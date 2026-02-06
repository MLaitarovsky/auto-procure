from crewai.tools import BaseTool
from typing import List, Any
from app.services.supabase import supabase
import json
from pydantic import Field


class CheckStockTool(BaseTool):
    name: str = "Check Stock Levels"
    description: str = (
        "Useful to find items that are low on stock. Returns a JSON list of products."
    )

    def _run(self, **kwargs) -> str:
        # Note: We ignore arguments here as this tool scans the whole DB
        response = supabase.table("products").select("*").execute()

        low_stock_items = []
        for product in response.data:
            if product["current_stock"] < product["min_stock_threshold"]:
                low_stock_items.append(product)

        return json.dumps(low_stock_items)


class CreateDraftOrderTool(BaseTool):
    name: str = "Create Draft Order"
    description: str = (
        "Creates a PO in the database. Inputs: vendor_id, product_ids (list), quantities (list), reasoning."
    )

    def _run(
        self,
        vendor_id: str,
        product_ids: List[str],
        quantities: List[int],
        reasoning: str,
    ) -> str:
        total_amount = 0

        po_data = {
            "vendor_id": vendor_id,
            "status": "pending_approval",
            "ai_reasoning": reasoning,
            "total_amount": total_amount,
        }

        try:
            po_res = supabase.table("purchase_orders").insert(po_data).execute()

            if po_res.data and len(po_res.data) > 0:
                po_id = po_res.data[0]["id"]
            else:
                return "Error: Database did not return a new PO ID."

            items_data = []
            for pid, qty in zip(product_ids, quantities):
                items_data.append(
                    {
                        "purchase_order_id": po_id,
                        "product_id": pid,
                        "quantity_suggested": qty,
                    }
                )

            supabase.table("po_items").insert(items_data).execute()
            return f"Success! Draft Order {po_id} created."

        except Exception as e:
            return f"Error creating order: {str(e)}"
