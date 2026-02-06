import sys
import os

# Force Python to see the 'backend' folder as the root
# Get the directory where this main.py file lives (".../backend/app")
current_dir = os.path.dirname(os.path.abspath(__file__))
# Go up one level to get the "backend" folder
backend_dir = os.path.dirname(current_dir)
# Add it to the system path so "app.ai" becomes valid
sys.path.append(backend_dir)


from fastapi import FastAPI
from app.services.supabase import supabase
from fastapi.middleware.cors import CORSMiddleware

# This import was failing, but the fix above should solve it
from app.ai.crew import run_procurement_cycle

app = FastAPI(title="Auto-Procure API")

# Allow front to talk to back
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (ok for local dev)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (POST, GET, etc.)
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"status": "active", "system": "Auto-Procure Agent"}


@app.get("/inventory")
def get_inventory():
    # Query the 'products' table we created in SQL
    response = supabase.table("products").select("*").execute()
    return response.data


@app.post("/run-agent")
def trigger_agent():
    result = run_procurement_cycle()
    return {"status": "success", "agent_log": result}


@app.get("/orders")
def get_orders():
    # Fetch all orders that are pending approval
    response = (
        supabase.table("purchase_orders")
        .select("*")
        .eq("status", "pending_approval")
        .execute()
    )
    return response.data


@app.post("/orders/{order_id}/approve")
def approve_order(order_id: str):
    # Update the status in Supabase
    response = (
        supabase.table("purchase_orders")
        .update({"status": "approved"})
        .eq("id", order_id)
        .execute()
    )
    return {"message": "Order approved", "data": response.data}


if __name__ == "__main__":
    import uvicorn

    # Run directly using the app object we created above
    uvicorn.run(app, host="127.0.0.1", port=8000)
