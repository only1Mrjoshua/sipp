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

def diagnose():
    print("=" * 60)
    print("Diagnosing API Query Issues")
    print("=" * 60)

    # 1. Check student
    student = users.find_one({"email": "sorochijoshua22@gmail.com", "role": "student"})
    if not student:
        print("❌ Student not found")
        return
    print(f"✅ Student found: {student.get('firstName')} {student.get('lastName')}")
    print(f"   State: {student.get('state')}, LGA: {student.get('lga')}")

    # 2. Check internships with Active status
    active_internships = list(internships.find({"status": "Active"}))
    print(f"✅ Found {len(active_internships)} active internships")

    # 3. Check each internship's company
    for intern in active_internships[:5]:  # check first 5
        company_id = intern.get("companyId")
        if not company_id:
            print(f"❌ Internship {intern.get('_id')} has no companyId")
            continue
        if not ObjectId.is_valid(company_id):
            print(f"❌ Internship {intern.get('_id')} has invalid companyId: {company_id}")
            continue
        company = users.find_one({"_id": ObjectId(company_id)})
        if not company:
            print(f"❌ Company not found for internship {intern.get('_id')}")
            continue
        print(f"   ✅ Company found: {company.get('companyName')} (State: {company.get('state')}, LGA: {company.get('lga')})")

        # Check if company matches student location
        if company.get("state") == student.get("state") and company.get("lga") == student.get("lga"):
            print(f"      ✅ Location matches!")
        else:
            print(f"      ❌ Location mismatch: company {company.get('state')} – {company.get('lga')} vs student {student.get('state')} – {student.get('lga')}")

if __name__ == "__main__":
    diagnose()