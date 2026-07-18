from pydantic import BaseModel
from typing import Optional, List

class UserResponse(BaseModel):
    id: str
    email: str
    phone: str
    role: str
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    university: Optional[str] = None
    faculty: Optional[str] = None
    department: Optional[str] = None
    matricNumber: Optional[str] = None
    level: Optional[str] = None
    companyName: Optional[str] = None
    industry: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    isVerified: bool
    isActive: bool
    createdAt: str
    updatedAt: str

class ProfileCompletionResponse(BaseModel):
    is_complete: bool
    missing_fields: List[str]
    message: str

class StudentProfileUpdate(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    phone: Optional[str] = None
    university: Optional[str] = None
    faculty: Optional[str] = None
    department: Optional[str] = None
    matricNumber: Optional[str] = None
    level: Optional[str] = None
    skills: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    careerAspiration: Optional[str] = None