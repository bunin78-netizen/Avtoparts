from app.integrations.suppliers.base import BaseSupplierAPI


class OmegaSupplierAPI(BaseSupplierAPI):
    """Demo implementation for supplier API integration."""

    async def search_products(self, article: str, brand: str | None = None) -> list[dict]:
        return [
            {
                "article": article,
                "brand": brand or "OMEGA",
                "title": "Demo product from Omega",
                "price": 100.0,
                "stock": 3,
                "supplier_name": "omega",
            }
        ]

    async def get_product_details(self, product_id: str) -> dict:
        return {"product_id": product_id, "details": "Demo details"}

    async def check_availability(self, product_id: str) -> dict:
        return {"product_id": product_id, "available": True, "stock": 3}

    async def create_order(self, payload: dict) -> dict:
        return {"supplier_order_id": "OMG-001", "payload": payload, "status": "new"}

    async def get_order_status(self, order_id: str) -> dict:
        return {"supplier_order_id": order_id, "status": "processing"}
