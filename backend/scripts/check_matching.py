import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from pymongo import MongoClient

mongo_client = MongoClient(settings.MONGODB_URL)
db = mongo_client[settings.DATABASE_NAME]
users_collection = db.users

# Department to Industry Mapping (matching the one in internships.py)
DEPARTMENT_INDUSTRY_MAPPING = {
    "Computer Science": ["Information Technology / Software", "Finance / Banking", "Consulting"],
    "Biochemistry": ["Healthcare / Medical", "Agriculture / Agribusiness"],
    "International Relations": ["Legal", "Consulting", "Marketing / Advertising", "Education / Academia"],
}

def check_matching():
    students = list(users_collection.find({"role": "student"}))
    companies = list(users_collection.find({"role": "company"}))

    print(f"Found {len(students)} students and {len(companies)} companies.\n")

    for student in students:
        print(f"👤 {student.get('firstName', '')} {student.get('lastName', '')} ({student.get('email', '')})")
        print(f"   Dept: {student.get('department', '')}")
        print(f"   State: '{student.get('state', '')}'")
        print(f"   LGA:   '{student.get('lga', '')}'")

        # Find companies with same state & lga
        matching_location = []
        for comp in companies:
            if comp.get('state', '').strip().lower() == student.get('state', '').strip().lower() and \
               comp.get('lga', '').strip().lower() == student.get('lga', '').strip().lower():
                matching_location.append(comp)

        print(f"   Companies in same location: {len(matching_location)}")

        if not matching_location:
            print("   ❌ No companies in same location.")
            print("   → Check if student location matches any company's state/lga.")
            print("   → Verify whitespace, case, and exact string equality (e.g., 'Port Harcourt' vs 'PortHarcourt').\n")
            continue

        # Check department-industry mapping
        student_dept = student.get('department', '')
        allowed_industries = DEPARTMENT_INDUSTRY_MAPPING.get(student_dept, [])
        print(f"   Allowed industries: {allowed_industries}")

        matches = []
        for comp in matching_location:
            if comp.get('industry', '') in allowed_industries:
                matches.append(comp)
            else:
                print(f"   ❌ Industry mismatch: Company '{comp.get('companyName')}' has industry '{comp.get('industry')}' (not in allowed list).")

        print(f"   ✅ Companies matching both location and industry: {len(matches)}\n")

if __name__ == "__main__":
    check_matching()