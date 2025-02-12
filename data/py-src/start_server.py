import os
import subprocess
from pathlib import Path

def run_command(command):
    try:
        # Set the working directory to the directory containing this script
        script_dir = Path(__file__).resolve().parent.parent
        os.chdir(script_dir)
        
        # Run the command in a new command prompt window
        subprocess.Popen(f'start cmd /k "{command}"', shell=True)
        
        # Exit the current script to close the old window
        os._exit(0)
    except subprocess.CalledProcessError as e:
        print(e.output)  # Print the error output if command fails
        print(e.stderr)  # Print the error stderr if command fails

def start_server_menu():
    os.system('cls' if os.name == 'nt' else 'clear')  # Clear the screen before displaying the menu
    options = ["May 30th 2018 - npm run serve 2018", "September 15th 2017 - npm run serve 2017"]
    print("Server Options")
    
    for idx, option in enumerate(options, start=1):
        print(f"{idx}. {option}")

    choice = input("Select an option: ")
    if choice == "1":
        run_command("npm run serve 2018")
    elif choice == "2":
        run_command("npm run serve 2017")
    else:
        print("Invalid choice")

if __name__ == "__main__":
    start_server_menu()
