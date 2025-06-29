from .auth_routes import auth_bp
from .product_routes import product_bp # Import product blueprint

__all__ = [
    'auth_bp',
    'product_bp',
]
