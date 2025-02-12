import os
import json
import sys
import random
import logging
import curses
from pathlib import Path

# Set up logging
log_dir = Path("logs")
log_dir.mkdir(parents=True, exist_ok=True)  # Create the directory if it doesn't exist
log_file = log_dir / "kittyrec.log"

# Reset log file
if log_file.exists():
    log_file.unlink()

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s',
                    handlers=[logging.FileHandler(log_file)])

def clear_screen():
    # Clear the screen based on the operating system
    os.system('cls' if os.name == 'nt' else 'clear')

def print_welcome_message(stdscr):
    stdscr.addstr(0, 0, """

██╗  ██╗██╗████████╗████████╗██╗   ██╗██████╗ ███████╗ ██████╗
██║ ██╔╝██║╚══██╔══╝╚══██╔══╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔════╝
█████╔╝ ██║   ██║      ██║    ╚████╔╝ ██████╔╝█████╗  ██║     
██╔═██╗ ██║   ██║      ██║     ╚██╔╝  ██╔══██╗██╔══╝  ██║     
██║  ██╗██║   ██║      ██║      ██║   ██║  ██║███████╗╚██████╗
╚═╝  ╚═╝╚═╝   ╚═╝      ╚═╝      ╚═╝   ╚═╝╚══════╝ ╚═════╝
           First Public hybrid OldRecRoom server
                                                       
""")
    stdscr.addstr(8, 0, "Fork of: https://github.com/RealMCoded/Rec.js/\n")

def check_config():
    if not os.path.exists('./config.json'):
        logging.warning('config.json does not exist! Creating...')
        os.system('cp config.template.json config.json')

def check_user_config():
    if not os.path.exists('./user-info/user.json'):
        logging.warning('./user-info/user.json does not exist! Creating...')
        os.system('cp user-info/user.template.json user-info/user.json')
        with open("./user-info/user.json", "r") as file:
            plrjson = json.load(file)
        plrjson['userid'] = random.randint(0, 99999)
        with open("./user-info/user.json", "w") as file:
            json.dump(plrjson, file)

def run_command(command):
    logging.info(f"Running command: {command}")
    os.system(command)

def start_server():
    run_command("python py-src/start_server.py")

def config():
    # Placeholder for the config logic
    logging.info("Running config")

def rooms():
    # Placeholder for the rooms logic
    logging.info("Running rooms")

def help():
    # Placeholder for the help logic
    logging.info("Running help")

def no_command():
    # Placeholder for the no command logic
    logging.info("No command specified")

def main_menu(stdscr):
    curses.curs_set(0)
    curses.start_color()
    curses.init_pair(1, curses.COLOR_BLACK, curses.COLOR_WHITE)
    current_row = 0

    menu = ["Start Server", "Config", "Rooms", "Help", "Exit"]

    while True:
        stdscr.clear()
        print_welcome_message(stdscr)
        
        for idx, row in enumerate(menu):
            x = 0
            y = idx + 12
            if idx == current_row:
                stdscr.attron(curses.color_pair(1))
                stdscr.addstr(y, x, row)
                stdscr.attroff(curses.color_pair(1))
            else:
                stdscr.addstr(y, x, row)

        key = stdscr.getch()

        if key == curses.KEY_UP and current_row > 0:
            current_row -= 1
        elif key == curses.KEY_DOWN and current_row < len(menu) - 1:
            current_row += 1
        elif key == curses.KEY_ENTER or key in [10, 13]:
            if menu[current_row] == "Start Server":
                start_server()
            elif menu[current_row] == "Config":
                config()
            elif menu[current_row] == "Rooms":
                rooms()
            elif menu[current_row] == "Help":
                help()
            elif menu[current_row] == "Exit":
                break

        stdscr.refresh()

def main():
    clear_screen()
    check_config()
    check_user_config()
    curses.wrapper(main_menu)

if __name__ == "__main__":
    main()
