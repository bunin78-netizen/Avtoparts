import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ArrowLeft, CreditCard, Building2, Smartphone, Package, MapPin, User, Phone, Mail, MessageCircle, CheckCircle2, Truck } from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
}

const novaPoshtaCities = [
  'Київ', 'Харків', 'Одеса', 'Дніпро', 'Донецьк', 'Запоріжжя', 'Львів', 'Кривий Ріг',
  'Миколаїв', 'Маріуполь', 'Луганськ', 'Вінниця', 'Макіївка', 'Херсон', 'Полтава',
  'Чернігів', 'Черкаси', 'Житомир', 'Суми', 'Хмельницький', 'Рівне', 'Кропивницький',
  'Івано-Франківськ', 'Тернопіль', 'Луцьк', 'Ужгород',
];

const novaPoshtaWarehouses: Record<string, string[]> = {
  'Київ': ['Відділення №1: вул. Пирогівський шлях, 135', 'Відділення №2: вул. Хрещатик, 22', 'Відділення №5: просп. Перемоги, 67', 'Відділення №12: вул. Велика Васильківська, 100', 'Поштомат №108: вул. Саксаганського, 42'],
  'Харків': ['Відділення №1: вул. Полтавський шлях, 28', 'Відділення №3: просп. Науки, 14', 'Відділення №7: вул. Сумська, 45'],
  'Одеса': ['Відділення №1: вул. Новосельського, 68', 'Відділення №4: вул. Дерибасівська, 12', 'Відділення №9: просп. Шевченка, 33'],
  'Львів': ['Відділення №1: вул. Городоцька, 194', 'Відділення №3: просп. Свободи, 28', 'Відділення №6: вул. Шевченка, 15'],
  'Дніпро': ['Відділення №1: просп. Яворницького, 64', 'Відділення №2: вул. Робоча, 23', 'Відділення №5: вул. Титова, 36'],
};

export function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '',
    city: '', warehouse: '',
    paymentMethod: 'mono',
    comment: '',
    messenger: 'telegram',
  });

  const availableWarehouses = novaPoshtaWarehouses[form.city] || [];

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-green-50 rounded-3xl p-8 border border-green-200">
          <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Замовлення оформлено! 🎉</h2>
          <p className="text-slate-600 mb-2">Номер замовлення: <span className="font-bold text-orange-600">AP-{Math.floor(Math.random() * 90000) + 10000}</span></p>
          <p className="text-sm text-slate-500 mb-6">
            Ми надіслали підтвердження на ваш email та {form.messenger === 'telegram' ? 'Telegram' : 'Viber'}.
            Менеджер зв'яжеться з вами найближчим часом.
          </p>

          <div className="bg-white rounded-2xl p-4 mb-6 text-left text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Доставка:</span>
              <span className="font-medium">Нова Пошта — {form.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Відділення:</span>
              <span className="font-medium text-right max-w-[60%]">{form.warehouse}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Оплата:</span>
              <span className="font-medium">{form.paymentMethod === 'mono' ? '💳 Monobank' : '🏦 ПриватБанк'}</span>
            </div>
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => onNavigate('catalog')} className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition font-medium">
              Продовжити покупки
            </button>
            <a href="https://t.me/" target="_blank" rel="noreferrer" className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition font-medium flex items-center gap-2">
              <MessageCircle size={18} /> Telegram
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <button onClick={() => onNavigate('cart')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-orange-600 mb-4 transition">
        <ArrowLeft size={16} /> Повернутися до кошика
      </button>

      <h2 className="text-2xl font-bold text-slate-800 mb-6">Оформлення замовлення</h2>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[
          { num: 1, label: 'Контакти', icon: User },
          { num: 2, label: 'Доставка', icon: Truck },
          { num: 3, label: 'Оплата', icon: CreditCard },
        ].map(({ num, label, icon: Icon }) => (
          <div key={num} className="flex items-center gap-2 flex-1">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition w-full
              ${step >= num ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-400'}`}>
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{num}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          {/* Step 1: Contacts */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><User size={18} /> Контактні дані</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">Ім'я *</label>
                  <input type="text" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Іван" />
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">Прізвище *</label>
                  <input type="text" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Петренко" />
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block"><Phone size={14} className="inline" /> Телефон *</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="+380 (XX) XXX-XX-XX" />
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block"><Mail size={14} className="inline" /> Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="email@example.com" />
                </div>
              </div>

              {/* Messenger preference */}
              <div>
                <label className="text-sm text-slate-600 mb-2 block">Зв'язок через месенджер</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setForm({...form, messenger: 'telegram'})}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition border
                      ${form.messenger === 'telegram' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                  >
                    <span>✈️</span> Telegram
                  </button>
                  <button
                    onClick={() => setForm({...form, messenger: 'viber'})}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition border
                      ${form.messenger === 'viber' ? 'bg-purple-50 border-purple-300 text-purple-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                  >
                    <span>💬</span> Viber
                  </button>
                </div>
              </div>

              <button onClick={() => setStep(2)}
                className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition">
                Далі — Доставка →
              </button>
            </div>
          )}

          {/* Step 2: Delivery (Nova Poshta) */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Package size={18} />
                <span>Доставка — </span>
                <span className="text-red-600">Нова Пошта</span>
                <span className="text-lg">📦</span>
              </h3>

              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-3">
                <div className="bg-red-500 text-white rounded-lg p-2">
                  <Truck size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-red-800">Інтеграція з Новою Поштою</p>
                  <p className="text-xs text-red-600">Автоматичне створення ТТН • Відстеження • SMS-сповіщення</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-600 mb-1 block"><MapPin size={14} className="inline" /> Місто *</label>
                <select value={form.city} onChange={e => setForm({...form, city: e.target.value, warehouse: ''})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                  <option value="">Оберіть місто</option>
                  {novaPoshtaCities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {form.city && (
                <div>
                  <label className="text-sm text-slate-600 mb-1 block"><Building2 size={14} className="inline" /> Відділення / Поштомат *</label>
                  <select value={form.warehouse} onChange={e => setForm({...form, warehouse: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <option value="">Оберіть відділення</option>
                    {availableWarehouses.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label className="text-sm text-slate-600 mb-1 block">Коментар до замовлення</label>
                <textarea value={form.comment} onChange={e => setForm({...form, comment: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 h-20 resize-none"
                  placeholder="Додаткові побажання..." />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border border-slate-200 text-slate-600 font-medium py-3 rounded-xl hover:bg-slate-50 transition">
                  ← Назад
                </button>
                <button onClick={() => setStep(3)}
                  className="flex-1 bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition">
                  Далі — Оплата →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><CreditCard size={18} /> Спосіб оплати</h3>

              <div className="space-y-3">
                {/* Monobank */}
                <button
                  onClick={() => setForm({...form, paymentMethod: 'mono'})}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition text-left
                    ${form.paymentMethod === 'mono' ? 'border-black bg-gray-50' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0">
                    M
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">Monobank</p>
                    <p className="text-xs text-slate-500">Оплата карткою через Monobank Acquiring</p>
                  </div>
                  <Smartphone size={20} className={form.paymentMethod === 'mono' ? 'text-black' : 'text-slate-300'} />
                </button>

                {/* PrivatBank */}
                <button
                  onClick={() => setForm({...form, paymentMethod: 'privat'})}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition text-left
                    ${form.paymentMethod === 'privat' ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0">
                    P
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">ПриватБанк</p>
                    <p className="text-xs text-slate-500">Оплата через LiqPay / Приват24</p>
                  </div>
                  <CreditCard size={20} className={form.paymentMethod === 'privat' ? 'text-green-500' : 'text-slate-300'} />
                </button>

                {/* Cash on delivery */}
                <button
                  onClick={() => setForm({...form, paymentMethod: 'cod'})}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition text-left
                    ${form.paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white text-2xl shrink-0">
                    💵
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">Накладений платіж</p>
                    <p className="text-xs text-slate-500">Оплата при отриманні на Новій Пошті</p>
                  </div>
                  <Package size={20} className={form.paymentMethod === 'cod' ? 'text-orange-500' : 'text-slate-300'} />
                </button>
              </div>

              <div className="flex gap-3 mt-4">
                <button onClick={() => setStep(2)} className="flex-1 border border-slate-200 text-slate-600 font-medium py-3 rounded-xl hover:bg-slate-50 transition">
                  ← Назад
                </button>
                <button onClick={handlePlaceOrder}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition shadow-md">
                  ✅ Підтвердити замовлення
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sticky top-48">
            <h3 className="font-bold text-slate-800 mb-3">Ваше замовлення</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm gap-2">
                  <span className="text-slate-600 truncate flex-1">{product.name} × {quantity}</span>
                  <span className="font-medium shrink-0">{(product.price * quantity).toLocaleString()} ₴</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 mt-3 pt-3">
              <div className="flex justify-between font-bold text-lg">
                <span>Разом</span>
                <span className="text-orange-600">{totalPrice.toLocaleString()} ₴</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
