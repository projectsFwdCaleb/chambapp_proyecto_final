
import os
import requests
from dotenv import load_dotenv
import json

load_dotenv()

OPENAI_URL = "https://api.openai.com/v1/chat/completions"
KEY = os.getenv("OPENAI_API_KEY")

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {KEY}"
}

data = {
    "model": "gpt-4o-mini",
    "messages": [
        {"role": "user", "content": "Hola"}
    ]
}

try:
    print(f"Testing with Key: {KEY[:10]}...")
    response = requests.post(OPENAI_URL, headers=headers, json=data, timeout=30)
    print("Status:", response.status_code)
    try:
        print("Response:", json.dumps(response.json(), indent=2))
    except:
        print("Response Text:", response.text)
except Exception as e:
    print("Exception:", e)
