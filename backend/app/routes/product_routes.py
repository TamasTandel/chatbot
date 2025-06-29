from flask import Blueprint, request, jsonify
from ..models import Product, Category, UserRole // Ensure UserRole is imported if used for role checks
from ..app import db // Assuming direct import of db for convenience, or from .. import db
from ..utils import generate_prefixed_id // For PRD_ID generation
from flask_jwt_extended import jwt_required, get_jwt_identity

product_bp = Blueprint('product_bp', __name__)

# Helper function to check for admin role (can be moved to a decorators utils file later)
def admin_required(fn):
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user_identity = get_jwt_identity()
        if not current_user_identity or current_user_identity.get('role') not in [UserRole.ADMIN, UserRole.EMPLOYEE]: # Allow EMPLOYEE as admin for now
            return jsonify(msg="Admins/Employees only!"), 403
        return fn(*args, **kwargs)
    wrapper.__name__ = fn.__name__ # Preserve original function name for Flask
    return wrapper

# GET all products (public)
@product_bp.route('', methods=['GET'])
def get_products():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)

        products_query = Product.query

        # Optional: Add filtering by category or search term
        category_name = request.args.get('category')
        if category_name:
            category = Category.query.filter_by(name=category_name).first()
            if category:
                products_query = products_query.filter_by(category_id=category.id)
            else: # Category not found, return empty list for this filter
                return jsonify(products=[], total=0, pages=0, current_page=page), 200


        search_term = request.args.get('search')
        if search_term:
            products_query = products_query.filter(Product.name.ilike(f"%{search_term}%"))

        paginated_products = products_query.order_by(Product.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)

        products_data = []
        for product in paginated_products.items:
            category_data = None
            if product.category:
                category_data = {"id": product.category.id, "name": product.category.name}
            products_data.append({
                "id": product.id,
                "prd_id": product.prd_id,
                "name": product.name,
                "description": product.description,
                "price": str(product.price), # Convert Decimal to string for JSON
                "stock_quantity": product.stock_quantity,
                "category": category_data,
                "image_url": product.image_url,
                "created_at": product.created_at.isoformat()
            })

        return jsonify(
            products=products_data,
            total=paginated_products.total,
            pages=paginated_products.pages,
            current_page=paginated_products.page
        ), 200
    except Exception as e:
        # Log error e
        print(f"Error fetching products: {e}")
        return jsonify(msg="Error fetching products", error=str(e)), 500


# GET a single product by its PRD_ID (public)
@product_bp.route('/<string:prd_id>', methods=['GET'])
def get_product_by_prd_id(prd_id):
    product = Product.query.filter_by(prd_id=prd_id).first()
    if not product:
        return jsonify(msg="Product not found"), 404

    category_data = None
    if product.category:
        category_data = {"id": product.category.id, "name": product.category.name}

    return jsonify({
        "id": product.id,
        "prd_id": product.prd_id,
        "name": product.name,
        "description": product.description,
        "price": str(product.price),
        "stock_quantity": product.stock_quantity,
        "category": category_data,
        "image_url": product.image_url,
        "created_at": product.created_at.isoformat()
    }), 200

