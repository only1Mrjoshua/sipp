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
# INDUSTRY MAPPING FOR MATCHING
# ============================================================
INDUSTRIES_FOR_CS = ["Information Technology / Software", "Finance / Banking", "Consulting"]
INDUSTRIES_FOR_BIOCHEM = ["Healthcare / Medical", "Agriculture / Agribusiness"]
INDUSTRIES_FOR_INTL_REL = ["Legal", "Consulting", "Marketing / Advertising", "Education / Academia"]

ALL_INDUSTRIES = [
    "Information Technology / Software", 
    "Engineering / Manufacturing",
    "Finance / Banking", 
    "Healthcare / Medical",
    "Construction / Real Estate",
    "Education / Academia",
    "Marketing / Advertising",
    "Legal",
    "Agriculture / Agribusiness",
    "Consulting"
]

# ============================================================
# REALISTIC COMPANY NAME PARTS
# ============================================================
COMPANY_PREFIXES = [
    "Afri", "Nigeria", "West", "Niger", "Savannah", "Tropical",
    "Prime", "Premium", "Elite", "Grand", "Royal", "Golden",
    "Allied", "Integrated", "Unified", "Central", "Prime",
    "First", "Leading", "Top", "Best", "Superior"
]

COMPANY_SUFFIXES = {
    "Information Technology / Software": ["Tech", "Technologies", "Systems", "Software", "Digital", "Informatics"],
    "Finance / Banking": ["Finance", "Bank", "Capital", "Trust", "Investment", "Financial", "Credence"],
    "Consulting": ["Consulting", "Advisory", "Associates", "Partners", "Solutions"],
    "Healthcare / Medical": ["Health", "Medical", "Pharma", "Bio", "Life", "Diagnostics"],
    "Agriculture / Agribusiness": ["Agro", "Farms", "Agribusiness", "Harvest", "Green", "Plantations"],
    "Engineering / Manufacturing": ["Engineering", "Industries", "Manufacturing", "Construction", "Works"],
    "Legal": ["Legal", "Attorneys", "Law", "Partners"],
    "Marketing / Advertising": ["Marketing", "Ads", "Brand", "Communications", "Digital", "Media"],
    "Education / Academia": ["Academy", "Learning", "Education", "Scholars", "Institute"],
    "Construction / Real Estate": ["Realty", "Construction", "Builders", "Properties", "Estates"]
}

# Street names (Nigerian-inspired)
STREET_NAMES = [
    "Ahmadu Bello Way", "Awolowo Road", "Bamenda Street", "Crescent",
    "Daramola Street", "Edo Street", "Garki Road", "Haruna Street",
    "Ikeja Road", "Jabi Avenue", "Kano Street", "Lugard Avenue",
    "Murtala Mohammed Way", "Nnamdi Azikiwe Road", "Obafemi Awolowo Road",
    "Ogunlana Drive", "Ojuelegba Road", "Okonkwo Street", "Olowu Street",
    "Onikan Road", "Ring Road", "Sabo Street", "Surulere Street",
    "Tinubu Street", "Victoria Road", "Yaba Street"
]

# ============================================================
# LOCATION CONFIGURATION
# ============================================================
LOCATION_CONFIG = {
    "Rivers": {
        "main_lga": "Port Harcourt",
        "student_type": "CS",
        "matching_industries": INDUSTRIES_FOR_CS,
        "other_lgas": ["Eleme", "Okrika", "Obio/Akpor", "Oyigbo", "Ikwerre", "Etche", "Ahoada East", "Degema", "Bonny"]
    },
    "FCT (Abuja)": {
        "main_lga": "Municipal Area Council",
        "student_type": "CS",
        "matching_industries": INDUSTRIES_FOR_CS,
        "other_lgas": ["Bwari", "Gwagwalada", "Kuje", "Kwali", "Abaji"]
    },
    "Nasarawa": {
        "main_lga": "Keffi",
        "student_type": "CS",
        "matching_industries": INDUSTRIES_FOR_CS,
        "other_lgas": ["Akwanga", "Lafia", "Karu", "Kokona", "Nasarawa", "Obi", "Toto", "Wamba"]
    },
    "Lagos": {
        "main_lga": "Surulere",
        "student_type": "Mixed",
        "matching_industries": INDUSTRIES_FOR_BIOCHEM + INDUSTRIES_FOR_INTL_REL,
        "other_lgas": ["Ikeja", "Victoria Island", "Lekki", "Ikorodu", "Epe", "Badagry", "Ojo", "Agege", "Alimosho", "Mushin"]
    }
}

