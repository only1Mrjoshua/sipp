from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.database import Database
from app.core.config import settings
from app.routers import auth, students, companies, internships, applications

@asynccontextmanager
async def lifespan(app: FastAPI):
    await Database.connect_db()
    yield
    await Database.close_db()

app = FastAPI(
    title="SIPP API",
    description="Smart Internship Placement Portal API",
    version="1.0.0",
    lifespan=lifespan
)

allowed_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    settings.FRONTEND_URL,
    "https://sipp.curriumx.online",
    "https://sipp.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(students.router)
app.include_router(companies.router)
app.include_router(internships.router)
app.include_router(applications.router)  # ADD THIS

@app.get("/")
async def root():
    return {
        "message": "Welcome to SIPP API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}