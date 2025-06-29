import os
from dotenv import load_dotenv

# Load environment variables from .env file at the project root (backend/.env)
# Ensure .env is in the backend directory, or adjust path if it's at the project root.
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env') # Assumes .env is in backend/
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)
else:
    # If not in backend/, try loading from project root (useful if running scripts from project root)
    project_root_dotenv = os.path.join(os.path.dirname(__file__), '..', '..', '.env')
    if os.path.exists(project_root_dotenv):
        load_dotenv(project_root_dotenv)
    else:
        # Fallback to loading .env from current working directory if others don't exist
        load_dotenv()


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a-very-secret-key-indeed'

    # PostgreSQL connection string
    # Example: postgresql://username:password@host:port/database_name
    # For local development, you might have something like:
    # DATABASE_URL=postgresql://azbooks_user:azbooks_password@localhost:5432/azbooks_db
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///./default_app.db' # Fallback to a local SQLite file if DATABASE_URL is not set

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'another-super-secret-jwt-key' # Change this!

    # CORS Configuration (allow frontend to connect)
    # Update this to your frontend URL in production
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS') or "http://localhost:3000" # Default for local Next.js dev server