# ============================================================
# COMPANY GENERATION FUNCTIONS
# ============================================================
def generate_company_name(industry):
    """Generate a realistic company name based on industry"""
    prefix = random.choice(COMPANY_PREFIXES)
    suffix_list = COMPANY_SUFFIXES.get(industry, ["Limited"])
    suffix = random.choice(suffix_list)
    # Add a connecting word sometimes
    if random.choice([True, False]):
        connector = random.choice([" ", " ", " "])  # keep simple
        name = f"{prefix}{connector}{suffix}"
    else:
        name = f"{prefix} {suffix}"
    # Ensure it's not too long
    return name.strip()

def generate_email(company_name):
    """Generate a realistic email from company name"""
    # Remove spaces and special characters
    base = company_name.lower().replace(" ", "").replace("/", "").replace("-", "")
    # Add random number to avoid duplicates
    rand_num = random.randint(1, 999)
    domain_choice = random.choice(["@gmail.com", "@yahoo.com", "@outlook.com", "@protonmail.com", "@company.ng", "@business.ng"])
    return f"{base}{rand_num}{domain_choice}"

def generate_address(lga, state):
    """Generate a realistic address with street number and street name"""
    street_num = random.randint(1, 100)
    street = random.choice(STREET_NAMES)
    return f"{street_num} {street}, {lga}, {state}"

def generate_companies_for_location(state, config):
    """Generate 10 companies: 5 in main LGA (matching), 5 in other LGAs (random)"""
    companies = []
    main_lga = config["main_lga"]
    matching_industries = config["matching_industries"]
    other_lgas = config["other_lgas"]
    
    # 5 companies in main LGA - use matching industries
    for i in range(1, 6):
        industry = random.choice(matching_industries)
        name = generate_company_name(industry)
        company = {
            "name": name,
            "email": generate_email(name),
            "phone": f"+234 80{random.randint(100, 999)} {random.randint(100, 999)} {random.randint(1000, 9999)}",
            "industry": industry,
            "state": state,
            "lga": main_lga,
            "city": main_lga,
            "address": generate_address(main_lga, state),
            "description": f"We are a leading {industry} company based in {main_lga}, {state}.",
            "size": random.choice(["1–10", "11–50", "51–200", "200+"]),
            "website": f"www.{name.lower().replace(' ', '').replace('/', '')}.com"
        }
        companies.append(company)
    
    # 5 companies in other LGAs - use random industries
    for i in range(1, 6):
        industry = random.choice(ALL_INDUSTRIES)
        lga_index = (i - 1) % len(other_lgas)
        lga = other_lgas[lga_index]
        name = generate_company_name(industry)
        company = {
            "name": name,
            "email": generate_email(name),
            "phone": f"+234 80{random.randint(100, 999)} {random.randint(100, 999)} {random.randint(1000, 9999)}",
            "industry": industry,
            "state": state,
            "lga": lga,
            "city": lga,
            "address": generate_address(lga, state),
            "description": f"We are a dynamic {industry} company located in {lga}, {state}.",
            "size": random.choice(["1–10", "11–50", "51–200", "200+"]),
            "website": f"www.{name.lower().replace(' ', '').replace('/', '')}.com"
        }
        companies.append(company)
    
    return companies

# ============================================================
# HELPER FUNCTIONS FOR AUTO-OTP
# ============================================================
def get_otp_from_db(email):
    """Fetch the latest OTP for a given email from MongoDB"""
    otp_doc = db.otps.find_one(
        {"email": email},
        sort=[("createdAt", -1)]
    )
    return otp_doc.get("otp") if otp_doc else None

