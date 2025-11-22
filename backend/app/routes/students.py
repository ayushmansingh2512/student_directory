from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Student
from ..schemas import StudentResponse, SectionEnum

router = APIRouter(
    prefix="/api/students",
    tags=["Students"]
)

@router.get("/", response_model=List[StudentResponse])
def get_students(
    section: Optional[SectionEnum] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Student)
    if section:
        query = query.filter(Student.section == section.value)
    return query.offset(skip).limit(limit).all()

@router.get("/{roll_number}", response_model=StudentResponse)
def get_student(roll_number: str, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.roll_number == roll_number).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student
