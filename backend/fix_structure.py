import os

# Define the required structure
paths = ["app/__init__.py", "app/ai/__init__.py", "app/services/__init__.py"]

print("🛠️  Repairing Python Package Structure...")

for path in paths:
    # Ensure folder exists
    os.makedirs(os.path.dirname(path), exist_ok=True)

    # Force create/touch the file
    with open(path, "a") as f:
        pass
    print(f"✅ Verified/Created: {path}")

print("\n🧹 Clearing Python Cache...")
# Walk through and delete __pycache__ folders
for root, dirs, files in os.walk("."):
    for d in dirs:
        if d == "__pycache__":
            cache_path = os.path.join(root, d)
            print(f"   - Removing cache: {cache_path}")
            # Try to rename/delete (safe way for Windows/OneDrive)
            try:
                import shutil

                shutil.rmtree(cache_path)
            except Exception as e:
                print(f"   ⚠️ Could not delete {cache_path} (OneDrive lock?). Skipping.")

print("\n🚀 DONE. Try running uvicorn now.")
