import sys
import os

# Add the parent directory (backend/) to Python path so 'app' can be imported
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import asyncio
import httpx
import time
from pymongo import MongoClient
from app.core.config import settings

# ============================================================
# CONFIGURATION
# ============================================================
BASE_URL = "http://localhost:8000"  # Change if needed
PASSWORD = "LovuLord2022$$"         # Default password for all students

# MongoDB connection (uses your app's settings)
client_mongo = MongoClient(settings.MONGODB_URL)
db = client_mongo[settings.DATABASE_NAME]

# ============================================================
# STUDENT DATA
# ============================================================
STUDENTS = [
    {
        # 1. Computer Science, Obong University, Port Harcourt, Rivers
        "firstName": "Joshua",
        "lastName": "Sorochi",
        "email": "sorochijoshua22@gmail.com",
        "phone": "+234 801 234 5678",
        "university": "Obong University",
        "faculty": "Natural and Applied Science",
        "department": "Computer Science",
        "matricNumber": "OBU/CS/2022/1001",
        "level": "300L",
        "state": "Rivers",
        "lga": "Port Harcourt",
        "skills": ["Python", "JavaScript", "HTML/CSS", "Git", "SQL",
                   "Data Structures", "Algorithms", "React", "Node.js"],
        "interests": ["Software Development", "Web Development",
                      "Artificial Intelligence", "Data Science"],
        "careerAspiration": "Full Stack Developer"
    },
    {
        # 2. Computer Science, Obong University, Lugbe, Abuja (FCT)
        "firstName": "Njoku",
        "lastName": "Samuel",
        "email": "sorochijoshua2022@gmail.com",
        "phone": "+234 802 345 6789",
        "university": "Obong University",
        "faculty": "Natural and Applied Science",
        "department": "Computer Science",
        "matricNumber": "OBU/CS/2022/1002",
        "level": "300L",
        "state": "FCT (Abuja)",
        "lga": "Municipal Area Council",
        "skills": ["Python", "Java", "C++", "Git", "SQL",
                   "Data Structures", "Algorithms", "Spring Boot"],
        "interests": ["Software Engineering", "Backend Development",
                      "Cloud Computing", "DevOps"],
        "careerAspiration": "Backend Engineer"
    },
    {
        # 3. Computer Science, Obong University, Keffi, Nasarawa
        "firstName": "Joy",
        "lastName": "Riyesi",
        "email": "sorochijoshua2021@gmail.com",
        "phone": "+234 803 456 7890",
        "university": "Obong University",
        "faculty": "Natural and Applied Science",
        "department": "Computer Science",
        "matricNumber": "OBU/CS/2022/1003",
        "level": "300L",
        "state": "Nasarawa",
        "lga": "Keffi",
        "skills": ["Python", "JavaScript", "HTML/CSS", "Git",
                   "React", "Node.js", "MongoDB", "Express"],
        "interests": ["Web Development", "Mobile Development",
                      "UI/UX Design", "Digital Marketing"],
        "careerAspiration": "Frontend Developer"
    },
    {
        # 4. Biochemistry, Surulere, Lagos
        "firstName": "Ifiok",
        "lastName": "Samuel",
        "email": "sorochijoshua30@gmail.com",
        "phone": "+234 804 567 8901",
        "university": "University of Lagos",
        "faculty": "Science",
        "department": "Biochemistry",
        "matricNumber": "UNILAG/BCH/2022/001",
        "level": "300L",
        "state": "Lagos",
        "lga": "Surulere",
        "skills": ["Lab Techniques", "Data Analysis", "Scientific Writing",
                   "Microscopy", "Chromatography", "Spectroscopy"],
        "interests": ["Medical Research", "Pharmaceuticals",
                      "Biotechnology", "Public Health"],
        "careerAspiration": "Biochemist"
    },
    {
        # 5. International Relations, Surulere, Lagos
        "firstName": "Edara",
        "lastName": "Samuel",
        "email": "01joshcreations@gmail.com",
        "phone": "+234 805 678 9012",
        "university": "University of Lagos",
        "faculty": "Social Sciences",
        "department": "International Relations",
        "matricNumber": "UNILAG/IR/2022/001",
        "level": "300L",
        "state": "Lagos",
        "lga": "Surulere",
        "skills": ["Policy Analysis", "Negotiation", "Diplomacy",
                   "Research", "Communication", "Conflict Resolution"],
        "interests": ["Global Governance", "Human Rights",
                      "International Law", "Environmental Policy"],
        "careerAspiration": "Diplomat"
    }
]