# ============================================================
# API FUNCTIONS
# ============================================================
async def register_company(client, company_data, password):
    """Register a company"""
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
        response = await client.post(
            f"{BASE_URL}/api/auth/register/company",
            json=payload
        )
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
    """Verify OTP using the API"""
    try:
        response = await client.post(
            f"{BASE_URL}/api/auth/verify-otp",
            json={"email": email, "otp": otp}
        )
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
    """Register and auto-verify OTP (no internship)"""
    email = company["email"]
    
    # 1. Register
    success, _ = await register_company(client, company, password)
    if not success:
        return False
    
    # 2. Wait for OTP to be saved
    print("  ⏳ Waiting for OTP to be saved...")
    time.sleep(2)
    
    # 3. Retrieve OTP from DB
    otp = get_otp_from_db(email)
    if not otp:
        print(f"  ❌ Could not retrieve OTP for {email}. Skipping.")
        return False
    
    # 4. Verify OTP automatically
    verified = await verify_otp(client, email, otp)
    if not verified:
        return False
    
    print(f"  ✅ Company {company['name']} activated.")
    return True

# ============================================================
# MAIN
# ============================================================
async def main():
    print("=" * 60)
    print("SIPP - Bulk Company Creator (Auto-OTP, No Internships)")
    print("=" * 60)
    
    # Generate companies for all locations
    all_companies = []
    
    for state, config in LOCATION_CONFIG.items():
        companies = generate_companies_for_location(state, config)
        all_companies.extend(companies)
        student_type_label = "CS Students" if config["student_type"] == "CS" else "Biochem + Intl Relations Students"
        print(f"\n📍 {state}: {len(companies)} companies generated")
        print(f"   - {config['main_lga']}: 5 companies (matching {student_type_label})")
        print(f"   - Other LGAs: 5 companies (random industries)")
    
    print("\n" + "=" * 60)
    print(f"Total companies to create: {len(all_companies)}")
    print("=" * 60)
    
    print("\n📌 Student-Location Matching Plan:")
    print("   • Port Harcourt (CS) → IT/Software, Finance, Consulting")
    print("   • Abuja (CS) → IT/Software, Finance, Consulting")
    print("   • Keffi (CS) → IT/Software, Finance, Consulting")
    print("   • Surulere, Lagos (Biochem) → Healthcare/Medical, Agriculture")
    print("   • Surulere, Lagos (Intl Relations) → Legal, Consulting, Marketing, Education")
    print("-" * 60)
    
    print("\n📌 Automatic OTP Verification: Enabled (MongoDB)")
    print("   - No manual input required.")
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
            is_matching = company['lga'] == LOCATION_CONFIG[company['state']]["main_lga"]
            match_status = "✅ MATCHES STUDENT" if is_matching else "📍 Other LGA"
            print(f"   Type: {match_status}")
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
    print("✅ All companies processed.")
    print("=" * 60)
    
    print("\n📋 Summary:")
    print(f"   Total companies: {len(all_companies)}")
    print("\n   By Location (Matching Companies):")
    for state, config in LOCATION_CONFIG.items():
        main_count = sum(1 for c in all_companies if c["state"] == state and c["lga"] == config["main_lga"])
        other_count = sum(1 for c in all_companies if c["state"] == state and c["lga"] != config["main_lga"])
        print(f"   • {state}: {main_count + other_count} total ({main_count} matching in {config['main_lga']}, {other_count} in other LGAs)")
    
    print("\n📌 Matching Companies by Student:")
    print("   • Joshua Sorochi (CS, Port Harcourt) → 5 companies in Port Harcourt")
    print("   • Njoku Samuel (CS, Abuja) → 5 companies in Municipal Area Council")
    print("   • Joy Riyesi (CS, Keffi) → 5 companies in Keffi")
    print("   • Ifiok Samuel (Biochem, Surulere) → 5 companies in Surulere")
    print("   • Edara Samuel (Intl Relations, Surulere) → 5 companies in Surulere")
    print("\n💡 Note: No internships were created. Only company profiles.")

if __name__ == "__main__":
    asyncio.run(main())