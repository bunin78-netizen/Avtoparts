from pydantic import BaseModel, Field


class CategoryOut(BaseModel):
    id: int
    name: str


class ProductOut(BaseModel):
    id: int
    article: str
    brand: str
    title: str
    price: float
    old_price: float | None = None
    stock: int
    supplier_name: str


class ProductSearchIn(BaseModel):
    article: str = Field(min_length=2)
    brand: str | None = None


class CartItemIn(BaseModel):
    product_id: int
    quantity: int = Field(ge=1, le=100)


class UpdateCartItemIn(BaseModel):
    quantity: int = Field(ge=1, le=100)


class OrderCreateIn(BaseModel):
    user_id: int


class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
