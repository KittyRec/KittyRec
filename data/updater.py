import requests
import os
import zipfile
import filecmp
import shutil

# URL of the JSON file containing update info
UPDATE_URL = 'http://localhost:8000/toupdate.json'

# Directories
EXTRACT_DIR = 'new_version'
IGNORE_DIRS = ['user-info']
IGNORE_FILES = ['has_user_client_reset.txt']

def get_update_info():
    response = requests.get(UPDATE_URL)
    response.raise_for_status()
    return response.json()

def download_update(url, filename):
    response = requests.get(url, stream=True)
    response.raise_for_status()
    with open(filename, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
    print(f'Update downloaded to {filename}')

def extract_update(filename, extract_to):
    with zipfile.ZipFile(filename, 'r') as zip_ref:
        zip_ref.extractall(extract_to)
    print(f'Update extracted to {extract_to}')

def should_ignore(file_path):
    for ignore_dir in IGNORE_DIRS:
        if file_path.startswith(ignore_dir):
            return True
    for ignore_file in IGNORE_FILES:
        if os.path.basename(file_path) == ignore_file:
            return True
    return False

def compare_and_update_files(new_version_dir):
    for root, _, files in os.walk(new_version_dir):
        for file in files:
            new_file_path = os.path.join(root, file)
            rel_path = os.path.relpath(new_file_path, new_version_dir)
            existing_file_path = os.path.join('.', rel_path)

            if should_ignore(rel_path):
                print(f'Ignoring {rel_path}')
                continue

            if os.path.exists(existing_file_path):
                if filecmp.cmp(new_file_path, existing_file_path, shallow=False):
                    print(f'{rel_path} is up to date.')
                else:
                    print(f'Updating {rel_path}')
                    shutil.copy2(new_file_path, existing_file_path)
            else:
                print(f'Adding new file {rel_path}')
                shutil.copy2(new_file_path, existing_file_path)

def get_current_version(file_path):
    with open(file_path, 'r') as f:
        return f.read().strip()

def has_letters(version_string):
    return any(char.isalpha() for char in version_string)

def main():
    update_info = get_update_info()
    current_version = get_current_version('version.skid')

    if has_letters(update_info['version']) or has_letters(current_version):
        print("Version string contains letters. Skipping update.")
        return

    if update_info['version'] != current_version:
        print(f"New version available: {update_info['version']}")
        download_update(update_info['download_url'], 'new_version.zip')
        extract_update('new_version.zip', EXTRACT_DIR)
        compare_and_update_files(EXTRACT_DIR)
    else:
        print("You are already using the latest version")

if __name__ == "__main__":
    main()
