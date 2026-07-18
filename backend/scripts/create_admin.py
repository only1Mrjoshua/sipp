import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import Database
from app.core.config import settings
from app.services.user_service import UserService
from app.models.user import AdminCreate

async def create_admin():
    await Database.connect_db()
    
    admin_data = AdminCreate(
        email=settings.ADMIN_EMAIL,
        password=settings.ADMIN_PASSWORD
    )
    
    user_id, error = await UserService.create_admin(admin_data)
    if error:
        print(f"❌ Error: {error}")
    else:
        print(f"✅ Admin created successfully!")
        print(f"   Email: {settings.ADMIN_EMAIL}")
        print(f"   Password: {settings.ADMIN_PASSWORD}")
        print(f"   User ID: {user_id}")
    
    await Database.close_db()

if __name__ == "__main__":
    asyncio.run(create_admin())