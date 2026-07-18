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
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: 'Outfit', sans-serif; background-color: #f8fafc; padding: 40px 20px; }}
                    .container {{ max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 2px 15px -3px rgba(0,0,0,0.07); }}
                    .header {{ text-align: center; margin-bottom: 30px; display: flex; align-items: center; justify-content: center; gap: 12px; }}
                    .logo-icon {{ width: 40px; height: 40px; }}
                    .logo-text {{ font-size: 24px; font-weight: 800; color: #053F5C; }}
                    .subtitle {{ color: #4A5568; font-size: 14px; margin-top: 4px; }}
                    .otp-box {{ background: #F8FAFC; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }}
                    .otp-code {{ font-size: 36px; font-weight: 800; color: #429EBD; letter-spacing: 8px; }}
                    .footer {{ text-align: center; margin-top: 30px; color: #A0AEC0; font-size: 14px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://sipp.curriumx.online/icon.webp" alt="SIPP" class="logo-icon" />
                        <div>
                            <div class="logo-text">SIPP</div>
                            <div class="subtitle">Smart Internship Placement Portal</div>
                        </div>
                    </div>
                    <h2 style="color: #053F5C; text-align: center;">Verify Your Email</h2>
                    <p style="color: #4A5568; text-align: center;">Use the verification code below to complete your registration.</p>
                    <div class="otp-box">
                        <div class="otp-code">{otp}</div>
                    </div>
                    <p style="color: #4A5568; text-align: center; font-size: 14px;">This code will expire in <strong>10 minutes</strong>.</p>
                    <p style="color: #4A5568; text-align: center; font-size: 14px;">If you didn't request this, please ignore this email.</p>
                    <div class="footer">
                        <p>&copy; 2026 SIPP. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            params = {
                "from": settings.EMAIL_FROM,
                "to": [email],
                "subject": "Verify Your SIPP Account",
                "html": html_content,
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