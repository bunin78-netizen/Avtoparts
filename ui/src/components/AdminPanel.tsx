import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SupplierPanel } from './SupplierPanel';
import { SupplierImport } from './SupplierImport';
import {
  Lock, Mail, Eye, EyeOff, ShieldCheck, LogOut, LayoutDashboard,
  Cloud, Package, Users, BarChart3, Settings, ArrowLeft, Send, MessageCircle,
  ArrowDownToLine
} from 'lucide-react';

interface AdminPanelProps {
  onNavigate: (page: string) => void;
}

export function AdminPanel({ onNavigate }: AdminPanelProps) {
  const { user, isAdmin, login, logout } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: 'admin@avtopro.ua', password: 'admin' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminTab, setAdminTab] = useState<'suppliers' | 'import' | 'stats' | 'settings'>('suppliers');

  const handleAdminLogin = () => {
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(loginForm.email, loginForm.password);
      if (result.success) {
        setError('');
      } else {
        setError(result.error || 'Помилка входу');
      }
      setLoading(false);
    }, 600);
  };

  // Not logged in as admin - show admin login
  if (!isAdmin) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12">
        <button onClick={() => onNavigate('catalog')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-orange-600 mb-6 transition">
          <ArrowLeft size={16} /> Повернутися до магазину
        </button>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white text-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-xl font-bold">Панель адміністратора</h2>
            <p className="text-slate-400 text-sm mt-1">Доступ лише для адміністраторів</p>
          </div>

          {/* Login Form */}
          <div className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                ⚠️ {error}
              </div>
            )}

            {user && user.role === 'customer' && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm px-4 py-3 rounded-xl">
                ⚠️ Ви увійшли як клієнт <strong>{user.email}</strong>. Для доступу до адмін-панелі потрібен акаунт адміністратора.
                <button onClick={logout} className="block mt-2 text-yellow-800 font-semibold hover:underline">
                  Вийти та увійти як адмін →
                </button>
              </div>
            )}

            <div>
              <label className="text-sm text-slate-600 mb-1 block">Email адміністратора</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  placeholder="admin@avtopro.ua"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-600 mb-1 block">Пароль</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginForm.password}
                  onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  placeholder="Пароль"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleAdminLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-slate-700 to-slate-800 text-white font-bold py-3 rounded-xl hover:from-slate-800 hover:to-slate-900 transition shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <><ShieldCheck size={18} /> Увійти як адміністратор</>
              )}
            </button>

            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-400 text-center mb-2">Демо-дані для входу:</p>
              <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500 space-y-1">
                <p>📧 Email: <code className="bg-slate-200 px-1.5 py-0.5 rounded">admin@avtopro.ua</code></p>
                <p>🔑 Пароль: <code className="bg-slate-200 px-1.5 py-0.5 rounded">будь-який</code></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin is logged in - show admin dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <div className="text-white">
            <h2 className="text-lg font-bold">Панель адміністратора</h2>
            <p className="text-slate-400 text-sm">{user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('catalog')}
            className="bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-600 transition flex items-center gap-2"
          >
            <LayoutDashboard size={16} /> До магазину
          </button>
          <button
            onClick={() => { logout(); onNavigate('catalog'); }}
            className="bg-red-500/20 text-red-400 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-500/30 transition flex items-center gap-2"
          >
            <LogOut size={16} /> Вийти
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[
          { id: 'suppliers' as const, label: 'Постачальники API', icon: Cloud },
          { id: 'import' as const, label: 'Імпорт даних', icon: ArrowDownToLine },
          { id: 'stats' as const, label: 'Статистика', icon: BarChart3 },
          { id: 'settings' as const, label: 'Налаштування', icon: Settings },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setAdminTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition whitespace-nowrap
              ${adminTab === tab.id ? 'bg-orange-100 text-orange-700' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {adminTab === 'suppliers' && <SupplierPanel />}

      {adminTab === 'import' && <SupplierImport />}

      {adminTab === 'stats' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <Package size={20} className="text-blue-500 mb-2" />
              <p className="text-xs text-slate-500">Замовлень сьогодні</p>
              <p className="text-3xl font-bold text-slate-800">47</p>
              <p className="text-xs text-green-600 mt-1">+12% від вчора</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <Users size={20} className="text-purple-500 mb-2" />
              <p className="text-xs text-slate-500">Нових клієнтів</p>
              <p className="text-3xl font-bold text-slate-800">23</p>
              <p className="text-xs text-green-600 mt-1">+8% від вчора</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <BarChart3 size={20} className="text-green-500 mb-2" />
              <p className="text-xs text-slate-500">Дохід сьогодні</p>
              <p className="text-3xl font-bold text-slate-800">125K ₴</p>
              <p className="text-xs text-green-600 mt-1">+15% від вчора</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <Cloud size={20} className="text-orange-500 mb-2" />
              <p className="text-xs text-slate-500">API запитів</p>
              <p className="text-3xl font-bold text-slate-800">1,247</p>
              <p className="text-xs text-slate-400 mt-1">за останню годину</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 className="font-bold text-slate-800 mb-4">Топ продажів сьогодні</h3>
            <div className="space-y-2">
              {[
                { name: 'Гальмівні колодки Brembo', sales: 12, revenue: 22200 },
                { name: 'Масляний фільтр Mann-Filter', sales: 28, revenue: 7980 },
                { name: 'Ремінь ГРМ Gates', sales: 8, revenue: 36000 },
                { name: 'Амортизатор Sachs', sales: 5, revenue: 16000 },
                { name: 'Свічки NGK (комплект)', sales: 15, revenue: 10800 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-slate-800">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-500">{item.sales} шт.</span>
                    <span className="font-bold text-slate-800">{item.revenue.toLocaleString()} ₴</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {adminTab === 'settings' && (
        <div className="max-w-2xl space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 className="font-bold text-slate-800 mb-4">Інтеграції платіжних систем</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white font-bold">M</div>
                  <div>
                    <p className="font-medium text-slate-800">Monobank Acquiring</p>
                    <p className="text-xs text-slate-500">API Token: ****-****-****-7a2b</p>
                  </div>
                </div>
                <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium">Активно</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
                  <div>
                    <p className="font-medium text-slate-800">ПриватБанк LiqPay</p>
                    <p className="text-xs text-slate-500">Public Key: ****3f8d</p>
                  </div>
                </div>
                <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium">Активно</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 className="font-bold text-slate-800 mb-4">Інтеграція Нова Пошта</h3>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white text-lg">📦</div>
                <div>
                  <p className="font-medium text-slate-800">Nova Poshta API 2.0</p>
                  <p className="text-xs text-slate-500">API Key: ****-****-****-9c4e</p>
                </div>
              </div>
              <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium">Активно</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 className="font-bold text-slate-800 mb-4">Месенджери</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white"><Send size={18} /></div>
                  <div>
                    <p className="font-medium text-slate-800">Telegram Bot</p>
                    <p className="text-xs text-slate-500">@avtopro_shop_bot</p>
                  </div>
                </div>
                <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium">Активно</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white"><MessageCircle size={18} /></div>
                  <div>
                    <p className="font-medium text-slate-800">Viber Bot</p>
                    <p className="text-xs text-slate-500">АвтоПро Official</p>
                  </div>
                </div>
                <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium">Активно</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
