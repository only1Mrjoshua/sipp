from pydantic import BaseModel, EmailStr
from typing import Optional, List

# --- REQUEST SCHEMAS ---

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class StudentSignupRequest(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    phone: str
    university: str
    faculty: str
    department: str
    matricNumber: str
    level: str
    state: str          # NEW: Student's state (required)
    lga: str            # NEW: Student's LGA (required)
    password: str
    skills: Optional[List[str]] = []
    interests: Optional[List[str]] = []
    careerAspiration: Optional[str] = ""

class CompanySignupRequest(BaseModel):
    companyName: str
    email: EmailStr
    phone: str
    industry: str
    state: str          # NEW: Company's state (required)
    lga: str            # NEW: Company's LGA (required for exact matching)
    city: str
    address: str
    password: str

class OTPRequest(BaseModel):
    email: EmailStr
    otp: str

class ResendOTPRequest(BaseModel):
    email: EmailStr

# --- RESPONSE SCHEMAS ---

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: str
    email: str
    first_name: str = ""
    last_name: str = ""
    profile_picture: str = ""
    company_name: str = ""
    skills: List[str] = []
    interests: List[str] = []
    career_aspiration: str = ""
    state: Optional[str] = None   # NEW: User's state
    lga: Optional[str] = None     # NEW: User's LGA

class OTPResponse(BaseModel):
    message: str
    verified: bool

class RegisterResponse(BaseModel):
    message: str
    email: str
    role: str

class ErrorResponse(BaseModel):
    detail: str