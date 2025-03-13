from dotenv import load_dotenv
import os

CURRENT_USER_EMAIL = "javier@gmail.com"

load_dotenv()

TYPESENSE_API_KEY = os.getenv("TYPESENSE_API_KEY")

TYPESENSE_CONFIG = {
    "host": "typesense",
    "port": "8108",
    "protocol": "http",
    "api_key": TYPESENSE_API_KEY,
}
