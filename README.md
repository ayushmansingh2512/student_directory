# KIETMap - Student Directory

A modern, minimal student directory application built with FastAPI and React.

## Project Structure

- `backend/`: FastAPI application with SQLAlchemy and Pydantic.
- `frontend/`: React application with Vite and Tailwind CSS.

## Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL (Neon DB recommended)

## Setup Instructions

### Backend

1.  Navigate to the backend directory:
    ```bash
    cd kietmap/backend
    ```
2.  Create and activate a virtual environment:
    ```bash
    python -m venv venv
    # Windows
    .\venv\Scripts\activate
    # Mac/Linux
    source venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Set up environment variables:
    - Create a `.env` file in `backend/` (see `.env.example` or use the one created).
    - Add `DATABASE_URL`, `GITHUB_TOKEN`, etc.
5.  **Start the server:**
    ```bash
    uvicorn app.main:app --reload
    ```
    The API will be available at `http://localhost:8000`.

### Frontend

1.  Navigate to the frontend directory:
    ```bash
    cd kietmap/frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

## Features

- **Student Registration:** Register with Roll No, Section, and Profile Links.
- **Directory:** View students by Section (A, B, C, D).
- **Rankings:** View top students by GitHub Commits and LeetCode Points.
- **Profile View:** Detailed modal with sliding portfolio preview.
