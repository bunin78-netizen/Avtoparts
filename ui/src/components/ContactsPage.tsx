import { Phone, Mail, MapPin, Clock, MessageCircle, Send, ExternalLink } from 'lucide-react';

export function ContactsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Контакти</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Contact Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
          <h3 className="font-bold text-slate-800 text-lg">АвтоПро — Інтернет-магазин автозапчастин</h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-orange-100 rounded-xl p-2.5 shrink-0">
                <Phone size={18} className="text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800">Телефони</p>
                <p className="text-sm text-slate-600">+380 (44) 123-45-67</p>
                <p className="text-sm text-slate-600">+380 (67) 987-65-43</p>
                <p className="text-sm text-slate-600">+380 (50) 111-22-33</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-xl p-2.5 shrink-0">
                <Mail size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800">Email</p>
                <p className="text-sm text-slate-600">info@avtopro.ua</p>
                <p className="text-sm text-slate-600">sales@avtopro.ua</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-green-100 rounded-xl p-2.5 shrink-0">
                <MapPin size={18} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800">Адреса</p>
                <p className="text-sm text-slate-600">м. Київ, вул. Автозаводська, 25</p>
                <p className="text-sm text-slate-600">Склад: м. Київ, вул. Промислова, 10</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-purple-100 rounded-xl p-2.5 shrink-0">
                <Clock size={18} className="text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800">Графік роботи</p>
                <p className="text-sm text-slate-600">Пн-Пт: 9:00 - 19:00</p>
                <p className="text-sm text-slate-600">Сб: 10:00 - 16:00</p>
                <p className="text-sm text-slate-600">Нд: вихідний</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messengers */}
        <div className="space-y-4">
          {/* Telegram */}
          <a href="https://t.me/avtopro_shop" target="_blank" rel="noreferrer"
            className="block bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-5 text-white hover:from-blue-600 hover:to-blue-700 transition shadow-lg shadow-blue-200">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-xl p-3">
                <Send size={28} />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold">Telegram</h4>
                <p className="text-blue-100 text-sm">Швидка консультація та замовлення</p>
                <p className="text-white/80 text-sm mt-1">@avtopro_shop</p>
              </div>
              <ExternalLink size={20} className="opacity-60" />
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">🤖 Бот-консультант</span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">📸 Фото запчастин</span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">🔔 Сповіщення</span>
            </div>
          </a>

          {/* Viber */}
          <a href="viber://chat?number=380671234567" target="_blank" rel="noreferrer"
            className="block bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-5 text-white hover:from-purple-600 hover:to-purple-700 transition shadow-lg shadow-purple-200">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-xl p-3">
                <MessageCircle size={28} />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold">Viber</h4>
                <p className="text-purple-100 text-sm">Спільнота автолюбителів</p>
                <p className="text-white/80 text-sm mt-1">+380 (67) 123-45-67</p>
              </div>
              <ExternalLink size={20} className="opacity-60" />
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">👥 Спільнота</span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">📢 Канал акцій</span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">💬 Підтримка</span>
            </div>
          </a>

          {/* Callback */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h4 className="font-bold text-slate-800 mb-3">📞 Замовити дзвінок</h4>
            <div className="space-y-3">
              <input type="text" placeholder="Ваше ім'я"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              <input type="tel" placeholder="+380 (XX) XXX-XX-XX"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              <button className="w-full bg-orange-500 text-white font-medium py-2.5 rounded-xl hover:bg-orange-600 transition">
                Передзвоніть мені
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Partners */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-bold text-slate-800 mb-4">Платіжні партнери</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
            <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0">M</div>
            <div>
              <h4 className="font-bold text-slate-800">Monobank</h4>
              <p className="text-xs text-slate-500">Онлайн-оплата карткою • Розстрочка до 12 міс. • Apple/Google Pay</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-green-50 rounded-xl p-4">
            <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0">P</div>
            <div>
              <h4 className="font-bold text-slate-800">ПриватБанк</h4>
              <p className="text-xs text-slate-500">LiqPay • Приват24 • Оплата частинами • Розстрочка</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
