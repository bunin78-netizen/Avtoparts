from __future__ import annotations

from abc import ABC, abstractmethod


class BaseSupplierAPI(ABC):
    @abstractmethod
    async def search_products(self, article: str, brand: str | None = None) -> list[dict]:
        raise NotImplementedError

    @abstractmethod
    async def get_product_details(self, product_id: str) -> dict:
        raise NotImplementedError

    @abstractmethod
    async def check_availability(self, product_id: str) -> dict:
        raise NotImplementedError

    @abstractmethod
    async def create_order(self, payload: dict) -> dict:
        raise NotImplementedError

    @abstractmethod
    async def get_order_status(self, order_id: str) -> dict:
        raise NotImplementedError
