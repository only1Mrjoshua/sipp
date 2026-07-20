import asyncio
import httpx
from datetime import datetime
import time

# Configuration
BASE_URL = "http://localhost:8000"  # Change to your backend URL
EMAIL = "sorochijoshua22@gmail.com"
PASSWORD = "LovuLord2022$$"  # Replace with the actual password

# Student Details
STUDENT_DATA = {
    "firstName": "Sorochi",
    "lastName": "Joshua",
    "email": EMAIL,
    "phone": "+234 812 345 6789",
    "university": "Obong University",
    "faculty": "Natural and Applied Science",
    "department": "Computer Science",
    "matricNumber": "OBU/CS/2022/1234",
    "level": "300L",
    "password": PASSWORD,
    "skills": [
        "Python",
        "JavaScript",
        "HTML/CSS",
        "Git",
        "SQL",
        "Data Structures",
        "Algorithms",
        "Java",
        "React",
        "Node.js",
        "Problem Solving",
        "Critical Thinking",
        "Team Collaboration",
        "Communication"
    ],
    "interests": [
        "Software Development",
        "Web Development",
        "Artificial Intelligence",
        "Data Science",
        "Cloud Engineering",
        "Mobile Development",
        "UI/UX Design"
    ],
    "careerAspiration": "Software Engineer"
}

