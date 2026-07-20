import asyncio
import httpx
from datetime import datetime, timedelta
import random
import time

# Configuration
BASE_URL = "http://localhost:8000"
EMAIL = "sorochijoshua2021@gmail.com"
PASSWORD = "LovuLord2022$$"  # Replace with the actual password

# Company Details
COMPANY_DATA = {
    "companyName": "MediHealth International",
    "email": EMAIL,
    "phone": "+234 812 345 6789",
    "industry": "Healthcare / Medical",
    "state": "Lagos",
    "city": "Ikeja",
    "address": "123 Medical Plaza, Ikeja, Lagos",
    "password": PASSWORD
}

# All internship types under Healthcare / Medical
INTERNSHIP_TYPES = [
    "Medical Intern",
    "Nursing Intern",
    "Pharmacy Intern",
    "Medical Research Intern",
    "Healthcare Administration Intern",
    "Public Health Intern",
    "Clinical Research Intern",
    "Medical Laboratory Intern",
    "Radiology Intern",
    "Physical Therapy Intern",
    "Mental Health Intern",
    "Occupational Therapy Intern",
    "Health Informatics Intern",
    "Community Health Intern"
]

# Healthcare specific skills
SKILLS_REQUIRED = [
    "Patient Care", "Clinical Skills", "Medical Terminology",
    "EMR Systems", "Research Skills", "Communication",
    "Critical Thinking", "Problem Solving", "Team Collaboration",
    "Compassion", "Attention to Detail", "Emergency Care",
    "Laboratory Techniques", "Molecular Biology", "PCR",
    "Pharmacology", "Drug Formulation", "Patient Counseling"
]

SKILLS_OFFERED = [
    "Advanced Patient Care", "Clinical Research", "Medical Ethics",
    "Healthcare Administration", "Leadership Skills",
    "Communication Skills", "Critical Thinking", "Team Collaboration",
    "Patient Management", "Healthcare Technology"
]

BENEFITS = [
    "Clinical Experience",
    "Mentorship Program",
    "Professional Development",
    "Health Insurance",
    "Flexible Hours",
    "Career Growth Opportunities",
    "Learning Resources",
    "Team Building Activities",
    "Medical Licensure Support",
    "Hands-on Training",
    "Research Opportunities"
]

def get_description(title):
    role_descriptions = {
        "Medical Intern": "Work alongside experienced physicians in diagnosing and treating patients. Gain hands-on clinical experience in various medical specialties and learn about patient care, medical procedures, and healthcare delivery.",
        "Nursing Intern": "Provide direct patient care under the supervision of registered nurses. Learn about patient assessment, medication administration, and nursing best practices.",
        "Pharmacy Intern": "Work in a clinical pharmacy setting, learning about drug dispensing, patient counseling, and pharmaceutical care. Gain experience in medication management and pharmacy operations.",
        "Medical Research Intern": "Participate in cutting-edge medical research projects. Learn about research methodologies, data collection, and analysis in clinical and laboratory settings.",
        "Healthcare Administration Intern": "Learn about healthcare management, operations, and policy. Work with administrators to improve healthcare delivery and patient outcomes.",
        "Public Health Intern": "Work on community health initiatives and public health programs. Learn about disease prevention, health education, and population health management.",
        "Clinical Research Intern": "Support clinical trials and research studies. Learn about Good Clinical Practice (GCP), data management, and regulatory compliance in clinical research.",
        "Medical Laboratory Intern": "Perform laboratory tests and analyses to support patient diagnosis. Learn about laboratory procedures, quality control, and diagnostic testing.",
        "Radiology Intern": "Work with medical imaging technologies like X-ray, MRI, and CT scans. Learn about radiology procedures and patient care in diagnostic imaging.",
        "Physical Therapy Intern": "Help patients recover from injuries and improve mobility. Learn about therapeutic exercises, rehabilitation techniques, and patient care.",
        "Mental Health Intern": "Support mental health professionals in providing care to patients. Learn about counseling, mental health assessment, and therapeutic interventions.",
        "Occupational Therapy Intern": "Help patients develop skills for daily living and working. Learn about occupational therapy techniques and patient rehabilitation.",
        "Health Informatics Intern": "Work at the intersection of healthcare and technology. Learn about electronic health records, health data analytics, and healthcare IT systems.",
        "Community Health Intern": "Engage with communities to promote health and wellness. Learn about health education, outreach programs, and community health assessment."
    }
    return role_descriptions.get(title, f"Gain hands-on experience in healthcare as a {title}.")

def get_location_specific(title):
    locations = ["Lagos, Nigeria", "Abuja, Nigeria", "Port Harcourt, Nigeria", "Ibadan, Nigeria", "Kano, Nigeria"]
    return locations[hash(title) % len(locations)]

def get_about_company():
    return """MediHealth International is a leading healthcare organization committed to providing high-quality medical services and advancing healthcare delivery in Nigeria. We operate state-of-the-art medical facilities and are dedicated to training the next generation of healthcare professionals.

Our mission is to improve health outcomes through excellent patient care, medical education, and research. We provide a supportive environment where healthcare interns can learn from experienced professionals, develop clinical skills, and contribute to meaningful healthcare initiatives."""

