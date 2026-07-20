import asyncio
import httpx
from datetime import datetime, timedelta
import json

# Configuration
BASE_URL = "http://localhost:8000"  # Change to your backend URL
EMAIL = "sorochijoshua30@gmail.com"
PASSWORD = "LovuLord2022$$"  # Replace with the actual password

# All internship types under Information Technology / Software
INTERNSHIP_TYPES = [
    "Frontend Developer Intern",
    "Backend Developer Intern",
    "Full Stack Developer Intern",
    "UI/UX Design Intern",
    "Data Analyst Intern",
    "Data Scientist Intern",
    "Machine Learning Intern",
    "DevOps Engineer Intern",
    "Cloud Engineer Intern",
    "Cybersecurity Intern",
    "Database Administrator Intern",
    "Software Engineer Intern",
    "Mobile Developer Intern (iOS)",
    "Mobile Developer Intern (Android)",
    "Quality Assurance Intern",
    "Product Management Intern",
    "Technical Support Intern",
    "IT Support Intern",
    "Network Administrator Intern",
    "Systems Administrator Intern",
    "Business Intelligence Intern",
    "Blockchain Developer Intern"
]

# Skills for IT/Software industry
SKILLS_REQUIRED = [
    "JavaScript", "TypeScript", "Python", "Java", "C#", "C++", "Go",
    "React", "Next.js", "Vue.js", "Angular", "Node.js", "Express",
    "SQL", "MongoDB", "PostgreSQL", "Firebase", "GraphQL", "REST APIs",
    "Git", "Docker", "Kubernetes", "AWS", "Azure", "GCP",
    "Linux", "Bash", "PowerShell", "CI/CD", "Jenkins", "GitHub Actions",
    "HTML5", "CSS3", "SASS", "Tailwind CSS", "Bootstrap",
    "Figma", "Adobe XD", "Sketch", "UI/UX Design",
    "Data Analysis", "Machine Learning", "TensorFlow", "PyTorch",
    "Agile", "Scrum", "Jira", "Confluence"
]

SKILLS_OFFERED = [
    "Advanced JavaScript", "React", "Node.js", "Python", "Java",
    "Cloud Computing (AWS/Azure)", "DevOps Practices", "Agile Methodologies",
    "System Design", "Microservices Architecture", "Data Science",
    "UI/UX Design", "Product Management", "Leadership Skills",
    "Communication Skills", "Problem Solving", "Team Collaboration",
    "Project Management", "Technical Writing"
]

BENEFITS = [
    "Remote Work Options",
    "Flexible Working Hours",
    "Paid Internship",
    "Mentorship Program",
    "Professional Development",
    "Certification Reimbursement",
    "Health Insurance",
    "Gym Membership",
    "Free Lunch/Meal Stipend",
    "Transport Allowance",
    "Work Equipment (Laptop, etc.)",
    "Learning Budget",
    "Career Growth Opportunities",
    "Networking Events",
    "Team Building Activities"
]

# Descriptions for each internship type
def get_description(title):
    role_descriptions = {
        "Frontend Developer Intern": "Build responsive and interactive user interfaces using modern frontend technologies like React, Next.js, and Tailwind CSS. Collaborate with designers and backend developers to create seamless user experiences.",
        "Backend Developer Intern": "Design and develop robust backend systems using Node.js, Python, or Java. Work with databases like PostgreSQL and MongoDB to build scalable APIs and microservices.",
        "Full Stack Developer Intern": "Work across the entire stack - from frontend to backend. Build complete web applications, participate in code reviews, and learn about system architecture and deployment.",
        "UI/UX Design Intern": "Create intuitive and visually appealing user interfaces. Work on wireframing, prototyping, and user research to design exceptional user experiences.",
        "Data Analyst Intern": "Analyze large datasets to extract meaningful insights. Use Python, SQL, and visualization tools to help drive data-informed business decisions.",
        "Data Scientist Intern": "Apply machine learning and statistical models to solve complex business problems. Work with big data technologies and build predictive models.",
        "Machine Learning Intern": "Develop and deploy machine learning models. Work with TensorFlow, PyTorch, and other ML frameworks to solve real-world problems.",
        "DevOps Engineer Intern": "Build and maintain CI/CD pipelines, manage cloud infrastructure, and automate deployment processes. Work with Docker, Kubernetes, and cloud platforms.",
        "Cloud Engineer Intern": "Design and manage cloud infrastructure on AWS, Azure, or GCP. Work with containerization, serverless architecture, and cloud-native technologies.",
        "Cybersecurity Intern": "Protect systems and data from security threats. Learn about security best practices, vulnerability assessment, and incident response.",
        "Database Administrator Intern": "Manage and optimize database systems. Work with SQL, NoSQL databases, and ensure data integrity and performance.",
        "Software Engineer Intern": "Design, develop, and maintain software applications. Follow best practices in software engineering and contribute to all stages of development.",
        "Mobile Developer Intern (iOS)": "Build native iOS applications using Swift and SwiftUI. Learn mobile development best practices and app architecture.",
        "Mobile Developer Intern (Android)": "Build native Android applications using Kotlin and Android Jetpack. Learn mobile development best practices.",
        "Quality Assurance Intern": "Ensure software quality through testing and automation. Write test cases, perform manual and automated testing, and improve QA processes.",
        "Product Management Intern": "Work with cross-functional teams to define product requirements and roadmap. Learn about product strategy and user research.",
        "Technical Support Intern": "Provide technical support to users and troubleshoot issues. Learn about customer service and technical problem-solving.",
        "IT Support Intern": "Manage IT systems and provide technical support to employees. Learn about hardware, software, and network troubleshooting.",
        "Network Administrator Intern": "Manage and maintain network infrastructure. Learn about network protocols, security, and administration.",
        "Systems Administrator Intern": "Manage and maintain server systems. Learn about system administration, security, and automation.",
        "Business Intelligence Intern": "Build dashboards and reports to support business decisions. Work with data visualization tools and business analytics.",
        "Blockchain Developer Intern": "Build decentralized applications and smart contracts. Learn about blockchain technology and Web3 development."
    }
    return role_descriptions.get(title, f"Exciting internship opportunity to gain hands-on experience as a {title}.")

