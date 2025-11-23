from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Student
from ..schemas import StudentCreate, StudentResponse

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


@router.post("/register", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
async def register_student(student: StudentCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    db_student_email = db.query(Student).filter(Student.email == student.email).first()
    if db_student_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if roll number already exists
    db_student_roll = db.query(Student).filter(Student.roll_number == student.roll_number).first()
    if db_student_roll:
        raise HTTPException(status_code=400, detail="Roll number already registered")
    
    # Create new student
    student_data = student.model_dump()
    
    # Convert Enum to string
    if 'section' in student_data:
        student_data['section'] = student_data['section'].value
    
    # Sanitize string inputs (strip whitespace)
    for key, value in student_data.items():
        if isinstance(value, str):
            student_data[key] = value.strip()
    
    # Convert URL objects to strings and strip them
    for key in ['linkedin_url', 'figma_url', 'portfolio_url']:
        if student_data.get(key):
            student_data[key] = str(student_data[key]).strip()

    # Fetch Stats
    from ..services.github_service import get_github_commits
    from ..services.leetcode_service import get_leetcode_stats
    from ..services.gmail_service import get_gmail_photo
    
    if student_data.get('github_username'):
        commits = await get_github_commits(student_data['github_username'])
        student_data['github_commits_count'] = commits if commits is not None else 0
        
    if student_data.get('leetcode_username'):
        points = await get_leetcode_stats(student_data['leetcode_username'])
        student_data['leetcode_points'] = points if points is not None else 0
        
    if student_data.get('email'):
        student_data['gmail_photo_url'] = await get_gmail_photo(
            student_data['email'], 
            student_data.get('github_username')
        )

    new_student = Student(**student_data)
    
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return new_student

@router.get("/verify-email/{email}")
def verify_email(email: str, db: Session = Depends(get_db)):
    db_student = db.query(Student).filter(Student.email == email).first()
    if db_student:
        return {"exists": True}
    return {"exists": False}
