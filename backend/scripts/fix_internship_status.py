import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from pymongo import MongoClient

mongo_client = MongoClient(settings.MONGODB_URL)
db = mongo_client[settings.DATABASE_NAME]
internships_collection = db.internships

# Update all internships to 'Active'
result = internships_collection.update_many(
    {},
    {"$set": {"status": "Active"}}
)
print(f"Updated {result.modified_count} internships to 'Active'.")

# Also verify no other statuses exist
statuses = internships_collection.distinct("status")
print(f"Distinct statuses: {statuses}")