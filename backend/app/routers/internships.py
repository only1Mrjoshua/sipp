from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime
from bson import ObjectId
from app.core.database import get_users_collection, get_internships_collection, get_applications_collection
from app.core.security import decode_access_token
from app.models.internship import InternshipCreate, InternshipOut

router = APIRouter(prefix="/api/internships", tags=["Internships"])

# Create security instance
security = HTTPBearer()

# Department to Industry Mapping - COMPLETE LIST
DEPARTMENT_INDUSTRY_MAPPING = {
    # ============ TECHNOLOGY & IT ============
    "Computer Science": ["Information Technology / Software"],
    "Software Engineering": ["Information Technology / Software"],
    "Information Technology": ["Information Technology / Software"],
    "Statistics": ["Information Technology / Software", "Finance / Banking", "Consulting"],
    "Mathematics": ["Information Technology / Software", "Finance / Banking", "Consulting"],
    
    # ============ ENGINEERING ============
    "Mechanical Engineering": ["Engineering / Manufacturing"],
    "Electrical Engineering": ["Engineering / Manufacturing"],
    "Civil Engineering": ["Engineering / Manufacturing", "Construction / Real Estate"],
    "Petroleum Engineering": ["Engineering / Manufacturing"],
    "Chemical Engineering": ["Engineering / Manufacturing"],
    "Physics": ["Engineering / Manufacturing"],
    
    # ============ FINANCE & BUSINESS ============
    "Accounting": ["Finance / Banking"],
    "Economics": ["Finance / Banking", "Consulting"],
    "Business Administration": ["Finance / Banking", "Consulting", "Marketing / Advertising", 
                                "Education / Academia", "Hospitality / Tourism", 
                                "Media / Entertainment", "Construction / Real Estate"],
    
    # ============ MARKETING & COMMUNICATION ============
    "Marketing": ["Marketing / Advertising", "Media / Entertainment"],
    "Mass Communication": ["Marketing / Advertising", "Media / Entertainment", 
                           "Education / Academia", "Hospitality / Tourism"],
    
    # ============ HEALTHCARE & MEDICAL ============
    "Medicine": ["Healthcare / Medical"],
    "Nursing": ["Healthcare / Medical"],
    "Pharmacy": ["Healthcare / Medical"],
    "Biochemistry": ["Healthcare / Medical", "Agriculture / Agribusiness"],
    "Microbiology": ["Healthcare / Medical", "Agriculture / Agribusiness"],
    "Psychology": ["Healthcare / Medical", "Education / Academia", "Marketing / Advertising", "Consulting"],
    
    # ============ AGRICULTURE ============
    "Agriculture": ["Agriculture / Agribusiness"],
    
    # ============ LEGAL ============
    "Law": ["Legal"],
    
    # ============ EDUCATION ============
    "Education": ["Education / Academia"],
    
    # ============ ARCHITECTURE ============
    "Architecture": ["Construction / Real Estate"],
}


# ============ SINGLE SOURCE OF TRUTH MATCHING FUNCTION ============

def calculate_match(student, internship, company):
    """
    Returns the match percentage between a student and an internship.
    This is the SINGLE source of truth for all matching logic.
    
    Args:
        student (dict): Student user document
        internship (dict): Internship document
        company (dict): Company user document
    
    Returns:
        int: Match score between 0 and 100
    """
    student_department = student.get("department", "")
    student_skills = student.get("skills", [])
    student_interests = student.get("interests", [])

    company_industry = company.get("industry", "")

    # Check department -> industry mapping
    allowed_industries = DEPARTMENT_INDUSTRY_MAPPING.get(student_department, [])

    if company_industry not in allowed_industries:
        return 0

    required_skills = internship.get("skillsRequired", [])
    offered_skills = internship.get("skillsOffered", [])

    skill_score = 0
    interest_score = 0

    if required_skills:
        matched_skills = [
            s for s in student_skills
            if s.lower() in [r.lower() for r in required_skills]
        ]

        skill_score = (
            len(matched_skills) / len(required_skills)
        ) * 100

    if offered_skills and student_interests:
        matched_interests = [
            i for i in student_interests
            if i.lower() in [o.lower() for o in offered_skills]
        ]

        interest_score = (
            len(matched_interests) / len(offered_skills)
        ) * 20

    return round(min(skill_score + interest_score, 100))


# ============ ENDPOINTS ============

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get current user from JWT token in Authorization header"""
    token = credentials.credentials
    
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    collection = await get_users_collection()
    user = await collection.find_one({"_id": ObjectId(payload["sub"])})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if not user.get("isActive", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated"
        )
    
    return user


@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_internship(
    internship_data: InternshipCreate,
    user: dict = Depends(get_current_user)
):
    """Create a new internship (Company only)"""
    
    # Check if user is a company
    if user.get("role") != "company":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only companies can create internships"
        )
    
    collection = await get_internships_collection()
    
    try:
        # Ensure all required fields are present
        internship_doc = {
            "companyId": str(user["_id"]),
            "title": internship_data.title.strip(),
            "location": internship_data.location.strip(),
            "type": internship_data.type,
            "duration": internship_data.duration,
            "aboutRole": internship_data.aboutRole.strip(),
            "aboutCompany": internship_data.aboutCompany.strip(),
            "applicationDeadline": internship_data.applicationDeadline,
            "spotsAvailable": int(internship_data.spotsAvailable),
            "skillsRequired": [s.strip() for s in internship_data.skillsRequired if s and s.strip()] if internship_data.skillsRequired else [],
            "skillsOffered": [s.strip() for s in internship_data.skillsOffered if s and s.strip()] if internship_data.skillsOffered else [],
            "benefits": [b.strip() for b in internship_data.benefits if b and b.strip()] if internship_data.benefits else [],
            "status": "Active",
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        
        result = await collection.insert_one(internship_doc)
        
        return {
            "message": "Internship created successfully",
            "internship_id": str(result.inserted_id)
        }
    except Exception as e:
        print(f"Error creating internship: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create internship: {str(e)}"
        )


@router.get("/company")
async def get_company_internships(user: dict = Depends(get_current_user)):
    """Get all internships for a company with applicant counts and matched student counts"""
    
    if user.get("role") != "company":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only companies can view their internships"
        )
    
    internships_collection = await get_internships_collection()
    applications_collection = await get_applications_collection()
    users_collection = await get_users_collection()
    
    internships = await internships_collection.find({"companyId": str(user["_id"])}).to_list(None)
    
    # Get all active students (for matching calculation)
    all_students = await users_collection.find({
        "role": "student", 
        "isActive": True
    }).to_list(None)
    
    result = []
    for internship in internships:
        internship_id = str(internship["_id"])
        
        # Count applications for this internship
        applicant_count = await applications_collection.count_documents({
            "internshipId": internship_id
        })
        
        # Get company
        company = await users_collection.find_one({
            "_id": ObjectId(internship["companyId"])
        })
        company_name = company.get("companyName", "Your Company") if company else "Your Company"
        
        # ============ CALCULATE MATCHED STUDENTS USING calculate_match() ============
        matched_count = 0
        
        for student in all_students:
            score = calculate_match(student, internship, company)
            if score > 0:
                matched_count += 1
        
        result.append({
            "id": internship_id,
            "companyId": internship.get("companyId", ""),
            "title": internship.get("title", ""),
            "location": internship.get("location", ""),
            "type": internship.get("type", ""),
            "duration": internship.get("duration", ""),
            "aboutRole": internship.get("aboutRole", ""),
            "aboutCompany": internship.get("aboutCompany", ""),
            "applicationDeadline": internship.get("applicationDeadline", ""),
            "spotsAvailable": internship.get("spotsAvailable", 0),
            "skillsRequired": internship.get("skillsRequired", []),
            "skillsOffered": internship.get("skillsOffered", []),
            "benefits": internship.get("benefits", []),
            "status": internship.get("status", "Active"),
            "companyName": company_name,
            "applicants": applicant_count,
            "matchCount": matched_count,  # Students who match the internship
            "createdAt": internship.get("createdAt", datetime.utcnow()),
            "updatedAt": internship.get("updatedAt", datetime.utcnow())
        })
    
    return result


@router.get("/student/matched")
async def get_matched_internships(
    user: dict = Depends(get_current_user),
    skip: int = 0,
    limit: int = 50
):
    """Get internships matched to a student – optimized with aggregation and pagination"""
    
    if user.get("role") != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can view matched internships"
        )

    # 1. Full student profile
    users_collection = await get_users_collection()
    full_user = await users_collection.find_one({"_id": ObjectId(user["_id"])})
    if not full_user:
        raise HTTPException(status_code=404, detail="User not found")

    internships_collection = await get_internships_collection()
    applications_collection = await get_applications_collection()

    # 2. Get active internships with pagination (sorted newest first)
    internships_cursor = internships_collection.find({"status": "Active"}).sort("createdAt", -1).skip(skip).limit(limit)
    internships = await internships_cursor.to_list(length=limit)
    if not internships:
        return []

    # 3. Collect all company IDs and fetch companies in ONE query
    company_ids = list({ObjectId(internship["companyId"]) for internship in internships})
    companies = await users_collection.find({"_id": {"$in": company_ids}}).to_list(None)
    company_map = {str(comp["_id"]): comp for comp in companies}

    # 4. Count applications per internship in ONE aggregation
    internship_ids = [internship["_id"] for internship in internships]

    # total applicants
    pipeline_total = [
        {"$match": {"internshipId": {"$in": internship_ids}}},
        {"$group": {"_id": "$internshipId", "total": {"$sum": 1}}}
    ]
    total_counts = await applications_collection.aggregate(pipeline_total).to_list(None)
    total_map = {doc["_id"]: doc["total"] for doc in total_counts}

    # matched applicants (Accepted or In Review)
    pipeline_matched = [
        {"$match": {"internshipId": {"$in": internship_ids}, "status": {"$in": ["Accepted", "In Review"]}}},
        {"$group": {"_id": "$internshipId", "matched": {"$sum": 1}}}
    ]
    matched_counts = await applications_collection.aggregate(pipeline_matched).to_list(None)
    matched_map = {doc["_id"]: doc["matched"] for doc in matched_counts}

    # 5. Build response, computing match scores in Python
    matched_internships = []
    for internship in internships:
        company = company_map.get(internship["companyId"])
        if not company:
            continue

        match_score = calculate_match(full_user, internship, company)
        if match_score <= 0:
            continue

        internship_id = str(internship["_id"])
        matched_internships.append({
            "id": internship_id,
            "companyId": internship.get("companyId", ""),
            "title": internship.get("title", ""),
            "location": internship.get("location", ""),
            "type": internship.get("type", ""),
            "duration": internship.get("duration", ""),
            "aboutRole": internship.get("aboutRole", ""),
            "aboutCompany": internship.get("aboutCompany", ""),
            "applicationDeadline": internship.get("applicationDeadline", ""),
            "spotsAvailable": internship.get("spotsAvailable", 0),
            "skillsRequired": internship.get("skillsRequired", []),
            "skillsOffered": internship.get("skillsOffered", []),
            "benefits": internship.get("benefits", []),
            "status": internship.get("status", "Active"),
            "companyName": company.get("companyName", "Unknown Company"),
            "companyIndustry": company.get("industry", ""),
            "match": match_score,
            "applicants": total_map.get(internship_id, 0),
            "matchCount": matched_map.get(internship_id, 0),
            "createdAt": internship.get("createdAt", datetime.utcnow()),
            "updatedAt": internship.get("updatedAt", datetime.utcnow())
        })

    # Sort by match score descending
    matched_internships.sort(key=lambda x: x["match"], reverse=True)
    return matched_internships


@router.get("/{internship_id}/match")
async def get_match_score(
    internship_id: str,
    user: dict = Depends(get_current_user)
):
    """Get the match score for a specific internship and student"""
    
    if user.get("role") != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Students only."
        )

    internships_collection = await get_internships_collection()
    users_collection = await get_users_collection()

    internship = await internships_collection.find_one({
        "_id": ObjectId(internship_id)
    })

    if not internship:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Internship not found."
        )

    company = await users_collection.find_one({
        "_id": ObjectId(internship["companyId"])
    })

    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found."
        )

    score = calculate_match(user, internship, company)

    return {
        "match": score
    }


@router.get("/{internship_id}")
async def get_internship(internship_id: str):
    """Get internship by ID"""
    collection = await get_internships_collection()
    
    try:
        internship = await collection.find_one({"_id": ObjectId(internship_id)})
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid internship ID")
    
    if not internship:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Internship not found")
    
    internship["_id"] = str(internship["_id"])
    
    # Get company name
    users_collection = await get_users_collection()
    company = await users_collection.find_one({"_id": ObjectId(internship["companyId"])})
    internship["companyName"] = company.get("companyName", "Unknown Company") if company else "Unknown Company"
    
    return internship


# ============ UPDATE INTERNSHIP ENDPOINT ============
@router.put("/{internship_id}")
async def update_internship(
    internship_id: str,
    internship_data: InternshipCreate,
    user: dict = Depends(get_current_user)
):
    """Update an existing internship (Company only)"""
    
    if user.get("role") != "company":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only companies can update internships"
        )
    
    internships_collection = await get_internships_collection()
    
    try:
        internship = await internships_collection.find_one({"_id": ObjectId(internship_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid internship ID"
        )
    
    if not internship:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Internship not found"
        )
    
    # Check if company owns this internship
    if internship["companyId"] != str(user["_id"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own internships"
        )
    
    # Update the internship
    update_data = {
        "title": internship_data.title.strip(),
        "location": internship_data.location.strip(),
        "type": internship_data.type,
        "duration": internship_data.duration,
        "aboutRole": internship_data.aboutRole.strip(),
        "aboutCompany": internship_data.aboutCompany.strip(),
        "applicationDeadline": internship_data.applicationDeadline,
        "spotsAvailable": int(internship_data.spotsAvailable),
        "skillsRequired": [s.strip() for s in internship_data.skillsRequired if s and s.strip()] if internship_data.skillsRequired else [],
        "skillsOffered": [s.strip() for s in internship_data.skillsOffered if s and s.strip()] if internship_data.skillsOffered else [],
        "benefits": [b.strip() for b in internship_data.benefits if b and b.strip()] if internship_data.benefits else [],
        "updatedAt": datetime.utcnow()
    }
    
    await internships_collection.update_one(
        {"_id": ObjectId(internship_id)},
        {"$set": update_data}
    )
    
    return {
        "message": "Internship updated successfully",
        "internship_id": internship_id
    }


# ============ DELETE INTERNSHIP ENDPOINT ============
@router.delete("/{internship_id}")
async def delete_internship(
    internship_id: str,
    user: dict = Depends(get_current_user)
):
    """Delete an internship and its applications"""
    
    if user.get("role") != "company":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only companies can delete internships"
        )
    
    internships_collection = await get_internships_collection()
    applications_collection = await get_applications_collection()
    
    try:
        internship = await internships_collection.find_one({"_id": ObjectId(internship_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid internship ID"
        )
    
    if not internship:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Internship not found"
        )
    
    # Check if user owns this internship
    if internship["companyId"] != str(user["_id"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own internships"
        )
    
    # Delete all applications for this internship
    await applications_collection.delete_many({
        "internshipId": internship_id
    })
    
    # Delete the internship
    await internships_collection.delete_one({"_id": ObjectId(internship_id)})
    
    return {"message": "Internship and all associated applications deleted successfully"}


# ============ UPDATE INTERNSHIP STATUS ENDPOINT ============
@router.put("/{internship_id}/status")
async def update_internship_status(
    internship_id: str,
    status_data: dict,
    user: dict = Depends(get_current_user)
):
    """Update internship status"""
    
    if user.get("role") != "company":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only companies can update internship status"
        )
    
    collection = await get_internships_collection()
    
    try:
        internship = await collection.find_one({"_id": ObjectId(internship_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid internship ID"
        )
    
    if not internship:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Internship not found"
        )
    
    # Check if user owns this internship
    if internship["companyId"] != str(user["_id"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own internships"
        )
    
    new_status = status_data.get("status")
    if not new_status:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status is required"
        )
    
    valid_statuses = ["Active", "Closed", "Draft"]
    if new_status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )
    
    await collection.update_one(
        {"_id": ObjectId(internship_id)},
        {"$set": {"status": new_status, "updatedAt": datetime.utcnow()}}
    )
    
    return {"message": f"Internship status updated to {new_status}"}