from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import IndexModel, ASCENDING, DESCENDING
from .config import settings

class Database:
    client: AsyncIOMotorClient = None
    db = None
    
    @classmethod
    async def connect_db(cls):
        cls.client = AsyncIOMotorClient(settings.MONGODB_URL)
        cls.db = cls.client[settings.DATABASE_NAME]
        await cls.create_indexes()
        print(f"Connected to MongoDB: {settings.DATABASE_NAME}")
    
    @classmethod
    async def close_db(cls):
        if cls.client:
            cls.client.close()
            print("MongoDB connection closed")
    
    @classmethod
    async def create_indexes(cls):
        # Users collection indexes
        await cls.db.users.create_indexes([
            IndexModel([("email", ASCENDING)], unique=True),
            IndexModel([("role", ASCENDING)]),
            IndexModel([("isVerified", ASCENDING)]),
            IndexModel([("isActive", ASCENDING)]),
        ])
        
        # OTPs collection indexes
        await cls.db.otps.create_indexes([
            IndexModel([("email", ASCENDING)]),
            IndexModel([("expiresAt", ASCENDING)], expireAfterSeconds=0),
        ])
        
        # Internships collection indexes
        await cls.db.internships.create_indexes([
            IndexModel([("companyId", ASCENDING)]),
            IndexModel([("status", ASCENDING)]),
            IndexModel([("skillsRequired", ASCENDING)]),
            IndexModel([("createdAt", DESCENDING)]),
        ])
        
        # Applications collection indexes - ADD THIS
        await cls.db.applications.create_indexes([
            IndexModel([("internshipId", ASCENDING)]),
            IndexModel([("studentId", ASCENDING)]),
            IndexModel([("companyId", ASCENDING)]),
            IndexModel([("status", ASCENDING)]),
            IndexModel([("createdAt", DESCENDING)]),
        ])
        
        print("Database indexes created")
    
    @classmethod
    def get_db(cls):
        return cls.db

# Collection accessors
async def get_users_collection():
    return Database.get_db()["users"]

async def get_otps_collection():
    return Database.get_db()["otps"]

async def get_internships_collection():
    return Database.get_db()["internships"]

async def get_applications_collection():
    return Database.get_db()["applications"]