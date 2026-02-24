import { X, ShoppingCart, Heart, Check, AlertCircle, Truck, Shield, ArrowLeft, ArrowRight } from 'lucide-react';
import type { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

interface Props {
  product: Product;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: Props) {
  const { addToCart, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'compat' | 'delivery'>('desc');
  const isInCart = items.some(item => item.product.id === product.id);

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-bold text-slate-800 truncate pr-4">{product.name}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition shrink-0">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image */}
            <div className="md:w-1/2">
              <div className="bg-slate-50 rounded-2xl aspect-square flex items-center justify-center relative">
                <div className="text-8xl opacity-30">🔧</div>
                {discount > 0 && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-xl">
                    -{discount}%
                  </span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="md:w-1/2 space-y-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Артикул: {product.sku} | OEM: {product.oem}</p>
                <h3 className="text-xl font-bold text-slate-800">{product.name}</h3>
                <p className="text-sm text-slate-500 mt-1">Бренд: <span className="font-medium text-slate-700">{product.brand}</span></p>
                <p className="text-xs text-slate-400 mt-1">Постачальник: {product.supplier}</p>
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2">
                {product.inStock ? (
                  <><Check size={16} className="text-green-500" /><span className="text-sm text-green-600 font-medium">В наявності на складі</span></>
                ) : (
                  <><AlertCircle size={16} className="text-orange-500" /><span className="text-sm text-orange-600 font-medium">Під замовлення (2-3 дні)</span></>
                )}
              </div>

              {/* Price */}
              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-bold text-slate-800">{product.price.toLocaleString()} ₴</span>
                  {product.oldPrice && (
                    <span className="text-lg text-slate-400 line-through">{product.oldPrice.toLocaleString()} ₴</span>
                  )}
                </div>
              </div>

              {/* Quantity & Add to cart */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2.5 text-slate-500 hover:bg-slate-50 transition">
                    <ArrowLeft size={14} />
                  </button>
                  <span className="w-10 text-center font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2.5 text-slate-500 hover:bg-slate-50 transition">
                    <ArrowRight size={14} />
                  </button>
                </div>
                <button
                  onClick={() => { for (let i = 0; i < quantity; i++) addToCart(product); }}
                  disabled={!product.inStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition shadow-md
                    ${product.inStock
                      ? isInCart
                        ? 'bg-green-500 text-white hover:bg-green-600 shadow-green-200'
                        : 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-200'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
                >
                  <ShoppingCart size={18} />
                  {isInCart ? 'В кошику ✓' : 'Додати в кошик'}
                </button>
                <button className="p-3 border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-200 transition">
                  <Heart size={18} />
                </button>
              </div>

              {/* Quick info */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-xl p-2.5">
                  <Truck size={14} className="text-red-500" /> Доставка Новою Поштою
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-xl p-2.5">
                  <Shield size={14} className="text-green-500" /> Гарантія 12 місяців
                </div>
              </div>

              {/* Payment */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Оплата:</span>
                <span className="bg-black text-white px-2 py-0.5 rounded font-bold">Mono</span>
                <span className="bg-green-600 text-white px-2 py-0.5 rounded font-bold">Приват</span>
                <span className="bg-orange-500 text-white px-2 py-0.5 rounded font-bold">Наложка</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 border-t border-slate-100 pt-4">
            <div className="flex gap-1 mb-4">
              {[
                { id: 'desc' as const, label: 'Опис' },
                { id: 'compat' as const, label: 'Сумісність' },
                { id: 'delivery' as const, label: 'Доставка' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm rounded-xl font-medium transition
                    ${activeTab === tab.id ? 'bg-orange-100 text-orange-700' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'desc' && (
              <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
            )}
            {activeTab === 'compat' && (
              <div>
                <p className="text-sm text-slate-600 mb-2">Підходить для автомобілів:</p>
                <div className="flex flex-wrap gap-2">
                  {product.compatibility.map(car => (
                    <span key={car} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-xl text-sm font-medium">
                      🚗 {car}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'delivery' && (
              <div className="text-sm text-slate-600 space-y-2">
                <p>📦 <strong>Нова Пошта:</strong> 1-3 дні, від 45 ₴</p>
                <p>🚛 <strong>Кур'єром:</strong> 1-2 дні, від 80 ₴</p>
                <p>🏪 <strong>Самовивіз:</strong> безкоштовно (м. Київ)</p>
                <p className="text-green-600 font-medium mt-2">🎁 Безкоштовна доставка від 3,000 ₴!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
