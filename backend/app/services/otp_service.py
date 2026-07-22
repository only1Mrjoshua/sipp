import random
import resend
from datetime import datetime, timedelta
from app.core.config import settings
from app.core.database import get_otps_collection

resend.api_key = settings.RESEND_API_KEY

class OTPService:
    @staticmethod
    def generate_otp() -> str:
        return ''.join(str(random.randint(0, 9)) for _ in range(6))

    @staticmethod
    async def send_otp_email(email: str, otp: str):
        try:
            plain_text_content = f"""
SIPP - Smart Internship Placement Portal

Verify Your Email
-----------------

Your verification code is: {otp}

This code will expire in 10 minutes.

If you didn't request this, please ignore this email.

---
© 2026 SIPP. All rights reserved.
"""
            params = {
                "from": settings.EMAIL_FROM,
                "to": [email],
                "subject": "Verify Your SIPP Account",
                "text": plain_text_content,
            }
            email_response = resend.Emails.send(params)
            return email_response
        except Exception as e:
            print(f"Error sending email: {e}")
            return None

    @staticmethod
    async def save_otp(email: str, otp: str):
        collection = await get_otps_collection()
        expires_at = datetime.utcnow() + timedelta(minutes=10)
        await collection.insert_one({
            "email": email,
            "otp": otp,
            "expiresAt": expires_at,
            "createdAt": datetime.utcnow()
        })

    @staticmethod
    async def verify_otp(email: str, otp: str) -> bool:
        collection = await get_otps_collection()
        otp_doc = await collection.find_one({
            "email": email,
            "otp": otp,
            "expiresAt": {"$gt": datetime.utcnow()}
        })
        if not otp_doc:
            return False
        await collection.delete_one({"_id": otp_doc["_id"]})
        return True

    @staticmethod
    async def delete_expired_otps():
        collection = await get_otps_collection()
        await collection.delete_many({
            "expiresAt": {"$lt": datetime.utcnow()}
        })

    @staticmethod
    async def send_application_notification(
        company_email: str,
        company_name: str,
        student_name: str,
        internship_title: str,
        application_id: str,
        frontend_url: str
    ):
        """Send an email to the company when a student applies."""
        try:
            view_link = f"{frontend_url}/company/application/{application_id}"
            subject = f"New Application for {internship_title}"
            plain_text = f"""
New Application Received

Dear {company_name},

{student_name} has applied for the internship position: {internship_title}.

Click the link below to view the full application and take action:
{view_link}

Thank you for using SIPP.
            """
            params = {
                "from": settings.EMAIL_FROM,
                "to": [company_email],
                "subject": subject,
                "text": plain_text,
            }
            await resend.Emails.send(params)
            return True
        except Exception as e:
            print(f"Error sending application notification: {e}")
            return False

    # NEW: Send status update to student
    @staticmethod
    async def send_application_status_update(
        student_email: str,
        student_name: str,
        company_name: str,
        internship_title: str,
        status: str,
        application_id: str,
        frontend_url: str
    ):
        """Send an email to the student when application status changes."""
        try:
            view_link = f"{frontend_url}/student/application/{application_id}"
            subject = f"Application Update: {status} - {internship_title}"
            plain_text = f"""
Application Status Update

Dear {student_name},

Your application for {internship_title} at {company_name} has been updated to: {status}.

You can view your application at:
{view_link}

Thank you for using SIPP.
            """
            params = {
                "from": settings.EMAIL_FROM,
                "to": [student_email],
                "subject": subject,
                "text": plain_text,
            }
            await resend.Emails.send(params)
            return True
        except Exception as e:
            print(f"Error sending status update email: {e}")
            return False