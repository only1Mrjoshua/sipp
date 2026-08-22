import sys
import os
import random
import asyncio
import httpx
import time
from typing import List, Dict

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
users_collection = db.users

# ============================================================
# RICH INDUSTRY DATA FOR DIVERSE INTERNSHIPS
# ============================================================
# Extended lists for generating varied internships per company
INDUSTRY_DETAILS = {
    "Information Technology / Software": {
        "titles": [
            "Frontend Developer", "Backend Developer", "Full Stack Developer",
            "UI/UX Designer", "Data Analyst", "Data Scientist", "Machine Learning Engineer",
            "DevOps Engineer", "Cloud Engineer", "Cybersecurity Analyst",
            "Software Engineer", "Mobile App Developer (iOS)", "Mobile App Developer (Android)",
            "QA Engineer", "Product Manager", "Technical Support", "IT Support",
            "Database Administrator", "Systems Administrator", "Business Intelligence Analyst",
            "Blockchain Developer", "Game Developer"
        ],
        "skills_req_pool": [
            "JavaScript", "TypeScript", "Python", "Java", "C#", "C++", "Go",
            "React", "Next.js", "Vue.js", "Angular", "Node.js", "Express",
            "SQL", "MongoDB", "PostgreSQL", "Firebase", "GraphQL", "REST APIs",
            "Git", "Docker", "Kubernetes", "AWS", "Azure", "GCP",
            "Linux", "Bash", "PowerShell", "CI/CD", "Jenkins", "GitHub Actions",
            "HTML5", "CSS3", "SASS", "Tailwind CSS", "Bootstrap",
            "Figma", "Adobe XD", "Sketch", "UI/UX Design",
            "Data Analysis", "Machine Learning", "TensorFlow", "PyTorch",
            "Agile", "Scrum", "Jira", "Confluence"
        ],
        "skills_off_pool": [
            "Advanced JavaScript", "React", "Node.js", "Python", "Java",
            "Cloud Computing (AWS/Azure)", "DevOps Practices", "Agile Methodologies",
            "System Design", "Microservices Architecture", "Data Science",
            "UI/UX Design", "Product Management", "Leadership Skills",
            "Communication Skills", "Problem Solving", "Team Collaboration",
            "Project Management", "Technical Writing"
        ],
        "benefits_pool": [
            "Remote Work", "Flexible Hours", "Paid Internship", "Mentorship",
            "Professional Development", "Certification Reimbursement",
            "Health Insurance", "Gym Membership", "Free Lunch",
            "Transport Allowance", "Work Equipment", "Learning Budget",
            "Career Growth", "Networking Events", "Team Building"
        ],
        "durations": ["3 months", "6 months", "12 months"],
        "types": ["Remote", "Hybrid", "On-site"]
    },
    "Engineering / Manufacturing": {
        "titles": [
            "Mechanical Engineer", "Electrical Engineer", "Civil Engineer",
            "Chemical Engineer", "Petroleum Engineer", "Automation Engineer",
            "Quality Engineer", "Safety Engineer", "Manufacturing Engineer",
            "Design Engineer", "Structural Engineer", "Power Systems Engineer",
            "Renewable Energy Engineer", "HVAC Engineer", "Instrumentation Engineer",
            "Maintenance Engineer", "Production Engineer", "Process Engineer",
            "Drilling Engineer", "Reservoir Engineer", "Geotechnical Engineer"
        ],
        "skills_req_pool": [
            "AutoCAD", "SolidWorks", "Revit", "MATLAB", "Simulink",
            "PLC Programming", "Circuit Design", "Thermodynamics",
            "Fluid Mechanics", "Structural Analysis", "Process Design",
            "Quality Control", "Safety Protocols", "Project Management",
            "HVAC Systems", "Power Systems", "Renewable Energy",
            "Drilling Operations", "Reservoir Engineering", "Geology",
            "Manufacturing Processes", "CNC Programming", "3D Printing"
        ],
        "skills_off_pool": [
            "Advanced CAD", "Systems Design", "Project Management",
            "Leadership Skills", "Communication Skills",
            "Problem Solving", "Team Collaboration", "Industry Standards",
            "Quality Control", "Safety Management", "Technical Writing"
        ],
        "benefits_pool": [
            "Hands-on Experience", "Mentorship", "Professional Development",
            "Health Insurance", "Career Growth", "Learning Resources",
            "Team Building", "Safe Environment", "Technical Training",
            "Field Experience"
        ],
        "durations": ["3 months", "6 months", "12 months"],
        "types": ["On-site", "Hybrid"]
    },
    "Finance / Banking": {
        "titles": [
            "Finance Analyst", "Investment Banking Analyst", "Financial Analyst",
            "Accountant", "Auditor", "Tax Consultant", "Risk Manager",
            "Compliance Officer", "Wealth Manager", "Corporate Finance Analyst",
            "Treasury Analyst", "Financial Planner", "Business Analyst",
            "Credit Analyst", "Portfolio Manager"
        ],
        "skills_req_pool": [
            "Financial Analysis", "Accounting", "Excel", "QuickBooks", "SAP",
            "Financial Modeling", "Data Analysis", "Risk Assessment",
            "Regulatory Compliance", "Internal Audit", "Tax Preparation",
            "Budgeting", "Forecasting", "Financial Reporting",
            "Corporate Finance", "Investment Strategies", "Portfolio Management"
        ],
        "skills_off_pool": [
            "Advanced Excel", "Financial Modeling", "SAP", "Business Analytics",
            "Investment Strategies", "Risk Management", "Regulatory Compliance",
            "Leadership Skills", "Communication Skills", "Client Management"
        ],
        "benefits_pool": [
            "Professional Development", "Mentorship", "Career Growth",
            "Health Insurance", "Retirement Plans", "Performance Bonuses",
            "Flexible Hours", "Team Building", "Certifications Support"
        ],
        "durations": ["3 months", "6 months", "12 months"],
        "types": ["Remote", "Hybrid", "On-site"]
    },
    "Healthcare / Medical": {
        "titles": [
            "Medical Intern", "Nursing Intern", "Pharmacy Intern",
            "Medical Researcher", "Healthcare Administrator", "Public Health Intern",
            "Clinical Research Coordinator", "Medical Lab Technologist",
            "Radiology Technician", "Physical Therapist", "Mental Health Counselor",
            "Occupational Therapist", "Health Informatics Specialist",
            "Community Health Worker"
        ],
        "skills_req_pool": [
            "Patient Care", "Clinical Skills", "Medical Terminology",
            "EMR Systems", "Research Skills", "Communication",
            "Critical Thinking", "Problem Solving", "Team Collaboration",
            "Compassion", "Attention to Detail", "Emergency Care",
            "Laboratory Techniques", "Molecular Biology", "PCR",
            "Pharmacology", "Drug Formulation", "Patient Counseling"
        ],
        "skills_off_pool": [
            "Advanced Patient Care", "Clinical Research", "Medical Ethics",
            "Healthcare Administration", "Leadership Skills",
            "Communication Skills", "Critical Thinking", "Team Collaboration",
            "Patient Management", "Healthcare Technology"
        ],
        "benefits_pool": [
            "Clinical Experience", "Mentorship", "Professional Development",
            "Health Insurance", "Flexible Hours", "Career Growth",
            "Learning Resources", "Team Building", "Licensure Support"
        ],
        "durations": ["3 months", "6 months", "12 months"],
        "types": ["On-site", "Hybrid"]
    },
    "Construction / Real Estate": {
        "titles": [
            "Construction Manager", "Real Estate Agent", "Architectural Intern",
            "Quantity Surveyor", "Site Engineer", "Property Developer",
            "Facilities Manager", "Urban Planner", "Interior Designer"
        ],
        "skills_req_pool": [
            "Construction Management", "Project Management",
            "AutoCAD", "Revit", "SketchUp", "Quantity Surveying",
            "Site Supervision", "Building Regulations", "Safety Protocols",
            "Cost Estimation", "Material Sourcing", "Urban Planning",
            "Interior Design", "Rendering", "Building Design"
        ],
        "skills_off_pool": [
            "Construction Management", "Project Planning", "AutoCAD",
            "Leadership Skills", "Communication Skills", "Problem Solving",
            "Cost Management", "Quality Control"
        ],
        "benefits_pool": [
            "Hands-on Experience", "Mentorship", "Professional Development",
            "Career Growth", "Learning Resources", "Team Building",
            "Site Experience"
        ],
        "durations": ["3 months", "6 months", "12 months"],
        "types": ["On-site", "Hybrid"]
    },
    "Education / Academia": {
        "titles": [
            "Teaching Assistant", "Education Researcher", "Curriculum Developer",
            "EdTech Specialist", "Special Education Teacher",
            "School Administrator", "Academic Advisor", "E-Learning Designer",
            "Training Coordinator"
        ],
        "skills_req_pool": [
            "Teaching", "Curriculum Development", "Classroom Management",
            "Educational Technology", "Assessment Design", "Communication",
            "Research Skills", "Presentation Skills", "Student Engagement",
            "Lesson Planning", "Educational Psychology"
        ],
        "skills_off_pool": [
            "Advanced Teaching Methods", "Curriculum Design", "Educational Technology",
            "Leadership Skills", "Communication Skills", "Research Skills",
            "Assessment Design", "Student Engagement"
        ],
        "benefits_pool": [
            "Teaching Experience", "Mentorship", "Professional Development",
            "Career Growth", "Learning Resources", "Team Building",
            "Certifications Support"
        ],
        "durations": ["3 months", "6 months", "12 months"],
        "types": ["Remote", "Hybrid", "On-site"]
    },
    "Marketing / Advertising": {
        "titles": [
            "Marketing Coordinator", "Digital Marketing Specialist",
            "Content Marketer", "Social Media Manager", "SEO Specialist",
            "Brand Strategist", "Public Relations Coordinator",
            "Market Researcher", "Event Planner", "Graphic Designer",
            "Copywriter", "Product Marketing Manager", "Growth Hacker"
        ],
        "skills_req_pool": [
            "Digital Marketing", "SEO", "SEM", "Social Media Marketing",
            "Content Creation", "Google Analytics", "Email Marketing",
            "WordPress", "Adobe Creative Suite", "Canva",
            "Copywriting", "Brand Management", "Market Research",
            "Public Relations", "Event Planning", "Analytics"
        ],
        "skills_off_pool": [
            "Advanced Digital Marketing", "Brand Strategy", "Content Marketing",
            "Social Media Management", "Analytics", "Leadership Skills",
            "Communication Skills", "Creative Thinking", "Campaign Management"
        ],
        "benefits_pool": [
            "Portfolio Building", "Mentorship", "Professional Development",
            "Career Growth", "Learning Resources", "Team Building",
            "Networking Opportunities"
        ],
        "durations": ["3 months", "6 months", "12 months"],
        "types": ["Remote", "Hybrid", "On-site"]
    },
    "Legal": {
        "titles": [
            "Legal Intern", "Corporate Law Intern", "Criminal Law Intern",
            "Human Rights Intern", "Legal Researcher", "Paralegal",
            "Family Law Intern", "Immigration Law Intern",
            "Environmental Law Intern", "Intellectual Property Intern"
        ],
        "skills_req_pool": [
            "Legal Research", "Legal Writing", "Case Analysis",
            "Communication", "Negotiation", "Critical Thinking",
            "Drafting", "Litigation Support", "Client Counseling",
            "Contract Law", "Corporate Law", "Human Rights Law"
        ],
        "skills_off_pool": [
            "Advanced Legal Research", "Legal Writing", "Case Management",
            "Communication Skills", "Negotiation Skills", "Professional Ethics",
            "Court Procedures", "Client Management"
        ],
        "benefits_pool": [
            "Legal Experience", "Mentorship", "Professional Development",
            "Career Growth", "Learning Resources", "Networking",
            "Bar Exam Preparation Support"
        ],
        "durations": ["3 months", "6 months", "12 months"],
        "types": ["Remote", "Hybrid", "On-site"]
    },
    "Agriculture / Agribusiness": {
        "titles": [
            "Agricultural Scientist", "Agribusiness Manager", "Farm Manager",
            "Agronomist", "Animal Scientist", "Food Processing Specialist",
            "Agri-Tech Specialist", "Soil Scientist", "Extension Officer",
            "Agricultural Researcher"
        ],
        "skills_req_pool": [
            "Crop Production", "Animal Husbandry", "Farm Management",
            "Soil Science", "Agricultural Technology", "Food Processing",
            "Agribusiness", "Supply Chain", "Quality Control",
            "Plant Science", "Agricultural Economics", "Irrigation"
        ],
        "skills_off_pool": [
            "Crop Science", "Animal Science", "Farm Management",
            "Agribusiness", "Technology in Agriculture", "Leadership Skills",
            "Food Safety", "Supply Chain Management"
        ],
        "benefits_pool": [
            "Agricultural Experience", "Mentorship", "Professional Development",
            "Career Growth", "Learning Resources", "Hands-on Training",
            "Field Experience"
        ],
        "durations": ["3 months", "6 months", "12 months"],
        "types": ["On-site", "Hybrid"]
    },
    "Consulting": {
        "titles": [
            "Management Consultant", "Strategy Consultant", "Business Analyst",
            "Financial Consultant", "IT Consultant", "HR Consultant",
            "Operations Consultant", "Risk Consultant", "Digital Transformation Consultant"
        ],
        "skills_req_pool": [
            "Business Analysis", "Data Analysis", "Excel", "PowerPoint",
            "Problem Solving", "Communication", "Strategic Thinking",
            "Market Research", "Financial Modeling", "Project Management",
            "Data Visualization", "Change Management", "Risk Assessment"
        ],
        "skills_off_pool": [
            "Business Strategy", "Data Analysis", "Project Management",
            "Leadership Skills", "Communication Skills", "Problem Solving",
            "Consulting Methodologies", "Client Management"
        ],
        "benefits_pool": [
            "Consulting Experience", "Mentorship", "Professional Development",
            "Career Growth", "Learning Resources", "Networking",
            "Travel Opportunities"
        ],
        "durations": ["3 months", "6 months", "12 months"],
        "types": ["Remote", "Hybrid", "On-site"]
    }
}

