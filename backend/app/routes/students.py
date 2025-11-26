from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Student
from ..schemas import StudentResponse, SectionEnum, StudentUpdate
from ..services.stats_service import update_student_stats


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
    return query.order_by(Student.roll_number).offset(skip).limit(limit).all()

@router.get("/{roll_number}", response_model=StudentResponse)
def get_student(roll_number: str, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.roll_number == roll_number).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.post("/{roll_number}/refresh", response_model=StudentResponse)
async def refresh_student_stats(roll_number: str, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.roll_number == roll_number).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    updated_student = await update_student_stats(db, student)
    return updated_student

@router.put("/{roll_number}", response_model=StudentResponse)
def update_student(roll_number: str, student_update: StudentUpdate, db: Session = Depends(get_db)):
    db_student = db.query(Student).filter(Student.roll_number == roll_number).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    update_data = student_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_student, key, value)
    
    db.commit()
    db.refresh(db_student)
    return db_student
