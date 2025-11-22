from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Student
from ..schemas import StudentResponse
from sqlalchemy import desc

router = APIRouter(
    prefix="/api/rankings",
    tags=["Rankings"]
)

@router.get("/github", response_model=List[StudentResponse])
def get_github_rankings(limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Student).order_by(desc(Student.github_commits_count)).limit(limit).all()

@router.get("/leetcode", response_model=List[StudentResponse])
def get_leetcode_rankings(limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Student).order_by(desc(Student.leetcode_points)).limit(limit).all()

@router.post("/refresh")
def refresh_rankings(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    # TODO: Trigger background task to update data from external APIs
    background_tasks.add_task(update_student_data, db)
    return {"message": "Ranking refresh triggered"}

def update_student_data(db: Session):
    # Placeholder for background update logic
    pass
