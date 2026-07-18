from datetime import datetime
from app.core.database import get_users_collection
from app.core.security import hash_password, verify_password
from app.models.user import StudentCreate, CompanyCreate, AdminCreate
from app.schemas.auth import LoginRequest

class UserService:
    @staticmethod
    async def create_student(student_data: StudentCreate):
        collection = await get_users_collection()
        
        # Check if email exists
        existing = await collection.find_one({"email": student_data.email})
        if existing:
            return None, "Email already registered"
        
        hashed_pw = hash_password(student_data.password)
        user_doc = {
            "firstName": student_data.firstName,
            "lastName": student_data.lastName,
            "email": student_data.email,
            "phone": student_data.phone,
            "university": student_data.university,
            "faculty": student_data.faculty,
            "department": student_data.department,
            "matricNumber": student_data.matricNumber,
            "level": student_data.level,
            "hashedPassword": hashed_pw,
            "role": "student",
            "isVerified": False,
            "isActive": True,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        
        result = await collection.insert_one(user_doc)
        return str(result.inserted_id), None

    @staticmethod
    async def create_company(company_data: CompanyCreate):
        collection = await get_users_collection()
        
        # Check if email exists
        existing = await collection.find_one({"email": company_data.email})
        if existing:
            return None, "Email already registered"
        
        hashed_pw = hash_password(company_data.password)
        user_doc = {
            "companyName": company_data.companyName,
            "email": company_data.email,
            "phone": company_data.phone,
            "industry": company_data.industry,
            "state": company_data.state,
            "city": company_data.city,
            "address": company_data.address,
            "hashedPassword": hashed_pw,
            "role": "company",
            "isVerified": False,
            "isActive": True,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        
        result = await collection.insert_one(user_doc)
        return str(result.inserted_id), None

    @staticmethod
    async def create_admin(admin_data: AdminCreate):
        collection = await get_users_collection()
        
        # Check if admin exists
        existing = await collection.find_one({"email": admin_data.email})
        if existing:
            return None, "Admin already exists"
        
        hashed_pw = hash_password(admin_data.password)
        user_doc = {
            "email": admin_data.email,
            "hashedPassword": hashed_pw,
            "role": "admin",
            "isVerified": True,
            "isActive": True,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        
        result = await collection.insert_one(user_doc)
        return str(result.inserted_id), None

    @staticmethod
    async def authenticate_user(login_data: LoginRequest):
        collection = await get_users_collection()
        user = await collection.find_one({"email": login_data.email})
        
        if not user:
            return None, "Invalid credentials"
        
        if not verify_password(login_data.password, user.get("hashedPassword", "")):
            return None, "Invalid credentials"
        
        if not user.get("isActive", True):
            return None, "Account is deactivated"
        
        return user, None

    @staticmethod
    async def verify_user(email: str):
        collection = await get_users_collection()
        result = await collection.update_one(
            {"email": email},
            {"$set": {"isVerified": True, "updatedAt": datetime.utcnow()}}
        )
        return result.modified_count > 0

    @staticmethod
    async def get_user_by_email(email: str):
        collection = await get_users_collection()
        return await collection.find_one({"email": email})

    @staticmethod
    async def get_user_by_id(user_id: str):
        from bson import ObjectId
        collection = await get_users_collection()
        return await collection.find_one({"_id": ObjectId(user_id)})