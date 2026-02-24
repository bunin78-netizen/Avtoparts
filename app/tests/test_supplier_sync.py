import asyncio

from app.integrations.suppliers.omega import OmegaSupplierAPI
from app.services.supplier_sync import SupplierSyncService


def test_search_across_suppliers_applies_markup_and_returns_article() -> None:
    service = SupplierSyncService([OmegaSupplierAPI()], markup_percent=10)
    results = asyncio.run(service.search_across_suppliers("1234567", "BOSCH"))

    assert isinstance(results, list)
    assert len(results) > 0
    assert all("article" in item for item in results)
    assert all("price" in item for item in results)
    assert results[0]["price"] == 110.0
