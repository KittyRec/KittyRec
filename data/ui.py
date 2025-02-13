import customtkinter as ctk
from PIL import Image, ImageDraw
import json, threading, ping3, time, webbrowser, os, subprocess

class KittyRecLauncher(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("KittyRec Launcher")
        self.geometry("900x600")
        self.minsize(800, 500)
        
        # Theme setup
        ctk.set_appearance_mode("dark")
        self.configure(fg_color="#1E1A2E")
        self.colors = {
            'primary': "#7C3AED", 'primary_hover': "#6D28D9",
            'secondary_bg': "#2D2640", 'accent': "#A78BFA",
            'text': "#DDD6FE", 'success': "#34D399",
            'warning': "#FBBF24", 'error': "#EF4444"
        }
        
        # Load data
        self.server_process = None
        self.is_launching = False
        self.current_ping = 0
        self.user_data = self._load_json('user-info/user.json', {"username": "Guest", "level": 0, "tokens": 0})
        self.version = self._load_file('version.skid', "0.1.0")
        self.profile_image = self._load_profile()
        
        # Setup UI
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(1, weight=1)
        self.create_ui()
        
        # Start ping check
        threading.Thread(target=self._ping_loop, daemon=True).start()

    def _load_json(self, path, default):
        try:
            with open(path) as f:
                return json.load(f)
        except:
            return default

    def _load_file(self, path, default):
        try:
            with open(path) as f:
                return f.read().strip()
        except:
            return default

    def _load_profile(self):
        try:
            if os.path.exists('user-info/ProfileImage.png'):
                img = Image.open('user-info/ProfileImage.png').convert('RGBA')
                img.thumbnail((30, 30))
                mask = Image.new('L', (30, 30), 0)
                ImageDraw.Draw(mask).ellipse((0, 0, 30, 30), fill=255)
                img.putalpha(mask)
                return ctk.CTkImage(light_image=img, dark_image=img, size=(30, 30))
        except:
            return None

    def _ping_loop(self):
        while True:
            try:
                ping_time = ping3.ping('KittyRec.KittySec.com', timeout=1)
                self.current_ping = int(ping_time * 1000) if ping_time else 999
            except:
                self.current_ping = 999
            
            if hasattr(self, 'status_label'):
                if self.current_ping < 80:
                    status = (self.colors['success'], f"Excellent ({self.current_ping}ms)", True)
                elif self.current_ping < 300:
                    status = (self.colors['warning'], f"Fair ({self.current_ping}ms)", True)
                else:
                    status = (self.colors['error'], f"Poor ({self.current_ping}ms)", False)
                
                self.status_label.configure(text_color=status[0])
                self.status_text.configure(text=status[1])
                if not self.is_launching:
                    self.start_button.configure(state="normal" if status[2] else "disabled")
            
            time.sleep(5)

    def start_server(self):
        if self.current_ping < 300 or self.is_launching:
            self.is_launching = True
            self.start_button.configure(state="disabled", text="Launching...", fg_color=self.colors['primary_hover'])
            
            # Launch animation
            progress = ctk.CTkProgressBar(self.content_frame, width=200, height=10, corner_radius=5,
                                        fg_color=self.colors['secondary_bg'], progress_color=self.colors['primary'])
            progress.grid(row=3, column=0, pady=(10, 20))
            progress.set(0)
            
            def update(value):
                if value <= 1.0:
                    progress.set(value)
                    self.after(50, lambda: update(value + 0.05))
                else:
                    progress.grid_remove()
                    self.start_button.configure(state="normal", text="Launch KittyRec", fg_color=self.colors['primary'])
                    self.is_launching = False
            
            update(0)
            
            # Start server
            cmd = ['start', 'cmd', '/k'] if os.name == 'nt' else ['gnome-terminal', '--']
            self.server_process = subprocess.Popen([*cmd, 'node', 'index.js', 'serve', '2017'],
                                                 shell=os.name == 'nt', cwd=os.getcwd())

    def logout(self):
        try:
            with open('user-info/FirstTimeTF.txt', 'w') as f:
                f.write("True")
            if self.server_process:
                if os.name == 'nt':
                    subprocess.run(['taskkill', '/F', '/T', '/PID', str(self.server_process.pid)])
                else:
                    self.server_process.terminate()
            self.quit()
        except Exception as e:
            print(f"Logout error: {e}")

    def create_ui(self):
        # Top bar with user info
        top = ctk.CTkFrame(self, fg_color="#251D35", height=40)
        top.grid(row=0, column=0, sticky="ew")
        top.grid_columnconfigure(1, weight=1)
        
        # User info (left side)
        user = ctk.CTkFrame(top, fg_color="transparent")
        user.grid(row=0, column=0, pady=5, padx=20, sticky="w")
        
        if self.profile_image:
            ctk.CTkLabel(user, text="", image=self.profile_image).pack(side="left", padx=10)
        ctk.CTkLabel(user, text=self.user_data['username'], font=("", 14, "bold"),
                    text_color=self.colors['text']).pack(side="left", padx=15)
        
        # Stats (right side)
        stats = ctk.CTkFrame(top, fg_color="transparent")
        stats.grid(row=0, column=1, pady=5, sticky="e", padx=20)
        
        level = ctk.CTkFrame(stats, fg_color=self.colors['primary'])
        level.pack(side="left", padx=5)
        ctk.CTkLabel(level, text=f"Level {self.user_data['level']}", font=("", 12),
                    text_color=self.colors['text']).pack(padx=10, pady=2)
        
        tokens = ctk.CTkFrame(stats, fg_color=self.colors['secondary_bg'])
        tokens.pack(side="left", padx=5)
        ctk.CTkLabel(tokens, text=f"{self.user_data['tokens']} Tokens", font=("", 12),
                    text_color=self.colors['accent']).pack(padx=10, pady=2)
        
        # Main content
        self.content_frame = ctk.CTkFrame(self, fg_color=self.colors['secondary_bg'], corner_radius=15)
        self.content_frame.grid(row=1, column=0, padx=40, pady=40, sticky="nsew")
        self.content_frame.grid_columnconfigure(0, weight=1)
        self.content_frame.grid_rowconfigure(0, weight=1)
        
        # Centered hero section
        hero_frame = ctk.CTkFrame(self.content_frame, fg_color="transparent")
        hero_frame.grid(row=0, column=0, sticky="nsew")
        hero_frame.grid_columnconfigure(0, weight=1)
        hero_frame.grid_rowconfigure((0, 1, 2), weight=1)
        
        # Center the elements within the frame
        inner_frame = ctk.CTkFrame(hero_frame, fg_color="transparent")
        inner_frame.pack(expand=True)
        
        ctk.CTkLabel(inner_frame, text="KittyRec", font=("Arial", 48, "bold"),
                    text_color=self.colors['accent']).pack(pady=(0, 10))
        
        ctk.CTkLabel(inner_frame, text="Experience the nostalgia of classic Rec Room, reimagined for today",
                    font=("", 16), text_color=self.colors['text']).pack(pady=(0, 20))
        
        # Center the buttons within the frame
        action_inner_frame = ctk.CTkFrame(inner_frame, fg_color="transparent")
        action_inner_frame.pack(anchor="center")
        
        # Discord and Logout buttons side by side
        ctk.CTkButton(action_inner_frame, text="Join Discord", font=("", 12), fg_color=self.colors['primary'],
                     hover_color=self.colors['primary_hover'], width=120, height=32,
                     command=lambda: webbrowser.open('https://discord.gg/DRaCSGfSSk')).pack(side="left", padx=10)
        
        ctk.CTkButton(action_inner_frame, text="Logout", font=("", 12), fg_color=self.colors['error'],
                     hover_color="#DC2626", width=120, height=32,
                     command=self.logout).pack(side="left", padx=10)

        # Launch button section
        launch_frame = ctk.CTkFrame(self.content_frame, fg_color="transparent")
        launch_frame.grid(row=1, column=0, sticky="ew", pady=(0, 20))
        launch_frame.grid_columnconfigure(0, weight=1)
        launch_frame.grid_rowconfigure(0, weight=1)
        
        self.start_button = ctk.CTkButton(launch_frame, text="Launch KittyRec", font=("", 20),
                                        fg_color=self.colors['primary'], hover_color=self.colors['primary_hover'],
                                        corner_radius=10, height=50, width=200, command=self.start_server)
        self.start_button.grid(row=0, column=0, pady=10)

        # Version and Status indicator (bottom)
        bottom_info_frame = ctk.CTkFrame(self.content_frame, fg_color=self.colors['secondary_bg'])
        bottom_info_frame.grid(row=2, column=0, sticky="ew", pady=(0, 20))
        bottom_info_frame.grid_columnconfigure((0, 1), weight=1)
        
        # Version (left)
        version_frame = ctk.CTkFrame(bottom_info_frame, fg_color=self.colors['secondary_bg'])
        version_frame.grid(row=0, column=0, sticky="w", padx=20)
        ctk.CTkLabel(version_frame, text=f"v{self.version}", font=("", 12),
                    text_color=self.colors['accent']).pack(padx=10, pady=2)
        
        # Status indicator (right)
        status_frame = ctk.CTkFrame(bottom_info_frame, fg_color=self.colors['secondary_bg'])
        status_frame.grid(row=0, column=1, sticky="e", padx=20)
        
        self.status_label = ctk.CTkLabel(status_frame, text="●", font=("", 16), text_color=self.colors['success'])
        self.status_label.pack(side="left", padx=5)
        
        self.status_text = ctk.CTkLabel(status_frame, text="Checking...", font=("", 12), text_color=self.colors['text'])
        self.status_text.pack(side="left", padx=(0, 10))
        
if __name__ == "__main__":
    KittyRecLauncher().mainloop()
