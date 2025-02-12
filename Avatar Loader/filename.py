import os
import json
import psutil
import tkinter as tk
from tkinter import ttk, messagebox, filedialog

USER_INFO_LOCAT = 'USER-INFO-LOCAT'
AVATARS_JSON = 'avitars.json'
CONFIG_FILE = 'config.json'

# Function to initialize files and directories
def initialize():
    if not os.path.exists(USER_INFO_LOCAT):
        os.mkdir(USER_INFO_LOCAT)
    if not os.path.exists(AVATARS_JSON):
        with open(AVATARS_JSON, 'w') as f:
            json.dump({}, f)
    if not os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE, 'w') as f:
            json.dump({}, f)

# Function to prompt for user-info directory
def prompt_user_info_dir():
    user_info_dir = filedialog.askdirectory(title="Select your user-info folder")
    user_json_path = os.path.join(user_info_dir, 'user.json')
    if os.path.exists(user_json_path):
        with open(user_json_path, 'r') as f:
            user_info = json.load(f)
        save_user_info_dir(user_info_dir)
        return user_info, user_json_path
    else:
        messagebox.showerror("Error", "user.json not found in the selected directory")
        return None, None

# Function to save user-info directory to config file
def save_user_info_dir(user_info_dir):
    with open(CONFIG_FILE, 'r+') as f:
        try:
            config = json.load(f)
        except json.JSONDecodeError:
            config = {}
        config['user_info_dir'] = user_info_dir
        f.seek(0)
        json.dump(config, f)
        f.truncate()

# Function to load user-info directory from config file
def load_user_info_dir():
    if os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE, 'r') as f:
            try:
                config = json.load(f)
                return config.get('user_info_dir', None)
            except json.JSONDecodeError:
                return None
    return None

# Function to save avatar data to avitars.json
def save_avatar(user_info, slot):
    user_json_path = os.path.join(user_info['user_info_dir'], 'user.json')
    with open(user_json_path, 'r') as f:
        user_data = json.load(f)
    avatars = load_avatars()
    avatars[f"slot_{slot+1}"] = user_data['avatar2017']
    with open(AVATARS_JSON, 'w') as f:
        json.dump(avatars, f, indent=4)
    messagebox.showinfo("Success", "Avatar saved successfully!")

# Function to load avatar data and update user.json
def load_avatar(user_info, slot):
    avatars = load_avatars()
    avatar_data = avatars.get(f"slot_{slot+1}", None)
    if avatar_data:
        user_info['avatar2017'] = avatar_data
        user_json_path = os.path.join(user_info['user_info_dir'], 'user.json')
        with open(user_json_path, 'w') as f:
            json.dump(user_info, f, indent=4)
        messagebox.showinfo("Success", f"Loaded avatar data for slot {slot + 1}")
    else:
        messagebox.showerror("Error", f"No data found for slot {slot + 1}")

# Function to load avatars from avitars.json
def load_avatars():
    if os.path.exists(AVATARS_JSON):
        with open(AVATARS_JSON, 'r') as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return {}
    return {}

# Function to restart Recroom_Release.exe
def restart_recroom():
    try:
        # Find Recroom_Release.exe process
        recroom_processes = [p for p in psutil.process_iter(['pid', 'name', 'exe']) if p.info['name'] == 'Recroom_Release.exe']
        
        if recroom_processes:
            # Use the first instance found
            proc = recroom_processes[0]
            exe_path = proc.info['exe']
            exe_dir = os.path.dirname(exe_path)
            
            # Terminate the process
            proc.terminate()
            try:
                proc.wait(timeout=5)
            except psutil.TimeoutExpired:
                proc.kill()
            
            # Restart the process
            psutil.Popen([exe_path], cwd=exe_dir)
            messagebox.showinfo("Success", "Recroom_Release.exe has been restarted successfully!")
        else:
            messagebox.showinfo("Info", "Recroom_Release.exe is not currently running.")
    except Exception as e:
        messagebox.showerror("Error", f"An error occurred: {e}")

# Function to create the main menu GUI
def main_menu(user_info):
    global root, style
    root = tk.Tk()
    root.title("Kitty Avatar Loader")

    style = ttk.Style()
    style.configure("TLabel", font=("Helvetica", 14), padding=10)
    style.configure("TButton", font=("Helvetica", 12), padding=10, width=20)

    frame = ttk.Frame(root, padding=20)
    frame.pack(fill=tk.BOTH, expand=True)

    greeting = ttk.Label(frame, text=f"Hello {user_info['username']}, here are your saved avatars!")
    greeting.pack(pady=20)

    for i in range(4):
        slot_frame = ttk.Frame(frame, relief="ridge", borderwidth=2, padding=10)
        slot_frame.pack(pady=10, fill=tk.X)

        save_button = ttk.Button(slot_frame, text=f"Save Avatar Slot {i+1}", command=lambda i=i: save_avatar(user_info, i))
        save_button.grid(row=0, column=0, padx=10, pady=10)
        
        load_button = ttk.Button(slot_frame, text=f"Load Avatar Slot {i+1}", command=lambda i=i: load_avatar(user_info, i))
        load_button.grid(row=0, column=1, padx=10, pady=10)

    restart_button = ttk.Button(frame, text="Restart Recroom", command=restart_recroom)
    restart_button.pack(pady=20)

    root.mainloop()

# Main function to run the GUI
def run_gui():
    initialize()
    user_info_dir = load_user_info_dir()
    if user_info_dir:
        user_json_path = os.path.join(user_info_dir, 'user.json')
        if os.path.exists(user_json_path):
            with open(user_json_path, 'r') as f:
                user_info = json.load(f)
                user_info['user_info_dir'] = user_info_dir
            main_menu(user_info)
        else:
            messagebox.showerror("Error", "user.json not found in the saved directory")
            user_info, user_json_path = prompt_user_info_dir()
            if user_info:
                user_info['user_info_dir'] = user_info_dir
                main_menu(user_info)
    else:
        user_info, user_json_path = prompt_user_info_dir()
        if user_info:
            user_info['user_info_dir'] = user_info_dir
            main_menu(user_info)

# Run the script
if __name__ == "__main__":
    run_gui()
