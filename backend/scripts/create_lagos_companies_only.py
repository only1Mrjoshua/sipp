import sys
import os
import random
import asyncio
import httpx
import time

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from pymongo import MongoClient

# ============================================================
# CONFIGURATION
# ============================================================
BASE_URL = "http://localhost:8000"
PASSWORD = "LovuLord2022$$"

# MongoDB connection
mongo_client = MongoClient(settings.MONGODB_URL)
db = mongo_client[settings.DATABASE_NAME]

# ============================================================
# STUDENT DEFINITIONS FOR LAGOS ONLY
# ============================================================
STUDENTS_LAGOS = [
    {
        "name": "Ifiok Samuel (Biochemistry)",
        "department": "Biochemistry",
        "state": "Lagos",
        "main_lga": "Surulere",
        "other_lgas": ["Ikeja", "Victoria Island", "Lekki", "Ikorodu", "Epe", "Badagry", "Ojo", "Agege", "Alimosho", "Mushin"],
        "matching_industries": ["Healthcare / Medical", "Agriculture / Agribusiness"]
    },
    {
        "name": "Edara Samuel (International Relations)",
        "department": "International Relations",
        "state": "Lagos",
        "main_lga": "Surulere",
        "other_lgas": ["Ikeja", "Victoria Island", "Lekki", "Ikorodu", "Epe", "Badagry", "Ojo", "Agege", "Alimosho", "Mushin"],
        "matching_industries": ["Legal", "Consulting", "Marketing / Advertising", "Education / Academia"]
    }
]

# ============================================================
# REALISTIC COMPANY GENERATION
# ============================================================
COMPANY_PREFIXES = [
    "Afri", "Nigeria", "West", "Niger", "Savannah", "Tropical",
    "Prime", "Premium", "Elite", "Grand", "Royal", "Golden",
    "Allied", "Integrated", "Unified", "Central", "First",
    "Leading", "Top", "Best", "Superior"
]

COMPANY_SUFFIXES = {
    "Information Technology / Software": ["Tech", "Technologies", "Systems", "Software", "Digital", "Informatics"],
    "Finance / Banking": ["Finance", "Bank", "Capital", "Trust", "Investment", "Financial", "Credence"],
    "Consulting": ["Consulting", "Advisory", "Associates", "Partners", "Solutions"],
    "Healthcare / Medical": ["Health", "Medical", "Pharma", "Bio", "Life", "Diagnostics"],
    "Agriculture / Agribusiness": ["Agro", "Farms", "Agribusiness", "Harvest", "Green", "Plantations"],
    "Legal": ["Legal", "Attorneys", "Law", "Partners"],
    "Marketing / Advertising": ["Marketing", "Ads", "Brand", "Communications", "Digital", "Media"],
    "Education / Academia": ["Academy", "Learning", "Education", "Scholars", "Institute"]
}

STREET_NAMES = [
    "Ahmadu Bello Way", "Awolowo Road", "Bamenda Street", "Crescent",
    "Daramola Street", "Edo Street", "Garki Road", "Haruna Street",
    "Ikeja Road", "Jabi Avenue", "Kano Street", "Lugard Avenue",
    "Murtala Mohammed Way", "Nnamdi Azikiwe Road", "Obafemi Awolowo Road",
    "Ogunlana Drive", "Ojuelegba Road", "Okonkwo Street", "Olowu Street",
    "Onikan Road", "Ring Road", "Sabo Street", "Surulere Street",
    "Tinubu Street", "Victoria Road", "Yaba Street"
]

def generate_company_name(industry):
    prefix = random.choice(COMPANY_PREFIXES)
    suffix_list = COMPANY_SUFFIXES.get(industry, ["Limited"])
    suffix = random.choice(suffix_list)
    if random.choice([True, False]):
        name = f"{prefix}{suffix}"
    else:
        name = f"{prefix} {suffix}"
    return name.strip()

def generate_email(name):
    base = name.lower().replace(" ", "").replace("/", "").replace("-", "")
    rand_num = random.randint(1, 999)
    domain = random.choice(["@gmail.com", "@yahoo.com", "@outlook.com", "@protonmail.com", "@company.ng", "@business.ng"])
    return f"{base}{rand_num}{domain}"

def generate_address(lga, state):
    street_num = random.randint(1, 100)
    street = random.choice(STREET_NAMES)
    return f"{street_num} {street}, {lga}, {state}"

def generate_companies_for_student(student, count=10):
    """Generate 10 companies: 5 in main LGA, 5 in other LGAs, all matching student's industries"""
    companies = []
    main_lga = student["main_lga"]
    other_lgas = student["other_lgas"]
    matching_industries = student["matching_industries"]
    state = student["state"]
    
    # 5 companies in main LGA
    for i in range(1, 6):
        industry = random.choice(matching_industries)
        name = generate_company_name(industry)
        companies.append({
            "name": name,
            "email": generate_email(name),
            "phone": f"+234 80{random.randint(100, 999)} {random.randint(100, 999)} {random.randint(1000, 9999)}",
            "industry": industry,
            "state": state,
            "lga": main_lga,
            "city": main_lga,
            "address": generate_address(main_lga, state),
            "description": f"We are a leading {industry} company based in {main_lga}, {state}, serving our community.",
            "size": random.choice(["1–10", "11–50", "51–200", "200+"]),
            "website": f"www.{name.lower().replace(' ', '').replace('/', '')}.com"
        })
    
    # 5 companies in other LGAs (spread across, using matching industries as well)
    for i in range(1, 6):
        industry = random.choice(matching_industries)
        lga_index = (i - 1) % len(other_lgas)
        lga = other_lgas[lga_index]
        name = generate_company_name(industry)
        companies.append({
            "name": name,
            "email": generate_email(name),
            "phone": f"+234 80{random.randint(100, 999)} {random.randint(100, 999)} {random.randint(1000, 9999)}",
            "industry": industry,
            "state": state,
            "lga": lga,
            "city": lga,
            "address": generate_address(lga, state),
            "description": f"We are a dynamic {industry} company located in {lga}, {state}, offering excellent opportunities.",
            "size": random.choice(["1–10", "11–50", "51–200", "200+"]),
            "website": f"www.{name.lower().replace(' ', '').replace('/', '')}.com"
        })
    
    return companies

