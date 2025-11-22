from sqlalchemy import text
from app.database import engine, Base
from app.models import Student

def reset_database():
    try:
        with engine.connect() as connection:
            print("Dropping table 'students' with CASCADE...")
            connection.execute(text("DROP TABLE IF EXISTS students CASCADE"))
            connection.commit()
            print("Table dropped successfully.")
            
        print("Creating all tables...")
        Base.metadata.create_all(bind=engine)
        print("All tables created.")
        print("Database reset complete.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    reset_database()
