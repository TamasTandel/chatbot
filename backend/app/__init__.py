from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from .config import Config

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
cors = CORS()

def create_app(config_class=Config):
    """
    Application factory function.
    """
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Flask extensions here
    db.init_app(app)
    # Ensure migrations directory is correctly specified if not using default 'migrations' at project root
    # For 'backend/migrations', Flask-Migrate usually handles this if `flask db init` is run from `backend` dir.
    # If app.root_path is 'backend/app', then app.root_path + '/migrations' is 'backend/app/migrations'.
    # We want 'backend/migrations'. So, either ensure CWD is 'backend' when running flask db commands,
    # or provide an absolute path or a path relative to a known point.
    # For simplicity, let's assume flask commands are run from 'backend/' directory.
    migrate.init_app(app, db) # Default 'migrations' directory relative to CWD
    jwt.init_app(app)

    # Configure CORS
    cors_origins_config = app.config.get('CORS_ORIGINS', 'http://localhost:3000')
    if isinstance(cors_origins_config, str) and ',' in cors_origins_config:
        origins_list = [origin.strip() for origin in cors_origins_config.split(',')]
    elif isinstance(cors_origins_config, list):
        origins_list = cors_origins_config
    else:
        origins_list = [cors_origins_config] # Single string origin

    cors.init_app(app, resources={r"/api/*": {"origins": origins_list}}, supports_credentials=True)


    # Import and register blueprints here later
    from .routes import auth_bp, product_bp # Import the auth and product blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth') # Register auth
    app.register_blueprint(product_bp, url_prefix='/api/products') # Register products

    # A simple test route
    @app.route('/api/ping')
    def ping():
        return {"message": "AZ-Books Backend is alive!"}

    # It's good practice to also load models here so Alembic can find them,
    # especially if they are not imported elsewhere before migrations are run.
    # This will be done when models are defined.
    from . import models # noqa: F401 - Import models to ensure they are registered with SQLAlchemy

    return app
