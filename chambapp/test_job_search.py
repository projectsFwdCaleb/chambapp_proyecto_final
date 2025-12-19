
import requests
import os
from dotenv import load_dotenv

# Try to use the same logic as I expect the server to use, 
# although this is a client script, so it tests the ENDPOINT, not internal logic directly.
# But first I want to confirm the endpoint works.

try:
    print("Testing http://localhost:8000/api/job-suggestions/?query=programador ...")
    response = requests.get("http://localhost:8000/api/job-suggestions/?query=programador", timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text[:500]}")
except Exception as e:
    print(f"Error: {e}")
