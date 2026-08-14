from fastapi import APIRouter, HTTPException, status, Depends, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta
from bson import ObjectId
from typing import Optional, List
from app.core.database import get_users_collection, get_internships_collection, get_applications_collection
from app.core.security import decode_access_token

router = APIRouter(prefix="/api/admin", tags=["Admin"])
security = HTTPBearer()

# ============ Helper Functions ============

async def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Verify the user is an admin"""
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    users_collection = await get_users_collection()
    user = await users_collection.find_one({"_id": ObjectId(payload["sub"])})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    return user


def format_user(user):
    """Format user document for API response"""
    user.pop("hashedPassword", None)
    user["_id"] = str(user["_id"])
    return user


def format_internship(internship):
    """Format internship document for API response"""
    internship["_id"] = str(internship["_id"])
    return internship


def format_application(app):
    """Format application document for API response"""
    app["_id"] = str(app["_id"])
    return app


# ============ DASHBOARD STATS ============

@router.get("/stats")
async def get_dashboard_stats(admin: dict = Depends(get_current_admin)):
    """Get dashboard statistics"""
    
    users_collection = await get_users_collection()
    internships_collection = await get_internships_collection()
    applications_collection = await get_applications_collection()
    
    # Count users
    total_students = await users_collection.count_documents({"role": "student"})
    total_companies = await users_collection.count_documents({"role": "company"})
    
    # Count internships
    total_internships = await internships_collection.count_documents({})
    active_internships = await internships_collection.count_documents({"status": "Active"})
    
    # Count applications
    total_applications = await applications_collection.count_documents({})
    accepted = await applications_collection.count_documents({"status": "Accepted"})
    rejected = await applications_collection.count_documents({"status": "Rejected"})
    pending = await applications_collection.count_documents({"status": {"$in": [None, "", "In Review"]}})
    
    return {
        "totalStudents": total_students,
        "totalCompanies": total_companies,
        "totalInternships": total_internships,
        "activeInternships": active_internships,
        "totalApplications": total_applications,
        "accepted": accepted,
        "rejected": rejected,
        "pending": pending,
    }


@router.get("/activities")
async def get_recent_activities(
    limit: int = 10,
    admin: dict = Depends(get_current_admin)
):
    users_collection = await get_users_collection()
    internships_collection = await get_internships_collection()
    applications_collection = await get_applications_collection()

    activities = []

    # 1. Student registrations (latest 5)
    students = await users_collection.find({"role": "student"}).sort("createdAt", -1).limit(5).to_list(None)
    for student in students:
        name = f"{student.get('firstName', '')} {student.get('lastName', '')}".strip() or "Student"
        activities.append({
            "action": "New student registered",
            "user": name,
            "time": format_time_ago(student.get("createdAt")),
            "icon": "UserPlus",
            "createdAt": student.get("createdAt")
        })

    # 2. Company registrations (latest 5)
    companies = await users_collection.find({"role": "company"}).sort("createdAt", -1).limit(5).to_list(None)
    for company in companies:
        name = company.get("companyName", "Company")
        activities.append({
            "action": "New company registered",
            "user": name,
            "time": format_time_ago(company.get("createdAt")),
            "icon": "Building2",
            "createdAt": company.get("createdAt")
        })

    # 3. Internship postings (latest 5)
    internships = await internships_collection.find({}).sort("createdAt", -1).limit(5).to_list(None)
    for internship in internships:
        company = await users_collection.find_one({"_id": ObjectId(internship["companyId"])})
        company_name = company.get("companyName", "Company") if company else "Company"
        activities.append({
            "action": "New internship posted",
            "user": company_name,
            "time": format_time_ago(internship.get("createdAt")),
            "icon": "Briefcase",
            "createdAt": internship.get("createdAt")
        })

    # 4. Applications (latest 5)
    applications = await applications_collection.find({}).sort("createdAt", -1).limit(5).to_list(None)
    for app in applications:
        student = await users_collection.find_one({"_id": ObjectId(app["studentId"])})
        student_name = f"{student.get('firstName', '')} {student.get('lastName', '')}".strip() if student else "Student"
        internship = await internships_collection.find_one({"_id": ObjectId(app["internshipId"])})
        internship_title = internship.get("title", "internship") if internship else "internship"
        activities.append({
            "action": f"Application submitted for {internship_title}",
            "user": student_name,
            "time": format_time_ago(app.get("createdAt")),
            "icon": "FileCheck",
            "createdAt": app.get("createdAt")
        })

    # 5. Status changes (Accepted/Rejected) – latest 5
    status_changes = await applications_collection.find(
        {"status": {"$in": ["Accepted", "Rejected"]}}
    ).sort("updatedAt", -1).limit(5).to_list(None)
    for app in status_changes:
        student = await users_collection.find_one({"_id": ObjectId(app["studentId"])})
        student_name = f"{student.get('firstName', '')} {student.get('lastName', '')}".strip() if student else "Student"
        internship = await internships_collection.find_one({"_id": ObjectId(app["internshipId"])})
        internship_title = internship.get("title", "internship") if internship else "internship"
        action = f"Application accepted for {internship_title}" if app["status"] == "Accepted" else f"Application rejected for {internship_title}"
        icon = "CheckCircle" if app["status"] == "Accepted" else "XCircle"
        activities.append({
            "action": action,
            "user": student_name,
            "time": format_time_ago(app.get("updatedAt")),
            "icon": icon,
            "createdAt": app.get("updatedAt")
        })

    # Sort by timestamp (most recent first)
    activities.sort(key=lambda x: x.get("createdAt"), reverse=True)

    # Remove internal createdAt field
    for act in activities:
        act.pop("createdAt", None)

    return activities[:limit]


def format_time_ago(dt):
    if not dt:
        return "Recently"
    now = datetime.utcnow()
    diff = now - dt
    if diff.total_seconds() < 60:
        return "Just now"
    elif diff.total_seconds() < 3600:
        minutes = int(diff.total_seconds() / 60)
        return f"{minutes} min{'s' if minutes > 1 else ''} ago"
    elif diff.total_seconds() < 86400:
        hours = int(diff.total_seconds() / 3600)
        return f"{hours} hour{'s' if hours > 1 else ''} ago"
    elif diff.total_seconds() < 604800:
        days = int(diff.total_seconds() / 86400)
        return f"{days} day{'s' if days > 1 else ''} ago"
    else:
        weeks = int(diff.total_seconds() / 604800)
        return f"{weeks} week{'s' if weeks > 1 else ''} ago"


# ============ STUDENTS ============

@router.get("/students")
async def get_students(
    search: Optional[str] = Query(None, description="Search by name, email, or matric number"),
    department: Optional[str] = Query(None, description="Filter by department"),
    level: Optional[str] = Query(None, description="Filter by level"),
    status: Optional[str] = Query(None, description="Filter by status (Active/Suspended)"),
    skip: int = Query(0, ge=0, description="Pagination skip"),
    limit: int = Query(10, ge=1, le=100, description="Pagination limit"),
    admin: dict = Depends(get_current_admin)
):
    """Get all students with filters and pagination"""
    
    users_collection = await get_users_collection()
    applications_collection = await get_applications_collection()
    
    # Build query
    query = {"role": "student"}
    
    if search:
        query["$or"] = [
            {"firstName": {"$regex": search, "$options": "i"}},
            {"lastName": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
            {"matricNumber": {"$regex": search, "$options": "i"}},
        ]
    
    if department:
        query["department"] = department
    
    if level:
        query["level"] = level
    
    if status:
        query["isActive"] = status == "Active"
    
    # Get students
    total = await users_collection.count_documents(query)
    students = await users_collection.find(query).sort("createdAt", -1).skip(skip).limit(limit).to_list(None)
    
    result = []
    for student in students:
        # Count applications for this student
        app_count = await applications_collection.count_documents({"studentId": str(student["_id"])})
        
        student_formatted = {
            "_id": str(student["_id"]),
            "firstName": student.get("firstName", ""),
            "lastName": student.get("lastName", ""),
            "email": student.get("email", ""),
            "phone": student.get("phone", ""),
            "department": student.get("department", ""),
            "level": student.get("level", ""),
            "matricNumber": student.get("matricNumber", ""),
            "skills": student.get("skills", []),
            "interests": student.get("interests", []),
            "careerAspiration": student.get("careerAspiration", ""),
            "isActive": student.get("isActive", True),
            "profilePicture": student.get("profilePicture", ""),
            "createdAt": student.get("createdAt"),
            "applications": app_count,
        }
        result.append(student_formatted)
    
    return {
        "data": result,
        "total": total,
        "skip": skip,
        "limit": limit
    }


@router.get("/students/{student_id}")
async def get_student_detail(
    student_id: str,
    admin: dict = Depends(get_current_admin)
):
    """Get detailed student profile"""
    
    users_collection = await get_users_collection()
    applications_collection = await get_applications_collection()
    internships_collection = await get_internships_collection()
    
    try:
        student = await users_collection.find_one({"_id": ObjectId(student_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid student ID")
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    if student.get("role") != "student":
        raise HTTPException(status_code=400, detail="User is not a student")
    
    # Get applications
    applications = await applications_collection.find({"studentId": student_id}).to_list(None)
    application_details = []
    
    for app in applications:
        internship = await internships_collection.find_one({"_id": ObjectId(app["internshipId"])})
        company = await users_collection.find_one({"_id": ObjectId(app["companyId"])})
        
        application_details.append({
            "_id": str(app["_id"]),
            "internshipTitle": internship.get("title", "") if internship else "",
            "companyName": company.get("companyName", "") if company else "",
            "status": app.get("status", ""),
            "matchScore": app.get("matchScore", 0),
            "createdAt": app.get("createdAt"),
        })
    
    return {
        "_id": str(student["_id"]),
        "firstName": student.get("firstName", ""),
        "lastName": student.get("lastName", ""),
        "email": student.get("email", ""),
        "phone": student.get("phone", ""),
        "university": student.get("university", ""),
        "faculty": student.get("faculty", ""),
        "department": student.get("department", ""),
        "matricNumber": student.get("matricNumber", ""),
        "level": student.get("level", ""),
        "skills": student.get("skills", []),
        "interests": student.get("interests", []),
        "careerAspiration": student.get("careerAspiration", ""),
        "profilePicture": student.get("profilePicture", ""),
        "isActive": student.get("isActive", True),
        "isVerified": student.get("isVerified", False),
        "createdAt": student.get("createdAt"),
        "applications": application_details,
    }


@router.put("/students/{student_id}/status")
async def update_student_status(
    student_id: str,
    status_data: dict,
    admin: dict = Depends(get_current_admin)
):
    """Activate or suspend a student"""
    
    users_collection = await get_users_collection()
    
    new_status = status_data.get("isActive")
    if new_status is None:
        raise HTTPException(status_code=400, detail="isActive field is required")
    
    try:
        student = await users_collection.find_one({"_id": ObjectId(student_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid student ID")
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    if student.get("role") != "student":
        raise HTTPException(status_code=400, detail="User is not a student")
    
    await users_collection.update_one(
        {"_id": ObjectId(student_id)},
        {"$set": {"isActive": new_status, "updatedAt": datetime.utcnow()}}
    )
    
    return {
        "message": f"Student {'activated' if new_status else 'suspended'} successfully",
        "isActive": new_status
    }


@router.delete("/students/{student_id}")
async def delete_student(
    student_id: str,
    admin: dict = Depends(get_current_admin)
):
    """Delete a student account and all associated data"""
    
    users_collection = await get_users_collection()
    applications_collection = await get_applications_collection()
    
    try:
        student = await users_collection.find_one({"_id": ObjectId(student_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid student ID")
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    if student.get("role") != "student":
        raise HTTPException(status_code=400, detail="User is not a student")
    
    # Delete all applications
    await applications_collection.delete_many({"studentId": student_id})
    
    # Delete the student
    await users_collection.delete_one({"_id": ObjectId(student_id)})
    
    return {"message": "Student deleted successfully"}


# ============ COMPANIES ============

@router.get("/companies")
async def get_companies(
    search: Optional[str] = Query(None),
    industry: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    admin: dict = Depends(get_current_admin)
):
    users_collection = await get_users_collection()
    internships_collection = await get_internships_collection()
    applications_collection = await get_applications_collection()

    query = {"role": "company"}
    if search:
        query["$or"] = [
            {"companyName": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
        ]
    if industry:
        query["industry"] = industry

    total = await users_collection.count_documents(query)
    companies = await users_collection.find(query).sort("createdAt", -1).skip(skip).limit(limit).to_list(None)

    result = []
    for company in companies:
        company_id = str(company["_id"])
        # Count internships for this company
        internship_count = await internships_collection.count_documents({"companyId": company_id})
        # Count accepted students (applications with status "Accepted")
        accepted_count = await applications_collection.count_documents({
            "companyId": company_id,
            "status": "Accepted"
        })

        result.append({
            "_id": company_id,
            "companyName": company.get("companyName", ""),
            "email": company.get("email", ""),
            "phone": company.get("phone", ""),
            "industry": company.get("industry", ""),
            "state": company.get("state", ""),
            "city": company.get("city", ""),
            "address": company.get("address", ""),
            "website": company.get("website", ""),
            "isActive": company.get("isActive", True),
            "isVerified": company.get("isVerified", False),
            "createdAt": company.get("createdAt"),
            "internships": internship_count,          # ✅ Correct count
            "acceptedStudents": accepted_count,      # ✅ Correct count
        })

    return {
        "data": result,
        "total": total,
        "skip": skip,
        "limit": limit
    }


@router.get("/companies/{company_id}")
async def get_company_detail(
    company_id: str,
    admin: dict = Depends(get_current_admin)
):
    """Get detailed company profile"""
    
    users_collection = await get_users_collection()
    internships_collection = await get_internships_collection()
    applications_collection = await get_applications_collection()
    
    try:
        company = await users_collection.find_one({"_id": ObjectId(company_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid company ID")
    
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    if company.get("role") != "company":
        raise HTTPException(status_code=400, detail="User is not a company")
    
    # Get internships
    internships = await internships_collection.find({"companyId": company_id}).to_list(None)
    internship_list = []
    for internship in internships:
        # Count applications
        app_count = await applications_collection.count_documents({"internshipId": str(internship["_id"])})
        internship_list.append({
            "_id": str(internship["_id"]),
            "title": internship.get("title", ""),
            "status": internship.get("status", ""),
            "applicants": app_count,
            "createdAt": internship.get("createdAt"),
        })
    
    return {
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
        "isActive": company.get("isActive", True),
        "isVerified": company.get("isVerified", False),
        "createdAt": company.get("createdAt"),
        "internships": internship_list,
    }


@router.delete("/companies/{company_id}")
async def delete_company(
    company_id: str,
    admin: dict = Depends(get_current_admin)
):
    """Delete a company and all associated data"""
    
    users_collection = await get_users_collection()
    internships_collection = await get_internships_collection()
    applications_collection = await get_applications_collection()
    
    try:
        company = await users_collection.find_one({"_id": ObjectId(company_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid company ID")
    
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    if company.get("role") != "company":
        raise HTTPException(status_code=400, detail="User is not a company")
    
    # Get all internships for this company
    internships = await internships_collection.find({"companyId": company_id}).to_list(None)
    
    # Delete all applications for these internships
    for internship in internships:
        await applications_collection.delete_many({"internshipId": str(internship["_id"])})
    
    # Delete all internships
    await internships_collection.delete_many({"companyId": company_id})
    
    # Delete the company
    await users_collection.delete_one({"_id": ObjectId(company_id)})
    
    return {"message": "Company deleted successfully"}


# ============ INTERNSHIPS ============

@router.get("/internships")
async def get_admin_internships(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    admin: dict = Depends(get_current_admin)
):
    internships_collection = await get_internships_collection()
    applications_collection = await get_applications_collection()
    users_collection = await get_users_collection()

    # Build query
    query = {}
    if status:
        query["status"] = status
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
        ]

    # ✅ Get total count BEFORE pagination
    total = await internships_collection.count_documents(query)

    # Fetch paginated internships
    internships = await internships_collection.find(query).sort("createdAt", -1).skip(skip).limit(limit).to_list(None)

    result = []
    for internship in internships:
        company = await users_collection.find_one({"_id": ObjectId(internship["companyId"])})
        company_name = company.get("companyName", "Unknown Company") if company else "Unknown Company"
        app_count = await applications_collection.count_documents({"internshipId": str(internship["_id"])})
        result.append({
            "_id": str(internship["_id"]),
            "title": internship.get("title", ""),
            "companyName": company_name,
            "location": internship.get("location", ""),
            "type": internship.get("type", ""),
            "duration": internship.get("duration", ""),
            "status": internship.get("status", ""),
            "spotsAvailable": internship.get("spotsAvailable", 0),
            "skillsRequired": internship.get("skillsRequired", []),
            "benefits": internship.get("benefits", []),
            "aboutRole": internship.get("aboutRole", ""),
            "aboutCompany": internship.get("aboutCompany", ""),
            "applicationDeadline": internship.get("applicationDeadline", ""),
            "applicants": app_count,
            "createdAt": internship.get("createdAt"),
            "updatedAt": internship.get("updatedAt"),
        })

    return {
        "data": result,
        "total": total,  # ✅ Now the true total count
        "skip": skip,
        "limit": limit
    }


@router.get("/internships/{internship_id}")
async def get_admin_internship_detail(
    internship_id: str,
    admin: dict = Depends(get_current_admin)
):
    """Get detailed internship information"""
    
    internships_collection = await get_internships_collection()
    applications_collection = await get_applications_collection()
    users_collection = await get_users_collection()
    
    try:
        internship = await internships_collection.find_one({"_id": ObjectId(internship_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid internship ID")
    
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    # Get company
    company = await users_collection.find_one({"_id": ObjectId(internship["companyId"])})
    
    # Get applications
    applications = await applications_collection.find({"internshipId": internship_id}).to_list(None)
    application_list = []
    for app in applications:
        student = await users_collection.find_one({"_id": ObjectId(app["studentId"])})
        application_list.append({
            "_id": str(app["_id"]),
            "studentName": f"{student.get('firstName', '')} {student.get('lastName', '')}".strip() if student else "Unknown",
            "studentEmail": app.get("studentEmail", ""),
            "status": app.get("status", ""),
            "matchScore": app.get("matchScore", 0),
            "createdAt": app.get("createdAt"),
        })
    
    return {
        "_id": str(internship["_id"]),
        "title": internship.get("title", ""),
        "companyId": internship.get("companyId", ""),
        "companyName": company.get("companyName", "Unknown Company") if company else "Unknown Company",
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
        "status": internship.get("status", ""),
        "createdAt": internship.get("createdAt"),
        "applications": application_list,
    }


@router.delete("/internships/{internship_id}")
async def delete_admin_internship(
    internship_id: str,
    admin: dict = Depends(get_current_admin)
):
    """Delete an internship and all its applications"""
    
    internships_collection = await get_internships_collection()
    applications_collection = await get_applications_collection()
    
    try:
        internship = await internships_collection.find_one({"_id": ObjectId(internship_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid internship ID")
    
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    # Delete all applications
    await applications_collection.delete_many({"internshipId": internship_id})
    
    # Delete the internship
    await internships_collection.delete_one({"_id": ObjectId(internship_id)})
    
    return {"message": "Internship deleted successfully"}


@router.put("/internships/{internship_id}/status")
async def update_admin_internship_status(
    internship_id: str,
    status_data: dict,
    admin: dict = Depends(get_current_admin)
):
    """Update internship status (Active/Closed/Draft)"""
    
    internships_collection = await get_internships_collection()
    
    new_status = status_data.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="Status is required")
    
    valid_statuses = ["Active", "Closed", "Draft", "Archived"]
    if new_status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}")
    
    try:
        internship = await internships_collection.find_one({"_id": ObjectId(internship_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid internship ID")
    
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    await internships_collection.update_one(
        {"_id": ObjectId(internship_id)},
        {"$set": {"status": new_status, "updatedAt": datetime.utcnow()}}
    )
    
    return {"message": f"Internship status updated to {new_status}"}


# ============ APPLICATIONS ============

@router.get("/applications")
async def get_admin_applications(
    search: Optional[str] = Query(None, description="Search by student or company"),
    status: Optional[str] = Query(None, description="Filter by status (In Review/Accepted/Rejected)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    admin: dict = Depends(get_current_admin)
):
    """Get all applications with filters and pagination"""
    
    applications_collection = await get_applications_collection()
    users_collection = await get_users_collection()
    internships_collection = await get_internships_collection()
    
    query = {}
    
    if status:
        query["status"] = status
    
    # Get applications
    total = await applications_collection.count_documents(query)
    applications = await applications_collection.find(query).sort("createdAt", -1).skip(skip).limit(limit).to_list(None)
    
    result = []
    for app in applications:
        # Get student
        student = await users_collection.find_one({"_id": ObjectId(app["studentId"])})
        student_name = f"{student.get('firstName', '')} {student.get('lastName', '')}".strip() if student else "Unknown Student"
        
        # Get internship
        internship = await internships_collection.find_one({"_id": ObjectId(app["internshipId"])})
        internship_title = internship.get("title", "") if internship else ""
        
        # Get company
        company = await users_collection.find_one({"_id": ObjectId(app["companyId"])})
        company_name = company.get("companyName", "Unknown Company") if company else "Unknown Company"
        
        app_formatted = {
            "_id": str(app["_id"]),
            "studentId": app.get("studentId", ""),
            "studentName": student_name,
            "companyId": app.get("companyId", ""),
            "companyName": company_name,
            "internshipId": app.get("internshipId", ""),
            "internshipTitle": internship_title,
            "status": app.get("status", ""),
            "matchScore": app.get("matchScore", 0),
            "createdAt": app.get("createdAt"),
        }
        
        # Apply search filter
        if search:
            if search.lower() not in student_name.lower() and search.lower() not in company_name.lower() and search.lower() not in internship_title.lower():
                continue
        
        result.append(app_formatted)
    
    return {
        "data": result,
        "total": len(result),
        "skip": skip,
        "limit": limit
    }


@router.get("/applications/{application_id}")
async def get_admin_application_detail(
    application_id: str,
    admin: dict = Depends(get_current_admin)
):
    """Get detailed application information"""
    
    applications_collection = await get_applications_collection()
    users_collection = await get_users_collection()
    internships_collection = await get_internships_collection()
    
    try:
        app = await applications_collection.find_one({"_id": ObjectId(application_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid application ID")
    
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Get student
    student = await users_collection.find_one({"_id": ObjectId(app["studentId"])})
    
    # Get internship
    internship = await internships_collection.find_one({"_id": ObjectId(app["internshipId"])})
    
    # Get company
    company = await users_collection.find_one({"_id": ObjectId(app["companyId"])})
    
    return {
        "_id": str(app["_id"]),
        "student": {
            "_id": str(student["_id"]) if student else "",
            "firstName": student.get("firstName", "") if student else "",
            "lastName": student.get("lastName", "") if student else "",
            "email": student.get("email", "") if student else "",
            "phone": student.get("phone", "") if student else "",
            "university": student.get("university", "") if student else "",
            "department": student.get("department", "") if student else "",
            "level": student.get("level", "") if student else "",
            "skills": student.get("skills", []) if student else [],
            "interests": student.get("interests", []) if student else [],
            "careerAspiration": student.get("careerAspiration", "") if student else "",
            "profilePicture": student.get("profilePicture", "") if student else "",
        } if student else None,
        "internship": {
            "_id": str(internship["_id"]) if internship else "",
            "title": internship.get("title", "") if internship else "",
            "location": internship.get("location", "") if internship else "",
            "type": internship.get("type", "") if internship else "",
            "duration": internship.get("duration", "") if internship else "",
            "skillsRequired": internship.get("skillsRequired", []) if internship else [],
            "benefits": internship.get("benefits", []) if internship else [],
            "spotsAvailable": internship.get("spotsAvailable", 0) if internship else 0,
        } if internship else None,
        "company": {
            "_id": str(company["_id"]) if company else "",
            "companyName": company.get("companyName", "") if company else "",
            "email": company.get("email", "") if company else "",
            "phone": company.get("phone", "") if company else "",
            "industry": company.get("industry", "") if company else "",
            "state": company.get("state", "") if company else "",
            "city": company.get("city", "") if company else "",
            "address": company.get("address", "") if company else "",
            "website": company.get("website", "") if company else "",
        } if company else None,
        "coverLetter": app.get("coverLetter", ""),
        "matchScore": app.get("matchScore", 0),
        "status": app.get("status", ""),
        "note": app.get("note", ""),
        "createdAt": app.get("createdAt"),
        "updatedAt": app.get("updatedAt"),
    }

@router.get("/companies/{company_id}/internships")
async def get_company_internships(
    company_id: str,
    admin: dict = Depends(get_current_admin)
):
    """Get all internships for a specific company (admin view)"""
    
    internships_collection = await get_internships_collection()
    
    try:
        internships = await internships_collection.find({"companyId": company_id}).to_list(None)
    except:
        raise HTTPException(status_code=400, detail="Invalid company ID")
    
    if not internships:
        return []
    
    result = []
    applications_collection = await get_applications_collection()
    for internship in internships:
        app_count = await applications_collection.count_documents({"internshipId": str(internship["_id"])})
        result.append({
            "_id": str(internship["_id"]),
            "title": internship.get("title", ""),
            "location": internship.get("location", ""),
            "type": internship.get("type", ""),
            "duration": internship.get("duration", ""),
            "status": internship.get("status", ""),
            "spotsAvailable": internship.get("spotsAvailable", 0),
            "applicants": app_count,
            "createdAt": internship.get("createdAt"),
        })
    
    return result


@router.get("/companies/{company_id}/accepted")
async def get_company_accepted_students(
    company_id: str,
    admin: dict = Depends(get_current_admin)
):
    """Get all accepted students for a specific company (admin view)"""
    
    applications_collection = await get_applications_collection()
    users_collection = await get_users_collection()
    internships_collection = await get_internships_collection()
    
    applications = await applications_collection.find({
        "companyId": company_id,
        "status": "Accepted"
    }).to_list(None)
    
    result = []
    for app in applications:
        student = await users_collection.find_one({"_id": ObjectId(app["studentId"])})
        internship = await internships_collection.find_one({"_id": ObjectId(app["internshipId"])})
        result.append({
            "_id": str(app["_id"]),
            "student": {
                "firstName": student.get("firstName", "") if student else "",
                "lastName": student.get("lastName", "") if student else "",
                "email": student.get("email", "") if student else "",
                "phone": student.get("phone", "") if student else "",
                "university": student.get("university", "") if student else "",
                "department": student.get("department", "") if student else "",
                "level": student.get("level", "") if student else "",
            } if student else None,
            "internship": {
                "title": internship.get("title", "") if internship else "",
                "location": internship.get("location", "") if internship else "",
                "type": internship.get("type", "") if internship else "",
                "duration": internship.get("duration", "") if internship else "",
            } if internship else None,
            "matchScore": app.get("matchScore", 0),
            "createdAt": app.get("createdAt"),
        })
    
    return result

@router.put("/companies/{company_id}/status")
async def update_company_status(
    company_id: str,
    status_data: dict,
    admin: dict = Depends(get_current_admin)
):
    users_collection = await get_users_collection()
    is_active = status_data.get("isActive")
    if is_active is None:
        raise HTTPException(400, "isActive field required")

    try:
        company = await users_collection.find_one({"_id": ObjectId(company_id)})
    except:
        raise HTTPException(400, "Invalid company ID")
    if not company:
        raise HTTPException(404, "Company not found")

    await users_collection.update_one(
        {"_id": ObjectId(company_id)},
        {"$set": {"isActive": is_active, "updatedAt": datetime.utcnow()}}
    )
    return {"message": f"Company {'activated' if is_active else 'suspended'}"}

@router.get("/companies/{company_id}/internships")
async def get_admin_company_internships(
    company_id: str,
    admin: dict = Depends(get_current_admin)
):
    """Get all internships (including Closed, Draft, Archived) for a specific company (admin only)."""
    internships_collection = await get_internships_collection()
    applications_collection = await get_applications_collection()

    try:
        internships = await internships_collection.find({"companyId": company_id}).to_list(None)
    except:
        raise HTTPException(status_code=400, detail="Invalid company ID")

    result = []
    for internship in internships:
        app_count = await applications_collection.count_documents({
            "internshipId": str(internship["_id"])
        })
        result.append({
            "_id": str(internship["_id"]),
            "title": internship.get("title", ""),
            "location": internship.get("location", ""),
            "type": internship.get("type", ""),
            "duration": internship.get("duration", ""),
            "status": internship.get("status", ""),  # includes all statuses
            "applicants": app_count,
            "createdAt": internship.get("createdAt"),
            "updatedAt": internship.get("updatedAt"),
        })

    return result