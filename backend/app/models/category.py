import uuid
from datetime import datetime, timezone
from .. import db

class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), unique=True, nullable=False, index=True)
    description = db.Column(db.Text, nullable=True)

    # For hierarchical categories (optional future feature)
    # parent_id = db.Column(db.String(36), db.ForeignKey('categories.id'), nullable=True, index=True)
    # children = db.relationship('Category', backref=db.backref('parent', remote_side=[id]), lazy='dynamic')

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    products = db.relationship('Product', back_populates='category', lazy='dynamic')

    def __repr__(self):
        return f'<Category {self.id} - {self.name}>'
