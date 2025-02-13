import requests
import json

url = "https://kittyrec.kittysec.com/api/signup"

# Prompting the user for account information

print("\nIt seems like it's your first time here! Make a new account below.\n")
username = input("Enter new username: ")
password = input("Enter password: ")
email = input("Enter email (This is optional!): ")

# Creating payload with user-provided information
payload = {
    "username": username,
    "password": password,
    "email": email
}

# Sending POST request to the API endpoint
response = requests.post(url, json=payload)

# Checking the response status code
if response.status_code == 200:
    # Parsing the JSON response
    data = response.json()
    # Extracting id and token from the response
    user_id = data['id']
    token = data['token']
    print("Account created successfully!")
    print("User ID:", user_id)
    print("Token:", token)

    # Filling user information into the provided JSON template
    user_json = {
        "username": username,
        "level": 1,
        "tokens": 25,
        "userid": user_id,
        "settings": [
            {"Key": "MOD_BLOCKED_TIME", "Value": "5000"},
            {"Key": "MOD_BLOCKED_DURATION", "Value": "5000"},
            {"Key": "PlayerSessionCount", "Value": "24"},
            {"Key": "ShowRoomCenter", "Value": "1"},
            {"Key": "QualitySettings", "Value": "3"},
            {"Key": "Recroom.OOBE", "Value": "100"},
            {"Key": "VoiceFilter", "Value": "0"},
            {"Key": "VIGNETTED_TELEPORT_ENABLED", "Value": "0"},
            {"Key": "CONTINUOUS_ROTATION_MODE", "Value": "0"},
            {"Key": "ROTATION_INCREMENT", "Value": "0"},
            {"Key": "ROTATE_IN_PLACE_ENABLED", "Value": "0"},
            {"Key": "TeleportBuffer", "Value": "0"},
            {"Key": "VoiceChat", "Value": "2"},
            {"Key": "PersonalBubble", "Value": "0"},
            {"Key": "ShowNames", "Value": "1"},
            {"Key": "H.264 plugin", "Value": "1"},
            {"Key": "USER_TRACKING", "Value": "20"}
        ],
        "avatar2016": {
            "OutfitSelections": "b33dbeee-5bdd-443d-aa6a-761248054e08,,,,1;6d48c545-22bb-46c1-a29d-0a38af387143,,,,2;6d48c545-22bb-46c1-a29d-0a38af387143,,,,3;102c625b-b988-4bf8-a2aa-a31ad7029cdc,bd4a84e2-b67a-4269-a26a-17fb23ddb09e,ccf1ccc1-e229-4157-bb74-f2cdef01e547,,0;d0a9262f-5504-46a7-bb10-7507503db58e,ba6b6e1a-a09a-4ba0-9523-552869f03336,,d461ca71-45c9-415e-8e09-ba93e8d73450,1;193a3bf9-abc0-4d78-8d63-92046908b1c5,,,,0;3a790be3-2937-44d4-be01-b5d65353bd3d,,,,2;3a790be3-2937-44d4-be01-b5d65353bd3d,,,,3;e15b13a7-9e9a-4b32-ba2c-0cb31ed55a8c,,,,1",
            "FaceFeatures": "{\"ver\":3,\"eyeId\":\"AjGMoJhEcEehacRZjUMuDg\",\"eyePos\":{\"x\":0.0,\"y\":0.0},\"eyeScl\":0.0,\"mouthId\":\"FrZBRanXEEK29yKJ4jiMjg\",\"mouthPos\":{\"x\":0.0,\"y\":0.0},\"mouthScl\":0.0,\"beardColorId\":\"befcc00a-a2e6-48e4-864c-593d57bbbb5b\"}",
            "SkinColor": "85343b16-d58a-4091-96d8-083a81fb03ae",
            "HairColor": "befcc00a-a2e6-48e4-864c-593d57bbbb5b"
        },
        "avatar2017": {
            "OutfitSelections":"b33dbeee-5bdd-443d-aa6a-761248054e08,,,,1;6d48c545-22bb-46c1-a29d-0a38af387143,,,,2;6d48c545-22bb-46c1-a29d-0a38af387143,,,,3;102c625b-b988-4bf8-a2aa-a31ad7029cdc,bd4a84e2-b67a-4269-a26a-17fb23ddb09e,ccf1ccc1-e229-4157-bb74-f2cdef01e547,,0;d0a9262f-5504-46a7-bb10-7507503db58e,ba6b6e1a-a09a-4ba0-9523-552869f03336,,d461ca71-45c9-415e-8e09-ba93e8d73450,1;193a3bf9-abc0-4d78-8d63-92046908b1c5,,,,0;3a790be3-2937-44d4-be01-b5d65353bd3d,,,,2;3a790be3-2937-44d4-be01-b5d65353bd3d,,,,3;e15b13a7-9e9a-4b32-ba2c-0cb31ed55a8c,,,,1",
	        "FaceFeatures": "{\"ver\":3,\"eyeId\":\"YbG9bVnbcE-bPavyCz_jqA\",\"eyePos\":{\"x\":-0.009999999776482582,\"y\":-0.03999999910593033},\"eyeScl\":0.05000000074505806,\"mouthId\":\"EvIQk4Q4IkCOBBZkSBU-8g\",\"mouthPos\":{\"x\":0.0,\"y\":0.07999999821186066},\"mouthScl\":0.05000000074505806,\"beardColorId\":\"5ee30295-b05f-4e96-819e-5ac865b2c63d\"}",
            "SkinColor": "85343b16-d58a-4091-96d8-083a81fb03ae",
            "HairColor": "5ee30295-b05f-4e96-819e-5ac865b2c63d"
        },
        "Reputation": 0,
        "Verified": False,
        "Developer": False,
        "HasEmail": False,
        "CanReceiveInvites": False,
        "ProfileImageName": "Defalteeitallgoodd",
        "JuniorProfile": False,
        "ForceJuniorImages": False,
        "PendingJunior": False,
        "HasBirthday": False
    }

    # Writing user information to user.json
    with open('user-info/user.json', 'w') as f:
        json.dump(user_json, f)
    print("User information written to user.json")

    # Updating FirstTimeTF.txt to False
    with open('user-info/FirstTimeTF.txt', 'w') as f:
        f.write("False")
    print("200, Restart the program :D")
else:
    print("Failed to create account:", response.json())