async def login(client):
    """Login and get access token"""
    try:
        response = await client.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": EMAIL, "password": PASSWORD}
        )
        if response.status_code == 200:
            data = response.json()
            return data["access_token"]
        return None
    except Exception:
        return None

async def register_company(client):
    """Register the company account"""
    print("📝 Registering company account...")
    
    try:
        response = await client.post(
            f"{BASE_URL}/api/auth/register/company",
            json=COMPANY_DATA
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Company registered successfully!")
            print(f"   Email: {COMPANY_DATA['email']}")
            print(f"   Company: {COMPANY_DATA['companyName']}")
            print(f"   Industry: {COMPANY_DATA['industry']}")
            print(f"   Password: {PASSWORD}")
            print(f"   ⚠️  OTP sent to {EMAIL}")
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
    print(f"\n🔐 Verifying OTP...")
    
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

async def create_internship(client, token, internship_type, index, total):
    """Create a single internship"""
    
    # Select skills (4-6 from the list)
    required_skills = random.sample(SKILLS_REQUIRED, min(5, len(SKILLS_REQUIRED)))
    offered_skills = random.sample(SKILLS_OFFERED, min(3, len(SKILLS_OFFERED)))
    benefits = random.sample(BENEFITS, min(4, len(BENEFITS)))
    
    location = get_location_specific(internship_type)
    
    # Set deadline to 3 months from now
    deadline = (datetime.now() + timedelta(days=90)).strftime("%Y-%m-%d")
    
    # Random spots (2-5)
    spots = random.randint(2, 5)
    
    payload = {
        "title": internship_type,
        "location": location,
        "type": random.choice(["Full-time", "Hybrid"]),
        "duration": random.choice(["3 months", "4 months", "6 months"]),
        "aboutRole": get_description(internship_type),
        "aboutCompany": get_about_company(),
        "applicationDeadline": deadline,
        "spotsAvailable": spots,
        "skillsRequired": required_skills,
        "skillsOffered": offered_skills,
        "benefits": benefits
    }
    
    print(f"  [{index}/{total}] Creating: {internship_type}")
    print(f"    Location: {location}")
    print(f"    Spots: {spots}")
    
    try:
        response = await client.post(
            f"{BASE_URL}/api/internships/create",
            json=payload,
            headers={"Authorization": f"Bearer {token}"}
        )
        response.raise_for_status()
        print(f"    ✅ Created successfully")
        return True
    except Exception as e:
        print(f"    ❌ Failed: {e}")
        return False

async def main():
    print("=" * 70)
    print("🏥 SIPP - Create Healthcare Company + All Internships")
    print("=" * 70)
    print(f"Email: {EMAIL}")
    print(f"Company: {COMPANY_DATA['companyName']}")
    print(f"Industry: {COMPANY_DATA['industry']}")
    print(f"Number of internships: {len(INTERNSHIP_TYPES)}")
    print("-" * 70)
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        # Step 1: Register company
        print("\n🚀 Step 1: Registering Company...")
        registration_success, register_data = await register_company(client)
        
        if not registration_success:
            print("\n⚠️ Registration failed. The company might already exist.")
            print("   If the company exists, we'll try to login.")
            
            # Try to login
            token = await login(client)
            if token:
                print("✅ Login successful! Continuing to create internships...")
                # Skip OTP verification, already verified
            else:
                print("❌ Login failed. Please check the credentials.")
                return
        else:
            # Step 2: Wait for OTP to be saved
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
                print("   3. Run: python -c \"import requests; requests.post('http://localhost:8000/api/auth/verify-otp', json={'email': 'sorochijoshua2021@gmail.com', 'otp': 'YOUR_OTP'})\"")
                return
            
            # Step 5: Login after verification
            print("\n🔐 Logging in after verification...")
            token = await login(client)
            if not token:
                print("❌ Login failed. Please check the credentials.")
                return
            print("✅ Login successful!")
        
        # Step 6: Create all internships
        print("\n🚀 Step 2: Creating Internships...")
        print("-" * 70)
        
        successful = 0
        failed = 0
        
        for i, internship_type in enumerate(INTERNSHIP_TYPES, 1):
            success = await create_internship(client, token, internship_type, i, len(INTERNSHIP_TYPES))
            if success:
                successful += 1
            else:
                failed += 1
        
        # Summary
        print("\n" + "=" * 70)
        print("📊 SUMMARY")
        print("=" * 70)
        print(f"✅ Successfully created: {successful}")
        print(f"❌ Failed: {failed}")
        print(f"📝 Total: {len(INTERNSHIP_TYPES)}")
        print("=" * 70)
        
        print("\n📌 Login Credentials:")
        print(f"   Email: {EMAIL}")
        print(f"   Password: {PASSWORD}")
        
        print("\n📌 Company Details:")
        print(f"   Name: {COMPANY_DATA['companyName']}")
        print(f"   Industry: {COMPANY_DATA['industry']}")
        print(f"   Matching Departments: Medicine, Nursing, Pharmacy, Biochemistry, Microbiology, Psychology")
        
        print("\n📌 Internship Types Created:")
        for i, internship in enumerate(INTERNSHIP_TYPES, 1):
            print(f"   {i}. {internship}")
        
        print("\n" + "=" * 70)
        print("✅ DONE! Healthcare company and all internships created successfully!")
        print("=" * 70)

if __name__ == "__main__":
    asyncio.run(main())