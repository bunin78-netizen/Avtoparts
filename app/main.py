from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.routes import router
from app.core.database import Base, SessionLocal, engine
from app.logging_config import setup_logging
from app.models.entities import Category, Product, User
from app.monitoring import add_monitoring


setup_logging()
app = FastAPI(title="AutoParts Shop API", version="0.1.0")
app.include_router(router)
add_monitoring(app)


@app.get("/", response_class=HTMLResponse, include_in_schema=False)
def ui_home() -> str:
    return Path("app/ui_index.html").read_text(encoding="utf-8")


@app.on_event("startup")
def startup() -> None:
    Base.metadata.create_all(bind=engine)
    _seed_data(SessionLocal())


def _seed_data(db: Session) -> None:
    if db.scalar(select(Category.id).limit(1)):
        return

    engine_category = Category(name="Двигатель", is_popular=True)
    suspension_category = Category(name="Подвеска", is_popular=True)
    db.add_all([engine_category, suspension_category])
    db.flush()

    db.add_all(
        [
            Product(
                article="0986AB1234",
                brand="BOSCH",
                title="Тормозные колодки",
                price=1250,
                old_price=1450,
                stock=15,
                supplier_name="internal",
                category_id=suspension_category.id,
            ),
            Product(
                article="06A905115D",
                brand="VAG",
                title="Свеча зажигания",
                price=320,
                stock=35,
                supplier_name="internal",
                category_id=engine_category.id,
            ),
        ]
    )
    db.add(User(email="demo@autoparts.ua", full_name="Demo User"))
    db.commit()
    db.close()
