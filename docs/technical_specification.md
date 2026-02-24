# Техническое задание: AutoParts Shop

## 1. Общая информация

### 1.1 Название проекта
**AutoParts Shop** — интернет-магазин автозапчастей с интеграциями платежных систем, мессенджеров и поставщиков.

### 1.2 Цель проекта
Создание полнофункционального интернет-магазина автозапчастей с:
- автоматическим импортом товаров от поставщиков через API;
- интеграцией мессенджеров (Telegram, Viber) для уведомлений и заказов;
- интеграцией платежных систем (Monobank, PrivatBank);
- интеграцией службы доставки (Новая Почта);
- административной панелью для управления.

### 1.3 Целевая аудитория
- B2C клиенты (владельцы автомобилей);
- B2B клиенты (автосервисы, СТО);
- регион: Украина.

## 2. Технический стек

### 2.1 Backend
- Python 3.11+
- FastAPI 0.104+
- SQLAlchemy 2.0+ (ORM)
- Alembic (миграции БД)
- PostgreSQL 15+ (основная БД)
- Redis 7+ (кэш, очереди)
- Celery 5+ (фоновые задачи)
- aiogram 3+ (Telegram бот)
- viberbot 1.0+ (Viber бот)
- aiohttp 3.9+ (асинхронные HTTP запросы)
- Pydantic 2.5+ (валидация данных)
- python-jose (JWT токены)
- passlib (хэширование паролей)

### 2.2 Frontend
- React 18+
- React Router 6+
- Ant Design 5+ (UI библиотека)
- Axios 1.6+ (HTTP клиент)
- React Query / SWR (кэширование данных)

### 2.3 DevOps
- Docker 20.10+
- Docker Compose 2.0+
- Nginx (reverse proxy)
- Let's Encrypt (SSL сертификаты)
- GitHub Actions / GitLab CI (CI/CD)

### 2.4 Мониторинг и логирование
- Prometheus (метрики)
- Grafana (визуализация)
- ELK Stack или Loki (логи)
- Sentry (отслеживание ошибок)

## 3. Архитектура системы

### 3.1 Общая схема
- Frontend (React + Ant Design + Axios + Router)
- Nginx как reverse proxy
- Несколько инстансов FastAPI
- PostgreSQL, Redis, Celery Worker/Beat
- Внешние интеграции: Telegram API, Viber API, Suppliers API, Monobank API, PrivatBank API, Nova Poshta API

### 3.2 Структура базы данных
Ключевые сущности:
- `users`
- `suppliers`
- `categories`
- `products`
- `orders`
- `order_items`
- `order_status_history`
- `cart_items`
- `favorites`
- `reviews`
- `price_history`
- `search_queries`
- `settings`
- `promo_codes`
- `notifications`
- `integration_logs`

Дополнительно предусмотрены индексы по основным сценариям поиска, фильтрации и аналитики.

## 4. Функциональные требования

### 4.1 Пользовательская часть (Frontend)

#### 4.1.1 Главная страница
**Требования:**
- слайдер с акциями/новинками;
- популярные категории (grid 4x2);
- хиты продаж (карусель);
- блок «Как сделать заказ»;
- блок преимуществ;
- футер с контактами.

**Компоненты:**
- `HeroSlider`
- `CategoryGrid`
- `ProductCarousel`
- `HowToOrder`
- `Features`
- `Footer`

**API:**
- `GET /api/banners`
- `GET /api/categories/popular`
- `GET /api/products/bestsellers`

#### 4.1.2 Поиск товаров
**Требования:**
- поиск по артикулу (основной);
- опциональный фильтр по бренду;
- поиск у всех поставщиков;
- таблица результатов;
- сортировка: цена, наличие, поставщик;
- фильтры: цена, бренд, поставщик, наличие;
- пагинация.

**API:**
- `POST /api/products/search`

**Логика:**
1. Запрос ко всем активным поставщикам.
2. Агрегация результатов.
3. Применение наценки поставщика.
4. Дедупликация по `(артикул + бренд)`.
5. Сортировка по приоритету.

#### 4.1.3 Карточка товара
**Требования:**
- галерея изображений;
- название, артикул, бренд;
- текущая и старая цена;
- наличие и количество;
- характеристики (таблица);
- применимость;
- OE номера;
- похожие товары;
- отзывы;
- кнопки: «В корзину», «В избранное», «Купить в 1 клик».

**API:**
- `GET /api/products/:id`
- `POST /api/products/:id/reviews`
- `GET /api/products/:id/related`

#### 4.1.4 Корзина
**Требования:**
- таблица товаров;
- изменение количества;
- удаление;
- автосохранение в localStorage;
- расчет итогов;
- промокод;
- переход к оформлению.

