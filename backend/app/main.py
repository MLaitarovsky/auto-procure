from fastapi import FastAPI
from app.services.supabase import supabase

app = FastAPI(title="Auto-Procure API")


@app.get("/")
def read_root():
    return {"status": "active", "system": "Auto-Procure Agent"}


@app.get("/inventory")
def get_inventory():
    # Query the 'products' table we created in SQL
    response = supabase.table("products").select("*").execute()
    return response.data
