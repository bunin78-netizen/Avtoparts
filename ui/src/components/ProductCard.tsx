import { ShoppingCart, Heart, Eye, Check, AlertCircle } from 'lucide-react';
import type { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onViewProduct: (product: Product) => void;
}

export function ProductCard({ product, onViewProduct }: ProductCardProps) {
  const { addToCart, items } = useCart();
  const { user, isAuthenticated, toggleWishlist } = useAuth();
  const [addedAnim, setAddedAnim] = useState(false);
  const isInCart = items.some(item => item.product.id === product.id);
  const isLiked = isAuthenticated && user?.wishlist.includes(product.id);

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleAdd = () => {
    addToCart(product);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1000);
  };

  const handleLike = () => {
    if (isAuthenticated) {
      toggleWishlist(product.id);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 overflow-hidden group flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-slate-50 aspect-[4/3]">
        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <div className="text-6xl opacity-30">🔧</div>
        </div>
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            -{discount}%
          </span>
        )}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleLike}
            className={`p-2 rounded-full shadow-md transition ${isLiked ? 'bg-red-500 text-white' : 'bg-white text-slate-500 hover:text-red-500'}`}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => onViewProduct(product)}
            className="p-2 bg-white text-slate-500 hover:text-blue-500 rounded-full shadow-md transition"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] text-slate-400 mb-1">Артикул: {product.sku} | OEM: {product.oem}</p>
        <h3
          className="text-sm font-semibold text-slate-800 mb-1 cursor-pointer hover:text-orange-600 transition line-clamp-2"
          onClick={() => onViewProduct(product)}
        >
          {product.name}
        </h3>
        <p className="text-xs text-slate-500 mb-1">{product.brand}</p>
        <p className="text-[10px] text-slate-400 mb-3 line-clamp-1">{product.compatibility.join(', ')}</p>

        <div className="mt-auto">
          {/* Stock status */}
          <div className="flex items-center gap-1 mb-2">
            {product.inStock ? (
              <><Check size={14} className="text-green-500" /><span className="text-xs text-green-600 font-medium">В наявності</span></>
            ) : (
              <><AlertCircle size={14} className="text-orange-500" /><span className="text-xs text-orange-600 font-medium">Під замовлення</span></>
            )}
          </div>

          {/* Price & button */}
          <div className="flex items-end justify-between gap-2">
            <div>
              {product.oldPrice && (
                <p className="text-xs text-slate-400 line-through">{product.oldPrice.toLocaleString()} ₴</p>
              )}
              <p className="text-lg font-bold text-slate-800">{product.price.toLocaleString()} ₴</p>
            </div>
            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className={`p-2.5 rounded-xl transition-all duration-300 shadow-sm
                ${addedAnim
                  ? 'bg-green-500 text-white scale-110'
                  : isInCart
                    ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                    : product.inStock
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
            >
              {addedAnim ? <Check size={18} /> : <ShoppingCart size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
