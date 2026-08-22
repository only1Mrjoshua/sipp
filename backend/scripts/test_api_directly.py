import sys
import os
import asyncio
import httpx
import json

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from pymongo import MongoClient

BASE_URL = "http://localhost:8000"
PASSWORD = "LovuLord2022$$"

# Connect to MongoDB
mongo_client = MongoClient(settings.MONGODB_URL)
db = mongo_client[settings.DATABASE_NAME]
users_collection = db.users

async def test_api(student_email):
    # Get student
    student = users_collection.find_one({"email": student_email, "role": "student"})
    if not student:
        print(f"Student {student_email} not found.")
        return
    
    print(f"\n👤 Testing API for {student_email}")
    print(f"   State: {student.get('state')}, LGA: {student.get('lga')}")
    
    # Login to get token
    async with httpx.AsyncClient(timeout=30.0) as client:
        login_response = await client.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": student_email, "password": PASSWORD}
        )
        if login_response.status_code != 200:
            print(f"❌ Login failed: {login_response.json()}")
            return
        token = login_response.json().get("access_token")
        print(f"   Login successful, token obtained.")
        
        # Call the internships endpoint
        headers = {"Authorization": f"Bearer {token}"}
        response = await client.get(
            f"{BASE_URL}/api/internships/student/matched?skip=0&limit=50",
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Found {len(data)} internships")
            if data:
                # Show first few
                for internship in data[:3]:
                    print(f"      - {internship.get('title')} (Match: {internship.get('match')}%)")
        else:
            print(f"   ❌ API error: {response.status_code} – {response.json()}")

async def main():
    student_emails = [
        "sorochijoshua22@gmail.com",
        "sorochijoshua2022@gmail.com",
        "sorochijoshua2021@gmail.com",
        "sorochijoshua30@gmail.com",
        "01joshcreations@gmail.com"
    ]
    for email in student_emails:
        await test_api(email)

if __name__ == "__main__":
    asyncio.run(main())