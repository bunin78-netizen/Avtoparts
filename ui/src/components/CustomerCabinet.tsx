import { useState } from 'react';
import { useAuth, type Order } from '../context/AuthContext';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import {
  User, Package, Heart, Settings, LogOut, ShoppingBag, Truck,
  MapPin, CreditCard, CheckCircle2, Clock, AlertCircle, Eye,
  ChevronRight, Edit3, Save, Send, MessageCircle, Phone, Mail,
  ShoppingCart, Trash2, ArrowRight, Box, Star
} from 'lucide-react';

interface CustomerCabinetProps {
  onNavigate: (page: string) => void;
}

type CabinetTab = 'overview' | 'orders' | 'wishlist' | 'profile' | 'tracking';

export function CustomerCabinet({ onNavigate }: CustomerCabinetProps) {
  const { user, logout, updateProfile, toggleWishlist } = useAuth();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<CabinetTab>('overview');
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    city: user?.city || '',
    messenger: user?.messenger || 'telegram' as 'telegram' | 'viber',
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (!user) return null;

  const wishlistProducts = products.filter(p => user.wishlist.includes(p.id));

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'paid': return 'bg-blue-100 text-blue-700';
      case 'shipping': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Очікує оплати';
      case 'paid': return 'Оплачено';
      case 'shipping': return 'Доставляється';
      case 'delivered': return 'Доставлено';
      case 'cancelled': return 'Скасовано';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock size={14} />;
      case 'paid': return <CreditCard size={14} />;
      case 'shipping': return <Truck size={14} />;
      case 'delivered': return <CheckCircle2 size={14} />;
      case 'cancelled': return <AlertCircle size={14} />;
    }
  };

  const handleSaveProfile = () => {
    updateProfile({
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      phone: editForm.phone,
      email: editForm.email,
      city: editForm.city,
      messenger: editForm.messenger,
    });
    setEditMode(false);
  };

  const handleLogout = () => {
    logout();
    onNavigate('catalog');
  };

  const tabs: { id: CabinetTab; label: string; icon: typeof User; count?: number }[] = [
    { id: 'overview', label: 'Огляд', icon: User },
    { id: 'orders', label: 'Замовлення', icon: Package, count: user.orders.length },
    { id: 'wishlist', label: 'Бажання', icon: Heart, count: user.wishlist.length },
    { id: 'tracking', label: 'Відстеження', icon: Truck },
    { id: 'profile', label: 'Профіль', icon: Settings },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 mb-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-2xl flex items-center justify-center text-2xl font-bold">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
            <p className="text-slate-400 text-sm">{user.email}</p>
            <p className="text-slate-500 text-xs mt-0.5">Клієнт з {user.registeredAt}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('catalog')}
            className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition flex items-center gap-2"
          >
            <ShoppingBag size={16} /> До каталогу
          </button>
          <button
            onClick={handleLogout}
            className="bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-600 transition flex items-center gap-2"
          >
            <LogOut size={16} /> Вийти
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-56 shrink-0">
          <nav className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2 flex lg:flex-col gap-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedOrder(null); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition whitespace-nowrap
                  ${activeTab === tab.id ? 'bg-orange-100 text-orange-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-auto bg-slate-200 text-slate-600 text-xs px-1.5 py-0.5 rounded-full font-bold">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Package size={14} className="text-blue-500" />
                    <span className="text-xs text-slate-500">Замовлення</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{user.orders.length}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Truck size={14} className="text-purple-500" />
                    <span className="text-xs text-slate-500">В дорозі</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    {user.orders.filter(o => o.status === 'shipping').length}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart size={14} className="text-red-500" />
                    <span className="text-xs text-slate-500">Бажання</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{user.wishlist.length}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard size={14} className="text-green-500" />
                    <span className="text-xs text-slate-500">Витрачено</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-800">
                    {user.orders.reduce((s, o) => s + o.total, 0).toLocaleString()} ₴
                  </p>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Package size={16} /> Останні замовлення
                  </h3>
                  <button onClick={() => setActiveTab('orders')} className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
                    Усі <ChevronRight size={14} />
                  </button>
                </div>
                {user.orders.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">📦</div>
                    <p className="text-slate-500 text-sm">Замовлень поки немає</p>
                    <button onClick={() => onNavigate('catalog')} className="mt-3 text-orange-600 font-medium text-sm hover:text-orange-700">
                      Перейти до каталогу →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {user.orders.slice(0, 3).map(order => (
                      <div
                        key={order.id}
                        onClick={() => { setActiveTab('orders'); setSelectedOrder(order); }}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-white rounded-lg p-2 shadow-sm">
                            <ShoppingBag size={16} className="text-slate-500" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{order.id}</p>
                            <p className="text-xs text-slate-500">{order.date} • {order.items.length} товарів</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)} {getStatusLabel(order.status)}
                          </span>
                          <span className="font-bold text-sm text-slate-800">{order.total.toLocaleString()} ₴</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setActiveTab('tracking')}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition text-left"
                >
                  <Truck size={20} className="text-red-500 mb-2" />
                  <p className="font-semibold text-slate-800 text-sm">Відстежити посилку</p>
                  <p className="text-xs text-slate-500">Нова Пошта • ТТН</p>
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition text-left"
                >
                  <Heart size={20} className="text-red-400 mb-2" />
                  <p className="font-semibold text-slate-800 text-sm">Список бажань</p>
                  <p className="text-xs text-slate-500">{user.wishlist.length} товарів</p>
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition text-left"
                >
                  <Settings size={20} className="text-slate-500 mb-2" />
                  <p className="font-semibold text-slate-800 text-sm">Налаштування</p>
                  <p className="text-xs text-slate-500">Профіль та адреса</p>
                </button>
              </div>
            </div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && !selectedOrder && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Package size={18} /> Мої замовлення
              </h3>
              {user.orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-lg font-semibold text-slate-700 mb-2">Замовлень поки немає</p>
                  <p className="text-sm text-slate-500 mb-4">Оберіть товари з каталогу та оформіть перше замовлення</p>
                  <button onClick={() => onNavigate('catalog')} className="bg-orange-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-orange-600 transition">
                    Перейти до каталогу
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {user.orders.map(order => (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="border border-slate-100 rounded-xl p-4 hover:shadow-md transition cursor-pointer"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-800">{order.id}</span>
                          <span className="text-xs text-slate-500">{order.date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)} {getStatusLabel(order.status)}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {order.items.map((item, i) => (
                          <p key={i} className="text-sm text-slate-600">
                            {item.name} × {item.qty} — <span className="font-medium">{(item.price * item.qty).toLocaleString()} ₴</span>
                          </p>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <MapPin size={12} /> {order.delivery.city}
                          {order.delivery.ttn && (
                            <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded font-mono text-[10px]">ТТН: {order.delivery.ttn}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{order.total.toLocaleString()} ₴</span>
                          <Eye size={14} className="text-slate-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Order Detail */}
          {activeTab === 'orders' && selectedOrder && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <button onClick={() => setSelectedOrder(null)} className="text-sm text-slate-500 hover:text-orange-600 mb-4 flex items-center gap-1">
                ← Назад до замовлень
              </button>

              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Замовлення {selectedOrder.id}</h3>
                  <p className="text-sm text-slate-500">від {selectedOrder.date}</p>
                </div>
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusIcon(selectedOrder.status)} {getStatusLabel(selectedOrder.status)}
                </span>
              </div>

              {/* Items */}
              <div className="border border-slate-100 rounded-xl overflow-hidden mb-4">
                <div className="bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-500">Товари</div>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-lg">🔧</div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                        <p className="text-xs text-slate-500">Арт: {item.sku} • Кількість: {item.qty}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-800">{(item.price * item.qty).toLocaleString()} ₴</span>
                  </div>
                ))}
                <div className="bg-slate-50 px-4 py-3 flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-600">Разом</span>
                  <span className="text-lg font-bold text-orange-600">{selectedOrder.total.toLocaleString()} ₴</span>
                </div>
              </div>

              {/* Delivery & Payment Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Truck size={14} className="text-red-500" /> Доставка
                  </h4>
                  <p className="text-sm text-slate-600">Нова Пошта — {selectedOrder.delivery.city}</p>
                  <p className="text-xs text-slate-500 mt-1">{selectedOrder.delivery.warehouse}</p>
                  {selectedOrder.delivery.ttn && (
                    <p className="text-xs font-mono bg-white px-2 py-1 rounded mt-2 text-red-600 inline-block">
                      ТТН: {selectedOrder.delivery.ttn}
                    </p>
                  )}
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <CreditCard size={14} className="text-green-500" /> Оплата
                  </h4>
                  <p className="text-sm text-slate-600">
                    {selectedOrder.paymentMethod === 'mono' ? '💳 Monobank' : selectedOrder.paymentMethod === 'privat' ? '🏦 ПриватБанк' : '💵 Наложений платіж'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedOrder.status === 'pending' ? 'Очікує оплати' : 'Оплачено'}
                  </p>
                </div>
              </div>

              {/* Tracking Timeline */}
              {selectedOrder.delivery.ttn && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-red-800 mb-3 flex items-center gap-2">
                    <Box size={14} /> Відстеження Нова Пошта
                  </h4>
                  <div className="space-y-2">
                    {[
                      { label: 'Замовлення створено', done: true },
                      { label: 'Передано в Нову Пошту', done: true },
                      { label: 'В дорозі', done: selectedOrder.status === 'shipping' || selectedOrder.status === 'delivered' },
                      { label: 'Прибуло у місто', done: selectedOrder.status === 'delivered' },
                      { label: 'Отримано', done: selectedOrder.status === 'delivered' },
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${step.done ? 'bg-green-500' : 'bg-slate-200'}`}>
                          {step.done && <CheckCircle2 size={10} className="text-white" />}
                        </div>
                        <span className={`text-sm ${step.done ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reorder */}
              <button
                onClick={() => {
                  selectedOrder.items.forEach(item => {
                    const prod = products.find(p => p.sku === item.sku);
                    if (prod) addToCart(prod);
                  });
                  onNavigate('cart');
                }}
                className="mt-4 w-full bg-orange-500 text-white font-medium py-2.5 rounded-xl hover:bg-orange-600 transition flex items-center justify-center gap-2"
              >
                <ArrowRight size={16} /> Повторити замовлення
              </button>
            </div>
          )}

          {/* Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Heart size={18} className="text-red-400" /> Список бажань
              </h3>
              {wishlistProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💝</div>
                  <p className="text-lg font-semibold text-slate-700 mb-2">Список бажань порожній</p>
                  <p className="text-sm text-slate-500 mb-4">Додавайте товари, натискаючи ❤️ на картці товару</p>
                  <button onClick={() => onNavigate('catalog')} className="bg-orange-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-orange-600 transition">
                    Перейти до каталогу
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {wishlistProducts.map(product => (
                    <div key={product.id} className="flex items-center gap-4 p-3 border border-slate-100 rounded-xl hover:shadow-sm transition">
                      <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-2xl">🔧</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-slate-800 truncate">{product.name}</h4>
                        <p className="text-xs text-slate-500">{product.brand} | {product.sku}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {product.inStock ? (
                            <span className="text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle2 size={12} /> В наявності</span>
                          ) : (
                            <span className="text-xs text-orange-600 font-medium flex items-center gap-1"><Clock size={12} /> Під замовлення</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          {product.oldPrice && (
                            <p className="text-xs text-slate-400 line-through">{product.oldPrice.toLocaleString()} ₴</p>
                          )}
                          <p className="font-bold text-slate-800">{product.price.toLocaleString()} ₴</p>
                        </div>
                        <button
                          onClick={() => { addToCart(product); }}
                          disabled={!product.inStock}
                          className="bg-orange-500 text-white p-2 rounded-xl hover:bg-orange-600 transition disabled:bg-slate-200 disabled:text-slate-400"
                        >
                          <ShoppingCart size={16} />
                        </button>
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="text-red-400 hover:text-red-600 p-2 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tracking */}
          {activeTab === 'tracking' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-5 text-white">
                <h3 className="font-bold text-lg flex items-center gap-2 mb-1">
                  <Box size={20} /> Відстеження посилок — Нова Пошта
                </h3>
                <p className="text-red-200 text-sm">Відстежуйте статус ваших замовлень</p>
              </div>

              {user.orders.filter(o => o.delivery.ttn).length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
                  <div className="text-5xl mb-3">📦</div>
                  <p className="text-slate-500">Немає активних відправлень</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {user.orders.filter(o => o.delivery.ttn).map(order => (
                    <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div>
                          <p className="font-bold text-slate-800">{order.id}</p>
                          <p className="text-xs text-slate-500 font-mono">ТТН: {order.delivery.ttn}</p>
                        </div>
                        <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)} {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                        <MapPin size={14} className="text-red-500" />
                        <span>{order.delivery.city} → {order.delivery.warehouse}</span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(step => (
                          <div
                            key={step}
                            className={`h-1.5 flex-1 rounded-full ${
                              step <= (order.status === 'delivered' ? 5 : order.status === 'shipping' ? 3 : order.status === 'paid' ? 2 : 1)
                                ? 'bg-green-500'
                                : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Settings size={18} /> Налаштування профілю
                </h3>
                {!editMode ? (
                  <button onClick={() => setEditMode(true)} className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 font-medium">
                    <Edit3 size={14} /> Редагувати
                  </button>
                ) : (
                  <button onClick={handleSaveProfile} className="flex items-center gap-1 text-sm bg-green-500 text-white px-4 py-1.5 rounded-lg hover:bg-green-600 transition font-medium">
                    <Save size={14} /> Зберегти
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-500 mb-1 block">Ім'я</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={editForm.firstName}
                        onChange={e => setEditForm({ ...editForm, firstName: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    ) : (
                      <p className="text-slate-800 font-medium flex items-center gap-2"><User size={14} className="text-slate-400" /> {user.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-slate-500 mb-1 block">Прізвище</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={editForm.lastName}
                        onChange={e => setEditForm({ ...editForm, lastName: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    ) : (
                      <p className="text-slate-800 font-medium">{user.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-500 mb-1 block">Email</label>
                  {editMode ? (
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                  ) : (
                    <p className="text-slate-800 font-medium flex items-center gap-2"><Mail size={14} className="text-slate-400" /> {user.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-slate-500 mb-1 block">Телефон</label>
                  {editMode ? (
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                  ) : (
                    <p className="text-slate-800 font-medium flex items-center gap-2"><Phone size={14} className="text-slate-400" /> {user.phone}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-slate-500 mb-1 block">Місто доставки</label>
                  {editMode ? (
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={editForm.city}
                        onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder="Введіть місто"
                      />
                    </div>
                  ) : (
                    <p className="text-slate-800 font-medium flex items-center gap-2"><MapPin size={14} className="text-slate-400" /> {user.city || 'Не вказано'}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-slate-500 mb-2 block">Месенджер для зв'язку</label>
                  {editMode ? (
                    <div className="flex gap-3">
                      <button
                        onClick={() => setEditForm({ ...editForm, messenger: 'telegram' })}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition border
                          ${editForm.messenger === 'telegram' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-slate-200 text-slate-500'}`}
                      >
                        <Send size={14} /> Telegram
                      </button>
                      <button
                        onClick={() => setEditForm({ ...editForm, messenger: 'viber' })}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition border
                          ${editForm.messenger === 'viber' ? 'bg-purple-50 border-purple-300 text-purple-700' : 'border-slate-200 text-slate-500'}`}
                      >
                        <MessageCircle size={14} /> Viber
                      </button>
                    </div>
                  ) : (
                    <p className="text-slate-800 font-medium flex items-center gap-2">
                      {user.messenger === 'telegram' ? <><Send size={14} className="text-blue-500" /> Telegram</> : <><MessageCircle size={14} className="text-purple-500" /> Viber</>}
                    </p>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Star size={12} /> Зареєстровано: {user.registeredAt}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
