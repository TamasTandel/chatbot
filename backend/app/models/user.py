import uuid
from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash
from .. import db # Import db from the app package's __init__.py

class UserRole:
    CUSTOMER = 'customer'
    EMPLOYEE = 'employee'
    VENDOR = 'vendor'
    LENDER = 'lender'
    SCHOOL_ADMIN = 'school_admin'
    ADMIN = 'admin' # Super admin

    @classmethod
    def get_all_roles(cls):
        return [getattr(cls, attr) for attr in dir(cls) if not callable(getattr(cls, attr)) and not attr.startswith("__")]

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(50), nullable=False, default=UserRole.CUSTOMER, index=True)

    # Prefixed human-readable IDs will be managed by a utility service upon creation/role assignment
    # For example, a User might have one or more associated prefixed IDs depending on their roles/profiles
    # We can add specific columns here or in linked profile tables as needed.
    # For now, let's keep the User model lean and add specific prefixed IDs to related profiles or handle via a separate ID mapping table.
    # Example: usr_id = db.Column(db.String(20), unique=True, nullable=True, index=True)

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationship to UserProfile
    user_profile = db.relationship('UserProfile', back_populates='user', uselist=False, cascade="all, delete-orphan")

    def set_password(self, password):
        # Consider using passlib for stronger hashing like bcrypt or argon2
        # For now, Werkzeug's default (scrypt or pbkdf2_sha256) is used by generate_password_hash
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.id} - {self.email} - {self.role}>'

class UserProfile(db.Model):
    __tablename__ = 'user_profiles'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, unique=True, index=True)

    first_name = db.Column(db.String(50), nullable=True)
    last_name = db.Column(db.String(50), nullable=True)
    phone_number = db.Column(db.String(20), nullable=True)

    # Prefixed IDs related to this user's specific roles/profiles can go here
    # e.g., if this profile represents a customer:
    cst_id = db.Column(db.String(20), unique=True, nullable=True, index=True)
    # e.g., if this profile represents a vendor:
    vnd_id = db.Column(db.String(20), unique=True, nullable=True, index=True)
    # e.g., if this profile represents a school contact:
    sch_id = db.Column(db.String(20), unique=True, nullable=True, index=True)
    # e.g., if this profile represents a lender contact:
    lnd_id = db.Column(db.String(20), unique=True, nullable=True, index=True)
    # A generic user ID might also be stored if needed, distinct from primary User.id
    usr_id = db.Column(db.String(20), unique=True, nullable=True, index=True)


    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = db.relationship('User', back_populates='user_profile')

    def __repr__(self):
        return f'<UserProfile for User {self.user_id}>'
