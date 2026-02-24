import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartPageProps {
  onNavigate: (page: string) => void;
}

export function CartPage({ onNavigate }: CartPageProps) {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="text-7xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">Кошик порожній</h2>
        <p className="text-slate-500 mb-6">Додайте товари з каталогу для оформлення замовлення</p>
        <button
          onClick={() => onNavigate('catalog')}
          className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition font-medium"
        >
          Перейти до каталогу
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <button onClick={() => onNavigate('catalog')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-orange-600 mb-4 transition">
        <ArrowLeft size={16} /> Продовжити покупки
      </button>

      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <ShoppingBag size={24} /> Кошик
        <span className="text-sm font-normal text-slate-500">({items.length} товарів)</span>
      </h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Items */}
        <div className="flex-1 space-y-3">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex gap-4">
              <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-3xl">🔧</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-800 truncate">{product.name}</h3>
                <p className="text-xs text-slate-500">{product.brand} | {product.sku}</p>
                <p className="text-xs text-slate-400 mt-0.5">{product.supplier}</p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 bg-slate-50 rounded-lg">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-1.5 text-slate-500 hover:text-orange-600 transition"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-1.5 text-slate-500 hover:text-orange-600 transition"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-800">{(product.price * quantity).toLocaleString()} ₴</span>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-600 font-medium transition"
          >
            Очистити кошик
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sticky top-48">
            <h3 className="font-bold text-slate-800 mb-4">Разом</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Товари ({items.reduce((s, i) => s + i.quantity, 0)} шт.)</span>
                <span className="font-medium">{totalPrice.toLocaleString()} ₴</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 flex items-center gap-1"><Truck size={14} /> Доставка</span>
                <span className="text-green-600 font-medium">За тарифами НП</span>
              </div>
            </div>
            <div className="border-t border-slate-100 mt-4 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>До сплати</span>
                <span className="text-orange-600">{totalPrice.toLocaleString()} ₴</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('checkout')}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-3 rounded-xl mt-4 hover:from-orange-600 hover:to-yellow-600 transition shadow-md shadow-orange-200"
            >
              Оформити замовлення
            </button>
            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="text-xs text-slate-400">Оплата:</span>
              <span className="text-xs font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded">💳 Mono</span>
              <span className="text-xs font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded">🏦 Приват</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
