from utils.auth import get_password_hash, verify_password

try:
    print("Testing hash...")
    pwd = "student123"
    hashed = get_password_hash(pwd)
    print(f"Hash success: {hashed[:20]}...")
    
    print("Testing verify...")
    valid = verify_password(pwd, hashed)
    print(f"Verify success: {valid}")
    
except Exception as e:
    print(f"Error: {e}")
