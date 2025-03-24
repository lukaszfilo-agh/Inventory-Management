from .auth import (create_access_token, decode_access_token, get_current_user,
                   hash_password, oauth2_scheme, role_required,
                   verify_password, create_default_user)
from .config import settings
from .database import Base, engine, get_db
from .email_config import send_email