# ============================================================
# FETCH COMPANIES FROM DB
# ============================================================
def get_companies_to_process():
    """Fetch all companies from the database (we assume we only have the 50 target companies)"""
    # You can filter by state or email pattern if needed.
    # For simplicity, we'll fetch all companies with role 'company'
    # But we want only the ones we created (50). We can identify by email pattern or just all.
    # Since we only have these 50 companies, fetch all.
    companies = list(users_collection.find({"role": "company"}))
    return companies

# ============================================================
# INTERNSHIP GENERATOR
# ============================================================
def generate_10_internships(company):
    """Generate 10 distinct internship listings for a company based on its industry"""
    industry = company["industry"]
    details = INDUSTRY_DETAILS.get(industry)
    if not details:
        print(f"⚠️ No details for industry: {industry}. Using defaults.")
        # Fallback defaults
        details = {
            "titles": ["General Intern"],
            "skills_req_pool": ["Communication", "Teamwork"],
            "skills_off_pool": ["Professional Skills"],
            "benefits_pool": ["Mentorship"],
            "durations": ["3 months"],
            "types": ["On-site"]
        }
    
    titles = details["titles"]
    skills_req = details["skills_req_pool"]
    skills_off = details["skills_off_pool"]
    benefits = details["benefits_pool"]
    durations = details["durations"]
    types = details["types"]
    
    internships = []
    # We'll generate 10 unique roles by shuffling titles or combining.
    # If fewer than 10 titles, we'll reuse with variants.
    available_titles = titles.copy()
    random.shuffle(available_titles)
    # Ensure we have at least 10 titles by cycling if needed
    selected_titles = []
    for i in range(10):
        if available_titles:
            selected_titles.append(available_titles.pop())
        else:
            # Reuse with a suffix
            reused = titles[i % len(titles)]
            selected_titles.append(f"{reused} (Variant {i//len(titles)+1})")
    
    for i in range(10):
        title = selected_titles[i]
        # Choose random skills (5 required, 4 offered, 3 benefits)
        req_skills = random.sample(skills_req, min(5, len(skills_req)))
        off_skills = random.sample(skills_off, min(4, len(skills_off)))
        benefit_list = random.sample(benefits, min(3, len(benefits)))
        duration = random.choice(durations)
        internship_type = random.choice(types)
        spots = random.randint(1, 5)
        location = f"{company['city']}, {company['state']}"
        about_role = f"As a {title} intern, you will work on exciting projects and contribute to our team in the {industry} industry."
        about_company = company.get("description", "We are a dynamic company.")
        
        internships.append({
            "title": title,
            "location": location,
            "type": internship_type,
            "duration": duration,
            "aboutRole": about_role,
            "aboutCompany": about_company,
            "applicationDeadline": "2026-12-31T23:59:59",
            "spotsAvailable": spots,
            "skillsRequired": req_skills,
            "skillsOffered": off_skills,
            "benefits": benefit_list
        })
    return internships

