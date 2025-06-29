import uuid
from datetime import datetime, timezone
from .. import db

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4())) # Internal UUID
    prd_id = db.Column(db.String(20), unique=True, nullable=False, index=True) # Prefixed PRDxxxxxx, to be generated

    name = db.Column(db.String(255), nullable=False, index=True)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    stock_quantity = db.Column(db.Integer, nullable=False, default=0)

    category_id = db.Column(db.String(36), db.ForeignKey('categories.id'), nullable=True, index=True)
    image_url = db.Column(db.String(512), nullable=True)

    # If a product is directly associated with a vendor (User with 'vendor' role)
    # vendor_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True, index=True)

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    category = db.relationship('Category', back_populates='products')
    # vendor = db.relationship('User', backref=db.backref('supplied_products', lazy='dynamic'))


    def __repr__(self):
        return f'<Product {self.prd_id} - {self.name}>'
