from fastapi import APIRouter
from core import send_email

router = APIRouter()


@router.get("/health",
            response_description="Health check status",
            summary="Health Check Endpoint",
            description="Endpoint to check if the API is running properly. Returns a status and message.")
def health_check():
    """
    This endpoint checks the health of the API.
    - Returns a status of 'ok' and a message confirming that the API is running.
    """
    return {'status': 'ok', 'message': 'API is running'}

@router.get("/send-email")
def health_check():
    try:
        send_email("lukif02@gmail.com", "Test Email", "This is a test email.")
        return {"status": "ok", "message": "email sent"}
    except Exception as e:
        return {"status": "error", "message": str(e)}