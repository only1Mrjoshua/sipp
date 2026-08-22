import sys
import os
from bson import ObjectId

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from pymongo import MongoClient

mongo_client = MongoClient(settings.MONGODB_URL)
db = mongo_client[settings.DATABASE_NAME]
users = db.users
internships = db.internships

def update_intl_student():
    student = users.find_one({"email": "01joshcreations@gmail.com", "role": "student"})
    if not student:
        print("Student not found")
        return

    allowed_industries = ["Legal", "Consulting", "Marketing / Advertising", "Education / Academia"]
    companies = list(users.find({
        "role": "company",
        "state": student.get("state"),
        "lga": student.get("lga"),
        "industry": {"$in": allowed_industries}
    }))

    print(f"Found {len(companies)} matching companies")

    all_required = set()
    all_offered = set()
    for comp in companies:
        interns = list(internships.find({"companyId": str(comp["_id"])}))
        for intern in interns:
            req = intern.get("skillsRequired", [])
            off = intern.get("skillsOffered", [])
            all_required.update(req)
            all_offered.update(off)

    print(f"Collected {len(all_required)} required skills, {len(all_offered)} offered skills")

    # Merge with existing
    existing_skills = set(student.get("skills", []))
    existing_interests = set(student.get("interests", []))
    new_skills = list(existing_skills.union(all_required))
    new_interests = list(existing_interests.union(all_offered))

    result = users.update_one(
        {"_id": student["_id"]},
        {"$set": {"skills": new_skills, "interests": new_interests}}
    )
    if result.modified_count > 0:
        print(f"✅ Updated: skills now {len(new_skills)} items, interests {len(new_interests)} items.")
    else:
        print("No changes made.")

if __name__ == "__main__":
    update_intl_student()