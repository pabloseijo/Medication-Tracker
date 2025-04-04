from dotenv import load_dotenv
import os

CURRENT_USER_EMAIL = "javier@gmail.com"

load_dotenv()

TYPESENSE_API_KEY = os.getenv("TYPESENSE_API_KEY")

TYPESENSE_CONFIG = {
    "host": "pu4o6da8m95f0ne7p-1.a1.typesense.net",
    "port": "443",
    "protocol": "https",
    "api_key": TYPESENSE_API_KEY,
}
