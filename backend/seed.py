import asyncio
from app.services.supabase import supabase

# Fake Data
VENDORS = [
    {
        "name": "TechGiant Supply",
        "contact_email": "orders@techgiant.com",
        "lead_time_days": 3,
    },
    {
        "name": "Global Chips Inc",
        "contact_email": "sales@globalchips.com",
        "lead_time_days": 14,
    },
]

PRODUCTS = [
    {
        "sku": "GPU-3080-RTX",
        "name": "RTX 3080 Graphics Card",
        "current_stock": 5,
        "min_stock_threshold": 10,
        "unit_price": 699.99,
    },
    {
        "sku": "CPU-RYZEN-9",
        "name": "AMD Ryzen 9 5900X",
        "current_stock": 25,
        "min_stock_threshold": 15,
        "unit_price": 450.00,
    },
    {
        "sku": "RAM-32GB-DDR4",
        "name": "Corsair Vengeance 32GB",
        "current_stock": 8,
        "min_stock_threshold": 20,
        "unit_price": 120.50,
    },
    {
        "sku": "SSD-1TB-NVME",
        "name": "Samsung 970 EVO 1TB",
        "current_stock": 50,
        "min_stock_threshold": 10,
        "unit_price": 150.00,
    },
]


async def seed_database():
    print("🌱 Starting Seed Process...")

    # 1. Insert Vendors
    print("Inserting Vendors...")
    for vendor in VENDORS:
        # Check if exists to avoid duplicates
        existing = (
            supabase.table("vendors").select("id").eq("name", vendor["name"]).execute()
        )

        if not existing.data:
            data, count = supabase.table("vendors").insert(vendor).execute()
            print(f"  + Added {vendor['name']}")
        else:
            print(f"  - {vendor['name']} already exists")

    # 2. Get Vendor IDs to link Products
    vendors_response = supabase.table("vendors").select("id, name").execute()
    # Create a lookup dict: {"TechGiant Supply": "uuid-123..."}
    vendor_map = {v["name"]: v["id"] for v in vendors_response.data}

    # Assign specific vendors to products for realism
    PRODUCTS[0]["vendor_id"] = vendor_map["TechGiant Supply"]
    PRODUCTS[1]["vendor_id"] = vendor_map["Global Chips Inc"]
    PRODUCTS[2]["vendor_id"] = vendor_map["TechGiant Supply"]
    PRODUCTS[3]["vendor_id"] = vendor_map["Global Chips Inc"]

    # 3. Insert Products
    print("Inserting Products...")
    for product in PRODUCTS:
        existing = (
            supabase.table("products").select("id").eq("sku", product["sku"]).execute()
        )

        if not existing.data:
            supabase.table("products").insert(product).execute()
            print(f"  + Added {product['name']}")
        else:
            print(f"  - {product['name']} already exists")

    print("✅ Database Seeded Successfully!")


if __name__ == "__main__":
    asyncio.run(seed_database())
