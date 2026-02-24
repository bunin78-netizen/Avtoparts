from __future__ import annotations

from app.integrations.suppliers.base import BaseSupplierAPI


class SupplierSyncService:
    def __init__(self, suppliers: list[BaseSupplierAPI], markup_percent: float = 10.0) -> None:
        self.suppliers = suppliers
        self.markup_percent = markup_percent

    async def search_across_suppliers(self, article: str, brand: str | None = None) -> list[dict]:
        results: list[dict] = []
        for supplier in self.suppliers:
            results.extend(await supplier.search_products(article=article, brand=brand))

        deduplicated: dict[tuple[str, str], dict] = {}
        for item in results:
            key = (item["article"], item["brand"])
            item["price"] = round(item["price"] * (1 + self.markup_percent / 100), 2)
            if key not in deduplicated or item["price"] < deduplicated[key]["price"]:
                deduplicated[key] = item

        return sorted(deduplicated.values(), key=lambda x: (x["price"], -x["stock"]))
