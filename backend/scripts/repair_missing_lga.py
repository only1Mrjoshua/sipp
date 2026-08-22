import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from pymongo import MongoClient

# Connect
mongo_client = MongoClient(settings.MONGODB_URL)
db = mongo_client[settings.DATABASE_NAME]
users_collection = db.users

# Define a fallback mapping for states that might lack a default LGA
FALLBACK_LGA = {
    "Rivers": "Port Harcourt",
    "FCT (Abuja)": "Municipal Area Council",
    "Nasarawa": "Keffi",
    "Lagos": "Surulere",
    # Add others if needed
}

def repair_companies():
    print("=" * 60)
    print("Repair Company Profiles – Missing LGA/State")
    print("=" * 60)
    
    # Find companies with missing lga
    missing_lga = list(users_collection.find({
        "role": "company",
        "$or": [
            {"lga": {"$exists": False}},
            {"lga": ""},
            {"lga": None}
        ]
    }))
    
    print(f"Found {len(missing_lga)} companies missing 'lga'.\n")
    
    updated_count = 0
    for comp in missing_lga:
        company_name = comp.get("companyName", "Unknown")
        state = comp.get("state", "")
        city = comp.get("city", "")
        
        # Determine lga
        if city:
            lga = city
        elif state and state in FALLBACK_LGA:
            lga = FALLBACK_LGA[state]
        else:
            lga = "Unknown"
        
        # Also fix missing state if needed (optional)
        if not state:
            # Try to infer from city (very basic)
            if "Port Harcourt" in city:
                state = "Rivers"
            elif "Abuja" in city or "Municipal" in city:
                state = "FCT (Abuja)"
            elif "Keffi" in city:
                state = "Nasarawa"
            elif "Surulere" in city:
                state = "Lagos"
            else:
                state = "Unknown"
        
        # Update
        update_data = {"lga": lga}
        if state:
            update_data["state"] = state
        
        result = users_collection.update_one(
            {"_id": comp["_id"]},
            {"$set": update_data}
        )
        if result.modified_count > 0:
            updated_count += 1
            print(f"✅ Updated '{company_name}': state='{state}', lga='{lga}'")
        else:
            print(f"⚠️ No changes for '{company_name}'")
    
    print(f"\n✅ Repair complete. Updated {updated_count} companies.")
    print("=" * 60)

if __name__ == "__main__":
    repair_companies()