import requests
import json
from PIL import Image

url = "https://oldrecroom.com/accounts/me/update/avatarItems"


headers = {'Content-Type': 'application/json', 'Authorization': '098D3258907JS40953J4095709SJ340953470S895J409J980FG7DJ0G9DFJBV'}


image = Image.open("E:\\New server 1.6.1\\images\\1695870952.JFIF")

file = image

response = requests.request("PUT", url, headers=headers, files=file)

print(response.text)