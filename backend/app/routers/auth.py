from fastapi import APIRouter, HTTPException, status, BackgroundTasks
from app.schemas.auth import (
    LoginRequest, LoginResponse, OTPRequest, OTPResponse,
    ResendOTPRequest, RegisterResponse, ErrorResponse
)
from app.models.user import StudentCreate, CompanyCreate
from app.services.user_service import UserService
from app.services.otp_service import OTPService
from app.core.security import create_access_token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register/student", response_model=RegisterResponse)
async def register_student(student_data: StudentCreate, background_tasks: BackgroundTasks):
    """
    Register a new student account.
    Sends OTP to email for verification.
    """
    user_id, error = await UserService.create_student(student_data)
    if error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error)
    
    # Generate and send OTP
    otp = OTPService.generate_otp()
    await OTPService.save_otp(student_data.email, otp)
    
    # Send OTP email in background
    background_tasks.add_task(OTPService.send_otp_email, student_data.email, otp)
    
    return RegisterResponse(
        message="Student registered successfully. Please verify your email.",
        email=student_data.email,
        role="student"
    )

@router.post("/register/company", response_model=RegisterResponse)
async def register_company(company_data: CompanyCreate, background_tasks: BackgroundTasks):
    """
    Register a new company account.
    Sends OTP to email for verification.
    """
    user_id, error = await UserService.create_company(company_data)
    if error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error)
    
    # Generate and send OTP
    otp = OTPService.generate_otp()
    await OTPService.save_otp(company_data.email, otp)
    
    # Send OTP email in background
    background_tasks.add_task(OTPService.send_otp_email, company_data.email, otp)
    
    return RegisterResponse(
        message="Company registered successfully. Please verify your email.",
        email=company_data.email,
        role="company"
    )

@router.post("/login", response_model=LoginResponse)
async def login(login_data: LoginRequest):
    """
    Login user. Returns JWT token with role information and user details.
    """
    user, error = await UserService.authenticate_user(login_data)
    if error:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=error)
    
    if not user.get("isVerified", False):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Email not verified. Please verify your email.")
    
    # Create JWT token
    token_data = {
        "sub": str(user["_id"]),
        "email": user["email"],
        "role": user["role"]
    }
    access_token = create_access_token(token_data)
    
    # Get user details
    first_name = user.get("firstName", "") or user.get("first_name", "")
    last_name = user.get("lastName", "") or user.get("last_name", "")
    profile_picture = user.get("profilePicture", "") or user.get("profile_picture", "")
    company_name = user.get("companyName", "") or user.get("company_name", "")
    skills = user.get("skills", [])
    interests = user.get("interests", [])
    career_aspiration = user.get("careerAspiration", "")
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        role=user["role"],
        user_id=str(user["_id"]),
        email=user["email"],
        first_name=first_name,
        last_name=last_name,
        profile_picture=profile_picture,
        company_name=company_name,
        skills=skills,
        interests=interests,
        career_aspiration=career_aspiration
    )

@router.post("/verify-otp", response_model=OTPResponse)
async def verify_otp(otp_data: OTPRequest):
    """
    Verify OTP and activate user account.
    """
    is_valid = await OTPService.verify_otp(otp_data.email, otp_data.otp)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP"
        )
    
    # Mark user as verified
    await UserService.verify_user(otp_data.email)
    
    return OTPResponse(
        message="Email verified successfully!",
        verified=True
    )

@router.post("/resend-otp")
async def resend_otp(resend_data: ResendOTPRequest, background_tasks: BackgroundTasks):
    """
    Resend OTP to user's email.
    """
    # Check if user exists
    user = await UserService.get_user_by_email(resend_data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user.get("isVerified", False):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already verified"
        )
    
    # Generate and send new OTP
    otp = OTPService.generate_otp()
    await OTPService.save_otp(resend_data.email, otp)
    background_tasks.add_task(OTPService.send_otp_email, resend_data.email, otp)
    
    return {"message": "OTP sent successfully"}

@router.post("/admin-login", response_model=LoginResponse)
async def admin_login(login_data: LoginRequest):
    """
    Admin login. Only admins can access this endpoint.
    """
    user, error = await UserService.authenticate_user(login_data)
    if error:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=error)
    
    if user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Admin privileges required."
        )
    
    # Create JWT token
    token_data = {
        "sub": str(user["_id"]),
        "email": user["email"],
        "role": user["role"]
    }
    access_token = create_access_token(token_data)
    
    # Get admin details
    first_name = user.get("firstName", "") or user.get("first_name", "")
    last_name = user.get("lastName", "") or user.get("last_name", "")
    profile_picture = user.get("profilePicture", "") or user.get("profile_picture", "")
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        role=user["role"],
        user_id=str(user["_id"]),
        email=user["email"],
        first_name=first_name,
        last_name=last_name,
        profile_picture=profile_picture
    )