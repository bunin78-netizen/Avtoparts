import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export function MessengerWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-72 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-4 text-white">
            <h4 className="font-bold">Потрібна допомога? 👋</h4>
            <p className="text-xs text-orange-100">Напишіть нам в месенджер</p>
          </div>
          <div className="p-4 space-y-2">
            <a
              href="https://t.me/avtopro_shop"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
            >
              <div className="bg-blue-500 rounded-lg p-2 text-white">
                <Send size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">Telegram</p>
                <p className="text-xs text-slate-500">Відповідь за 2 хв</p>
              </div>
            </a>
            <a
              href="viber://chat?number=380671234567"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition"
            >
              <div className="bg-purple-500 rounded-lg p-2 text-white">
                <MessageCircle size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">Viber</p>
                <p className="text-xs text-slate-500">Спільнота та підтримка</p>
              </div>
            </a>
            <a
              href="tel:+380441234567"
              className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition"
            >
              <div className="bg-green-500 rounded-lg p-2 text-white text-lg">
                📞
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">Зателефонувати</p>
                <p className="text-xs text-slate-500">+380 (44) 123-45-67</p>
              </div>
            </a>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-slate-700 hover:bg-slate-800 rotate-90'
            : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 animate-bounce'
        }`}
        style={{ animationDuration: '2s' }}
      >
        {isOpen ? <X size={24} className="text-white" /> : <MessageCircle size={24} className="text-white" />}
      </button>
    </div>
  );
}
