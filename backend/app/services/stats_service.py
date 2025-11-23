from sqlalchemy.orm import Session
from ..models import Student
from .github_service import get_github_commits
from .leetcode_service import get_leetcode_stats
import logging

logger = logging.getLogger(__name__)

async def update_student_stats(db: Session, student: Student):
    """
    Updates the GitHub commits and LeetCode points for a given student.
    """
    changes_made = False
    
    # Update GitHub Stats
    if student.github_username:
        try:
            commits = await get_github_commits(student.github_username)
            if commits is not None and commits != student.github_commits_count:
                student.github_commits_count = commits
                changes_made = True
            elif commits is None:
                logger.warning(f"Failed to fetch GitHub commits for {student.name}")
        except Exception as e:
            logger.error(f"Error updating GitHub stats for {student.name}: {e}")

    # Update LeetCode Stats
    if student.leetcode_username:
        try:
            points = await get_leetcode_stats(student.leetcode_username)
            if points is not None and points != student.leetcode_points:
                student.leetcode_points = points
                changes_made = True
            elif points is None:
                logger.warning(f"Failed to fetch LeetCode stats for {student.name}")
        except Exception as e:
            logger.error(f"Error updating LeetCode stats for {student.name}: {e}")

    if changes_made:
        db.commit()
        db.refresh(student)
    
    return student