**API:**
- `GET /api/cart`
- `POST /api/cart/items`
- `PUT /api/cart/items/:id`
- `DELETE /api/cart/items/:id`
- `POST /api/cart/apply-promo`

#### 4.1.5 Оформление заказа
Шаги:
1. Контактные данные.
2. Доставка.
3. Оплата.
4. Подтверждение.

**API:**
- `POST /api/orders`
- `GET /api/delivery/cities?search=`
- `GET /api/delivery/warehouses/:cityRef`
- `POST /api/promo-codes/validate`

#### 4.1.6 Личный кабинет
Разделы:
- профиль;
- мои заказы;
- избранное;
- адреса.

**API:**
- `GET /api/users/me`
- `PUT /api/users/me`
- `PUT /api/users/me/password`
- `GET /api/users/me/orders`
- `GET /api/users/me/favorites`
- `POST /api/users/link-telegram`
- `POST /api/users/link-viber`

### 4.2 Административная панель
Разделы:
- Dashboard (метрики, графики, топ товаров, последние заказы);
- управление заказами;
- управление товарами;
- управление поставщиками;
- управление пользователями;
- настройки (общие, оплата, доставка, мессенджеры).

### 4.3 Backend API
Ключевые домены:
- аутентификация и авторизация;
- каталог и поиск товаров;
- корзина;
- заказы;
- платежи;
- доставка (Новая Почта).

### 4.4 Интеграция с поставщиками
- Базовый интерфейс `BaseSupplierAPI` с обязательными методами:
  - `search_products`
  - `get_product_details`
  - `check_availability`
  - `create_order`
  - `get_order_status`
- Пример конкретной реализации: `OmegaSupplierAPI`.
- Отдельный `SupplierSyncService` для синхронизации, поиска по поставщикам, дедупликации и применения наценки.

### 4.5 Интеграция мессенджеров
- Telegram-бот на `aiogram` с состояниями:
  - поиск запчастей;
  - корзина;
  - оформление заказа;
  - просмотр заказов.
- Предусмотрены сценарии регистрации, поиска, добавления в корзину и оформления заказа.

### 4.6 Celery задачи
Периодические задачи:
- синхронизация поставщиков (ежечасно);
- проверка статусов платежей (каждые 5 минут);
- обновление статусов доставки (каждые 30 минут);
- очистка старых корзин;
- напоминания о брошенных корзинах;
- обновление статистики товаров;
- резервное копирование БД.

## 5. Требования к производительности

### 5.1 Скорость ответа API
- GET запросы: `< 200ms` (95 перцентиль)
- POST запросы: `< 500ms` (95 перцентиль)
- Поиск товаров: `< 3s` (включая запросы к поставщикам)
- Обработка платежа: `< 1s`

### 5.2 Масштабируемость
- Поддержка до `1000` одновременных пользователей
- До `100` запросов в секунду
- База данных: до `10 млн` товаров
- Кэширование часто запрашиваемых данных в Redis

### 5.3 Доступность
- Uptime: `99.9%`
- Автоматический restart при падении
- Health checks каждые `30` секунд
- Мониторинг через Prometheus + Grafana

## 6. Требования к безопасности

### 6.1 Аутентификация
- JWT токены с временем жизни `1 час`
- Refresh токены с временем жизни `30 дней`
- Безопасное хранение паролей (`bcrypt`)
- Rate limiting на login endpoints (`5 попыток / минуту`)

### 6.2 Защита данных
- HTTPS для всех соединений (обязательно)
- XSS защита
- CSRF токены для форм
- SQL injection защита (ORM)
- Валидация всех входных данных
- Sanitization пользовательского контента

### 6.3 API ключи
- Хранение в переменных окружения (`.env`)
- Rotation ключей каждые `90` дней
- Логирование всех обращений к внешним API
- Обработка ошибок без раскрытия чувствительной информации

## 7. Тестирование

### 7.1 Unit тесты

```python
# Пример pytest тестов

import pytest
from app.services.supplier_sync import SupplierSyncService


@pytest.mark.asyncio
async def test_search_across_suppliers(db_session):
    """Тест поиска у поставщиков"""

    service = SupplierSyncService(db_session)
    results = await service.search_across_suppliers("1234567", "BOSCH")

    assert isinstance(results, list)
    assert len(results) > 0
    assert all("article" in r for r in results)
    assert all("price" in r for r in results)


def test_create_order(db_session, test_user):
    """Тест создания заказа"""

    from app.services.order_service import OrderService

    order_service = OrderService(db_session)
    order = order_service.create_order(
        user_id=test_user.id,
        items=[{"product_id": 1, "quantity": 2}],
        delivery={...},
        recipient={...},
    )

    assert order.id is not None
    assert order.status == "new"
    assert len(order.items) == 1
```

