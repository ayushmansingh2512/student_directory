import os
import sqlalchemy
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load env vars
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./kietmap.db"
    print("Using SQLite fallback")
else:
    print("Using provided DATABASE_URL")

engine = create_engine(DATABASE_URL)

def run_migration():
    with engine.connect() as connection:
        # Check if columns exist (simple try/except approach for this script)
        try:
            print("Attempting to add moodle_username...")
            connection.execute(text("ALTER TABLE students ADD COLUMN moodle_username VARCHAR"))
            print("SUCCESS: moodle_username added.")
        except Exception as e:
            print(f"INFO: moodle_username might already exist or error: {e}")

        try:
            print("Attempting to add moodle_password...")
            connection.execute(text("ALTER TABLE students ADD COLUMN moodle_password VARCHAR"))
            print("SUCCESS: moodle_password added.")
        except Exception as e:
            print(f"INFO: moodle_password might already exist or error: {e}")
        
        connection.commit()

if __name__ == "__main__":
    run_migration()
