from pydantic import BaseModel, EmailStr
from typing import Optional

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: str
    email: str

class OTPRequest(BaseModel):
    email: EmailStr
    otp: str

class OTPResponse(BaseModel):
    message: str
    verified: bool

class ResendOTPRequest(BaseModel):
    email: EmailStr

class RegisterResponse(BaseModel):
    message: str
    email: str
    role: str

class ErrorResponse(BaseModel):
    detail: str