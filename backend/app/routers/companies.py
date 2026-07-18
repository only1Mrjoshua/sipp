from fastapi import APIRouter, HTTPException, status, File, UploadFile, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime
from bson import ObjectId
from app.core.database import get_users_collection
from app.core.security import decode_access_token
import cloudinary
import cloudinary.uploader
from app.core.config import settings

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

router = APIRouter(prefix="/api/companies", tags=["Companies"])

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

@router.get("/profile/{user_id}")
async def get_company_profile(user_id: str):
    """Get company profile details"""
    collection = await get_users_collection()
    
    try:
        user = await collection.find_one({"_id": ObjectId(user_id)})
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID")
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    if user.get("role") != "company":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is not a company")
    
    # Remove sensitive data
    user.pop("hashedPassword", None)
    user["_id"] = str(user["_id"])
    
    return user

@router.put("/profile/{user_id}")
async def update_company_profile(user_id: str, profile_data: dict):
    """Update company profile"""
    collection = await get_users_collection()
    
    try:
        user = await collection.find_one({"_id": ObjectId(user_id)})
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID")
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    if user.get("role") != "company":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is not a company")
    
    # Allowed fields to update - INCLUDING website
    allowed_fields = [
        "companyName", "phone", "website", "industry", "state", "city", "address",
        "companyDescription", "companySize", "internshipCategories",
        "skillsRequired", "skillsOffered", "benefits"
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
    
    if user.get("role") != "company":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is not a company")
    
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
            folder=f"sipp/company_profiles/{user_id}",
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