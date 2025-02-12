import os
import sys
import subprocess
import tkinter as tk
from tkinter import ttk, messagebox
import threading
import time
import winreg

class ModernInstallerUI:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Skubbusyy Installer")
        self.root.geometry("800x600")
        self.root.resizable(False, False)
        
        # Set window icon (assuming icon.ico exists in the same directory)
        try:
            self.root.iconbitmap("icon.ico")
        except:
            pass
        
        # Dark theme with purple accents
        self.root.configure(bg="#1a1a1a")
        
        # Configure styles
        self.setup_styles()
        
        # Create main container
        self.main_container = ttk.Frame(self.root, style="Main.TFrame")
        self.main_container.pack(expand=True, fill="both")
        
        # Create header
        self.create_header()
        
        # Create content area
        self.create_content()
        
        # Create footer
        self.create_footer()
        
        # Initialize packages list
        self.python_packages = ["requests", "tqdm", "windows-curses"]
        self.node_packages = ["json-cyclic", "axios", "ps-node", "discord-rpc", "gif-frames", "chokidar", "sharp", "gifsicle", "get-video-duration"];


    def setup_styles(self):
        style = ttk.Style()
        style.theme_use('clam')  # Use clam theme as base
        
        # Configure custom styles with dark theme
        style.configure("Main.TFrame", background="#1a1a1a")
        style.configure("Header.TFrame", background="#2d2d2d")
        style.configure("Content.TFrame", background="#1a1a1a")
        style.configure("Footer.TFrame", background="#1a1a1a")
        
        # Header label style
        style.configure("Header.TLabel",
                       background="#2d2d2d",
                       foreground="#ffffff",
                       font=("Segoe UI", 24, "bold"))
        
        # Regular label style
        style.configure("Content.TLabel",
                       background="#1a1a1a",
                       foreground="#ffffff",
                       font=("Segoe UI", 11))
        
        # Progress bar style
        style.configure("Modern.Horizontal.TProgressbar",
                       troughcolor="#2d2d2d",
                       background="#9370DB",  # Medium purple
                       thickness=6)
        
        # Button style
        style.configure("Action.TButton",
                       padding=10,
                       font=("Segoe UI", 11))
        
        style.configure("Danger.TButton",
                       padding=10,
                       font=("Segoe UI", 11))

    def create_header(self):
        header_frame = ttk.Frame(self.main_container, style="Header.TFrame")
        header_frame.pack(fill="x", ipady=20)
        
        title_label = ttk.Label(
            header_frame,
            text="Skubbusyy Installation Wizard",
            style="Header.TLabel"
        )
        title_label.pack(padx=20, pady=10)

    def create_content(self):
        content_frame = ttk.Frame(self.main_container, style="Content.TFrame")
        content_frame.pack(expand=True, fill="both", padx=20, pady=10)
        
        # Status label
        self.status_label = ttk.Label(
            content_frame,
            text="Ready to install",
            style="Content.TLabel"
        )
        self.status_label.pack(pady=(0, 10))
        
        # Progress bar
        self.progress = ttk.Progressbar(
            content_frame,
            style="Modern.Horizontal.TProgressbar",
            length=700,
            mode='determinate'
        )
        self.progress.pack(pady=(0, 20))
        
        # Details text area with scrollbar
        text_frame = ttk.Frame(content_frame)
        text_frame.pack(fill="both", expand=True)
        
        scrollbar = ttk.Scrollbar(text_frame)
        scrollbar.pack(side="right", fill="y")
        
        self.details_text = tk.Text(
            text_frame,
            height=15,
            bg="#2d2d2d",
            fg="#ffffff",
            font=("Consolas", 10),
            wrap=tk.WORD,
            borderwidth=1,
            relief="solid"
        )
        self.details_text.pack(side="left", fill="both", expand=True)
        
        scrollbar.config(command=self.details_text.yview)
        self.details_text.config(yscrollcommand=scrollbar.set)

    def create_footer(self):
        footer_frame = ttk.Frame(self.main_container, style="Footer.TFrame")
        footer_frame.pack(fill="x", pady=20)
        
        # Button container for better alignment
        button_container = ttk.Frame(footer_frame, style="Footer.TFrame")
        button_container.pack()
        
        # Install button
        self.start_button = ttk.Button(
            button_container,
            text="Install",
            command=self.start_installation,
            style="Action.TButton",
            width=20
        )
        self.start_button.pack(side="left", padx=5)
        
        # Uninstall button
        self.uninstall_button = ttk.Button(
            button_container,
            text="Uninstall",
            command=self.start_uninstallation,
            style="Danger.TButton",
            width=20
        )
        self.uninstall_button.pack(side="left", padx=5)

    def uninstall_packages(self):
        try:
            self.log_message("Starting uninstallation process...")
            success = True
            
            # Uninstall Python packages
            for i, package in enumerate(self.python_packages):
                progress = (i + 1) * (50 / len(self.python_packages))
                self.update_status(f"Uninstalling Python package: {package}", progress)
                
                cmd = [sys.executable, "-m", "pip", "uninstall", "-y", package]
                if not self.run_command(cmd):
                    self.log_message(f"Warning: Failed to uninstall {package}")
            
            # Uninstall Node packages
            if hasattr(self, 'npm_path'):
                for i, package in enumerate(self.node_packages):
                    progress = 50 + (i + 1) * (50 / len(self.node_packages))
                    self.update_status(f"Uninstalling Node.js package: {package}", progress)
                    
                    cmd = [self.npm_path, "uninstall", "-g", package]
                    if not self.run_command(cmd):
                        self.log_message(f"Warning: Failed to uninstall {package}")
            
            self.update_status("✅ Uninstallation Complete!", 100)
            messagebox.showinfo("Uninstallation Complete", "All packages have been uninstalled successfully!")
            self.enable_buttons()
            
        except Exception as e:
            self.log_message(f"Error during uninstallation: {str(e)}")
            messagebox.showerror("Error", "An error occurred during uninstallation. Check the logs for details.")
            self.enable_buttons()

    def start_uninstallation(self):
        if messagebox.askyesno("Confirm Uninstallation", 
                              "Are you sure you want to uninstall all packages? This cannot be undone."):
            self.disable_buttons()
            self.details_text.delete(1.0, tk.END)
            self.progress['value'] = 0
            threading.Thread(target=self.uninstall_packages, daemon=True).start()

    def disable_buttons(self):
        self.start_button.config(state="disabled")
        self.uninstall_button.config(state="disabled")

    def enable_buttons(self):
        self.start_button.config(state="normal")
        self.uninstall_button.config(state="normal")

    def log_message(self, message):
        self.details_text.insert(tk.END, f"{time.strftime('%H:%M:%S')} - {message}\n")
        self.details_text.see(tk.END)
        self.root.update()

    def update_status(self, message, progress_value):
        self.status_label.config(text=message)
        self.progress['value'] = progress_value
        self.log_message(message)

    def run_command(self, command, shell=False):
        try:
            self.log_message(f"Running command: {' '.join(command)}")
            process = subprocess.Popen(
                command,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                shell=shell,
                text=True,
                encoding='utf-8',
                errors='replace'
            )
            
            stdout, stderr = process.communicate()
            
            if stdout:
                self.log_message(stdout)
            if stderr:
                self.log_message(f"Error: {stderr}")
            
            return process.returncode == 0
        except Exception as e:
            self.log_message(f"Error executing command: {str(e)}")
            return False

    def get_nodejs_path(self):
        try:
            with winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\Node.js", 0, winreg.KEY_READ | winreg.KEY_WOW64_64KEY) as key:
                nodejs_path = winreg.QueryValueEx(key, "InstallPath")[0]
                return nodejs_path
        except WindowsError:
            try:
                with winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"SOFTWARE\Node.js", 0, winreg.KEY_READ | winreg.KEY_WOW64_64KEY) as key:
                    nodejs_path = winreg.QueryValueEx(key, "InstallPath")[0]
                    return nodejs_path
            except WindowsError:
                return None

    def find_npm_path(self):
        nodejs_path = self.get_nodejs_path()
        if nodejs_path:
            npm_path = os.path.join(nodejs_path, 'npm.cmd')
            if os.path.exists(npm_path):
                return npm_path
            
        common_paths = [
            r"C:\Program Files\nodejs\npm.cmd",
            r"C:\Program Files (x86)\nodejs\npm.cmd",
            os.path.expanduser("~\\AppData\\Roaming\\npm\\npm.cmd")
        ]
        
        for path in common_paths:
            if os.path.exists(path):
                return path
                
        return None

    def check_python(self):
        try:
            result = subprocess.run([sys.executable, "--version"], 
                                  capture_output=True, 
                                  text=True)
            version = result.stdout.strip()
            self.update_status(f"✓ Python is installed ({version})", 10)
            return True
        except Exception as e:
            self.update_status(f"❌ Python check failed: {str(e)}", 0)
            return False

    def check_node(self):
        try:
            npm_path = self.find_npm_path()
            if not npm_path:
                self.update_status("❌ npm not found. Please ensure Node.js is installed correctly.", 0)
                self.log_message("npm not found in common locations. Please add Node.js to your PATH or reinstall Node.js.")
                return False

            node_version = subprocess.check_output(["node", "--version"], text=True).strip()
            npm_version = subprocess.check_output([npm_path, "--version"], text=True).strip()
            
            self.update_status(f"✓ Node.js ({node_version}) and npm ({npm_version}) found", 20)
            self.npm_path = npm_path
            return True
        except Exception as e:
            self.update_status("❌ Node.js check failed. Please install Node.js.", 0)
            self.log_message(f"Node.js check error: {str(e)}")
            self.log_message("Please install Node.js from https://nodejs.org/")
            return False

    def upgrade_pip(self):
        try:
            self.update_status("Upgrading pip...", 30)
            cmd = [sys.executable, "-m", "pip", "install", "--upgrade", "pip"]
            return self.run_command(cmd)
        except Exception as e:
            self.log_message(f"Error upgrading pip: {str(e)}")
            return False

    def install_python_packages(self):
        try:
            for i, package in enumerate(self.python_packages):
                progress = 40 + (i + 1) * (20 / len(self.python_packages))
                self.update_status(f"Installing Python package: {package}", progress)
                
                cmd = [sys.executable, "-m", "pip", "install", "--upgrade", package]
                if not self.run_command(cmd):
                    return False
            return True
        except Exception as e:
            self.log_message(f"Error installing Python packages: {str(e)}")
            return False

    def install_node_packages(self):
        if not hasattr(self, 'npm_path'):
            return False
            
        try:
            for i, package in enumerate(self.node_packages):
                progress = 60 + (i + 1) * (20 / len(self.node_packages))
                self.update_status(f"Installing Node.js package: {package}", progress)
                
                cmd = [self.npm_path, "install", "-g", package]
                if not self.run_command(cmd):
                    return False
            return True
        except Exception as e:
            self.log_message(f"Error installing Node.js packages: {str(e)}")
            return False

    def run_npm_install(self):
        if not hasattr(self, 'npm_path'):
            return False
            
        try:
            self.update_status("Running npm install...", 90)
            cmd = [self.npm_path, "install"]
            return self.run_command(cmd)
        except Exception as e:
            self.log_message(f"Error running npm install: {str(e)}")
            return False

    def installation_process(self):
        try:
            self.log_message("Starting installation process...")
            success = True
            
            if not self.check_python():
                success = False
            
            if success and not self.check_node():
                success = False
            
            if success:
                if not self.upgrade_pip():
                    self.log_message("⚠️ Warning: Failed to upgrade pip, continuing...")
            
            if success:
                success = self.install_python_packages()
            
            if success:
                success = self.install_node_packages()
            
            if success:
                success = self.run_npm_install()
            if success:
                self.update_status("✅ Installation Complete!", 100)
                messagebox.showinfo("Installation Complete", "All packages have been installed successfully!")
            else:
                self.update_status("❌ Installation failed", 0)
                messagebox.showerror("Installation Failed", "An error occurred during the installation process.")
            
            self.enable_buttons()
            
        except Exception as e:
            self.log_message(f"Error during installation: {str(e)}")
            self.update_status("❌ Installation failed", 0)
            messagebox.showerror("Installation Failed", "An error occurred during the installation process.")
            self.enable_buttons()

    def start_installation(self):
        self.disable_buttons()
        self.details_text.delete(1.0, tk.END)
        self.progress['value'] = 0
        threading.Thread(target=self.installation_process, daemon=True).start()

    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    app = ModernInstallerUI()
    app.run()
