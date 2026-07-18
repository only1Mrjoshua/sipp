from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict, field_validator
from bson import ObjectId

class InternshipCreate(BaseModel):
    title: str
    location: str
    type: str
    duration: str
    aboutRole: str
    aboutCompany: str
    applicationDeadline: str
    spotsAvailable: int
    skillsRequired: Optional[List[str]] = Field(default_factory=list)
    skillsOffered: Optional[List[str]] = Field(default_factory=list)
    benefits: Optional[List[str]] = Field(default_factory=list)

    @field_validator('spotsAvailable')
    def validate_spots(cls, v):
        if v < 1:
            raise ValueError('Spots must be at least 1')
        return v

    @field_validator('type')
    def validate_type(cls, v):
        valid_types = ['Full-time', 'Part-time', 'Remote', 'Hybrid']
        if v not in valid_types:
            raise ValueError(f'Type must be one of: {", ".join(valid_types)}')
        return v

    @field_validator('duration')
    def validate_duration(cls, v):
        valid_durations = ['3 months', '4 months', '6 months', '9 months', '12 months']
        if v not in valid_durations:
            raise ValueError(f'Duration must be one of: {", ".join(valid_durations)}')
        return v

class InternshipOut(BaseModel):
    id: str = Field(alias="_id")
    companyId: str
    companyName: Optional[str] = None
    title: str
    location: str
    type: str
    duration: str
    aboutRole: str
    aboutCompany: str
    applicationDeadline: str
    spotsAvailable: int
    skillsRequired: List[str] = Field(default_factory=list)
    skillsOffered: List[str] = Field(default_factory=list)
    benefits: List[str] = Field(default_factory=list)
    status: str
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )