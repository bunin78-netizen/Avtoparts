import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, Eye, EyeOff, LogIn, UserPlus, ArrowRight, Shield, Truck, CreditCard, MessageCircle, Send } from 'lucide-react';

interface AuthPageProps {
  onNavigate: (page: string) => void;
  initialTab?: 'login' | 'register';
}

export function AuthPage({ onNavigate, initialTab = 'login' }: AuthPageProps) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', messenger: 'telegram' as 'telegram' | 'viber', agree: false,
  });

  const handleLogin = () => {
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(loginForm.email, loginForm.password);
      if (result.success) {
        onNavigate('catalog');
      } else {
        setError(result.error || 'Помилка входу');
      }
      setLoading(false);
    }, 600);
  };

  const handleRegister = () => {
    setError('');
    if (regForm.password !== regForm.confirmPassword) {
      setError('Паролі не співпадають');
      return;
    }
    if (!regForm.agree) {
      setError('Потрібно погодитись з умовами');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = register({
        email: regForm.email,
        password: regForm.password,
        firstName: regForm.firstName,
        lastName: regForm.lastName,
        phone: regForm.phone,
        messenger: regForm.messenger,
      });
      if (result.success) {
        onNavigate('account');
      } else {
        setError(result.error || 'Помилка реєстрації');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <div className="flex-1 max-w-md mx-auto lg:mx-0 w-full">
          {/* Tabs */}
          <div className="flex bg-slate-100 rounded-2xl p-1 mb-6">
            <button
              onClick={() => { setTab('login'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition
                ${tab === 'login' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <LogIn size={16} /> Увійти
            </button>
            <button
              onClick={() => { setTab('register'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition
                ${tab === 'register' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <UserPlus size={16} /> Реєстрація
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}

          {tab === 'login' ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
              <h2 className="text-xl font-bold text-slate-800">Вхід в особистий кабінет</h2>
              <p className="text-sm text-slate-500">Увійдіть, щоб переглядати замовлення та керувати профілем</p>

              <div>
                <label className="text-sm text-slate-600 mb-1 block">Email *</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-600 mb-1 block">Пароль *</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginForm.password}
                    onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="Введіть пароль"
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

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-orange-500 focus:ring-orange-400" />
                  Запам'ятати мене
                </label>
                <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                  Забули пароль?
                </button>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-3 rounded-xl hover:from-orange-600 hover:to-yellow-600 transition shadow-md shadow-orange-200 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <><LogIn size={18} /> Увійти</>
                )}
              </button>

              <div className="text-center">
                <p className="text-sm text-slate-500">
                  Ще немає акаунту?{' '}
                  <button onClick={() => setTab('register')} className="text-orange-600 hover:text-orange-700 font-semibold">
                    Зареєструватися
                  </button>
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-400 text-center mb-3">Демо-доступ для тесту:</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setLoginForm({ email: 'user@test.com', password: '123456' }); }}
                    className="text-xs bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition font-medium"
                  >
                    👤 Клієнт
                  </button>
                  <button
                    onClick={() => { setLoginForm({ email: 'admin@avtopro.ua', password: 'admin' }); }}
                    className="text-xs bg-purple-50 text-purple-700 px-3 py-2 rounded-lg hover:bg-purple-100 transition font-medium"
                  >
                    🔑 Адмін
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
              <h2 className="text-xl font-bold text-slate-800">Реєстрація</h2>
              <p className="text-sm text-slate-500">Створіть акаунт для швидкого замовлення</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">Ім'я *</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={regForm.firstName}
                      onChange={e => setRegForm({ ...regForm, firstName: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="Іван"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">Прізвище *</label>
                  <input
                    type="text"
                    value={regForm.lastName}
                    onChange={e => setRegForm({ ...regForm, lastName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="Петренко"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-600 mb-1 block">Email *</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={regForm.email}
                    onChange={e => setRegForm({ ...regForm, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-600 mb-1 block">Телефон *</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={regForm.phone}
                    onChange={e => setRegForm({ ...regForm, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="+380 (XX) XXX-XX-XX"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-600 mb-2 block">Зв'язок через месенджер</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setRegForm({ ...regForm, messenger: 'telegram' })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition border
                      ${regForm.messenger === 'telegram' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                  >
                    <Send size={14} /> Telegram
                  </button>
                  <button
                    onClick={() => setRegForm({ ...regForm, messenger: 'viber' })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition border
                      ${regForm.messenger === 'viber' ? 'bg-purple-50 border-purple-300 text-purple-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                  >
                    <MessageCircle size={14} /> Viber
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">Пароль *</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={regForm.password}
                      onChange={e => setRegForm({ ...regForm, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="Мін. 6 символів"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">Повторіть пароль *</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={regForm.confirmPassword}
                    onChange={e => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="Повторіть пароль"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={regForm.agree}
                  onChange={e => setRegForm({ ...regForm, agree: e.target.checked })}
                  className="rounded border-slate-300 text-orange-500 focus:ring-orange-400 mt-0.5"
                />
                <span className="text-xs text-slate-500">
                  Я погоджуюсь з{' '}
                  <span className="text-orange-600 font-medium">умовами використання</span>{' '}
                  та{' '}
                  <span className="text-orange-600 font-medium">політикою конфіденційності</span>
                </span>
              </label>

              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-3 rounded-xl hover:from-orange-600 hover:to-yellow-600 transition shadow-md shadow-orange-200 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <><UserPlus size={18} /> Зареєструватися</>
                )}
              </button>

              <p className="text-sm text-slate-500 text-center">
                Вже маєте акаунт?{' '}
                <button onClick={() => setTab('login')} className="text-orange-600 hover:text-orange-700 font-semibold">
                  Увійти
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Benefits Sidebar */}
        <div className="flex-1 max-w-md mx-auto lg:mx-0">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white mb-4">
            <h3 className="text-lg font-bold mb-4">Переваги особистого кабінету</h3>
            <div className="space-y-4">
              {[
                { icon: ArrowRight, title: 'Швидке замовлення', desc: 'Збережені дані для миттєвого оформлення' },
                { icon: Truck, title: 'Відстеження доставки', desc: 'Статус замовлення та ТТН Нової Пошти' },
                { icon: CreditCard, title: 'Історія замовлень', desc: 'Всі замовлення та повторні покупки' },
                { icon: Shield, title: 'Список бажань', desc: 'Збережіть товари та слідкуйте за цінами' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="bg-orange-500/20 rounded-lg p-2 shrink-0">
                    <Icon size={16} className="text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="text-xs text-slate-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
            <h4 className="font-bold text-slate-800 mb-2">🎁 Бонус за реєстрацію</h4>
            <p className="text-sm text-slate-600 mb-3">Отримайте <span className="font-bold text-orange-600">знижку 5%</span> на перше замовлення після реєстрації!</p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="bg-white px-2 py-1 rounded font-mono font-bold text-orange-600">WELCOME5</span>
              <span>— промокод для знижки</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