# ============================================================
# AUTO-OTP HELPER
# ============================================================
def get_otp_from_db(email):
    otp_doc = db.otps.find_one(
        {"email": email},
        sort=[("createdAt", -1)]
    )
    return otp_doc.get("otp") if otp_doc else None

# ============================================================
# API FUNCTIONS
# ============================================================
async def register_company(client, company_data, password):
    print(f"  📝 Registering {company_data['name']} ({company_data['email']})...")
    payload = {
        "companyName": company_data["name"],
        "email": company_data["email"],
        "phone": company_data["phone"],
        "industry": company_data["industry"],
        "state": company_data["state"],
        "lga": company_data["lga"],
        "city": company_data["city"],
        "address": company_data["address"],
        "password": password
    }
    try:
        response = await client.post(f"{BASE_URL}/api/auth/register/company", json=payload)
        if response.status_code == 200:
            print(f"    ✅ Registration successful")
            return True, response.json()
        else:
            error = response.json().get('detail', 'Unknown error')
            print(f"    ❌ Registration failed: {error}")
            return False, None
    except Exception as e:
        print(f"    ❌ Registration error: {e}")
        return False, None

async def verify_otp(client, email, otp):
    try:
        response = await client.post(f"{BASE_URL}/api/auth/verify-otp", json={"email": email, "otp": otp})
        if response.status_code == 200:
            print(f"    ✅ OTP verified")
            return True
        else:
            print(f"    ❌ OTP verification failed: {response.json().get('detail')}")
            return False
    except Exception as e:
        print(f"    ❌ OTP verification error: {e}")
        return False

async def process_company(client, company, password):
    email = company["email"]
    success, _ = await register_company(client, company, password)
    if not success:
        return False
    print("  ⏳ Waiting for OTP...")
    time.sleep(2)
    otp = get_otp_from_db(email)
    if not otp:
        print(f"  ❌ Could not retrieve OTP for {email}.")
        return False
    verified = await verify_otp(client, email, otp)
    if not verified:
        return False
    print(f"  ✅ Company activated.")
    return True

# ============================================================
# MAIN
# ============================================================
async def main():
    print("=" * 60)
    print("SIPP - Lagos-Only Company Creator (Biochem + Intl Relations)")
    print("=" * 60)
    
    all_companies = []
    for student in STUDENTS_LAGOS:
        companies = generate_companies_for_student(student, count=10)
        all_companies.extend(companies)
        print(f"\n👤 {student['name']}")
        print(f"   Location: {student['state']} – {student['main_lga']}")
        print(f"   Matching industries: {', '.join(student['matching_industries'])}")
        print(f"   Generated {len(companies)} companies (5 in {student['main_lga']}, 5 in other LGAs)")

    print("\n" + "=" * 60)
    print(f"Total companies to create in Lagos: {len(all_companies)}")
    print("=" * 60)
    print("\n📌 Automatic OTP Verification enabled (MongoDB). No manual input needed.")
    print("📌 All companies will be created in Lagos state only.")
    print("📌 No internships will be created – only company profiles.")
    print("-" * 60)

    async with httpx.AsyncClient(timeout=30.0) as client:
        for i, company in enumerate(all_companies, 1):
            print(f"\n{'=' * 60}")
            print(f"📌 Company {i}/{len(all_companies)}")
            print(f"   Name: {company['name']}")
            print(f"   Location: {company['state']} – {company['lga']}")
            print(f"   Industry: {company['industry']}")
            print(f"   Address: {company['address']}")
            print(f"   Email: {company['email']}")
            print(f"{'=' * 60}")

            success = await process_company(client, company, PASSWORD)
            if success:
                print(f"✅ {company['name']} created successfully.")
            else:
                print(f"❌ Failed to create {company['name']}.")

            if i < len(all_companies):
                print("\n" + "-" * 40)
                print("⏳ Moving to next company in 2 seconds...")
                time.sleep(2)

    print("\n" + "=" * 60)
    print("✅ All Lagos companies processed.")
    print("=" * 60)
    print("\n📋 Summary:")
    for student in STUDENTS_LAGOS:
        count = sum(1 for c in all_companies if c["lga"] == student["main_lga"] or c["lga"] in student["other_lgas"])
        main_count = sum(1 for c in all_companies if c["lga"] == student["main_lga"])
        other_count = count - main_count
        print(f"   • {student['name']}: {count} companies ({main_count} in {student['main_lga']}, {other_count} in other LGAs)")
    print("\n💡 These companies replace the old mixed Lagos set and add a dedicated set for Intl Relations.")

if __name__ == "__main__":
    asyncio.run(main())