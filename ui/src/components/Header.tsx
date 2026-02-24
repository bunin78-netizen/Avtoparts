import { ShoppingCart, Search, Menu, X, Phone, MapPin, Clock, User, Wrench, LogIn, ChevronDown, LogOut, Package, Heart, Settings } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({ currentPage, onNavigate, searchQuery, onSearchChange }: HeaderProps) {
  const { totalItems, totalPrice } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navItems = [
    { id: 'catalog', label: 'Каталог запчастин' },
    { id: 'vehicles', label: '🚗 Легкові / 🚛 Вантажні' },
    { id: 'delivery', label: 'Доставка' },
    { id: 'contacts', label: 'Контакти' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top bar */}
      <div className="bg-slate-800 text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1"><Phone size={12} /> +380 (44) 123-45-67</span>
            <span className="hidden sm:flex items-center gap-1"><MapPin size={12} /> м. Київ, вул. Автозаводська, 25</span>
            <span className="hidden md:flex items-center gap-1"><Clock size={12} /> Пн-Сб: 9:00 - 19:00</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-yellow-400">🇺🇦 Укр</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <button onClick={() => onNavigate('catalog')} className="flex items-center gap-2 shrink-0">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-2">
              <Wrench size={28} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-slate-800 leading-tight">АвтоПро</h1>
              <p className="text-[10px] text-slate-500 leading-tight">Автозапчастини онлайн</p>
            </div>
          </button>

          {/* Search */}
          <div className="flex-1 max-w-xl relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { onSearchChange(e.target.value); onNavigate('catalog'); }}
              placeholder="Пошук за назвою, артикулом або OEM..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm"
            />
          </div>

          {/* User Account */}
          <div className="relative" ref={userMenuRef}>
            {isAuthenticated ? (
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 transition"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user?.firstName[0]}{user?.lastName[0]}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs text-slate-500 leading-tight">
                    {isAdmin ? '🔑 Адмін' : 'Мій кабінет'}
                  </p>
                  <p className="text-sm font-medium text-slate-800 leading-tight">{user?.firstName}</p>
                </div>
                <ChevronDown size={14} className="text-slate-400 hidden md:block" />
              </button>
            ) : (
              <button
                onClick={() => onNavigate('auth')}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 transition"
              >
                <User size={20} />
                <span className="hidden md:inline text-sm font-medium">Увійти</span>
              </button>
            )}

            {/* User Dropdown */}
            {userMenuOpen && isAuthenticated && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in">
                <div className="p-3 bg-slate-50 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-800">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <div className="py-1">
                  {!isAdmin && (
                    <>
                      <button
                        onClick={() => { onNavigate('account'); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition"
                      >
                        <User size={14} /> Мій кабінет
                      </button>
                      <button
                        onClick={() => { onNavigate('account'); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition"
                      >
                        <Package size={14} /> Мої замовлення
                      </button>
                      <button
                        onClick={() => { onNavigate('account'); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition"
                      >
                        <Heart size={14} /> Список бажань
                      </button>
                      <button
                        onClick={() => { onNavigate('account'); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition"
                      >
                        <Settings size={14} /> Налаштування
                      </button>
                    </>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => { onNavigate('admin'); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-purple-700 hover:bg-purple-50 transition"
                    >
                      <Settings size={14} /> Адмін-панель
                    </button>
                  )}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); onNavigate('catalog'); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut size={14} /> Вийти
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
          <button
            onClick={() => onNavigate('cart')}
            className="relative flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-4 py-2.5 rounded-xl transition shrink-0 shadow-md shadow-orange-200"
          >
            <ShoppingCart size={20} />
            <div className="hidden sm:block text-left">
              <p className="text-[10px] leading-tight opacity-90">Кошик</p>
              <p className="text-sm font-bold leading-tight">{totalPrice.toLocaleString()} ₴</p>
            </div>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-t border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <ul className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row md:items-center gap-0 md:gap-1`}>
            {navItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }}
                  className={`block w-full text-left px-4 py-2.5 text-sm font-medium transition rounded-lg
                    ${currentPage === item.id
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-slate-600 hover:text-orange-600 hover:bg-orange-50'
                    }`}
                >
                  {item.label}
                </button>
              </li>
            ))}

            {/* Mobile-only auth links */}
            <li className="md:hidden border-t border-slate-200 mt-2 pt-2">
              {isAuthenticated ? (
                <>
                  {!isAdmin && (
                    <button
                      onClick={() => { onNavigate('account'); setMobileMenuOpen(false); }}
                      className="block w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                    >
                      👤 Мій кабінет
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                      className="block w-full text-left px-4 py-2.5 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg"
                    >
                      🔑 Адмін-панель
                    </button>
                  )}
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); onNavigate('catalog'); }}
                    className="block w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    🚪 Вийти
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { onNavigate('auth'); setMobileMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                  >
                    <LogIn size={14} className="inline mr-2" /> Увійти / Реєстрація
                  </button>
                </>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
