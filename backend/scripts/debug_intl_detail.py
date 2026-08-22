import sys
import os
import asyncio
from bson import ObjectId

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from pymongo import MongoClient
from app.routers.internships import calculate_match

mongo_client = MongoClient(settings.MONGODB_URL)
db = mongo_client[settings.DATABASE_NAME]
users = db.users
internships = db.internships

async def debug():
    student = users.find_one({"email": "01joshcreations@gmail.com", "role": "student"})
    if not student:
        print("Student not found")
        return

    print(f"👤 {student.get('firstName')} {student.get('lastName')} ({student.get('email')})")
    print(f"   State: {student.get('state')}, LGA: {student.get('lga')}")
    print(f"   Department: {student.get('department')}")
    print(f"   Skills: {student.get('skills')[:5]}...")
    print(f"   Interests: {student.get('interests')[:5]}...")
    print()

    # Find matching companies
    allowed_industries = ["Legal", "Consulting", "Marketing / Advertising", "Education / Academia"]
    companies = list(users.find({
        "role": "company",
        "state": student.get("state"),
        "lga": student.get("lga"),
        "industry": {"$in": allowed_industries}
    }))
    print(f"🏢 Matching companies: {len(companies)}")
    
    for comp in companies[:3]:  # Limit to first 3 to keep output manageable
        print(f"\nCompany: {comp.get('companyName')} ({comp.get('industry')})")
        interns = list(internships.find({"companyId": str(comp["_id"])}))
        for intern in interns[:3]:  # first 3 internships
            score = calculate_match(student, intern, comp)
            print(f"   Internship: {intern.get('title')} – Score: {score}")
            if score == 0:
                # Quick check
                student_skills = student.get('skills', [])
                req_skills = intern.get('skillsRequired', [])
                matched = [s for s in student_skills if s.lower() in [r.lower() for r in req_skills]]
                print(f"      Required skills matched: {len(matched)}/{len(req_skills)}")
                if matched:
                    print(f"      Matched: {matched}")
                else:
                    print(f"      Student skills sample: {student_skills[:3]}")
                    print(f"      Required sample: {req_skills[:3]}")

if __name__ == "__main__":
    asyncio.run(debug())