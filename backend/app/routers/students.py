from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from bson import ObjectId
from app.core.database import get_users_collection
from app.core.security import decode_access_token
from app.schemas.user import UserResponse, ProfileCompletionResponse

router = APIRouter(prefix="/api/students", tags=["Students"])

# Dependency to get current user from token
async def get_current_user(token: str):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
    collection = await get_users_collection()
    user = await collection.find_one({"_id": ObjectId(payload["sub"])})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@router.get("/profile/completion/{user_id}")
async def get_profile_completion(user_id: str):
    """Check if student profile is complete"""
    collection = await get_users_collection()
    
    try:
        user = await collection.find_one({"_id": ObjectId(user_id)})
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID")
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    if user.get("role") != "student":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is not a student")
    
    # Check required fields for student profile
    required_fields = [
        "firstName", "lastName", "email", "phone",
        "university", "faculty", "department", "matricNumber", "level"
    ]
    
    missing_fields = []
    for field in required_fields:
        if not user.get(field):
            missing_fields.append(field)
    
    is_complete = len(missing_fields) == 0
    
    return ProfileCompletionResponse(
        is_complete=is_complete,
        missing_fields=missing_fields,
        message="Profile complete!" if is_complete else "Please complete your profile to view internships."
    )

@router.get("/profile/{user_id}")
async def get_student_profile(user_id: str):
    """Get student profile details"""
    collection = await get_users_collection()
    
    try:
        user = await collection.find_one({"_id": ObjectId(user_id)})
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID")
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    if user.get("role") != "student":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is not a student")
    
    # Remove sensitive data
    user.pop("hashedPassword", None)
    user["_id"] = str(user["_id"])
    
    return user

@router.put("/profile/{user_id}")
async def update_student_profile(user_id: str, profile_data: dict):
    """Update student profile"""
    collection = await get_users_collection()
    
    try:
        user = await collection.find_one({"_id": ObjectId(user_id)})
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID")
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    if user.get("role") != "student":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is not a student")
    
    # Allowed fields to update
    allowed_fields = [
        "firstName", "lastName", "phone",
        "university", "faculty", "department", "matricNumber", "level",
        "skills", "interests", "careerAspiration"
    ]
    
    update_data = {}
    for field in allowed_fields:
        if field in profile_data:
            update_data[field] = profile_data[field]
    
    update_data["updatedAt"] = datetime.utcnow()
    
    result = await collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No changes made")
    
    return {"message": "Profile updated successfully"}