# ============================================================
# API FUNCTIONS
# ============================================================
async def login_company(client, email, password):
    try:
        response = await client.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": email, "password": password}
        )
        if response.status_code == 200:
            data = response.json()
            return data.get("access_token")
        else:
            print(f"   ❌ Login failed for {email}: {response.json().get('detail')}")
            return None
    except Exception as e:
        print(f"   ❌ Login error: {e}")
        return None

async def create_internship(client, token, internship_data):
    headers = {"Authorization": f"Bearer {token}"}
    try:
        response = await client.post(
            f"{BASE_URL}/api/internships/create",
            json=internship_data,
            headers=headers
        )
        if response.status_code == 201:
            return True
        else:
            print(f"      ❌ Failed: {response.json().get('detail')}")
            return False
    except Exception as e:
        print(f"      ❌ Error: {e}")
        return False

# ============================================================
# MAIN
# ============================================================
async def main():
    print("=" * 60)
    print("SIPP - Create 10 Internships per Company")
    print("=" * 60)
    
    # Fetch all companies
    companies = get_companies_to_process()
    print(f"Found {len(companies)} companies in database.")
    # Filter to only those with expected industry (optional)
    # We'll process all.
    
    total_internships = 0
    async with httpx.AsyncClient(timeout=30.0) as client:
        for idx, company in enumerate(companies, 1):
            email = company["email"]
            company_name = company.get("companyName", "Unknown")
            print(f"\n📌 Company {idx}/{len(companies)}: {company_name} ({email})")
            print(f"   Industry: {company['industry']}, Location: {company['state']} – {company['lga']}")
            
            # Login
            token = await login_company(client, email, PASSWORD)
            if not token:
                print("   ⚠️ Skipping company due to login failure.")
                continue
            
            # Generate 10 internships
            internships = generate_10_internships(company)
            print(f"   Generating 10 internships...")
            success_count = 0
            for i, internship in enumerate(internships, 1):
                print(f"      Creating internship {i}/10: {internship['title']}")
                success = await create_internship(client, token, internship)
                if success:
                    success_count += 1
                    total_internships += 1
                await asyncio.sleep(0.5)  # avoid rate limits
            
            print(f"   ✅ Created {success_count}/{len(internships)} internships for {company_name}.")
            # Small delay between companies
            if idx < len(companies):
                await asyncio.sleep(1)
    
    print("\n" + "=" * 60)
    print(f"✅ Completed. Total internships created: {total_internships}")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())