from fastapi import APIRouter, HTTPException, status, File, UploadFile, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime
from bson import ObjectId
from app.core.database import get_users_collection, get_applications_collection
from app.core.security import decode_access_token, verify_password, hash_password
from app.schemas.user import ProfileCompletionResponse
import cloudinary
import cloudinary.uploader
from app.core.config import settings

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

router = APIRouter(prefix="/api/students", tags=["Students"])

# Security
security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get current user from JWT token in Authorization header"""
    token = credentials.credentials
    
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    collection = await get_users_collection()
    user = await collection.find_one({"_id": ObjectId(payload["sub"])})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if not user.get("isActive", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated"
        )
    
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
    
    # Ensure arrays are always returned
    if "skills" not in user:
        user["skills"] = []
    if "interests" not in user:
        user["interests"] = []
    if "careerAspiration" not in user:
        user["careerAspiration"] = ""
    
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
    
    allowed_fields = [
        "firstName", "lastName", "phone",
        "university", "faculty", "department", "matricNumber", "level",
        "skills", "interests", "careerAspiration"
    ]
    
    update_data = {}
    for field in allowed_fields:
        if field in profile_data:
            # Handle arrays properly
            if field in ["skills", "interests"]:
                update_data[field] = profile_data[field] or []
            else:
                update_data[field] = profile_data[field]
    
    update_data["updatedAt"] = datetime.utcnow()
    
    result = await collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No changes made")
    
    return {"message": "Profile updated successfully"}

@router.post("/profile/upload-photo/{user_id}")
async def upload_profile_photo(
    user_id: str,
    file: UploadFile = File(...)
):
    """Upload profile picture to Cloudinary"""
    collection = await get_users_collection()
    
    try:
        user = await collection.find_one({"_id": ObjectId(user_id)})
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID")
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    if user.get("role") != "student":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is not a student")
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed"
        )
    
    # Validate file size (max 5MB)
    file_content = await file.read()
    if len(file_content) > 5 * 1024 * 1024:  # 5MB
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File too large. Maximum size is 5MB"
        )
    
    try:
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            file_content,
            folder=f"sipp/profiles/{user_id}",
            overwrite=True,
            resource_type="image",
            transformation=[
                {"width": 400, "height": 400, "crop": "fill"},
                {"quality": "auto"},
                {"fetch_format": "auto"}
            ]
        )
        image_url = result.get("secure_url")
        
        # Update user profile with the image URL
        await collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {
                "profilePicture": image_url,
                "updatedAt": datetime.utcnow()
            }}
        )
        
        return {
            "message": "Profile picture uploaded successfully",
            "profilePicture": image_url
        }
    except Exception as e:
        print(f"Upload error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload image: {str(e)}"
        )

# ==================== SETTINGS ENDPOINTS ====================

@router.put("/settings/change-password")
async def change_password(
    password_data: dict,
    user: dict = Depends(get_current_user)
):
    """Change student password"""
    
    if user.get("role") != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can change their password"
        )
    
    current_password = password_data.get("currentPassword")
    new_password = password_data.get("newPassword")
    
    if not current_password or not new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password and new password are required"
        )
    
    # Verify current password
    if not verify_password(current_password, user.get("hashedPassword", "")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Validate new password
    if len(new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 6 characters"
        )
    
    # Hash new password
    hashed_password = hash_password(new_password)
    
    # Update password
    collection = await get_users_collection()
    await collection.update_one(
        {"_id": ObjectId(user["_id"])},
        {"$set": {
            "hashedPassword": hashed_password,
            "updatedAt": datetime.utcnow()
        }}
    )
    
    return {"message": "Password updated successfully"}

@router.delete("/settings/delete-account")
async def delete_account(
    user: dict = Depends(get_current_user)
):
    """Delete student account and all associated data"""
    
    if user.get("role") != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can delete their account"
        )
    
    user_id = str(user["_id"])
    users_collection = await get_users_collection()
    applications_collection = await get_applications_collection()
    
    # Delete all applications submitted by this student
    await applications_collection.delete_many({
        "studentId": user_id
    })
    
    # Delete the user account
    result = await users_collection.delete_one({
        "_id": ObjectId(user_id)
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {"message": "Account deleted successfully"}