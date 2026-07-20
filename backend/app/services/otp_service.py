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
=========================================

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
        # Find valid OTP
        otp_doc = await collection.find_one({
            "email": email,
            "otp": otp,
            "expiresAt": {"$gt": datetime.utcnow()}
        })
        
        if not otp_doc:
            return False
        
        # Delete used OTP
        await collection.delete_one({"_id": otp_doc["_id"]})
        return True

    @staticmethod
    async def delete_expired_otps():
        collection = await get_otps_collection()
        await collection.delete_many({
            "expiresAt": {"$lt": datetime.utcnow()}
        })