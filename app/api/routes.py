from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import and_, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.integrations.suppliers.omega import OmegaSupplierAPI
from app.models.entities import CartItem, Category, Order, Product, User
from app.schemas.common import (
    CartItemIn,
    CategoryOut,
    OrderCreateIn,
    ProductOut,
    ProductSearchIn,
    UpdateCartItemIn,
    UserOut,
)
from app.services.supplier_sync import SupplierSyncService

router = APIRouter(prefix="/api")


@router.get("/categories/popular", response_model=list[CategoryOut])
def get_popular_categories(db: Session = Depends(get_db)) -> list[Category]:
    return db.scalars(select(Category).where(Category.is_popular.is_(True)).limit(8)).all()


@router.get("/products/bestsellers", response_model=list[ProductOut])
def get_bestsellers(db: Session = Depends(get_db)) -> list[Product]:
    return db.scalars(select(Product).order_by(Product.stock.desc()).limit(10)).all()


@router.post("/products/search")
async def search_products(payload: ProductSearchIn) -> list[dict]:
    service = SupplierSyncService([OmegaSupplierAPI()])
    return await service.search_across_suppliers(payload.article, payload.brand)


@router.get("/products/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)) -> Product:
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.get("/products/{product_id}/related", response_model=list[ProductOut])
def get_related(product_id: int, db: Session = Depends(get_db)) -> list[Product]:
    product = db.get(Product, product_id)
    if not product:
        return []
    stmt = select(Product).where(Product.category_id == product.category_id, Product.id != product_id).limit(6)
    return db.scalars(stmt).all()


@router.get("/cart")
def get_cart(user_id: int, db: Session = Depends(get_db)) -> list[CartItem]:
    return db.scalars(select(CartItem).where(CartItem.user_id == user_id)).all()


@router.post("/cart/items")
def add_cart_item(payload: CartItemIn, user_id: int, db: Session = Depends(get_db)) -> dict:
    item = CartItem(user_id=user_id, product_id=payload.product_id, quantity=payload.quantity)
    db.add(item)
    db.commit()
    db.refresh(item)
    return {"id": item.id, "message": "added"}


@router.put("/cart/items/{item_id}")
def update_cart_item(item_id: int, payload: UpdateCartItemIn, user_id: int, db: Session = Depends(get_db)) -> dict:
    stmt = select(CartItem).where(and_(CartItem.id == item_id, CartItem.user_id == user_id))
    item = db.scalar(stmt)
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    item.quantity = payload.quantity
    db.commit()
    return {"message": "updated"}


@router.delete("/cart/items/{item_id}")
def delete_cart_item(item_id: int, user_id: int, db: Session = Depends(get_db)) -> dict:
    stmt = select(CartItem).where(and_(CartItem.id == item_id, CartItem.user_id == user_id))
    item = db.scalar(stmt)
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(item)
    db.commit()
    return {"message": "deleted"}


@router.post("/orders")
def create_order(payload: OrderCreateIn, db: Session = Depends(get_db)) -> dict:
    items = db.scalars(select(CartItem).where(CartItem.user_id == payload.user_id)).all()
    if not items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    total = 0.0
    for item in items:
        product = db.get(Product, item.product_id)
        if product:
            total += product.price * item.quantity
    order = Order(user_id=payload.user_id, total_amount=total)
    db.add(order)
    for item in items:
        db.delete(item)
    db.commit()
    db.refresh(order)
    return {"order_id": order.id, "status": order.status, "total": order.total_amount}


@router.get("/users/me", response_model=UserOut)
def get_me(user_id: int, db: Session = Depends(get_db)) -> User:
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
