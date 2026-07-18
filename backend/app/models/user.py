from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class UserBase(BaseModel):
    email: EmailStr
    phone: str
    role: str  # "student", "company", "admin"
    isVerified: bool = False
    isActive: bool = True
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class StudentCreate(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    phone: str
    university: str
    faculty: str
    department: str
    matricNumber: str
    level: str
    password: str

class StudentInDB(UserBase):
    firstName: str
    lastName: str
    university: str
    faculty: str
    department: str
    matricNumber: str
    level: str
    hashedPassword: str

class CompanyCreate(BaseModel):
    companyName: str
    email: EmailStr
    phone: str
    industry: str
    state: str
    city: str
    address: str
    password: str

class CompanyInDB(UserBase):
    companyName: str
    industry: str
    state: str
    city: str
    address: str
    hashedPassword: str

class AdminCreate(BaseModel):
    email: EmailStr
    password: str

class AdminInDB(UserBase):
    hashedPassword: str

class UserOut(BaseModel):
    id: str = Field(alias="_id")
    email: EmailStr
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
    profilePicture: Optional[str] = None  # Add this field
    isVerified: bool
    isActive: bool
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )