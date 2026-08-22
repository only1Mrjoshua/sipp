import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from pymongo import MongoClient

# Connect
mongo_client = MongoClient(settings.MONGODB_URL)
db = mongo_client[settings.DATABASE_NAME]
users_collection = db.users
internships_collection = db.internships

# Department → allowed industries (copy from backend logic)
DEPARTMENT_INDUSTRY_MAPPING = {
    "Computer Science": ["Information Technology / Software", "Finance / Banking", "Consulting"],
    "Biochemistry": ["Healthcare / Medical", "Agriculture / Agribusiness"],
    "International Relations": ["Legal", "Consulting", "Marketing / Advertising", "Education / Academia"],
    # add others if needed
}

def get_matching_companies(student):
    """Return companies in same state and LGA with allowed industry for the student."""
    state = student.get("state")
    lga = student.get("lga")
    dept = student.get("department")
    allowed_industries = DEPARTMENT_INDUSTRY_MAPPING.get(dept, [])
    if not state or not lga or not allowed_industries:
        return []
    return list(users_collection.find({
        "role": "company",
        "state": state,
        "lga": lga,
        "industry": {"$in": allowed_industries}
    }))

def update_student_skills():
    students = list(users_collection.find({"role": "student"}))
    print(f"Found {len(students)} students.\n")
    
    for student in students:
        email = student["email"]
        name = f"{student.get('firstName', '')} {student.get('lastName', '')}"
        print(f"👤 {name} ({email})")
        companies = get_matching_companies(student)
        print(f"   Matching companies: {len(companies)}")
        if not companies:
            continue
        
        # Collect all skills from internships of these companies
        all_required = set()
        all_offered = set()
        for comp in companies:
            internships = internships_collection.find({"companyId": str(comp["_id"])})
            for intern in internships:
                req = intern.get("skillsRequired", [])
                off = intern.get("skillsOffered", [])
                all_required.update(req)
                all_offered.update(off)
        
        # Merge with existing skills/interests
        existing_skills = set(student.get("skills", []))
        existing_interests = set(student.get("interests", []))
        
        # Combine: keep existing and add new ones
        new_skills = list(existing_skills.union(all_required))
        new_interests = list(existing_interests.union(all_offered))
        
        # Update in DB
        result = users_collection.update_one(
            {"_id": student["_id"]},
            {"$set": {"skills": new_skills, "interests": new_interests}}
        )
        if result.modified_count > 0:
            print(f"   ✅ Updated: skills now {len(new_skills)} items, interests {len(new_interests)} items.")
        else:
            print(f"   ⚠️ No changes (already had all skills).")

if __name__ == "__main__":
    update_student_skills()