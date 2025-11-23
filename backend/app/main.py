from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from .routes import auth, students, rankings
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from contextlib import asynccontextmanager
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create tables
Base.metadata.create_all(bind=engine)

# Initialize scheduler
scheduler = AsyncIOScheduler()

async def scheduled_stats_update():
    """Background job to update all student stats."""
    logger.info("Starting scheduled stats update...")
    db = SessionLocal()
    try:
        from .routes.rankings import update_student_data
        await update_student_data(db)
        logger.info("Scheduled stats update completed successfully")
    except Exception as e:
        logger.error(f"Error in scheduled stats update: {e}")
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    scheduler.add_job(
        scheduled_stats_update,
        'interval',
        hours=1,
        id='stats_update_job',
        replace_existing=True
    )
    scheduler.start()
    logger.info("Scheduler started - stats will update every hour")
    yield
    # Shutdown
    scheduler.shutdown()
    logger.info("Scheduler shut down")

app = FastAPI(
    title="KIETMap API",
    description="Student Directory API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://*.vercel.app",  # Allow all Vercel deployments
        "https://student-directory-psi.vercel.app",  # Your production domain
    ],
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