# ============================================================
# HELPER FUNCTIONS
# ============================================================
async def register_student(client, student_data, password):
    """Register a single student with password."""
    print(f"\n📝 Registering {student_data['firstName']} {student_data['lastName']} ({student_data['email']})...")
    
    # Build payload: copy all fields except state and lga, then add them explicitly
    payload = {
        k: v for k, v in student_data.items()
        if k not in ["state", "lga"]
    }
    payload["state"] = student_data["state"]
    payload["lga"] = student_data["lga"]
    payload["password"] = password  # ← IMPORTANT: add password
    
    try:
        response = await client.post(
            f"{BASE_URL}/api/auth/register/student",
            json=payload
        )
        if response.status_code == 200:
            print(f"✅ Registration successful for {student_data['email']}")
            return True, response.json()
        else:
            error = response.json().get('detail', 'Unknown error')
            print(f"❌ Registration failed: {error}")
            return False, None
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return False, None

def get_otp_from_db(email):
    """Fetch the latest OTP for a given email."""
    otp_doc = db.otps.find_one(
        {"email": email},
        sort=[("createdAt", -1)]
    )
    return otp_doc.get("otp") if otp_doc else None

async def verify_otp(client, email, otp):
    """Verify OTP for the student."""
    print(f"🔐 Verifying OTP {otp} for {email}")
    try:
        response = await client.post(
            f"{BASE_URL}/api/auth/verify-otp",
            json={"email": email, "otp": otp}
        )
        if response.status_code == 200:
            print(f"✅ OTP verified for {email}")
            return True
        else:
            print(f"❌ OTP verification failed: {response.json().get('detail')}")
            return False
    except Exception as e:
        print(f"❌ OTP verification error: {e}")
        return False

async def login_and_verify(client, email, password):
    """Login to confirm account is active."""
    print(f"🔐 Logging in {email}...")
    try:
        response = await client.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": email, "password": password}
        )
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Login successful for {email}")
            return data
        else:
            print(f"❌ Login failed: {response.json().get('detail')}")
            return None
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None

async def create_student(client, student_data, password):
    """Full workflow: register, get OTP, verify, login."""
    email = student_data["email"]
    
    # 1. Register with password
    success, _ = await register_student(client, student_data, password)
    if not success:
        return False
    
    # 2. Wait for OTP to be saved
    print("⏳ Waiting for OTP...")
    time.sleep(2)
    
    # 3. Retrieve OTP from DB
    otp = get_otp_from_db(email)
    if not otp:
        print(f"⚠️ Could not retrieve OTP for {email}. Skipping verification.")
        return False
    
    # 4. Verify OTP
    verified = await verify_otp(client, email, otp)
    if not verified:
        return False
    
    # 5. Login
    login_data = await login_and_verify(client, email, password)
    if not login_data:
        return False
    
    print(f"✅ Student {email} fully activated.\n")
    return True

# ============================================================
# MAIN
# ============================================================
async def main():
    print("=" * 60)
    print("SIPP - Bulk Student Profile Creator")
    print("=" * 60)
    print(f"Total students to create: {len(STUDENTS)}")
    print("-" * 60)
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        for i, student in enumerate(STUDENTS, 1):
            print(f"\n--- Student {i}/{len(STUDENTS)} ---")
            success = await create_student(client, student, PASSWORD)
            if success:
                print(f"✅ {student['firstName']} {student['lastName']} created successfully.")
            else:
                print(f"❌ Failed to create {student['firstName']} {student['lastName']}.")
            time.sleep(1)
    
    print("\n" + "=" * 60)
    print("✅ All students processed.")
    print("=" * 60)
    print("\nCredentials for all students:")
    for s in STUDENTS:
        print(f"  Email: {s['email']}")
        print(f"  Password: {PASSWORD}")
        print(f"  Location: {s['state']} – {s['lga']}")
        print()

if __name__ == "__main__":
    asyncio.run(main())