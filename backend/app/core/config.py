from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # MongoDB
    MONGODB_URL: str
    DATABASE_NAME: str = "sipp"
    
    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60
    
    # Resend Email
    RESEND_API_KEY: str
    EMAIL_FROM: str
    
    # Frontend
    FRONTEND_URL: str = "http://localhost:5173"
    
    # Admin
    ADMIN_EMAIL: str
    ADMIN_PASSWORD: str
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()