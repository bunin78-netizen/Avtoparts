# AutoParts Shop

Базовая реализация ТЗ из `docs/technical_specification.md`.

## Что реализовано
- FastAPI API с основными маршрутами:
  - `GET /api/categories/popular`
  - `GET /api/products/bestsellers`
  - `POST /api/products/search`
  - `GET /api/products/{id}`
  - `GET /api/products/{id}/related`
  - `GET /api/cart`
  - `POST /api/cart/items`
  - `PUT /api/cart/items/{id}`
  - `DELETE /api/cart/items/{id}`
  - `POST /api/orders`
  - `GET /api/users/me`
- SQLAlchemy модели для пользователей, категорий, товаров, корзины и заказов.
- Базовый контракт поставщика (`BaseSupplierAPI`) и демо-интеграция (`OmegaSupplierAPI`).
- `SupplierSyncService` с агрегацией, наценкой и дедупликацией.
- Middleware для Prometheus-метрик и конфигурация логирования.
- Заглушки Celery-задач по расписаниям из ТЗ.

## Запуск
```bash
python -m venv .venv
source .venv/bin/activate
pip install -e .
uvicorn app.main:app --reload
```

## Тесты
```bash
pytest
```
