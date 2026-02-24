import { useState } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle, Loader, Database, ArrowDownToLine, Settings, Activity, BarChart3, Cloud, Link2 } from 'lucide-react';
import { suppliers } from '../data/products';

export function SupplierPanel() {
  const [supplierStates, setSupplierStates] = useState(suppliers.map(s => ({ ...s })));
  const [logs, setLogs] = useState<string[]>([
    '[14:30:12] ✅ Омега Автопоставка — синхронізація завершена (45230 товарів)',
    '[13:45:08] ✅ Елít Україна — синхронізація завершена (38750 товарів)',
    '[12:00:33] 🔄 Автотехнікс — синхронізація в процесі...',
    '[14:00:55] ✅ Інтеркарс — синхронізація завершена (67800 товарів)',
    '[11:30:00] ⚠️ Автотехнікс — помилка з\'єднання, повторна спроба...',
    '[10:15:22] 📦 Імпорт прайс-листа Інтеркарс — 1250 нових позицій',
  ]);

  const handleSync = (supplierId: string) => {
    setSupplierStates(prev => prev.map(s =>
      s.id === supplierId ? { ...s, apiStatus: 'syncing' as const } : s
    ));
    const now = new Date().toLocaleTimeString('uk-UA');
    setLogs(prev => [`[${now}] 🔄 Початок синхронізації ${supplierStates.find(s => s.id === supplierId)?.name}...`, ...prev]);

    setTimeout(() => {
      setSupplierStates(prev => prev.map(s =>
        s.id === supplierId ? { ...s, apiStatus: 'connected' as const, lastSync: new Date().toLocaleString('uk-UA') } : s
      ));
      const now2 = new Date().toLocaleTimeString('uk-UA');
      setLogs(prev => [`[${now2}] ✅ Синхронізація завершена успішно`, ...prev]);
    }, 2000);
  };

  const handleSyncAll = () => {
    supplierStates.forEach((s, i) => {
      setTimeout(() => handleSync(s.id), i * 500);
    });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Cloud size={22} /> API Інтеграції з постачальниками
          </h2>
          <p className="text-sm text-slate-500 mt-1">Управління імпортом товарів від постачальників</p>
        </div>
        <button
          onClick={handleSyncAll}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition flex items-center gap-2 font-medium shadow-md"
        >
          <RefreshCw size={16} /> Синхронізувати все
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database size={16} className="text-blue-500" />
            <span className="text-xs text-slate-500">Всього товарів</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">174,180</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Link2 size={16} className="text-green-500" />
            <span className="text-xs text-slate-500">Активних API</span>
          </div>
          <p className="text-2xl font-bold text-green-600">4 / 4</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownToLine size={16} className="text-purple-500" />
            <span className="text-xs text-slate-500">Імпортовано сьогодні</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">3,450</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={16} className="text-orange-500" />
            <span className="text-xs text-slate-500">Оновлено цін</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">12,780</p>
        </div>
      </div>

      {/* Supplier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {supplierStates.map(supplier => (
          <div key={supplier.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: supplier.color + '15' }}>
                  {supplier.logo}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{supplier.name}</h3>
                  <p className="text-xs text-slate-500">API v2.0 • REST</p>
                </div>
              </div>
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                ${supplier.apiStatus === 'connected' ? 'bg-green-100 text-green-700' :
                  supplier.apiStatus === 'syncing' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'}`}
              >
                {supplier.apiStatus === 'connected' && <CheckCircle2 size={12} />}
                {supplier.apiStatus === 'syncing' && <Loader size={12} className="animate-spin" />}
                {supplier.apiStatus === 'disconnected' && <AlertCircle size={12} />}
                {supplier.apiStatus === 'connected' ? "З'єднано" :
                  supplier.apiStatus === 'syncing' ? 'Синхронізація...' : "Від'єднано"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500">Товарів</p>
                <p className="font-bold text-slate-800">{supplier.productsCount.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500">Остання синхронізація</p>
                <p className="font-bold text-slate-800 text-xs">{supplier.lastSync}</p>
              </div>
            </div>

            {/* API Capabilities */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {['Прайс-лист', 'Залишки', 'Замовлення', 'Статуси'].map(cap => (
                <span key={cap} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                  {cap}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleSync(supplier.id)}
                disabled={supplier.apiStatus === 'syncing'}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition
                  ${supplier.apiStatus === 'syncing'
                    ? 'bg-yellow-100 text-yellow-600 cursor-wait'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
              >
                {supplier.apiStatus === 'syncing' ? <Loader size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                Синхронізувати
              </button>
              <button className="px-3 py-2 rounded-xl text-sm text-slate-500 hover:bg-slate-100 transition">
                <Settings size={16} />
              </button>
              <button className="px-3 py-2 rounded-xl text-sm text-slate-500 hover:bg-slate-100 transition">
                <Activity size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Logs */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <Activity size={16} /> Журнал синхронізації
        </h3>
        <div className="bg-slate-900 rounded-xl p-4 max-h-64 overflow-y-auto font-mono text-xs space-y-1">
          {logs.map((log, i) => (
            <p key={i} className="text-green-400">{log}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
