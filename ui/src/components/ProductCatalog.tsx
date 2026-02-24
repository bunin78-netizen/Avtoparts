import { useState } from 'react';
import { Filter, SlidersHorizontal, Grid3X3, List, ChevronDown } from 'lucide-react';
import { products, categories, brands, type Product } from '../data/products';
import { ProductCard } from './ProductCard';

interface CatalogProps {
  searchQuery: string;
  onViewProduct: (product: Product) => void;
}

export function ProductCatalog({ searchQuery, onViewProduct }: CatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState('Всі категорії');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  let filtered = products.filter(p => {
    const matchesSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.oem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Всі категорії' || p.category === selectedCategory;
    const matchesBrand = !selectedBrand || p.brand === selectedBrand;
    const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    const matchesStock = !inStockOnly || p.inStock;
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesStock;
  });

  if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  else if (sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <div className="text-xs text-slate-500 mb-4">
        Головна / Каталог {selectedCategory !== 'Всі категорії' && `/ ${selectedCategory}`}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className={`lg:w-64 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-5 sticky top-48">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Filter size={16} /> Фільтри
            </h3>

            {/* Categories */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Категорія</h4>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition
                      ${selectedCategory === cat ? 'bg-orange-100 text-orange-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Бренд</h4>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">Всі бренди</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Ціна, ₴</h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Від"
                />
                <span className="text-slate-400">—</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="До"
                />
              </div>
            </div>

            {/* In stock */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-slate-300 text-orange-500 focus:ring-orange-400"
              />
              <span className="text-sm text-slate-600">Тільки в наявності</span>
            </label>

            {/* Reset */}
            <button
              onClick={() => {
                setSelectedCategory('Всі категорії');
                setSelectedBrand('');
                setPriceRange([0, 15000]);
                setInStockOnly(false);
              }}
              className="w-full text-sm text-orange-600 hover:text-orange-700 font-medium py-2 border border-orange-200 rounded-lg hover:bg-orange-50 transition"
            >
              Скинути фільтри
            </button>
          </div>
        </div>

        {/* Products */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-1 text-sm text-slate-600 bg-white px-3 py-2 rounded-lg border border-slate-200"
              >
                <SlidersHorizontal size={16} /> Фільтри
              </button>
              <p className="text-sm text-slate-500">
                Знайдено: <span className="font-semibold text-slate-800">{filtered.length}</span> товарів
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-slate-200 rounded-lg pl-3 pr-8 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 appearance-none"
                >
                  <option value="default">За замовчуванням</option>
                  <option value="price-asc">Від дешевих</option>
                  <option value="price-desc">Від дорогих</option>
                  <option value="name">За назвою</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              <div className="hidden sm:flex border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-orange-100 text-orange-600' : 'bg-white text-slate-400'}`}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-orange-100 text-orange-600' : 'bg-white text-slate-400'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {filtered.length > 0 ? (
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'
            }>
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} onViewProduct={onViewProduct} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Товарів не знайдено</h3>
              <p className="text-sm text-slate-500">Спробуйте змінити параметри пошуку або фільтри</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
