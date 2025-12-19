
import requests
import sys

try:
    print("Checking http://localhost:8000/api/chat/ ...")
    # Sending a GET request to see if endpoint exists (it expects POST, so might return 405 or 200 depending on view)
    # Actually checking internal content, but simple connectivity first.
    response = requests.get("http://localhost:8000/api/chat/", timeout=5)
    print(f"Connected. Status Code: {response.status_code}")
except requests.exceptions.ConnectionError:
    print("Connection Refused. Server likely NOT running.")
except Exception as e:
    print(f"Error: {e}")
