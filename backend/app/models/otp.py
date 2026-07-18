from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

class OTPCreate(BaseModel):
    email: EmailStr
    otp: str
    expiresAt: datetime = Field(default_factory=lambda: datetime.utcnow())

class OTPInDB(BaseModel):
    email: EmailStr
    otp: str
    expiresAt: datetime
    createdAt: datetime = Field(default_factory=datetime.utcnow)