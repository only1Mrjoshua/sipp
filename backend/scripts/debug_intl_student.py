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
    print(f"   Skills (first 5): {student.get('skills', [])[:5]}")
    print(f"   Interests (first 5): {student.get('interests', [])[:5]}")
    print()

    # Fetch all active internships
    active = list(internships.find({"status": "Active"}))
    print(f"🔍 Found {len(active)} active internships")

    matched = []
    failed = 0
    for intern in active:
        company = users.find_one({"_id": ObjectId(intern["companyId"])})
        if not company:
            continue
        score = calculate_match(student, intern, company)
        if score > 0:
            matched.append((intern, score))
        else:
            failed += 1

    print(f"✅ Matched: {len(matched)}")
    print(f"❌ Failed: {failed}")

    if matched:
        print("\n📊 Sample matched internships (first 5):")
        for intern, score in matched[:5]:
            print(f"   {intern.get('title')} – Score: {score}%")

    # Check if there are companies in the student's location with allowed industries
    allowed_industries = ["Legal", "Consulting", "Marketing / Advertising", "Education / Academia"]
    companies_in_location = list(users.find({
        "role": "company",
        "state": student.get("state"),
        "lga": student.get("lga"),
        "industry": {"$in": allowed_industries}
    }))
    print(f"\n🏢 Companies in same location with matching industries: {len(companies_in_location)}")
    for comp in companies_in_location[:3]:
        internships_count = internships.count_documents({"companyId": str(comp["_id"])})
        print(f"   {comp.get('companyName')} ({comp.get('industry')}) – {internships_count} internships")

if __name__ == "__main__":
    asyncio.run(debug())