async def register_student(client):
    """Register the student account"""
    print("📝 Registering student account...")
    
    registration_data = {
        "firstName": STUDENT_DATA["firstName"],
        "lastName": STUDENT_DATA["lastName"],
        "email": STUDENT_DATA["email"],
        "phone": STUDENT_DATA["phone"],
        "university": STUDENT_DATA["university"],
        "faculty": STUDENT_DATA["faculty"],
        "department": STUDENT_DATA["department"],
        "matricNumber": STUDENT_DATA["matricNumber"],
        "level": STUDENT_DATA["level"],
        "password": STUDENT_DATA["password"],
        "skills": STUDENT_DATA["skills"],
        "interests": STUDENT_DATA["interests"],
        "careerAspiration": STUDENT_DATA["careerAspiration"]
    }
    
    try:
        response = await client.post(
            f"{BASE_URL}/api/auth/register/student",
            json=registration_data
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Student registered successfully!")
            print(f"   Email: {STUDENT_DATA['email']}")
            print(f"   Name: {STUDENT_DATA['firstName']} {STUDENT_DATA['lastName']}")
            print(f"   Department: {STUDENT_DATA['department']}")
            print(f"   Level: {STUDENT_DATA['level']}")
            print(f"   Password: {PASSWORD}")
            return True, data
        else:
            error_data = response.json()
            print(f"❌ Registration failed: {error_data.get('detail', 'Unknown error')}")
            return False, None
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return False, None

async def get_otp_from_db():
    """Get the OTP directly from the database (MongoDB)"""
    print("\n🔍 Checking for OTP in database...")
    
    try:
        # Import pymongo to connect to MongoDB
        from pymongo import MongoClient
        from app.core.config import settings
        
        # Connect to MongoDB
        client = MongoClient(settings.MONGODB_URL)
        db = client[settings.DATABASE_NAME]
        
        # Find the latest OTP for this email
        otp_doc = db.otps.find_one(
            {"email": EMAIL},
            sort=[("createdAt", -1)]
        )
        
        if otp_doc:
            otp = otp_doc.get("otp")
            print(f"✅ OTP found: {otp}")
            return otp
        else:
            print("❌ No OTP found in database")
            return None
    except Exception as e:
        print(f"⚠️ Could not read OTP from database: {e}")
        print("   Please check the OTP manually in MongoDB Compass")
        return None

async def verify_otp(client, otp):
    """Verify the OTP"""
    print(f"\n🔐 Verifying OTP: {otp}")
    
    try:
        response = await client.post(
            f"{BASE_URL}/api/auth/verify-otp",
            json={"email": EMAIL, "otp": otp}
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ OTP verified successfully!")
            return True
        else:
            error_data = response.json()
            print(f"❌ OTP verification failed: {error_data.get('detail', 'Unknown error')}")
            return False
    except Exception as e:
        print(f"❌ OTP verification error: {e}")
        return False

async def login_and_verify(client):
    """Login to verify the account was created"""
    print("\n🔐 Verifying login...")
    
    try:
        response = await client.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": STUDENT_DATA["email"], "password": PASSWORD}
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Login successful!")
            print(f"   User ID: {data.get('user_id')}")
            print(f"   Role: {data.get('role')}")
            print(f"   First Name: {data.get('first_name')}")
            print(f"   Last Name: {data.get('last_name')}")
            return data
        else:
            error_data = response.json()
            print(f"❌ Login failed: {error_data.get('detail', 'Unknown error')}")
            return None
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None

async def main():
    print("=" * 60)
    print("SIPP - Create Student Profile with OTP")
    print("=" * 60)
    print(f"Email: {EMAIL}")
    print(f"Name: {STUDENT_DATA['firstName']} {STUDENT_DATA['lastName']}")
    print(f"Department: {STUDENT_DATA['department']}")
    print(f"Level: {STUDENT_DATA['level']}")
    print("-" * 60)
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        # Step 1: Register student
        registration_success, register_data = await register_student(client)
        
        if not registration_success:
            print("\n⚠️ Registration failed. The student might already exist.")
            print("   If the student exists, check the database or use the MongoDB script.")
            return
        
        # Step 2: Wait a moment for the OTP to be saved
        print("\n⏳ Waiting for OTP to be saved...")
        time.sleep(2)
        
        # Step 3: Get OTP from database
        otp = await get_otp_from_db()
        
        if not otp:
            print("\n⚠️ Could not retrieve OTP automatically.")
            print("   Please check MongoDB Compass for the OTP in the 'otps' collection.")
            print("   Then enter it manually when prompted.")
            
            # Manual OTP entry
            otp = input("\nEnter the OTP from the database: ")
            if not otp:
                print("❌ No OTP provided. Cannot complete verification.")
                return
        
        # Step 4: Verify OTP
        verification_success = await verify_otp(client, otp)
        
        if not verification_success:
            print("\n❌ OTP verification failed.")
            print("   You can manually verify the OTP by:")
            print("   1. Check the OTP in MongoDB Compass (otps collection)")
            print("   2. Copy the OTP")
            print("   3. Run: python -c \"import requests; requests.post('http://localhost:8000/api/auth/verify-otp', json={'email': 'sorochijoshua22@gmail.com', 'otp': 'YOUR_OTP'})\"")
            return
        
        # Step 5: Login to verify account is active
        login_data = await login_and_verify(client)
        
        if not login_data:
            print("\n⚠️ Login failed. Please check the password.")
            return
        
        print("\n" + "=" * 60)
        print("✅ STUDENT PROFILE CREATED SUCCESSFULLY!")
        print("=" * 60)
        print(f"\n📌 Login Credentials:")
        print(f"   Email: {EMAIL}")
        print(f"   Password: {PASSWORD}")
        print(f"\n📌 Profile Details:")
        print(f"   Name: {STUDENT_DATA['firstName']} {STUDENT_DATA['lastName']}")
        print(f"   University: {STUDENT_DATA['university']}")
        print(f"   Department: {STUDENT_DATA['department']}")
        print(f"   Level: {STUDENT_DATA['level']}")
        print(f"   Career Aspiration: {STUDENT_DATA['careerAspiration']}")
        print(f"\n📌 Skills ({len(STUDENT_DATA['skills'])} skills):")
        print(f"   {', '.join(STUDENT_DATA['skills'][:10])}")
        if len(STUDENT_DATA['skills']) > 10:
            print(f"   ... and {len(STUDENT_DATA['skills']) - 10} more")
        print(f"\n📌 Interests ({len(STUDENT_DATA['interests'])} interests):")
        print(f"   {', '.join(STUDENT_DATA['interests'])}")
        print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())