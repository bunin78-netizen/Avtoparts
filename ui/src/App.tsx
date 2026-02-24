import { useState, useCallback } from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { ProductCatalog } from './components/ProductCatalog';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { VehicleCatalog } from './components/VehicleCatalog';
import { DeliveryPage } from './components/DeliveryPage';
import { ContactsPage } from './components/ContactsPage';
import { AuthPage } from './components/AuthPage';
import { CustomerCabinet } from './components/CustomerCabinet';
import { AdminPanel } from './components/AdminPanel';
import { ProductModal } from './components/ProductModal';
import { MessengerWidget } from './components/MessengerWidget';
import { Footer } from './components/Footer';
import type { Product } from './data/products';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { isAuthenticated, isAdmin } = useAuth();

  const handleNavigate = useCallback((page: string) => {
    // Redirect to auth if accessing account without login
    if (page === 'account' && !isAuthenticated) {
      setCurrentPage('auth');
    } else if (page === 'admin' && !isAdmin) {
      setCurrentPage('admin');
    } else {
      setCurrentPage(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [isAuthenticated, isAdmin]);

  const handleViewProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1">
        {/* Hero Banner - only on catalog page */}
        {currentPage === 'catalog' && !searchQuery && (
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
            <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg animate-pulse">🔥 АКЦІЯ</span>
                    <span className="text-xs text-slate-400">Безкоштовна доставка від 3000 ₴</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
                    Автозапчастини<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">оригінальна якість</span>
                  </h2>
                  <p className="text-slate-400 mb-4 text-sm md:text-base max-w-lg">
                    Понад 170,000 запчастин від провідних європейських брендів.
                    Оплата через Monobank та ПриватБанк. Доставка Новою Поштою по всій Україні.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleNavigate('catalog')}
                      className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-xl font-bold hover:from-orange-600 hover:to-yellow-600 transition shadow-lg shadow-orange-500/30"
                    >
                      Перейти до каталогу
                    </button>
                    {!isAuthenticated && (
                      <button
                        onClick={() => handleNavigate('auth')}
                        className="border border-slate-600 text-slate-300 px-6 py-3 rounded-xl font-medium hover:bg-slate-700 transition"
                      >
                        Реєстрація
                      </button>
                    )}
                    {isAuthenticated && !isAdmin && (
                      <button
                        onClick={() => handleNavigate('account')}
                        className="border border-slate-600 text-slate-300 px-6 py-3 rounded-xl font-medium hover:bg-slate-700 transition"
                      >
                        Мій кабінет
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-slate-500">
                    <span className="flex items-center gap-1">📦 Нова Пошта</span>
                    <span className="flex items-center gap-1">💳 Mono / Приват</span>
                    <span className="flex items-center gap-1">✈️ Telegram</span>
                    <span className="flex items-center gap-1">💬 Viber</span>
                    <span className="flex items-center gap-1">🛡️ Гарантія</span>
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-center">
                  <div className="relative">
                    <div className="w-48 h-48 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-full flex items-center justify-center">
                      <div className="w-36 h-36 bg-gradient-to-br from-orange-500/30 to-yellow-500/30 rounded-full flex items-center justify-center">
                        <span className="text-7xl">🚗</span>
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                      -30%
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Quick Select */}
              <div className="mt-6 pt-6 border-t border-slate-700">
                <p className="text-xs text-slate-500 mb-3">Підбір за автомобілем:</p>
                <div className="flex flex-wrap gap-3 mb-4">
                  <button
                    onClick={() => handleNavigate('vehicles')}
                    className="flex items-center gap-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-white px-4 py-2 rounded-xl text-sm transition"
                  >
                    🚗 Легкові автомобілі
                  </button>
                  <button
                    onClick={() => handleNavigate('vehicles')}
                    className="flex items-center gap-2 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 text-white px-4 py-2 rounded-xl text-sm transition"
                  >
                    🚛 Вантажні автомобілі
                  </button>
                </div>
              </div>

              {/* Brand logos */}
              <div className="pt-4 border-t border-slate-700">
                <p className="text-xs text-slate-500 mb-3">Бренди в каталозі:</p>
                <div className="flex flex-wrap gap-3">
                  {['Bosch', 'Brembo', 'Mann-Filter', 'Sachs', 'NGK', 'Gates', 'Valeo', 'LuK', 'Mahle', 'SKF'].map(brand => (
                    <div key={brand} className="bg-slate-700/50 px-3 py-1.5 rounded-lg">
                      <span className="text-xs text-slate-300 font-medium">{brand}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'catalog' && (
          <ProductCatalog searchQuery={searchQuery} onViewProduct={handleViewProduct} />
        )}
        {currentPage === 'vehicles' && <VehicleCatalog onNavigate={handleNavigate} />}
        {currentPage === 'cart' && <CartPage onNavigate={handleNavigate} />}
        {currentPage === 'checkout' && <CheckoutPage onNavigate={handleNavigate} />}
        {currentPage === 'delivery' && <DeliveryPage />}
        {currentPage === 'contacts' && <ContactsPage />}
        {currentPage === 'auth' && <AuthPage onNavigate={handleNavigate} />}
        {currentPage === 'account' && <CustomerCabinet onNavigate={handleNavigate} />}
        {currentPage === 'admin' && <AdminPanel onNavigate={handleNavigate} />}
      </main>

      <Footer />

      {/* Messenger floating widget */}
      <MessengerWidget />

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
