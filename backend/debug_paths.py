import os
import sys

print("🔍 DIAGNOSTIC REPORT")
print("-" * 30)
print(f"📂 Current Working Directory: {os.getcwd()}")
print(f"🐍 Python Executable: {sys.executable}")
print("-" * 30)

files_to_check = [
    "app/__init__.py",
    "app/main.py",
    "app/ai/__init__.py",
    "app/ai/crew.py",
    "app/ai/tools.py",
]

all_good = True
for path in files_to_check:
    exists = os.path.exists(path)
    icon = "✅" if exists else "❌"
    print(f"{icon} {path}")
    if not exists:
        all_good = False

print("-" * 30)
if all_good:
    print("🚀 File structure looks correct. The issue is likely import logic.")
else:
    print(
        "⚠️ CRITICAL: Missing files detected. Please create the missing files exactly as named above."
    )
