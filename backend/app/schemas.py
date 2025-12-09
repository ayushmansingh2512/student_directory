from pydantic import BaseModel, EmailStr, HttpUrl, Field
from typing import Optional
from datetime import datetime
from enum import Enum
from typing import List

class SectionEnum(str, Enum):
    A = "A"
    B = "B"
    C = "C"
    D = "D"

class StudentBase(BaseModel):
    roll_number: str
    email: EmailStr
    name: str
    section: SectionEnum
    github_username: Optional[str] = None
    leetcode_username: Optional[str] = None
    linkedin_url: Optional[str] = None
    figma_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    skills_description: Optional[str] = None
    bio_description: Optional[str] = None
    moodle_username: Optional[str] = None
    moodle_password: Optional[str] = None

class StudentCreate(StudentBase):
    pass

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    section: Optional[SectionEnum] = None
    github_username: Optional[str] = None
    leetcode_username: Optional[str] = None
    linkedin_url: Optional[str] = None
    figma_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    skills_description: Optional[str] = None
    bio_description: Optional[str] = None
    moodle_username: Optional[str] = None
    moodle_password: Optional[str] = None

class StudentResponse(StudentBase):
    id: int
    section: str # Use str instead of Enum for response to be more robust
    gmail_photo_url: Optional[str] = None
    github_commits_count: int = 0
    leetcode_points: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Assignment(BaseModel):
    title: str
    course: str
    status: str # "Left" or "Done"
    date: str # e.g. "Friday, 12 December"

class MoodleAssignmentsResponse(BaseModel):
    pending: List[Assignment]
    completed: List[Assignment]
