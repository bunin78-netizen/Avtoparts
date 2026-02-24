import { Truck, Package, MapPin, Clock, Shield, Phone, CheckCircle2, Box, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export function DeliveryPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState<null | {
    status: string; city: string; date: string; steps: { title: string; date: string; done: boolean; }[];
  }>(null);

  const handleTrack = () => {
    if (!trackingNumber) return;
    setTrackingResult({
      status: 'В дорозі',
      city: 'Київ → Львів',
      date: '16.01.2024',
      steps: [
        { title: 'Замовлення створено', date: '14.01.2024 10:30', done: true },
        { title: 'Передано в Нову Пошту', date: '14.01.2024 14:00', done: true },
        { title: 'Відправлення в дорозі', date: '15.01.2024 08:00', done: true },
        { title: 'Прибуло у місто отримання', date: '16.01.2024 (очікується)', done: false },
        { title: 'Отримано', date: '—', done: false },
      ],
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Truck size={24} /> Доставка та відстеження
      </h2>

      {/* Nova Poshta Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 mb-6 text-white flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20 rounded-xl p-3">
              <Package size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Нова Пошта</h3>
              <p className="text-red-200 text-sm">Офіційний партнер з доставки</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {[
              { icon: Truck, label: 'Доставка 1-3 дні' },
              { icon: MapPin, label: '30,000+ відділень' },
              { icon: Shield, label: 'Страхування вантажу' },
              { icon: Phone, label: 'SMS-сповіщення' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 bg-white/10 rounded-xl p-2.5">
                <Icon size={16} />
                <span className="text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="text-6xl">📦</div>
      </div>

      {/* Tracking */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Box size={18} /> Відстеження посилки
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={trackingNumber}
            onChange={e => setTrackingNumber(e.target.value)}
            placeholder="Введіть номер ТТН (наприклад: 20400000123456)"
            className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <button
            onClick={handleTrack}
            className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition font-medium flex items-center gap-2 shrink-0"
          >
            Відстежити <ArrowRight size={16} />
          </button>
        </div>

        {trackingResult && (
          <div className="mt-6 bg-slate-50 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-slate-500">ТТН: {trackingNumber}</p>
                <p className="font-bold text-slate-800">{trackingResult.city}</p>
              </div>
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                🚛 {trackingResult.status}
              </span>
            </div>
            <div className="space-y-3">
              {trackingResult.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0
                    ${step.done ? 'bg-green-500' : 'bg-slate-200'}`}>
                    {step.done && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${step.done ? 'text-slate-800' : 'text-slate-400'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-slate-500">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delivery Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <Clock size={24} className="text-orange-500 mb-3" />
          <h4 className="font-bold text-slate-800 mb-2">Терміни доставки</h4>
          <ul className="text-sm text-slate-600 space-y-1.5">
            <li>• Київ та область: 1 день</li>
            <li>• Обласні центри: 1-2 дні</li>
            <li>• Інші міста: 2-3 дні</li>
            <li>• Село: 3-5 днів</li>
          </ul>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <Shield size={24} className="text-blue-500 mb-3" />
          <h4 className="font-bold text-slate-800 mb-2">Гарантії</h4>
          <ul className="text-sm text-slate-600 space-y-1.5">
            <li>• Страхування кожної посилки</li>
            <li>• Автоматичне створення ТТН</li>
            <li>• Повернення протягом 14 днів</li>
            <li>• Безкоштовна доставка від 3000₴</li>
          </ul>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <Package size={24} className="text-green-500 mb-3" />
          <h4 className="font-bold text-slate-800 mb-2">Способи отримання</h4>
          <ul className="text-sm text-slate-600 space-y-1.5">
            <li>• Відділення Нової Пошти</li>
            <li>• Поштомати Нової Пошти</li>
            <li>• Кур'єр до дверей</li>
            <li>• Самовивіз зі складу (Київ)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
