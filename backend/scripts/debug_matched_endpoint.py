import sys
import os
import asyncio
from bson import ObjectId

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from pymongo import MongoClient
# Import the exact calculate_match from your router
from app.routers.internships import calculate_match

mongo_client = MongoClient(settings.MONGODB_URL)
db = mongo_client[settings.DATABASE_NAME]
users = db.users
internships = db.internships

async def debug():
    # 1. Get a student (use one that should match)
    student = users.find_one({"email": "sorochijoshua22@gmail.com", "role": "student"})
    if not student:
        print("Student not found")
        return

    print(f"👤 Student: {student.get('firstName')} {student.get('lastName')}")
    print(f"   State: {student.get('state')}, LGA: {student.get('lga')}")
    print(f"   Department: {student.get('department')}")
    print(f"   Skills (first 5): {student.get('skills')[:5]}")
    print(f"   Interests (first 5): {student.get('interests')[:5]}")
    print()

    # 2. Get all active internships
    active = list(internships.find({"status": "Active"}))
    print(f"🔍 Found {len(active)} active internships")

    matched = []
    failed = 0
    for intern in active[:10]:  # check first 10 to keep output manageable
        company = users.find_one({"_id": ObjectId(intern["companyId"])})
        if not company:
            print(f"⚠️ No company for internship {intern.get('title')}")
            continue

        score = calculate_match(student, intern, company)
        if score > 0:
            matched.append((intern, score))
            print(f"✅ {intern.get('title')} – Score: {score}")
        else:
            failed += 1
            print(f"❌ {intern.get('title')} – Score: {score}")
            print(f"   Student state/LGA: {student.get('state')}/{student.get('lga')}")
            print(f"   Company state/LGA: {company.get('state')}/{company.get('lga')}")
            print(f"   Student dept: {student.get('department')}, Company industry: {company.get('industry')}")
            # Check required skills overlap
            req_skills = intern.get('skillsRequired', [])
            student_skills = student.get('skills', [])
            if req_skills and student_skills:
                matched_skills = [s for s in student_skills if s.lower() in [r.lower() for r in req_skills]]
                print(f"   Matched required skills: {len(matched_skills)}/{len(req_skills)}")
                if not matched_skills:
                    print(f"      Student skills: {student_skills[:3]}")
                    print(f"      Required: {req_skills[:3]}")
            print()

    print(f"✅ Matched: {len(matched)}, Failed: {failed}")

if __name__ == "__main__":
    asyncio.run(debug())