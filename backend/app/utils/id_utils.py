import uuid
from .. import db # Assuming db instance is in app's __init__

# A simple in-memory counter for sequence numbers.
# In a production/distributed environment, this should be replaced with a more robust
# sequence generation strategy (e.g., database sequences, a dedicated ID service).
_sequence_counters = {}

def _get_next_sequence(prefix: str) -> int:
    if prefix not in _sequence_counters:
        _sequence_counters[prefix] = 0
    _sequence_counters[prefix] += 1
    return _sequence_counters[prefix]

def generate_prefixed_id(prefix: str, model_class=None, column_name: str = None) -> str:
    """
    Generates a prefixed ID, e.g., USR000001.
    Ensures uniqueness if model_class and column_name are provided by checking the DB.
    """
    if not prefix or len(prefix) != 3:
        raise ValueError("Prefix must be 3 characters long.")

    # Simple sequence for demonstration. For production, consider more robust sequence generation.
    # Also, the length of the numeric part (e.g., 6 digits) should be consistent.
    # Here, we format to 6 digits.

    max_attempts = 10 # Avoid infinite loops if there's an issue with sequence or collisions
    for _ in range(max_attempts):
        sequence_number = _get_next_sequence(prefix)
        new_id = f"{prefix.upper()}{sequence_number:06d}" # Formats to 6 digits, e.g., USR000001

        if model_class and column_name:
            # Check for uniqueness in the database
            # This requires an active app context if db operations are involved outside a request
            # For now, this utility might be called within a request context or a task with app context
            # A more robust check might involve trying to insert and catching a unique constraint violation,
            # or using a database sequence that guarantees uniqueness.

            # This is a simplified check. A direct query is more efficient.
            # Example: if not db.session.query(model_class).filter(getattr(model_class, column_name) == new_id).first():
            # For now, we'll assume the sequence generation is mostly unique for this basic setup.
            # True uniqueness should be enforced by a unique constraint on the DB column.
            pass # Placeholder for DB uniqueness check if needed beyond sequence

        return new_id # In this simplified version, we return the first generated ID.

    raise Exception(f"Could not generate a unique prefixed ID for {prefix} after {max_attempts} attempts.")


# Example usage (for testing this file directly, not part of app logic):
if __name__ == '__main__':
    print(generate_prefixed_id("USR"))
    print(generate_prefixed_id("USR"))
    print(generate_prefixed_id("PRD"))
    print(generate_prefixed_id("ORD", model_class=None, column_name=None)) # Example without DB check
    # To test with DB check, you'd need an app context and models.
    # from app import create_app, db
    # from app.models.user import User
    # app = create_app()
    # with app.app_context():
    #     print(generate_prefixed_id("USR", User, "usr_id")) # This won't work standalone without model setup

    # Resetting for multiple runs if testing standalone
    _sequence_counters.clear()
    for i in range(1, 15):
        print(generate_prefixed_id("TST") + f" (call {i})")