# POST a new product (admin/employee only)
@product_bp.route('', methods=['POST'])
@admin_required
def create_product():
    data = request.get_json()
    if not data or not data.get('name') or data.get('price') is None: # Price can be 0
        return jsonify(msg="Missing required fields: name and price"), 400

    try:
        new_prd_id = generate_prefixed_id("PRD") # TODO: Ensure this ID is unique in DB

        # Check if category_id is provided and valid
        category = None
        if data.get('category_id'):
            category = Category.query.get(data.get('category_id'))
            if not category:
                return jsonify(msg=f"Category with id {data.get('category_id')} not found"), 400

        new_product = Product(
            prd_id=new_prd_id,
            name=data['name'],
            description=data.get('description'),
            price=data['price'],
            stock_quantity=data.get('stock_quantity', 0),
            category_id=category.id if category else None,
            image_url=data.get('image_url')
        )
        db.session.add(new_product)
        db.session.commit()

        # Prepare response data
        category_data_resp = {"id": category.id, "name": category.name} if category else None
        return jsonify({
            "msg": "Product created successfully",
            "product": {
                "id": new_product.id,
                "prd_id": new_product.prd_id,
                "name": new_product.name,
                "description": new_product.description,
                "price": str(new_product.price),
                "stock_quantity": new_product.stock_quantity,
                "category": category_data_resp,
                "image_url": new_product.image_url
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error creating product: {e}") # Log error
        return jsonify(msg="Error creating product", error=str(e)), 500


# PUT/PATCH update a product by its PRD_ID (admin/employee only)
# Using PUT for full update, PATCH for partial. Here, let's implement PUT style.
@product_bp.route('/<string:prd_id>', methods=['PUT'])
@admin_required
def update_product(prd_id):
    product = Product.query.filter_by(prd_id=prd_id).first()
    if not product:
        return jsonify(msg="Product not found"), 404

    data = request.get_json()
    if not data:
        return jsonify(msg="No data provided for update"), 400

    try:
        if 'name' in data: product.name = data['name']
        if 'description' in data: product.description = data['description']
        if 'price' in data: product.price = data['price']
        if 'stock_quantity' in data: product.stock_quantity = data['stock_quantity']
        if 'image_url' in data: product.image_url = data['image_url']

        if 'category_id' in data:
            if data['category_id'] is None: # Allow unsetting category
                product.category_id = None
            else:
                category = Category.query.get(data['category_id'])
                if not category:
                    return jsonify(msg=f"Category with id {data['category_id']} not found"), 400
                product.category_id = category.id

        db.session.commit()

        category_data_resp = None
        if product.category:
             category_data_resp = {"id": product.category.id, "name": product.category.name}

        return jsonify({
            "msg": "Product updated successfully",
            "product": {
                "id": product.id,
                "prd_id": product.prd_id,
                "name": product.name,
                "description": product.description,
                "price": str(product.price),
                "stock_quantity": product.stock_quantity,
                "category": category_data_resp,
                "image_url": product.image_url
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error updating product {prd_id}: {e}") # Log error
        return jsonify(msg="Error updating product", error=str(e)), 500


# DELETE a product by its PRD_ID (admin/employee only)
@product_bp.route('/<string:prd_id>', methods=['DELETE'])
@admin_required
def delete_product(prd_id):
    product = Product.query.filter_by(prd_id=prd_id).first()
    if not product:
        return jsonify(msg="Product not found"), 404

    try:
        db.session.delete(product)
        db.session.commit()
        return jsonify(msg="Product deleted successfully"), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting product {prd_id}: {e}") # Log error
        return jsonify(msg="Error deleting product", error=str(e)), 500


# --- Category Management Routes (Optional, can be in a separate category_routes.py) ---

@product_bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = Category.query.order_by(Category.name).all()
        categories_data = [{"id": cat.id, "name": cat.name, "description": cat.description} for cat in categories]
        return jsonify(categories=categories_data), 200
    except Exception as e:
        print(f"Error fetching categories: {e}")
        return jsonify(msg="Error fetching categories", error=str(e)), 500

@product_bp.route('/categories', methods=['POST'])
@admin_required
def create_category():
    data = request.get_json()
    if not data or not data.get('name'):
        return jsonify(msg="Category name is required"), 400

    if Category.query.filter_by(name=data['name']).first():
        return jsonify(msg="Category with this name already exists"), 409

    try:
        new_category = Category(name=data['name'], description=data.get('description'))
        db.session.add(new_category)
        db.session.commit()
        return jsonify({
            "msg": "Category created successfully",
            "category": {"id": new_category.id, "name": new_category.name, "description": new_category.description}
        }), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error creating category: {e}")
        return jsonify(msg="Error creating category", error=str(e)), 500

# GET a single category by ID (public)
@product_bp.route('/categories/<string:category_id>', methods=['GET'])
def get_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return jsonify(msg="Category not found"), 404
    return jsonify(category={"id": category.id, "name": category.name, "description": category.description}), 200

# PUT update a category (admin/employee only)
@product_bp.route('/categories/<string:category_id>', methods=['PUT'])
@admin_required
def update_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return jsonify(msg="Category not found"), 404

    data = request.get_json()
    if not data:
        return jsonify(msg="No data provided"), 400

    if 'name' in data:
        # Check if new name conflicts with another existing category
        existing_category_with_new_name = Category.query.filter(Category.id != category_id, Category.name == data['name']).first()
        if existing_category_with_new_name:
            return jsonify(msg="Another category with this name already exists"), 409
        category.name = data['name']

    if 'description' in data:
        category.description = data['description']

    try:
        db.session.commit()
        return jsonify({
            "msg": "Category updated successfully",
            "category": {"id": category.id, "name": category.name, "description": category.description}
        }), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error updating category {category_id}: {e}")
        return jsonify(msg="Error updating category", error=str(e)), 500

# DELETE a category (admin/employee only)
# Note: Consider how to handle products associated with a category being deleted.
# Option 1: Set product.category_id to NULL (requires nullable FK)
# Option 2: Disallow deletion if products are associated
# Option 3: Delete/archive associated products (dangerous)
@product_bp.route('/categories/<string:category_id>', methods=['DELETE'])
@admin_required
def delete_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return jsonify(msg="Category not found"), 404

    # Check if any products are associated with this category
    if Product.query.filter_by(category_id=category.id).first():
        return jsonify(msg="Cannot delete category: it is associated with existing products. Please reassign products first."), 400
        # Alternatively, to nullify product category links:
        # Product.query.filter_by(category_id=category.id).update({"category_id": None})

    try:
        db.session.delete(category)
        db.session.commit()
        return jsonify(msg="Category deleted successfully"), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting category {category_id}: {e}")
        return jsonify(msg="Error deleting category", error=str(e)), 500
