# This file makes the 'models' directory a Python package.
# It also makes it easier to import models from this package
# and ensures they are known to SQLAlchemy before migration generation.

from .user import User, UserProfile, UserRole
from .product import Product
from .category import Category

# Define __all__ for explicit exports if desired
__all__ = [
    'User',
    'UserProfile',
    'UserRole',
    'Product',
    'Category'
]
