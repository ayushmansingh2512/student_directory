from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import auth, students, rankings

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="KIETMap API", description="Student Directory API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(students.router)
app.include_router(rankings.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to KIETMap API"}
