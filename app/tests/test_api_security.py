from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.api.routes import delete_cart_item, update_cart_item
from app.core.database import Base
from app.models.entities import CartItem, Category, Product
from app.schemas.common import CategoryOut, ProductOut, UpdateCartItemIn


def _build_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    return sessionmaker(bind=engine, autocommit=False, autoflush=False)()


def test_response_models_parse_sqlalchemy_entities() -> None:
    category = Category(id=5, name="Engine", is_popular=True)
    product = Product(
        id=9,
        article="A123",
        brand="BOSCH",
        title="Filter",
        price=100.0,
        old_price=120.0,
        stock=4,
        supplier_name="internal",
        category_id=5,
    )

    assert CategoryOut.model_validate(category).id == 5
    assert ProductOut.model_validate(product).article == "A123"


def test_cart_item_mutations_are_scoped_by_user() -> None:
    db = _build_session()
    db.add(Category(id=1, name="Suspension", is_popular=True))
    db.add(
        Product(
            id=1,
            article="SKU1",
            brand="VAG",
            title="Part",
            price=10.0,
            old_price=None,
            stock=2,
            supplier_name="internal",
            category_id=1,
        )
    )
    db.add(CartItem(id=100, user_id=1, product_id=1, quantity=1))
    db.commit()

    try:
        update_cart_item(item_id=100, payload=UpdateCartItemIn(quantity=3), user_id=2, db=db)
    except HTTPException as exc:
        assert exc.status_code == 404
    else:
        raise AssertionError("Expected 404 for cross-user update")

    try:
        delete_cart_item(item_id=100, user_id=2, db=db)
    except HTTPException as exc:
        assert exc.status_code == 404
    else:
        raise AssertionError("Expected 404 for cross-user delete")

    assert db.get(CartItem, 100) is not None
