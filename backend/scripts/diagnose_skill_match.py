import sys
import os
import json

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from pymongo import MongoClient

# Connect to MongoDB
mongo_client = MongoClient(settings.MONGODB_URL)
db = mongo_client[settings.DATABASE_NAME]
users_collection = db.users
internships_collection = db.internships

# Copy the exact calculate_match function from backend/app/routers/internships.py
DEPARTMENT_INDUSTRY_MAPPING = {
    "Computer Science": ["Information Technology / Software", "Finance / Banking", "Consulting"],
    "Biochemistry": ["Healthcare / Medical", "Agriculture / Agribusiness"],
    "International Relations": ["Legal", "Consulting", "Marketing / Advertising", "Education / Academia"],
}

def calculate_match(student, internship, company):
    """
    Returns the match percentage between a student and an internship.
    Matches backend logic exactly.
    """
    # Location check
    student_state = student.get("state", "").strip()
    student_lga = student.get("lga", "").strip()
    company_state = company.get("state", "").strip()
    company_lga = company.get("lga", "").strip()
    
    if not student_state or not student_lga or not company_state or not company_lga:
        return 0
    if student_state.lower() != company_state.lower() or student_lga.lower() != company_lga.lower():
        return 0

    student_department = student.get("department", "")
    student_skills = student.get("skills", [])
    student_interests = student.get("interests", [])
    company_industry = company.get("industry", "")
    
    # Department → Industry check
    allowed_industries = DEPARTMENT_INDUSTRY_MAPPING.get(student_department, [])
    if company_industry not in allowed_industries:
        return 0

    required_skills = internship.get("skillsRequired", [])
    offered_skills = internship.get("skillsOffered", [])
    
    skill_score = 0
    interest_score = 0
    
    if required_skills:
        matched_skills = [s for s in student_skills if s.lower() in [r.lower() for r in required_skills]]
        skill_score = (len(matched_skills) / len(required_skills)) * 100 if required_skills else 0
    
    if offered_skills and student_interests:
        matched_interests = [i for i in student_interests if i.lower() in [o.lower() for o in offered_skills]]
        interest_score = (len(matched_interests) / len(offered_skills)) * 20 if offered_skills else 0
    
    return round(min(skill_score + interest_score, 100))

def diagnose_student(student_email):
    student = users_collection.find_one({"email": student_email, "role": "student"})
    if not student:
        print(f"Student {student_email} not found.")
        return
    
    print(f"\n👤 {student.get('firstName')} {student.get('lastName')} ({student_email})")
    print(f"   Department: {student.get('department')}")
    print(f"   Location: {student.get('state')} – {student.get('lga')}")
    print(f"   Skills: {student.get('skills', [])}")
    print(f"   Interests: {student.get('interests', [])}")
    
    # Find companies in same location with matching industry
    matching_companies = list(users_collection.find({
        "role": "company",
        "state": student.get("state"),
        "lga": student.get("lga"),
        "industry": {"$in": DEPARTMENT_INDUSTRY_MAPPING.get(student.get("department"), [])}
    }))
    
    print(f"   Matching companies: {len(matching_companies)}")
    
    for comp in matching_companies:
        print(f"\n   Company: {comp.get('companyName')} (Industry: {comp.get('industry')})")
        internships = list(internships_collection.find({"companyId": str(comp["_id"])}))
        if not internships:
            print("      No internships found.")
            continue
        for internship in internships:
            score = calculate_match(student, internship, comp)
            if score > 0:
                print(f"      ✅ Internship: {internship.get('title')} – Score: {score}%")
                print(f"         Required skills: {internship.get('skillsRequired', [])}")
                print(f"         Offered skills: {internship.get('skillsOffered', [])}")
            else:
                print(f"      ❌ Internship: {internship.get('title')} – Score: 0%")
                # Show why it failed
                # Check location
                if student.get('state') != comp.get('state') or student.get('lga') != comp.get('lga'):
                    print("         Location mismatch")
                # Check industry
                if comp.get('industry') not in DEPARTMENT_INDUSTRY_MAPPING.get(student.get('department'), []):
                    print("         Industry mismatch")
                # Check skills
                required = internship.get('skillsRequired', [])
                if required:
                    matched = [s for s in student.get('skills', []) if s.lower() in [r.lower() for r in required]]
                    if not matched:
                        print("         No required skills matched.")
                offered = internship.get('skillsOffered', [])
                if offered and student.get('interests'):
                    matched_interests = [i for i in student.get('interests', []) if i.lower() in [o.lower() for o in offered]]
                    if not matched_interests and required and not matched:
                        print("         No interests matched offered skills.")
                if not required and not offered:
                    print("         Internship has no skills defined.")

def main():
    student_emails = [
        "sorochijoshua22@gmail.com",
        "sorochijoshua2022@gmail.com",
        "sorochijoshua2021@gmail.com",
        "sorochijoshua30@gmail.com",
        "01joshcreations@gmail.com"
    ]
    for email in student_emails:
        diagnose_student(email)

if __name__ == "__main__":
    main()