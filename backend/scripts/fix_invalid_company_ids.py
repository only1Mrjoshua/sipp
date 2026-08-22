import sys
import os
from bson import ObjectId

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from pymongo import MongoClient

mongo_client = MongoClient(settings.MONGODB_URL)
db = mongo_client[settings.DATABASE_NAME]
internships = db.internships
users = db.users

def fix():
    invalid = []
    for intern in internships.find():
        cid = intern.get("companyId")
        if not cid:
            invalid.append(intern)
            continue
        if not ObjectId.is_valid(cid):
            invalid.append(intern)
            continue
        # Check if company exists
        company = users.find_one({"_id": ObjectId(cid)})
        if not company:
            invalid.append(intern)
    
    if not invalid:
        print("✅ All internships have valid companyId.")
        return
    
    print(f"Found {len(invalid)} internships with invalid companyId.")
    for intern in invalid:
        print(f"  - {intern.get('title')} (ID: {intern.get('_id')}) – companyId: {intern.get('companyId')}")
        # Optionally delete or reassign; for now just delete
        # But we may want to delete them or set to a default company
        # Let's just delete them for clean testing
        # internships.delete_one({"_id": intern["_id"]})
        print("   (will be deleted - uncomment to delete)")

if __name__ == "__main__":
    fix()