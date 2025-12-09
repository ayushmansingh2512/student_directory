from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from .database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    roll_number = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    section = Column(String, nullable=False)  # A, B, C, D
    
    # External Profiles
    github_username = Column(String, nullable=True)
    leetcode_username = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    figma_url = Column(String, nullable=True)
    portfolio_url = Column(String, nullable=True)

    # Moodle Credentials
    moodle_username = Column(String, nullable=True)
    moodle_password = Column(String, nullable=True)
    
    # Bio/Skills
    skills_description = Column(Text, nullable=True)
    bio_description = Column(Text, nullable=True)
    
    # Cached Data
    gmail_photo_url = Column(String, nullable=True)
    github_commits_count = Column(Integer, default=0)
    leetcode_points = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
