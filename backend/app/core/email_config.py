from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from .config import settings

def send_email(to_email: str, subject: str, content: str):
    try:
        sg = SendGridAPIClient(settings.SENDGRID_API_KEY)  # Replace with your SendGrid API key
        from_email = "notifications.api.lf@gmail.com"  # Replace with your email
        message = Mail(
            from_email=from_email,
            to_emails=to_email,
            subject=subject,
            html_content=content
        )
        response = sg.send(message)
        print(f"Email sent! Status code: {response.status_code}")
        return response
    except Exception as e:
        print(f"Error: {e}")
        return None