import asyncio
import httpx

async def test():
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YTg5Y2UzODAwZTVjYWMzYWM4YmQ2YTEiLCJlbWFpbCI6InNvcm9jaGlqb3NodWEyMkBnbWFpbC5jb20iLCJyb2xlIjoic3R1ZGVudCIsImV4cCI6MTc5NjA2MTU0M30.Xd_UAF7FdzUg-P7fHmNFV8c73K3zyiWM4xN5ggyt7s0"  # paste the token you copied
    headers = {"Authorization": f"Bearer {token}"}
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "http://localhost:8000/api/internships/student/matched?skip=0&limit=50",
            headers=headers
        )
        print(resp.status_code)
        print(resp.json())

asyncio.run(test())