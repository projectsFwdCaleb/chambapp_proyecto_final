
import os
from dotenv import load_dotenv

load_dotenv()

google_key = os.getenv("GOOGLE_API_KEY")
google_cx = os.getenv("GOOGLE_CX")

print(f"GOOGLE_API_KEY Found: {'Yes' if google_key else 'No'}")
if google_key:
    print(f"Key start: {google_key[:5]}...")

print(f"GOOGLE_CX Found: {'Yes' if google_cx else 'No'}")
if google_cx:
    print(f"CX start: {google_cx[:5]}...")