### 7.2 Integration тесты
- Тестирование интеграций с поставщиками (mock API)
- Тестирование платежных систем (sandbox)
- Тестирование Новой Почты API
- Тестирование мессенджеров (mock bot)

### 7.3 Load тесты
- Apache JMeter или Locust
- Симуляция 1000 одновременных пользователей
- Проверка response time под нагрузкой
- Проверка работы БД под нагрузкой

## 8. Развертывание

### 8.1 Production environment

```yaml
# docker-compose.prod.yml

version: '3.8'

services:
  nginx:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - ./frontend/build:/usr/share/nginx/html
    depends_on:
      - backend
    restart: always

  backend:
    build: ./backend
    command: gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app --bind 0.0.0.0:8000
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    env_file:
      - .env
    depends_on:
      - db
      - redis
    restart: always
    deploy:
      replicas: 3

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  redis:
    image: redis:7-alpine
    restart: always

  celery_worker:
    build: ./backend
    command: celery -A app.celery_app worker --loglevel=info --concurrency=4
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    env_file:
      - .env
    depends_on:
      - db
      - redis
    restart: always
    deploy:
      replicas: 2

  celery_beat:
    build: ./backend
    command: celery -A app.celery_app beat --loglevel=info
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    env_file:
      - .env
    depends_on:
      - db
      - redis
    restart: always

  prometheus:
    image: prom/prometheus
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"
    restart: always

  grafana:
    image: grafana/grafana
    volumes:
      - grafana_data:/var/lib/grafana
    ports:
      - "3001:3000"
    restart: always

volumes:
  postgres_data:
  prometheus_data:
  grafana_data:
```

## 9. Мониторинг и логирование

### 9.1 Метрики (Prometheus)

```python
# app/monitoring.py

from prometheus_client import Counter, Histogram, Gauge
import time

# Счетчики запросов
http_requests_total = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

# Время выполнения запросов
http_request_duration = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration',
    ['method', 'endpoint']
)

# Активные пользователи
active_users = Gauge(
    'active_users',
    'Number of active users'
)

# Использование в middleware
from fastapi import Request
import time

@app.middleware("http")
async def monitor_requests(request: Request, call_next):
    start_time = time.time()

    response = await call_next(request)

    duration = time.time() - start_time

    http_requests_total.labels(
        method=request.method,
        endpoint=request.url.path,
        status=response.status_code
    ).inc()

    http_request_duration.labels(
        method=request.method,
        endpoint=request.url.path
    ).observe(duration)

    return response
```

### 9.2 Логирование

```python
# app/logging_config.py

import logging
from logging.handlers import RotatingFileHandler
import sys


def setup_logging():
    # Формат логов
    log_format = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'

    # Консольный handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(logging.Formatter(log_format))

    # Файловый handler (с ротацией)
    file_handler = RotatingFileHandler(
        'logs/app.log',
        maxBytes=10485760,  # 10MB
        backupCount=10
    )
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(logging.Formatter(log_format))

    # Ошибки отдельно
    error_handler = RotatingFileHandler(
        'logs/error.log',
        maxBytes=10485760,
        backupCount=10
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(logging.Formatter(log_format))

    # Корневой logger
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.DEBUG)
    root_logger.addHandler(console_handler)
    root_logger.addHandler(file_handler)
    root_logger.addHandler(error_handler)
```

## 10. Roadmap (Будущие функции)

### Фаза 2 (3-6 месяцев)
- Мобильное приложение (React Native / Flutter)
- Программа лояльности
- Система скидок и акций
- Чат с менеджером (онлайн поддержка)
- Сравнение товаров
- Рекомендательная система
- Multi-language support (UA, RU, EN)

### Фаза 3 (6-12 месяцев)
- AI поиск по фото запчасти
- VIN декодер
- Подбор запчастей по автомобилю
- B2B кабинет для оптовиков
- API для партнеров
- Marketplace (другие продавцы)

## 11. Контрольный список внедрения

### Pre-launch
- Настройка production сервера
- SSL сертификаты
- Настройка домена
- Миграция БД
- Тестирование всех интеграций
- Load testing
- Security audit
- Настройка backup
- Настройка мониторинга
- Документация API

### Launch
- Запуск production
- Мониторинг ошибок
- Проверка всех интеграций
- Тестовые заказы
- Оповещение команды

### Post-launch
- Анализ метрик
- Сбор обратной связи
- Исправление багов
- Оптимизация производительности

## Конец технического задания

Версия: `1.0`  
Дата: `2024`  
Автор: `AutoParts Development Team`

Это ТЗ должно покрыть все аспекты проекта для его полной реализации.
