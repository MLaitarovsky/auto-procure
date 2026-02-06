import uvicorn
import os
import sys

# 1. Get the absolute path to the 'backend' folder
current_dir = os.path.dirname(os.path.abspath(__file__))

# 2. Add it to Python's system path so it sees 'app' as a package
sys.path.append(current_dir)

if __name__ == "__main__":
    print(f"🚀 Starting server from: {current_dir}")
    # Run WITHOUT reload to prevent Windows spawning errors
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=False)
