
import os
from dotenv import load_dotenv

load_dotenv()

openai_key = os.getenv("OPENAI_API_KEY")
if openai_key:
    print(f"OPENAI_API_KEY Found: {openai_key[:8]}...")
else:
    print("OPENAI_API_KEY MISSING")
