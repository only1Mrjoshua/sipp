from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict
from bson import ObjectId

class ApplicationCreate(BaseModel):
    internshipId: str
    coverLetter: Optional[str] = ""

class ApplicationUpdate(BaseModel):
    status: str
    note: Optional[str] = ""

class ApplicationOut(BaseModel):
    id: str = Field(alias="_id")
    internshipId: str
    studentId: str
    companyId: str
    studentName: str
    studentEmail: str
    studentPhone: Optional[str] = None
    studentUniversity: Optional[str] = None
    studentDepartment: Optional[str] = None
    studentLevel: Optional[str] = None
    studentSkills: List[str] = []
    studentInterests: List[str] = []
    internshipTitle: str
    coverLetter: Optional[str] = ""
    matchScore: int
    status: str
    note: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )