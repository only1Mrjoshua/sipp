from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime
from bson import ObjectId
from app.core.database import get_users_collection, get_internships_collection, get_applications_collection
from app.core.security import decode_access_token
from app.models.application import ApplicationCreate, ApplicationUpdate, ApplicationOut

router = APIRouter(prefix="/api/applications", tags=["Applications"])

# Security
security = HTTPBearer()

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

@router.post("/apply")
async def apply_to_internship(
    application_data: ApplicationCreate,
    user: dict = Depends(get_current_user)
):
    """Apply to an internship (Student only)"""
    
    # Check if user is a student
    if user.get("role") != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can apply to internships"
        )
    
    # Check if internship exists
    internships_collection = await get_internships_collection()
    try:
        internship = await internships_collection.find_one({"_id": ObjectId(application_data.internshipId)})
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
    
    # Check if internship is active
    if internship.get("status") != "Active":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This internship is no longer accepting applications"
        )
    
    # Check if student already applied
    applications_collection = await get_applications_collection()
    existing = await applications_collection.find_one({
        "internshipId": application_data.internshipId,
        "studentId": str(user["_id"])
    })
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already applied to this internship"
        )
    
    # Calculate match score
    student_skills = user.get("skills", [])
    internship_skills = internship.get("skillsRequired", [])
    
    if student_skills and internship_skills:
        matched_skills = [s for s in student_skills if s in internship_skills]
        match_score = (len(matched_skills) / len(internship_skills)) * 100 if internship_skills else 0
        match_score = min(round(match_score), 100)
    else:
        match_score = 0
    
    # Create application with NO status (null or empty)
    application_doc = {
        "internshipId": application_data.internshipId,
        "studentId": str(user["_id"]),
        "companyId": internship["companyId"],
        "studentName": f"{user.get('firstName', '')} {user.get('lastName', '')}".strip(),
        "studentEmail": user.get("email", ""),
        "studentPhone": user.get("phone", ""),
        "studentUniversity": user.get("university", ""),
        "studentDepartment": user.get("department", ""),
        "studentLevel": user.get("level", ""),
        "studentSkills": user.get("skills", []),
        "studentInterests": user.get("interests", []),
        "internshipTitle": internship.get("title", ""),
        "coverLetter": application_data.coverLetter or "",
        "matchScore": match_score,
        "status": None,  # NO status initially
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    
    result = await applications_collection.insert_one(application_doc)
    
    return {
        "message": "Application submitted successfully",
        "application_id": str(result.inserted_id),
        "matchScore": match_score
    }

@router.put("/{application_id}/review")
async def start_review(
    application_id: str,
    user: dict = Depends(get_current_user)
):
    """Company starts reviewing an application - sets status from None to In Review"""
    
    if user.get("role") != "company":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only companies can review applications"
        )
    
    applications_collection = await get_applications_collection()
    
    try:
        application = await applications_collection.find_one({"_id": ObjectId(application_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid application ID"
        )
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Check if company owns this application
    if application.get("companyId") != str(user["_id"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only review applications for your internships"
        )
    
    # Only allow review if status is None or empty
    current_status = application.get("status")
    if current_status and current_status != "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Application already has status: {current_status}. Cannot start review."
        )
    
    # Update status to "In Review"
    await applications_collection.update_one(
        {"_id": ObjectId(application_id)},
        {"$set": {
            "status": "In Review",
            "reviewedAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }}
    )
    
    return {
        "message": "Application is now In Review",
        "status": "In Review"
    }

@router.get("/company")
async def get_company_applications(user: dict = Depends(get_current_user)):
    """Get all applications for internships created by this company"""
    
    if user.get("role") != "company":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only companies can view applications"
        )
    
    # Get all internships for this company
    internships_collection = await get_internships_collection()
    company_internships = await internships_collection.find({"companyId": str(user["_id"])}).to_list(None)
    
    if not company_internships:
        return []
    
    internship_ids = [str(i["_id"]) for i in company_internships]
    
    # Get all applications for these internships
    applications_collection = await get_applications_collection()
    applications = await applications_collection.find({
        "internshipId": {"$in": internship_ids}
    }).to_list(None)
    
    # Format response
    result = []
    for app in applications:
        app["_id"] = str(app["_id"])
        # Get internship details for additional info
        internship = next((i for i in company_internships if str(i["_id"]) == app["internshipId"]), None)
        if internship:
            app["internshipTitle"] = internship.get("title", "")
            app["companyName"] = user.get("companyName", "")
        result.append(app)
    
    return result

@router.get("/student")
async def get_student_applications(user: dict = Depends(get_current_user)):
    """Get all applications submitted by the current student"""
    
    if user.get("role") != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can view their applications"
        )
    
    applications_collection = await get_applications_collection()
    users_collection = await get_users_collection()
    internships_collection = await get_internships_collection()
    
    applications = await applications_collection.find({
        "studentId": str(user["_id"])
    }).to_list(None)
    
    # Format response with company names
    result = []
    for app in applications:
        app["_id"] = str(app["_id"])
        
        # Get internship details to get companyId
        internship = await internships_collection.find_one({"_id": ObjectId(app["internshipId"])})
        if internship:
            app["internshipTitle"] = internship.get("title", "")
            # Get company details
            company = await users_collection.find_one({"_id": ObjectId(internship["companyId"])})
            if company:
                app["companyName"] = company.get("companyName", "Unknown Company")
            else:
                app["companyName"] = "Unknown Company"
        else:
            app["internshipTitle"] = app.get("internshipTitle", "Unknown Position")
            app["companyName"] = "Unknown Company"
        
        # Ensure all required fields exist
        app["status"] = app.get("status", "In Review")
        
        result.append(app)
    
    return result

@router.get("/{application_id}")
async def get_application(
    application_id: str,
    user: dict = Depends(get_current_user)
):
    """Get a specific application by ID"""
    
    applications_collection = await get_applications_collection()
    
    try:
        application = await applications_collection.find_one({"_id": ObjectId(application_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid application ID"
        )
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Check authorization
    if user.get("role") == "student" and application["studentId"] != str(user["_id"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view your own applications"
        )
    
    if user.get("role") == "company" and application["companyId"] != str(user["_id"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view applications for your internships"
        )
    
    # Get additional details
    if user.get("role") == "company":
        # Get student details
        users_collection = await get_users_collection()
        student = await users_collection.find_one({"_id": ObjectId(application["studentId"])})
        if student:
            application["studentProfile"] = {
                "firstName": student.get("firstName", ""),
                "lastName": student.get("lastName", ""),
                "email": student.get("email", ""),
                "phone": student.get("phone", ""),
                "university": student.get("university", ""),
                "department": student.get("department", ""),
                "level": student.get("level", ""),
                "skills": student.get("skills", []),
                "interests": student.get("interests", []),
                "careerAspiration": student.get("careerAspiration", "")
            }
    
    application["_id"] = str(application["_id"])
    return application

@router.put("/{application_id}/status")
async def update_application_status(
    application_id: str,
    status_data: dict,
    user: dict = Depends(get_current_user)
):
    """Update application status (Company only)"""
    
    if user.get("role") != "company":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only companies can update application status"
        )
    
    applications_collection = await get_applications_collection()
    
    try:
        application = await applications_collection.find_one({"_id": ObjectId(application_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid application ID"
        )
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Check if company owns this application
    if application["companyId"] != str(user["_id"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update applications for your internships"
        )
    
    new_status = status_data.get("status")
    if not new_status:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status is required"
        )
    
    valid_statuses = ["In Review", "Accepted", "Rejected"]
    if new_status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )
    
    note = status_data.get("note", "")
    
    update_data = {
        "status": new_status,
        "updatedAt": datetime.utcnow()
    }
    
    if note:
        update_data["note"] = note
    
    await applications_collection.update_one(
        {"_id": ObjectId(application_id)},
        {"$set": update_data}
    )
    
    return {
        "message": f"Application status updated to {new_status}",
        "status": new_status,
        "note": note
    }


# ============ GET APPLICATIONS BY INTERNSHIP ============
@router.get("/internship/{internship_id}")
async def get_applications_by_internship(
    internship_id: str,
    user: dict = Depends(get_current_user)
):
    """Get all applications for a specific internship"""
    
    if user.get("role") != "company":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only companies can view applications"
        )
    
    applications_collection = await get_applications_collection()
    users_collection = await get_users_collection()
    
    # Check if the internship belongs to this company
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
    
    if internship["companyId"] != str(user["_id"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view applications for your own internships"
        )
    
    # Get applications for this internship
    applications = await applications_collection.find({
        "internshipId": internship_id
    }).to_list(None)
    
    # Get student details for each application
    result = []
    for app in applications:
        # Get student details
        student = await users_collection.find_one({"_id": ObjectId(app["studentId"])})
        result.append({
            "_id": str(app["_id"]),
            "studentName": app.get("studentName", ""),
            "studentEmail": app.get("studentEmail", ""),
            "status": app.get("status", ""),
            "createdAt": app.get("createdAt"),
            "matchScore": app.get("matchScore", 0),
            "student": {
                "firstName": student.get("firstName", "") if student else "",
                "lastName": student.get("lastName", "") if student else "",
                "email": student.get("email", "") if student else "",
                "phone": student.get("phone", "") if student else "",
                "university": student.get("university", "") if student else "",
                "department": student.get("department", "") if student else "",
                "level": student.get("level", "") if student else "",
                "skills": student.get("skills", []) if student else [],
                "interests": student.get("interests", []) if student else []
            } if student else None
        })
    
    return result


# ============ GET APPLICATION WITH FULL DETAILS ============
@router.get("/{application_id}/full")
async def get_application_with_details(
    application_id: str,
    user: dict = Depends(get_current_user)
):
    """Get a specific application with full internship and company details for students"""
    
    applications_collection = await get_applications_collection()
    
    try:
        application = await applications_collection.find_one({"_id": ObjectId(application_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid application ID"
        )
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Check authorization - student can view their own applications
    if user.get("role") == "student" and application["studentId"] != str(user["_id"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view your own applications"
        )
    
    # Company can view applications for their internships
    if user.get("role") == "company" and application["companyId"] != str(user["_id"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view applications for your internships"
        )
    
    # Get internship details
    internships_collection = await get_internships_collection()
    internship = None
    try:
        internship = await internships_collection.find_one({"_id": ObjectId(application["internshipId"])})
    except:
        pass
    
    # Get company details
    users_collection = await get_users_collection()
    company = None
    if internship and internship.get("companyId"):
        try:
            company = await users_collection.find_one({"_id": ObjectId(internship["companyId"])})
        except:
            pass
    
    # Build response
    response = {
        "application": {
            "_id": str(application["_id"]),
            "internshipId": application.get("internshipId", ""),
            "studentId": application.get("studentId", ""),
            "companyId": application.get("companyId", ""),
            "studentName": application.get("studentName", ""),
            "studentEmail": application.get("studentEmail", ""),
            "studentPhone": application.get("studentPhone", ""),
            "studentUniversity": application.get("studentUniversity", ""),
            "studentDepartment": application.get("studentDepartment", ""),
            "studentLevel": application.get("studentLevel", ""),
            "studentSkills": application.get("studentSkills", []),
            "studentInterests": application.get("studentInterests", []),
            "internshipTitle": application.get("internshipTitle", ""),
            "coverLetter": application.get("coverLetter", ""),
            "matchScore": application.get("matchScore", 0),
            "status": application.get("status", "In Review"),
            "note": application.get("note", ""),
            "createdAt": application.get("createdAt"),
            "updatedAt": application.get("updatedAt")
        },
        "internship": None,
        "company": None
    }
    
    # Add internship data if available
    if internship:
        response["internship"] = {
            "_id": str(internship["_id"]),
            "companyId": str(internship.get("companyId", "")),
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
            "status": internship.get("status", "")
        }
    
    # Add company data if available
    if company:
        response["company"] = {
            "_id": str(company["_id"]),
            "companyName": company.get("companyName", ""),
            "email": company.get("email", ""),
            "phone": company.get("phone", ""),
            "industry": company.get("industry", ""),
            "state": company.get("state", ""),
            "city": company.get("city", ""),
            "address": company.get("address", ""),
            "website": company.get("website", ""),
            "aboutCompany": company.get("aboutCompany", ""),
            "profilePicture": company.get("profilePicture", "")
        }
    else:
        # Fallback: use company data from application if available
        response["company"] = {
            "_id": application.get("companyId", ""),
            "companyName": application.get("companyName", "Unknown Company"),
            "email": application.get("companyEmail", ""),
            "phone": application.get("companyPhone", ""),
            "industry": "",
            "state": "",
            "city": "",
            "address": "",
            "website": "",
            "aboutCompany": "",
            "profilePicture": ""
        }
    
    return response