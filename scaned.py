import os
import re
import json
import logging
import portalocker
from pathlib import Path
from datetime import datetime
from typing import Dict, List
from queue import Queue
import threading

class URLScanner:
    def __init__(self, directory: str = ".", output_file: str = "urls.json", num_threads: int = 300):
        self.directory = directory
        self.output_file = output_file
        self.num_threads = num_threads
        self.logger = self.setup_logging()
        self.url_queue = Queue()
        self.file_lock = threading.Lock()
        self.stats_lock = threading.Lock()
        self.stats = {
            'total_files': 0,
            'files_with_urls': 0,
            'total_urls': 0,
            'errors': 0
        }
        
        # Create empty JSON file if it doesn't exist
        if not os.path.exists(self.output_file):
            with open(self.output_file, 'w') as f:
                json.dump({}, f)
        
    def setup_logging(self):
        if not os.path.exists('logs'):
            os.makedirs('logs')
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        log_file = f'logs/kittysec_scan_{timestamp}.log'
        
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file),
                logging.StreamHandler()
            ]
        )
        
        return logging.getLogger(__name__)

    def filter_kittysec_urls(self, urls: List[str]) -> List[str]:
        """Filter URLs to only include those containing kittysec.com"""
        return [url for url in urls if 'kittysec.com' in url.lower()]

    def save_urls(self, file_path: str, urls: List[str]):
        """Thread-safe URL saving"""
        temp_file = f"{self.output_file}.tmp"
        
        with self.file_lock:
            try:
                # Load current content
                current_data = {}
                try:
                    with open(self.output_file, 'r') as f:
                        portalocker.lock(f, portalocker.LOCK_EX)
                        try:
                            current_data = json.load(f)
                        finally:
                            portalocker.unlock(f)
                except (json.JSONDecodeError, FileNotFoundError):
                    current_data = {}

                # Update with new URLs
                current_data[file_path] = urls

                # Write updated content
                try:
                    with open(temp_file, 'w') as f:
                        portalocker.lock(f, portalocker.LOCK_EX)
                        try:
                            json.dump(current_data, f, indent=2, sort_keys=True)
                        finally:
                            portalocker.unlock(f)

                    # Use atomic replace
                    os.replace(temp_file, self.output_file)
                except Exception as e:
                    if os.path.exists(temp_file):
                        os.remove(temp_file)
                    raise
                    
            except Exception as e:
                self.logger.error(f"Error in save_urls for {file_path}: {str(e)}")
                if os.path.exists(temp_file):
                    try:
                        os.remove(temp_file)
                    except:
                        pass

    def read_file_content(self, file_path: str) -> str:
        """Try multiple methods to read file content"""
        try:
            # List of encodings to try
            encodings = ['utf-8', 'latin-1', 'cp1252', 'ascii', 'utf-16', 'utf-32']
            
            # First try text mode with different encodings
            for encoding in encodings:
                try:
                    with open(file_path, 'r', encoding=encoding) as f:
                        return f.read()
                except (UnicodeDecodeError, UnicodeError):
                    continue
            
            # If text mode fails, try binary mode
            with open(file_path, 'rb') as f:
                content = f.read()
                # Try to decode binary content
                for encoding in encodings:
                    try:
                        return content.decode(encoding)
                    except (UnicodeDecodeError, UnicodeError):
                        continue
                
                # If all decodings fail, try to decode ignoring errors
                return content.decode('utf-8', errors='ignore')
                
        except Exception as e:
            raise Exception(f"Could not read file: {str(e)}")

    def process_file(self, file_path: str):
        """Process a single file for URLs"""
        try:
            # Get file content using our robust reading method
            content = self.read_file_content(file_path)
            
            # Search for URLs using multiple patterns
            url_patterns = [
                r'https?://[^\s<>"]+',  # Standard http(s) URLs
                r'www\.[^\s<>"]+',      # www URLs
                r'[^\s<>"]+\.(?:com|org|net|gov|edu|io|dev)[^\s<>"\)]*'  # Domain-based URLs
            ]
            
            all_urls = []
            for pattern in url_patterns:
                urls = re.findall(pattern, content, re.IGNORECASE)
                all_urls.extend(urls)
            
            # Filter for kittysec.com URLs only
            kittysec_urls = self.filter_kittysec_urls(all_urls)
            
            if kittysec_urls:
                rel_path = os.path.relpath(file_path, self.directory)
                unique_urls = list(set(kittysec_urls))
                
                # Save URLs immediately
                self.save_urls(rel_path, unique_urls)
                
                # Update statistics
                with self.stats_lock:
                    self.stats['files_with_urls'] += 1
                    self.stats['total_urls'] += len(unique_urls)
                
                self.logger.info(f"Found and saved {len(unique_urls)} Kittysec URLs in {rel_path}:")
                for url in unique_urls:
                    self.logger.info(f"  - {url}")

        except Exception as e:
            with self.stats_lock:
                self.stats['errors'] += 1
            self.logger.warning(f"Error processing {file_path}: {str(e)}")
        finally:
            with self.stats_lock:
                self.stats['total_files'] += 1

    def worker(self):
        """Worker thread function"""
        while True:
            file_path = self.url_queue.get()
            if file_path is None:
                break
            self.process_file(file_path)
            self.url_queue.task_done()

    def scan_for_urls(self):
        self.logger.info(f"Starting aggressive Kittysec URL scan in directory: {self.directory}")
        self.logger.info(f"Using {self.num_threads} threads to scan ALL files and directories")
        
        # Create thread pool
        threads = []
        for _ in range(self.num_threads):
            t = threading.Thread(target=self.worker)
            t.start()
            threads.append(t)

        # Walk directory and add files to queue
        for root, dirs, files in os.walk(self.directory, followlinks=True):
            # Include hidden directories
            dirs[:] = [d for d in dirs]  # Remove the hidden dir filter
            
            self.logger.debug(f"Scanning directory: {root}")
            
            # Process all files, including hidden ones
            for file in files:
                if file != self.output_file and not file.endswith('.tmp'):
                    file_path = os.path.join(root, file)
                    self.url_queue.put(file_path)

        # Add None to queue to signal threads to exit
        for _ in range(self.num_threads):
            self.url_queue.put(None)

        # Wait for all threads to complete
        for t in threads:
            t.join()

        # Log final statistics
        self.logger.info(f"Scan complete! Summary:")
        self.logger.info(f"- Total files scanned: {self.stats['total_files']}")
        self.logger.info(f"- Files containing Kittysec URLs: {self.stats['files_with_urls']}")
        self.logger.info(f"- Total Kittysec URLs found: {self.stats['total_urls']}")
        self.logger.info(f"- Files with errors: {self.stats['errors']}")

if __name__ == "__main__":
    scanner = URLScanner(num_threads=300)
    scanner.scan_for_urls()