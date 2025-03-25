from core import get_current_user, send_email, role_required
from fastapi import APIRouter, Depends, HTTPException
from schemas import UserModel

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("/",
            response_description="Health check status",
            summary="Health Check Endpoint",
            description="Endpoint to check if the API is running properly. Returns a status and message.")
async def health_check():
    """
    This endpoint checks the health of the API.
    - Returns a status of 'ok' and a message confirming that the API is running.
    """
    return {'status': 'ok', 'message': 'API is running'}


@router.get("/send-email",
            response_description="Email health check status",
            summary="Email Health Check Endpoint",
            description="Endpoint to check if the email service is running properly. Returns a status and message.")
async def email_health_check(current_user: UserModel = Depends(get_current_user)):
    try:
        if current_user.role != "admin":
            raise HTTPException(
                status_code=403, detail="Not authorized to perform this action")
        response = send_email("lukif02@gmail.com",
                              "Test Email", "This is a test email.")
        return {"status": "ok", "message": f"{response}"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@router.get("/admin-only",
            response_description="Admin role check status",
            summary="Admin Only Endpoint",
            description="Endpoint that can only be accessed by users with the 'admin' role.")
async def admin_only_endpoint(current_user: UserModel = Depends(role_required(["admin"]))):
    return {"message": "Welcome, admin!"}
