import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from pymongo import MongoClient

mongo_client = MongoClient(settings.MONGODB_URL)
db = mongo_client[settings.DATABASE_NAME]
users_collection = db.users

# Find companies without lga or state
missing = list(users_collection.find({
    "role": "company",
    "$or": [
        {"lga": {"$exists": False}},
        {"lga": ""},
        {"lga": None},
        {"state": {"$exists": False}},
        {"state": ""},
        {"state": None}
    ]
}))

if missing:
    print(f"Found {len(missing)} companies missing location fields.")
    for comp in missing:
        # Try to infer from city or set a default
        city = comp.get("city", "")
        if "Port Harcourt" in city:
            comp["state"] = "Rivers"
            comp["lga"] = "Port Harcourt"
        elif "Abuja" in city or "Municipal" in city:
            comp["state"] = "FCT (Abuja)"
            comp["lga"] = "Municipal Area Council"
        elif "Keffi" in city:
            comp["state"] = "Nasarawa"
            comp["lga"] = "Keffi"
        elif "Surulere" in city:
            comp["state"] = "Lagos"
            comp["lga"] = "Surulere"
        else:
            # fallback to "Unknown"
            comp["state"] = comp.get("state", "Unknown")
            comp["lga"] = comp.get("lga", "Unknown")
        users_collection.update_one(
            {"_id": comp["_id"]},
            {"$set": {"state": comp["state"], "lga": comp["lga"]}}
        )
        print(f"Updated {comp.get('companyName')}: state={comp['state']}, lga={comp['lga']}")
else:
    print("All companies have location fields.")