import os
import sys
import requests
import json
import time
import uuid
import logging
from tqdm import tqdm
from pathlib import Path

time.sleep(2)
# THIS IS A TEST TO CHECK IF THE UPLOADER IS WORKING!!!
# Set up logging
log_dir = Path("logs")
log_dir.mkdir(parents=True, exist_ok=True)  # Create the directory if it doesn't exist
log_file = log_dir / "update.log"

# Reset log file
if log_file.exists():
    log_file.unlink()

logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(levelname)s - %(message)s',
                    handlers=[
                        logging.FileHandler(log_file),
                        logging.StreamHandler()
                    ])

def generate_client_id():
    client_id = uuid.uuid4()
    logging.debug(f"Generated client ID: {client_id}")
    return client_id

def read_token(file_path):
    try:
        with open(file_path, 'r') as tok:
            token = tok.read()
            logging.debug(f"Token read from {file_path}")
            return token
    except Exception as e:
        logging.error(f"Error reading token from {file_path}: {e}")

token = read_token('user-info/token.txt')

def check_first_time():
    first_time_tf_file = "user-info/FirstTimeTF.txt"
    if os.path.exists(first_time_tf_file):
        with open(first_time_tf_file, 'r') as file:
            first_time = file.read().strip().lower()
        logging.debug(f"First time check: {first_time}")
        if first_time == 'true':
            logging.info("First time running the script")
            os.system("python user-info/FirstTime.py")
        else:
            logging.info("Syncing server with KittyNet...")
    else:
        logging.warning("FirstTimeTF.txt file does not exist.")

check_first_time()

def ping_server(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        logging.debug(f"Server ping successful: {url}")
        return True
    except requests.exceptions.RequestException as e:
        logging.error(f"Sync Failed. Server Offline Error Code: {e}")
        time.sleep(8)
        sys.exit(1)

def get_api_version(api_url):
    try:
        response = requests.get(api_url)
        response.raise_for_status()
        version = response.json().get("record", {}).get("version", "")
        logging.debug(f"API version fetched: {version}")
        return version
    except requests.exceptions.RequestException as e:
        logging.error(f"Failed to fetch data from the API: {e}")
        return None

def get_local_version(file_path):
    try:
        with open(file_path, 'r') as file:
            version = file.read().strip()
            logging.debug(f"Local version read: {version}")
            return version
    except FileNotFoundError:
        logging.warning(f"Version file '{file_path}' not found.")
        return None

api_url = 'https://kittyrec.kittysec.com/api/check_version'
version_file_path = os.path.join(os.path.dirname(os.path.abspath(sys.argv[0])), 'version.skid')

api_version = get_api_version(api_url)
local_version = get_local_version(version_file_path)

if api_version and local_version:
    if api_version == local_version:
        logging.info(f"The program is up to date with version {local_version}.")
    else:
        logging.warning("The program version is not up to date.\nWaiting for 3 seconds before closing...")
        time.sleep(3)
        sys.exit()
else:
    logging.error("Failed to compare versions. Exiting...")

url_file_mapping = {"https://dj-pain.github.io/OldRecRoomCAPI/charades.txt": "user-info/charades.txt"}

with tqdm(total=len(url_file_mapping) + 3, desc="Progress", unit="step") as pbar:
    ping_server(api_url)
    pbar.update(1)
    
    for url, local_path in url_file_mapping.items():
        full_local_path = Path(local_path).resolve()
        try:
            response = requests.get(url)
            if response.status_code == 200:
                full_local_path.parent.mkdir(parents=True, exist_ok=True)
                full_local_path.write_bytes(response.content)
                logging.info(f"File downloaded: {full_local_path}")
            else:
                logging.error(f"Failed to download: {url}")
        except Exception as e:
            logging.error(f"Error downloading file: {e}")
        pbar.update(1)
    
    # --- Addition starts here ---
    # Update user-info/user.json with data from the server
    user_json_path = 'user-info/user.json'
    try:
        # Read the existing user data
        with open(user_json_path, 'r') as f:
            user_data = json.load(f)
            logging.debug(f"User data loaded from {user_json_path}")
    except FileNotFoundError:
        logging.error(f"User data file not found: {user_json_path}")
        user_data = {}
    except json.JSONDecodeError:
        logging.error(f"Invalid JSON format in {user_json_path}")
        user_data = {}

    userid = user_data.get('userid')
    if userid:
        user_data_url = "https://kittyrec.kittysec.com/userdata"
        params = {'userid': userid}
        try:
            response = requests.get(user_data_url, params=params)
            if response.status_code == 200:
                server_response = response.json()
                if server_response.get('status') == 'success':
                    updated_data = server_response.get('data', {})
                    if updated_data and str(updated_data.get('userid')) == str(userid):
                        # Fields to update
                        fields_to_update = ['username', 'level', 'tokens']
                        for field in fields_to_update:
                            if field in updated_data:
                                user_data[field] = updated_data[field]
                                logging.debug(f"Updated field '{field}' to '{updated_data[field]}'")
                        # Write the updated user data back to user.json
                        with open(user_json_path, 'w') as f:
                            json.dump(user_data, f, indent=4)
                        logging.info("User data successfully updated in user.json")
                    else:
                        logging.error("User data mismatch or missing from server response.")
                else:
                    error_msg = server_response.get('error', 'Unknown error')
                    logging.error(f"Failed to get user data from server: {error_msg}")
            else:
                logging.error(f"Server returned status code {response.status_code}")
        except requests.exceptions.RequestException as e:
            logging.error(f"An error occurred while requesting user data: {e}")
    else:
        logging.warning("User ID not found in user.json")
    pbar.update(1)
    # --- Addition ends here ---

    # Final step: Run KittyRec.py if everything works
    logging.info("Running KittyRec.py...")
    os.system("python KittyRec.py")
    pbar.update(1)
