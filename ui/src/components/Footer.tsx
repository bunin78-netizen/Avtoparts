import { Wrench, Send, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-800 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-2">
                <Wrench size={20} className="text-white" />
              </div>
              <span className="text-lg font-bold">АвтоПро</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Інтернет-магазин автозапчастин в Україні. Працюємо з 2015 року.
              Більше 170,000 товарів від провідних брендів.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-3">Інформація</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-orange-400 transition">Про компанію</a></li>
              <li><a href="#" className="hover:text-orange-400 transition">Доставка та оплата</a></li>
              <li><a href="#" className="hover:text-orange-400 transition">Гарантія та повернення</a></li>
              <li><a href="#" className="hover:text-orange-400 transition">Політика конфіденційності</a></li>
              <li><a href="#" className="hover:text-orange-400 transition">Оферта</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-3">Контакти</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2"><Phone size={14} /> +380 (44) 123-45-67</li>
              <li className="flex items-center gap-2"><Phone size={14} /> +380 (67) 987-65-43</li>
              <li className="flex items-center gap-2"><Mail size={14} /> info@avtopro.ua</li>
              <li className="flex items-center gap-2"><MapPin size={14} /> м. Київ, вул. Автозаводська, 25</li>
            </ul>
          </div>

          {/* Messengers & Payment */}
          <div>
            <h4 className="font-bold mb-3">Ми в месенджерах</h4>
            <div className="flex gap-3 mb-4">
              <a href="https://t.me/avtopro_shop" target="_blank" rel="noreferrer"
                className="bg-blue-500 hover:bg-blue-600 transition p-2.5 rounded-xl">
                <Send size={18} />
              </a>
              <a href="viber://chat?number=380671234567" target="_blank" rel="noreferrer"
                className="bg-purple-500 hover:bg-purple-600 transition p-2.5 rounded-xl">
                <MessageCircle size={18} />
              </a>
            </div>
            <h4 className="font-bold mb-2 text-sm">Оплата</h4>
            <div className="flex gap-2 mb-3">
              <span className="bg-black text-white px-2.5 py-1 rounded-lg text-xs font-bold">Mono</span>
              <span className="bg-green-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold">Приват</span>
              <span className="bg-slate-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold">Visa</span>
              <span className="bg-slate-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold">MC</span>
            </div>
            <h4 className="font-bold mb-2 text-sm">Доставка</h4>
            <span className="bg-red-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold">📦 Нова Пошта</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <p>© 2024 АвтоПро. Всі права захищені.</p>
          <p>Оригінальні запчастини від провідних брендів Європи</p>
        </div>
      </div>
    </footer>
  );
}
