import sys
import os
from bson import ObjectId

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from pymongo import MongoClient
from app.routers.internships import calculate_match

mongo_client = MongoClient(settings.MONGODB_URL)
db = mongo_client[settings.DATABASE_NAME]
users = db.users
internships = db.internships

def analyze():
    student = users.find_one({"email": "01joshcreations@gmail.com", "role": "student"})
    if not student:
        print("Student not found")
        return

    print(f"👤 {student.get('firstName')} {student.get('lastName')}")
    print(f"   State: {student.get('state')}, LGA: {student.get('lga')}")
    print(f"   Department: {student.get('department')}")
    print(f"   Skills ({len(student.get('skills', []))}): {student.get('skills', [])[:10]}...")
    print(f"   Interests ({len(student.get('interests', []))}): {student.get('interests', [])[:10]}...")
    print()

    # Pick a matching company
    company = users.find_one({
        "role": "company",
        "state": student.get("state"),
        "lga": student.get("lga"),
        "industry": {"$in": ["Consulting", "Legal", "Marketing / Advertising", "Education / Academia"]}
    })
    if not company:
        print("No matching company found.")
        return

    print(f"🏢 Company: {company.get('companyName')} ({company.get('industry')})")
    intern_list = list(internships.find({"companyId": str(company["_id"])}))
    print(f"   Internships: {len(intern_list)}")
    for intern in intern_list[:3]:
        print(f"   - {intern.get('title')}")
        print(f"      Required skills: {intern.get('skillsRequired', [])}")
        print(f"      Offered skills: {intern.get('skillsOffered', [])}")
        # Check matches
        req = intern.get('skillsRequired', [])
        off = intern.get('skillsOffered', [])
        student_skills = student.get('skills', [])
        student_interests = student.get('interests', [])
        matched_req = [s for s in student_skills if s.lower() in [r.lower() for r in req]]
        matched_off = [i for i in student_interests if i.lower() in [o.lower() for o in off]]
        print(f"      Matched required: {len(matched_req)}/{len(req)} – {matched_req}")
        print(f"      Matched offered: {len(matched_off)}/{len(off)} – {matched_off}")
        score = calculate_match(student, intern, company)
        print(f"      Match score: {score}\n")

if __name__ == "__main__":
    analyze()