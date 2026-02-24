from pydantic import BaseModel, ConfigDict, Field


class ORMBaseModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class CategoryOut(ORMBaseModel):
    id: int
    name: str


class ProductOut(ORMBaseModel):
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


class UserOut(ORMBaseModel):
    id: int
    email: str
    full_name: str
