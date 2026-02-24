import { useState, useMemo } from 'react';
import {
  Car, Truck, Search, ChevronRight, ChevronDown, ArrowLeft,
  Star, Package, Filter, Fuel, Calendar, Gauge,
  ShoppingCart, Heart, Tag, Zap, Info
} from 'lucide-react';
import { vehicleCategories, partCategoriesForVehicles, type VehicleBrand, type VehicleModel } from '../data/vehicles';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface VehicleCatalogProps {
  onNavigate: (page: string) => void;
}

type ViewState = 'categories' | 'brands' | 'models' | 'model-detail';

export function VehicleCatalog({ onNavigate }: VehicleCatalogProps) {
  const { addToCart, items } = useCart();
  const { user, isAuthenticated, toggleWishlist } = useAuth();
  const [vehicleType, setVehicleType] = useState<'passenger' | 'truck'>('passenger');
  const [viewState, setViewState] = useState<ViewState>('categories');
  const [selectedBrand, setSelectedBrand] = useState<VehicleBrand | null>(null);
  const [selectedModel, setSelectedModel] = useState<VehicleModel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEngine, setSelectedEngine] = useState('');
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null);

  const currentCategory = vehicleCategories.find(c => c.id === vehicleType)!;

  const filteredBrands = useMemo(() => {
    if (!searchQuery) return currentCategory.brands;
    const q = searchQuery.toLowerCase();
    return currentCategory.brands.filter(brand =>
      brand.name.toLowerCase().includes(q) ||
      brand.models.some(m => m.name.toLowerCase().includes(q))
    );
  }, [currentCategory.brands, searchQuery]);

  const popularModels = useMemo(() => {
    const models: { brand: VehicleBrand; model: VehicleModel }[] = [];
    currentCategory.brands.forEach(brand => {
      brand.models.forEach(model => {
        if (model.popular) models.push({ brand, model });
      });
    });
    return models.slice(0, 8);
  }, [currentCategory.brands]);

  const totalParts = useMemo(() =>
    partCategoriesForVehicles[vehicleType].reduce((sum, cat) => sum + cat.count, 0),
    [vehicleType]
  );

  const handleSelectBrand = (brand: VehicleBrand) => {
    setSelectedBrand(brand);
    setSelectedModel(null);
    setSelectedEngine('');
    setViewState('models');
  };

  const handleSelectModel = (model: VehicleModel) => {
    setSelectedModel(model);
    setSelectedEngine('');
    setViewState('model-detail');
  };

  const handleBack = () => {
    if (viewState === 'model-detail') {
      setSelectedModel(null);
      setViewState('models');
    } else if (viewState === 'models') {
      setSelectedBrand(null);
      setViewState('categories');
    } else {
      setViewState('categories');
    }
  };

  const compatibleProducts = useMemo(() => {
    if (!selectedModel) return [];
    return products.filter(p =>
      p.compatibility.some(c => {
        const q = selectedModel.name.toLowerCase();
        const brandName = selectedBrand?.name.toLowerCase() || '';
        return c.toLowerCase().includes(q.split(' ')[0]) ||
          c.toLowerCase().includes(brandName.substring(0, 3));
      })
    );
  }, [selectedModel, selectedBrand]);

  // Demo parts for model detail
  const demoParts = useMemo(() => {
    if (!selectedModel || !selectedBrand) return [];
    return [
      { id: 101, name: `Гальмівні колодки передні — ${selectedBrand.name} ${selectedModel.name}`, sku: `BP-${selectedModel.id}`, price: 1650, oldPrice: 1980, brand: 'Brembo', inStock: true, category: 'Гальмівна система' },
      { id: 102, name: `Масляний фільтр — ${selectedBrand.name} ${selectedModel.name}`, sku: `OF-${selectedModel.id}`, price: 295, brand: 'Mann-Filter', inStock: true, category: 'Фільтри' },
      { id: 103, name: `Повітряний фільтр — ${selectedBrand.name} ${selectedModel.name}`, sku: `AF-${selectedModel.id}`, price: 340, oldPrice: 410, brand: 'Mahle', inStock: true, category: 'Фільтри' },
      { id: 104, name: `Амортизатор передній — ${selectedBrand.name} ${selectedModel.name}`, sku: `SA-${selectedModel.id}`, price: 2850, brand: 'Sachs', inStock: true, category: 'Підвіска' },
      { id: 105, name: `Диск гальмівний — ${selectedBrand.name} ${selectedModel.name}`, sku: `BD-${selectedModel.id}`, price: 1420, oldPrice: 1690, brand: 'TRW', inStock: true, category: 'Гальмівна система' },
      { id: 106, name: `Свічки запалювання (к-т) — ${selectedBrand.name} ${selectedModel.name}`, sku: `SP-${selectedModel.id}`, price: 780, brand: 'NGK', inStock: true, category: 'Електрика' },
      { id: 107, name: `Ремінь ГРМ комплект — ${selectedBrand.name} ${selectedModel.name}`, sku: `TB-${selectedModel.id}`, price: 4200, oldPrice: 4900, brand: 'Gates', inStock: false, category: 'Двигун' },
      { id: 108, name: `Стійка стабілізатора — ${selectedBrand.name} ${selectedModel.name}`, sku: `SL-${selectedModel.id}`, price: 480, brand: 'Lemförder', inStock: true, category: 'Підвіска' },
    ];
  }, [selectedModel, selectedBrand]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 flex-wrap">
        <button onClick={() => onNavigate('catalog')} className="hover:text-orange-600 transition">Головна</button>
        <ChevronRight size={14} />
        <button onClick={() => { setViewState('categories'); setSelectedBrand(null); setSelectedModel(null); }} className="hover:text-orange-600 transition">
          Каталог автомобілів
        </button>
        {selectedBrand && (
          <>
            <ChevronRight size={14} />
            <button onClick={() => { setViewState('models'); setSelectedModel(null); }} className="hover:text-orange-600 transition">
              {selectedBrand.name}
            </button>
          </>
        )}
        {selectedModel && (
          <>
            <ChevronRight size={14} />
            <span className="text-slate-800 font-medium">{selectedModel.name}</span>
          </>
        )}
      </div>

      {/* Vehicle Type Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          {viewState !== 'categories' && (
            <button onClick={handleBack} className="flex items-center gap-1 text-sm text-slate-500 hover:text-orange-600 mb-2 transition">
              <ArrowLeft size={16} /> Назад
            </button>
          )}
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            {vehicleType === 'passenger' ? <Car size={26} /> : <Truck size={26} />}
            {viewState === 'categories' && 'Каталог автомобілів'}
            {viewState === 'brands' && `${currentCategory.name}`}
            {viewState === 'models' && selectedBrand && `${selectedBrand.name}`}
            {viewState === 'model-detail' && selectedModel && `${selectedBrand?.name} ${selectedModel.name}`}
          </h1>
        </div>
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
          <button
            onClick={() => { setVehicleType('passenger'); setViewState('categories'); setSelectedBrand(null); setSelectedModel(null); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition
              ${vehicleType === 'passenger' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Car size={18} /> Легкові
          </button>
          <button
            onClick={() => { setVehicleType('truck'); setViewState('categories'); setSelectedBrand(null); setSelectedModel(null); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition
              ${vehicleType === 'truck' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Truck size={18} /> Вантажні
          </button>
        </div>
      </div>

      {/* CATEGORIES VIEW (main) */}
      {viewState === 'categories' && (
        <>
          {/* Hero */}
          <div className={`rounded-2xl p-6 mb-6 text-white ${vehicleType === 'passenger'
            ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800'
            : 'bg-gradient-to-r from-amber-600 via-orange-700 to-red-800'
          }`}>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  {vehicleType === 'passenger' ? 'Запчастини для легкових авто' : 'Запчастини для вантажівок'}
                </h2>
                <p className="text-white/80 text-sm mb-4">
                  {vehicleType === 'passenger'
                    ? `Оберіть марку та модель вашого автомобіля — ми підберемо запчастини. ${currentCategory.brands.length} брендів, ${totalParts.toLocaleString()}+ запчастин`
                    : `Повний каталог запчастин для вантажних автомобілів. ${currentCategory.brands.length} виробників, ${totalParts.toLocaleString()}+ позицій`
                  }
                </p>
                {/* Search */}
                <div className="relative max-w-lg">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={vehicleType === 'passenger'
                      ? 'Пошук марки або моделі (напр. Golf, Passat, BMW...)'
                      : 'Пошук марки або моделі (напр. Actros, FH, TGX...)'
                    }
                    className="w-full pl-10 pr-4 py-3 bg-white/15 border border-white/25 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm backdrop-blur-sm"
                  />
                </div>
              </div>
              <div className="hidden md:flex text-8xl">
                {vehicleType === 'passenger' ? '🚗' : '🚛'}
              </div>
            </div>
          </div>

          {/* Popular Models */}
          {!searchQuery && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Star size={18} className="text-yellow-500" /> Популярні моделі
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {popularModels.map(({ brand, model }) => (
                  <button
                    key={`${brand.id}-${model.id}`}
                    onClick={() => { handleSelectBrand(brand); handleSelectModel(model); }}
                    className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-lg hover:border-orange-200 transition text-left group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{model.image}</span>
                      <span className="text-xs text-slate-400">{brand.logo}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 group-hover:text-orange-600 transition">{brand.name}</p>
                    <p className="text-xs text-slate-500">{model.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-slate-400">{model.years}</span>
                      <span className="text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded font-medium">
                        {model.partsCount.toLocaleString()} зч.
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Brands Grid */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              {vehicleType === 'passenger' ? <Car size={18} /> : <Truck size={18} />}
              {searchQuery ? `Результати пошуку "${searchQuery}"` : 'Всі виробники'}
              <span className="text-sm font-normal text-slate-400">({filteredBrands.length})</span>
            </h3>

            {filteredBrands.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                <div className="text-5xl mb-3">🔍</div>
                <p className="text-slate-600 font-medium">Нічого не знайдено за запитом "{searchQuery}"</p>
                <button onClick={() => setSearchQuery('')} className="mt-3 text-orange-600 text-sm font-medium hover:text-orange-700">
                  Скинути пошук
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBrands.map(brand => (
                  <div key={brand.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition">
                    <button
                      onClick={() => setExpandedBrand(expandedBrand === brand.id ? null : brand.id)}
                      className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${vehicleType === 'passenger' ? 'bg-blue-50' : 'bg-amber-50'}`}>
                          {vehicleType === 'passenger' ? '🚗' : '🚛'}
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-slate-800">{brand.name}</p>
                          <p className="text-xs text-slate-500">{brand.logo} {brand.country} • {brand.models.length} моделей</p>
                        </div>
                      </div>
                      <ChevronDown size={18} className={`text-slate-400 transition-transform ${expandedBrand === brand.id ? 'rotate-180' : ''}`} />
                    </button>

                    {expandedBrand === brand.id && (
                      <div className="border-t border-slate-100 p-2 bg-slate-50 space-y-1 max-h-64 overflow-y-auto">
                        {brand.models.map(model => (
                          <button
                            key={model.id}
                            onClick={() => { handleSelectBrand(brand); handleSelectModel(model); }}
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white hover:shadow-sm transition text-left"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{model.image}</span>
                              <div>
                                <p className="text-sm font-medium text-slate-800">{model.name}</p>
                                <p className="text-[10px] text-slate-400">{model.years}</p>
                              </div>
                              {model.popular && (
                                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-400">{model.partsCount.toLocaleString()} зч.</span>
                              <ChevronRight size={14} className="text-slate-300" />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {expandedBrand !== brand.id && (
                      <div className="px-4 pb-3">
                        <button
                          onClick={() => handleSelectBrand(brand)}
                          className={`w-full text-sm font-medium py-2 rounded-xl transition ${vehicleType === 'passenger'
                            ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                          }`}
                        >
                          Дивитись всі моделі →
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Part Categories */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Package size={18} /> Категорії запчастин
              {vehicleType === 'passenger' ? ' для легкових' : ' для вантажних'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {partCategoriesForVehicles[vehicleType].map(cat => (
                <button
                  key={cat.name}
                  onClick={() => onNavigate('catalog')}
                  className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md hover:border-orange-200 transition text-center group"
                >
                  <span className="text-3xl block mb-2">{cat.icon}</span>
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-orange-600 transition">{cat.name}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{cat.count.toLocaleString()} товарів</p>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* MODELS VIEW */}
      {viewState === 'models' && selectedBrand && (
        <>
          {/* Brand Header */}
          <div className={`rounded-2xl p-5 mb-6 text-white ${vehicleType === 'passenger'
            ? 'bg-gradient-to-r from-blue-600 to-indigo-700'
            : 'bg-gradient-to-r from-amber-600 to-red-700'
          }`}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center text-4xl backdrop-blur-sm">
                {vehicleType === 'passenger' ? '🚗' : '🚛'}
              </div>
              <div>
                <p className="text-sm text-white/70">{selectedBrand.logo} {selectedBrand.country}</p>
                <h2 className="text-2xl font-bold">{selectedBrand.name}</h2>
                <p className="text-sm text-white/80">{selectedBrand.models.length} моделей • {selectedBrand.models.reduce((s, m) => s + m.partsCount, 0).toLocaleString()} запчастин</p>
              </div>
            </div>
          </div>

          {/* Models Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedBrand.models.map(model => (
              <button
                key={model.id}
                onClick={() => handleSelectModel(model)}
                className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg hover:border-orange-200 transition text-left group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{model.image}</span>
                    {model.popular && (
                      <span className="bg-yellow-100 text-yellow-700 text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                        <Star size={10} className="fill-yellow-500" /> Популярне
                      </span>
                    )}
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-orange-500 transition mt-1" />
                </div>

                <h3 className="text-lg font-bold text-slate-800 group-hover:text-orange-600 transition">{model.name}</h3>

                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {model.years}</span>
                  <span className="flex items-center gap-1"><Fuel size={12} /> {model.engines.length} двигунів</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {model.engines.slice(0, 3).map(eng => (
                    <span key={eng} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{eng}</span>
                  ))}
                  {model.engines.length > 3 && (
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">+{model.engines.length - 3}</span>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Package size={12} /> {model.partsCount.toLocaleString()} запчастин
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${vehicleType === 'passenger' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-700'}`}>
                    Підібрати →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* MODEL DETAIL VIEW */}
      {viewState === 'model-detail' && selectedModel && selectedBrand && (
        <>
          {/* Model Header */}
          <div className={`rounded-2xl overflow-hidden mb-6 ${vehicleType === 'passenger'
            ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800'
            : 'bg-gradient-to-r from-amber-600 via-orange-700 to-red-800'
          }`}>
            <div className="p-6 text-white">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-1">
                  <p className="text-sm text-white/70 mb-1">{selectedBrand.logo} {selectedBrand.name} • {selectedBrand.country}</p>
                  <h2 className="text-3xl font-bold mb-2">{selectedModel.name}</h2>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-white/80 mb-4">
                    <span className="flex items-center gap-1 bg-white/15 px-3 py-1 rounded-lg"><Calendar size={14} /> {selectedModel.years}</span>
                    <span className="flex items-center gap-1 bg-white/15 px-3 py-1 rounded-lg"><Fuel size={14} /> {selectedModel.engines.length} двигунів</span>
                    <span className="flex items-center gap-1 bg-white/15 px-3 py-1 rounded-lg"><Package size={14} /> {selectedModel.partsCount.toLocaleString()} запчастин</span>
                  </div>

                  {/* Engine Select */}
                  <div>
                    <label className="text-sm text-white/70 mb-1 block">Оберіть двигун:</label>
                    <select
                      value={selectedEngine}
                      onChange={e => setSelectedEngine(e.target.value)}
                      className="w-full max-w-md bg-white/15 border border-white/25 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-sm"
                    >
                      <option value="" className="text-slate-800">Всі двигуни</option>
                      {selectedModel.engines.map(eng => (
                        <option key={eng} value={eng} className="text-slate-800">{eng}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-center">
                  <div className="text-8xl">{selectedModel.image}</div>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-black/20 backdrop-blur-sm px-6 py-3 flex flex-wrap items-center gap-6 text-xs text-white/70">
              <span className="flex items-center gap-1"><Zap size={12} className="text-yellow-400" /> OEM якість</span>
              <span className="flex items-center gap-1"><Tag size={12} className="text-green-400" /> Оптові ціни</span>
              <span className="flex items-center gap-1"><Filter size={12} /> Перехресні номери</span>
              <span className="flex items-center gap-1"><Gauge size={12} /> 100% сумісність</span>
            </div>
          </div>

          {/* Available Parts */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Part Categories */}
            <div className="lg:w-56 shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sticky top-48">
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm">
                  <Filter size={14} /> Категорії
                </h4>
                <div className="space-y-1">
                  {partCategoriesForVehicles[vehicleType].slice(0, 8).map(cat => (
                    <button
                      key={cat.name}
                      onClick={() => onNavigate('catalog')}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition text-left"
                    >
                      <span className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </span>
                      <ChevronRight size={12} className="text-slate-300" />
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 mt-3 pt-3">
                  <div className="bg-orange-50 rounded-xl p-3 text-center">
                    <Info size={16} className="text-orange-500 mx-auto mb-1" />
                    <p className="text-[10px] text-slate-600">Не знайшли потрібну запчастину? Зверніться до нас!</p>
                    <button
                      onClick={() => onNavigate('contacts')}
                      className="mt-2 text-xs bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition font-medium"
                    >
                      Запитати
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Parts List */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Package size={18} /> Запчастини для {selectedBrand.name} {selectedModel.name}
                  {selectedEngine && <span className="text-sm font-normal text-slate-500">• {selectedEngine}</span>}
                </h3>
                <span className="text-sm text-slate-500">{demoParts.length + compatibleProducts.length} товарів</span>
              </div>

              <div className="space-y-3">
                {/* Compatible products from catalog */}
                {compatibleProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                      <span className="text-2xl">🔧</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-400 mb-0.5">Арт: {product.sku} | OEM: {product.oem}</p>
                      <h4 className="text-sm font-semibold text-slate-800 truncate">{product.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500">{product.brand}</span>
                        <span className="text-xs bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-medium">✓ Сумісний</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        {product.oldPrice && <p className="text-xs text-slate-400 line-through">{product.oldPrice.toLocaleString()} ₴</p>}
                        <p className="text-lg font-bold text-slate-800">{product.price.toLocaleString()} ₴</p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {isAuthenticated && (
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className={`p-2 rounded-lg transition ${user?.wishlist.includes(product.id) ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400 hover:text-red-500'}`}
                          >
                            <Heart size={14} fill={user?.wishlist.includes(product.id) ? 'currentColor' : 'none'} />
                          </button>
                        )}
                        <button
                          onClick={() => addToCart(product)}
                          className={`p-2 rounded-lg transition ${items.some(i => i.product.id === product.id) ? 'bg-green-50 text-green-600' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
                        >
                          <ShoppingCart size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Demo parts for model */}
                {demoParts.map(part => (
                  <div key={part.id} className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                      <span className="text-2xl">🔧</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-400 mb-0.5">Арт: {part.sku}</p>
                      <h4 className="text-sm font-semibold text-slate-800 truncate">{part.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500">{part.brand}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{part.category}</span>
                        {part.inStock ? (
                          <span className="text-xs text-green-600 font-medium">✓ В наявності</span>
                        ) : (
                          <span className="text-xs text-orange-600 font-medium">⏳ Під замовлення</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        {part.oldPrice && <p className="text-xs text-slate-400 line-through">{part.oldPrice.toLocaleString()} ₴</p>}
                        <p className="text-lg font-bold text-slate-800">{part.price.toLocaleString()} ₴</p>
                      </div>
                      <button
                        onClick={() => onNavigate('catalog')}
                        className="bg-orange-500 text-white p-2.5 rounded-xl hover:bg-orange-600 transition"
                      >
                        <ShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom CTA */}
              <div className="mt-6 bg-slate-50 rounded-2xl p-5 text-center">
                <p className="text-slate-600 text-sm mb-3">
                  Показано {demoParts.length + compatibleProducts.length} з {selectedModel.partsCount.toLocaleString()} запчастин для {selectedBrand.name} {selectedModel.name}
                </p>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="bg-orange-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-orange-600 transition"
                >
                  Переглянути повний каталог →
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