def get_location_specific(title):
    locations = ["Lagos, Nigeria", "Abuja, Nigeria", "Remote", "Hybrid"]
    return locations[hash(title) % len(locations)]

def get_about_company():
    return """SIPP is a leading technology company specializing in innovative web solutions and digital transformation. We are committed to mentoring young talents and helping them grow into successful professionals. Our culture is built on innovation, collaboration, and continuous learning.

We offer a supportive environment where interns can work on real-world projects, receive mentorship from experienced professionals, and develop skills that will launch their careers."""

async def login(client):
    """Login and get access token"""
    response = await client.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": EMAIL, "password": PASSWORD}
    )
    response.raise_for_status()
    data = response.json()
    return data["access_token"]

async def create_internship(client, token, internship_type):
    """Create a single internship"""
    
    # Select random skills (4-6 skills from the list)
    import random
    required_skills = random.sample(SKILLS_REQUIRED, min(6, len(SKILLS_REQUIRED)))
    offered_skills = random.sample(SKILLS_OFFERED, min(4, len(SKILLS_OFFERED)))
    benefits = random.sample(BENEFITS, min(5, len(BENEFITS)))
    
    location = get_location_specific(internship_type)
    
    # Set deadline to 3 months from now
    deadline = (datetime.now() + timedelta(days=90)).strftime("%Y-%m-%d")
    
    payload = {
        "title": internship_type,
        "location": location,
        "type": random.choice(["Full-time", "Remote", "Hybrid"]),
        "duration": random.choice(["3 months", "4 months", "6 months"]),
        "aboutRole": get_description(internship_type),
        "aboutCompany": get_about_company(),
        "applicationDeadline": deadline,
        "spotsAvailable": random.randint(2, 5),
        "skillsRequired": required_skills,
        "skillsOffered": offered_skills,
        "benefits": benefits
    }
    
    print(f"Creating: {internship_type}")
    print(f"  Location: {location}")
    print(f"  Skills Required: {', '.join(required_skills[:4])}...")
    print(f"  Spots: {payload['spotsAvailable']}")
    
    try:
        response = await client.post(
            f"{BASE_URL}/api/internships/create",
            json=payload,
            headers={"Authorization": f"Bearer {token}"}
        )
        response.raise_for_status()
        print(f"✅ Created: {internship_type}\n")
        return True
    except Exception as e:
        print(f"❌ Failed: {internship_type}")
        print(f"   Error: {e}\n")
        return False

async def main():
    print("=" * 60)
    print("SIPP - Create All IT Internships")
    print("=" * 60)
    print(f"Email: {EMAIL}")
    print(f"Number of internships to create: {len(INTERNSHIP_TYPES)}")
    print("-" * 60)
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        # Login
        print("\n🔐 Logging in...")
        try:
            token = await login(client)
            print("✅ Login successful!\n")
        except Exception as e:
            print(f"❌ Login failed: {e}")
            print("Please check your email, password, and that the backend is running.")
            return
        
        # Create internships
        print("🚀 Creating internships...\n")
        successful = 0
        failed = 0
        
        for internship_type in INTERNSHIP_TYPES:
            success = await create_internship(client, token, internship_type)
            if success:
                successful += 1
            else:
                failed += 1
        
        # Summary
        print("=" * 60)
        print("📊 SUMMARY")
        print("=" * 60)
        print(f"✅ Successfully created: {successful}")
        print(f"❌ Failed: {failed}")
        print(f"📝 Total: {len(INTERNSHIP_TYPES)}")
        print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())