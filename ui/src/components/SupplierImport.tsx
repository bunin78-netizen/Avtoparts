import { useState, useCallback } from 'react';
import {
  Upload, FileSpreadsheet, FileText, Database, Download, RefreshCw,
  CheckCircle2, AlertTriangle, XCircle, Clock, ChevronRight, ChevronDown,
  Search, Settings, Play, Pause, Trash2, Eye, ArrowDownToLine,
  Tag, Package, Truck, DollarSign, BarChart3, Layers, Link2, Zap,
  Calendar, AlertCircle, Info, Box, Hash, Weight, Ruler
} from 'lucide-react';
import { suppliers } from '../data/products';

// ── Types ──
interface ImportField {
  id: string;
  label: string;
  icon: typeof Tag;
  required: boolean;
  description: string;
  example: string;
}

interface ImportTemplate {
  id: string;
  name: string;
  supplier: string;
  format: 'csv' | 'xlsx' | 'xml' | 'json' | 'api';
  fields: string[];
  lastUsed: string;
}

interface ImportRecord {
  id: string;
  supplier: string;
  type: 'pricelist' | 'stock' | 'delivery' | 'full';
  method: 'file' | 'api';
  format: string;
  status: 'success' | 'warning' | 'error' | 'processing' | 'pending';
  date: string;
  recordsTotal: number;
  recordsImported: number;
  recordsUpdated: number;
  recordsSkipped: number;
  recordsErrors: number;
  duration: string;
  fileName?: string;
}

interface PreviewRow {
  article: string;
  brand: string;
  name: string;
  oem: string;
  purchasePrice: number;
  retailPrice: number;
  markup: number;
  stock: number;
  warehouse: string;
  deliveryDays: number;
  weight: string;
  category: string;
  compatibility: string;
  crossRef: string;
  valid: boolean;
  warnings: string[];
}

interface PriceRule {
  id: string;
  supplier: string;
  category: string;
  markupPercent: number;
  minMarginPercent: number;
  roundTo: number;
  active: boolean;
}

type ImportTab = 'upload' | 'api-sync' | 'mapping' | 'preview' | 'history' | 'price-rules' | 'schedule';

// ── Constants ──
const IMPORT_FIELDS: ImportField[] = [
  { id: 'article', label: 'Артикул (SKU)', icon: Hash, required: true, description: 'Унікальний код товару постачальника', example: 'BP-2345-F' },
  { id: 'brand', label: 'Бренд / Виробник', icon: Tag, required: true, description: 'Назва виробника запчастини', example: 'Brembo' },
  { id: 'name', label: 'Назва товару', icon: Package, required: true, description: 'Повна назва запчастини', example: 'Гальмівні колодки передні' },
  { id: 'oem', label: 'OEM номери', icon: Link2, required: false, description: 'Оригінальні номери (через кому)', example: '7L6698151, 7P6698151' },
  { id: 'crossRef', label: 'Крос-номери', icon: Layers, required: false, description: 'Перехресні номери інших виробників', example: 'TRW GDB1550, ATE 13.0460' },
  { id: 'purchasePrice', label: 'Ціна закупки (₴)', icon: DollarSign, required: true, description: 'Закупівельна ціна від постачальника', example: '1250.00' },
  { id: 'rrp', label: 'РРЦ / Роздрібна ціна (₴)', icon: DollarSign, required: false, description: 'Рекомендована роздрібна ціна', example: '1850.00' },
  { id: 'currency', label: 'Валюта', icon: DollarSign, required: false, description: 'Валюта ціни (UAH, USD, EUR)', example: 'UAH' },
  { id: 'stock', label: 'Залишок на складі', icon: Box, required: true, description: 'Кількість одиниць в наявності', example: '25' },
  { id: 'warehouse', label: 'Склад', icon: Database, required: false, description: 'Назва або код складу постачальника', example: 'Київ-Центральний' },
  { id: 'deliveryDays', label: 'Строк поставки (дні)', icon: Truck, required: true, description: 'Кількість днів доставки від постачальника', example: '2' },
  { id: 'minOrder', label: 'Мін. замовлення', icon: Package, required: false, description: 'Мінімальна кількість для замовлення', example: '1' },
  { id: 'weight', label: 'Вага (кг)', icon: Weight, required: false, description: 'Вага товару в кілограмах', example: '1.2' },
  { id: 'dimensions', label: 'Розміри (Д×Ш×В мм)', icon: Ruler, required: false, description: 'Габарити в міліметрах', example: '250×150×80' },
  { id: 'category', label: 'Категорія', icon: Layers, required: false, description: 'Категорія товару', example: 'Гальмівна система' },
  { id: 'compatibility', label: 'Застосовність (авто)', icon: Zap, required: false, description: 'Моделі авто (через кому)', example: 'VW Golf VII, Audi A3' },
  { id: 'description', label: 'Опис', icon: FileText, required: false, description: 'Опис товару', example: 'Високоякісні гальмівні колодки...' },
  { id: 'imageUrl', label: 'URL зображення', icon: Eye, required: false, description: 'Посилання на фото товару', example: 'https://...' },
  { id: 'barcode', label: 'Штрихкод (EAN)', icon: Hash, required: false, description: 'EAN-13 штрихкод', example: '4006633248709' },
  { id: 'countryOfOrigin', label: 'Країна виробництва', icon: Info, required: false, description: 'Країна виробника', example: 'Німеччина' },
];

const IMPORT_TEMPLATES: ImportTemplate[] = [
  { id: 't1', name: 'Повний прайс-лист Омега', supplier: 'Омега Автопоставка', format: 'xlsx', fields: ['article', 'brand', 'name', 'oem', 'purchasePrice', 'rrp', 'stock', 'deliveryDays', 'category'], lastUsed: '2024-01-15' },
  { id: 't2', name: 'Залишки Елít (XML)', supplier: 'Елít Україна', format: 'xml', fields: ['article', 'brand', 'stock', 'warehouse', 'deliveryDays'], lastUsed: '2024-01-15' },
  { id: 't3', name: 'Прайс Автотехнікс CSV', supplier: 'Автотехнікс', format: 'csv', fields: ['article', 'brand', 'name', 'purchasePrice', 'stock', 'deliveryDays'], lastUsed: '2024-01-14' },
  { id: 't4', name: 'Інтеркарс API Sync', supplier: 'Інтеркарс', format: 'api', fields: ['article', 'brand', 'name', 'oem', 'crossRef', 'purchasePrice', 'rrp', 'stock', 'warehouse', 'deliveryDays', 'weight', 'category', 'compatibility'], lastUsed: '2024-01-15' },
  { id: 't5', name: 'Повний каталог Інтеркарс', supplier: 'Інтеркарс', format: 'json', fields: ['article', 'brand', 'name', 'oem', 'crossRef', 'purchasePrice', 'rrp', 'stock', 'deliveryDays', 'weight', 'dimensions', 'category', 'compatibility', 'description', 'imageUrl'], lastUsed: '2024-01-13' },
];

const IMPORT_HISTORY: ImportRecord[] = [
  { id: 'imp-001', supplier: 'Омега Автопоставка', type: 'pricelist', method: 'file', format: 'XLSX', status: 'success', date: '2024-01-15 14:30', recordsTotal: 45230, recordsImported: 44890, recordsUpdated: 38450, recordsSkipped: 340, recordsErrors: 0, duration: '2 хв 15 с', fileName: 'omega_pricelist_jan2024.xlsx' },
  { id: 'imp-002', supplier: 'Елít Україна', type: 'stock', method: 'api', format: 'API/XML', status: 'success', date: '2024-01-15 13:45', recordsTotal: 38750, recordsImported: 38750, recordsUpdated: 12340, recordsSkipped: 0, recordsErrors: 0, duration: '1 хв 48 с' },
  { id: 'imp-003', supplier: 'Автотехнікс', type: 'full', method: 'file', format: 'CSV', status: 'warning', date: '2024-01-15 12:00', recordsTotal: 22400, recordsImported: 22150, recordsUpdated: 18900, recordsSkipped: 180, recordsErrors: 70, duration: '3 хв 22 с', fileName: 'autotechnix_full_15jan.csv' },
  { id: 'imp-004', supplier: 'Інтеркарс', type: 'pricelist', method: 'api', format: 'API/JSON', status: 'success', date: '2024-01-15 14:00', recordsTotal: 67800, recordsImported: 67800, recordsUpdated: 45670, recordsSkipped: 0, recordsErrors: 0, duration: '4 хв 10 с' },
  { id: 'imp-005', supplier: 'Омега Автопоставка', type: 'delivery', method: 'file', format: 'CSV', status: 'success', date: '2024-01-14 16:30', recordsTotal: 45230, recordsImported: 45230, recordsUpdated: 8900, recordsSkipped: 0, recordsErrors: 0, duration: '58 с', fileName: 'omega_delivery_times.csv' },
  { id: 'imp-006', supplier: 'Елít Україна', type: 'pricelist', method: 'file', format: 'XLSX', status: 'error', date: '2024-01-14 10:15', recordsTotal: 0, recordsImported: 0, recordsUpdated: 0, recordsSkipped: 0, recordsErrors: 1, duration: '5 с', fileName: 'elit_broken_file.xlsx' },
  { id: 'imp-007', supplier: 'Інтеркарс', type: 'stock', method: 'api', format: 'API/JSON', status: 'success', date: '2024-01-14 09:00', recordsTotal: 67800, recordsImported: 67800, recordsUpdated: 23450, recordsSkipped: 0, recordsErrors: 0, duration: '2 хв 45 с' },
  { id: 'imp-008', supplier: 'Автотехнікс', type: 'delivery', method: 'api', format: 'API/XML', status: 'processing', date: '2024-01-15 15:00', recordsTotal: 22400, recordsImported: 14500, recordsUpdated: 9800, recordsSkipped: 0, recordsErrors: 0, duration: '—' },
];

const PREVIEW_DATA: PreviewRow[] = [
  { article: 'P 85 020', brand: 'Brembo', name: 'Гальмівні колодки передні', oem: '7L6698151', purchasePrice: 1250, retailPrice: 1850, markup: 48, stock: 25, warehouse: 'Київ-1', deliveryDays: 1, weight: '0.8', category: 'Гальмівна система', compatibility: 'VW Touareg, Audi Q7', crossRef: 'TRW GDB1550', valid: true, warnings: [] },
  { article: 'HU 719/7 x', brand: 'Mann-Filter', name: 'Масляний фільтр', oem: '06J115403Q', purchasePrice: 185, retailPrice: 285, markup: 54, stock: 150, warehouse: 'Київ-1', deliveryDays: 1, weight: '0.3', category: 'Фільтри', compatibility: 'VW Golf, Skoda Octavia', crossRef: 'Mahle OX 388D', valid: true, warnings: [] },
  { article: '315 523', brand: 'Sachs', name: 'Амортизатор задній газовий', oem: '1K0513029', purchasePrice: 2200, retailPrice: 3200, markup: 45, stock: 12, warehouse: 'Одеса-2', deliveryDays: 2, weight: '3.5', category: 'Підвіска', compatibility: 'VW Golf V, Golf VI', crossRef: 'Monroe E2070', valid: true, warnings: [] },
  { article: 'BKR6EIX-11', brand: 'NGK', name: 'Свічки запалювання іридій 4шт', oem: '101905617C', purchasePrice: 520, retailPrice: 720, markup: 38, stock: 80, warehouse: 'Київ-1', deliveryDays: 1, weight: '0.2', category: 'Електрика', compatibility: 'VW Passat, Audi A4', crossRef: 'Bosch FR7KI332S', valid: true, warnings: [] },
  { article: 'K025649XS', brand: 'Gates', name: 'Ремінь ГРМ комплект з помпою', oem: '', purchasePrice: 3100, retailPrice: 4500, markup: 45, stock: 5, warehouse: 'Львів-1', deliveryDays: 3, weight: '2.8', category: 'Двигун', compatibility: 'VW Passat 1.9TDI, Skoda Octavia 1.9TDI', crossRef: 'Conti CT1028WP6', valid: false, warnings: ['OEM номер відсутній'] },
  { article: 'C 2998/5 x', brand: 'Mann-Filter', name: 'Повітряний фільтр', oem: '1F0129620', purchasePrice: 245, retailPrice: 380, markup: 55, stock: 0, warehouse: '—', deliveryDays: 4, weight: '0.4', category: 'Фільтри', compatibility: 'VW Passat B6, VW Tiguan', crossRef: 'Mahle LX 1566', valid: true, warnings: ['Немає в наявності — буде під замовлення'] },
  { article: 'DF4381', brand: 'TRW', name: 'Диск гальмівний передній вентильований', oem: '1K0615301AA', purchasePrice: 920, retailPrice: 1450, markup: 57, stock: 18, warehouse: 'Київ-1', deliveryDays: 1, weight: '6.2', category: 'Гальмівна система', compatibility: 'VW Golf V, VW Golf VI, Audi A3', crossRef: 'Brembo 09.A820.11', valid: true, warnings: [] },
  { article: 'VL 380S', brand: 'Valeo', name: 'Радіатор охолодження двигуна', oem: '1K0121251EH', purchasePrice: 2800, retailPrice: 4200, markup: 50, stock: 3, warehouse: 'Одеса-2', deliveryDays: 3, weight: '4.5', category: 'Охолодження', compatibility: 'VW Golf V, VW Touran, Audi A3', crossRef: 'Nissens 65280A', valid: true, warnings: [] },
];

const PRICE_RULES: PriceRule[] = [
  { id: 'pr1', supplier: 'Омега Автопоставка', category: 'Гальмівна система', markupPercent: 45, minMarginPercent: 20, roundTo: 10, active: true },
  { id: 'pr2', supplier: 'Омега Автопоставка', category: 'Фільтри', markupPercent: 55, minMarginPercent: 25, roundTo: 5, active: true },
  { id: 'pr3', supplier: 'Елít Україна', category: 'Всі категорії', markupPercent: 40, minMarginPercent: 18, roundTo: 10, active: true },
  { id: 'pr4', supplier: 'Автотехнікс', category: 'Масла та рідини', markupPercent: 30, minMarginPercent: 15, roundTo: 5, active: true },
  { id: 'pr5', supplier: 'Інтеркарс', category: 'Всі категорії', markupPercent: 42, minMarginPercent: 20, roundTo: 10, active: true },
  { id: 'pr6', supplier: 'Інтеркарс', category: 'Електрика', markupPercent: 50, minMarginPercent: 22, roundTo: 5, active: false },
];

const SCHEDULES = [
  { id: 's1', supplier: 'Омега Автопоставка', type: 'Прайс + Залишки', frequency: 'Кожні 4 год', nextRun: '2024-01-15 18:00', active: true },
  { id: 's2', supplier: 'Елít Україна', type: 'Залишки', frequency: 'Кожну годину', nextRun: '2024-01-15 16:00', active: true },
  { id: 's3', supplier: 'Автотехнікс', type: 'Повний каталог', frequency: 'Раз на добу (03:00)', nextRun: '2024-01-16 03:00', active: true },
  { id: 's4', supplier: 'Інтеркарс', type: 'Прайс + Залишки + Строки', frequency: 'Кожні 2 год', nextRun: '2024-01-15 16:00', active: true },
  { id: 's5', supplier: 'Всі постачальники', type: 'Строки доставки', frequency: 'Раз на добу (06:00)', nextRun: '2024-01-16 06:00', active: false },
];

// ── Component ──
export function SupplierImport() {
  const [activeTab, setActiveTab] = useState<ImportTab>('upload');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [importType, setImportType] = useState<'pricelist' | 'stock' | 'delivery' | 'full'>('pricelist');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [_showPreview, setShowPreview] = useState(false);
  const [expandedField, setExpandedField] = useState<string | null>(null);
  const [searchFields, setSearchFields] = useState('');
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState<ImportRecord | null>(null);
  const [historyFilter, setHistoryFilter] = useState('');
  const [mappingColumns, setMappingColumns] = useState<Record<string, string>>({});

  // Simulated columns from "uploaded file"
  const fileColumns = [
    'Колонка A (Артикул)',
    'Колонка B (Бренд)',
    'Колонка C (Назва)',
    'Колонка D (OEM)',
    'Колонка E (Крос-номери)',
    'Колонка F (Ціна закупки)',
    'Колонка G (РРЦ)',
    'Колонка H (Валюта)',
    'Колонка I (Залишок)',
    'Колонка J (Склад)',
    'Колонка K (Строк поставки)',
    'Колонка L (Мін. замовлення)',
    'Колонка M (Вага)',
    'Колонка N (Розміри)',
    'Колонка O (Категорія)',
    'Колонка P (Застосовність)',
    'Колонка Q (Опис)',
    'Колонка R (URL зображення)',
  ];

  const handleFileUpload = useCallback(() => {
    setUploadedFile('omega_pricelist_jan2024.xlsx');
    // Auto-map columns
    const autoMap: Record<string, string> = {};
    IMPORT_FIELDS.forEach((f, i) => {
      if (i < fileColumns.length) {
        autoMap[f.id] = fileColumns[i];
      }
    });
    setMappingColumns(autoMap);
  }, []);

  const handleStartImport = useCallback(() => {
    setIsImporting(true);
    setImportProgress(0);
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsImporting(false);
          return 100;
        }
        return prev + Math.random() * 8 + 2;
      });
    }, 200);
  }, []);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'pricelist': return 'Прайс-лист';
      case 'stock': return 'Залишки / Наявність';
      case 'delivery': return 'Строки поставки';
      case 'full': return 'Повний каталог';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pricelist': return 'bg-blue-100 text-blue-700';
      case 'stock': return 'bg-green-100 text-green-700';
      case 'delivery': return 'bg-purple-100 text-purple-700';
      case 'full': return 'bg-orange-100 text-orange-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success': return { color: 'bg-green-100 text-green-700', icon: <CheckCircle2 size={12} />, label: 'Успішно' };
      case 'warning': return { color: 'bg-yellow-100 text-yellow-700', icon: <AlertTriangle size={12} />, label: 'З попередженнями' };
      case 'error': return { color: 'bg-red-100 text-red-700', icon: <XCircle size={12} />, label: 'Помилка' };
      case 'processing': return { color: 'bg-blue-100 text-blue-700', icon: <RefreshCw size={12} className="animate-spin" />, label: 'В процесі...' };
      default: return { color: 'bg-slate-100 text-slate-700', icon: <Clock size={12} />, label: 'Очікує' };
    }
  };

  const filteredFields = IMPORT_FIELDS.filter(f =>
    !searchFields || f.label.toLowerCase().includes(searchFields.toLowerCase()) || f.description.toLowerCase().includes(searchFields.toLowerCase())
  );

  const filteredHistory = IMPORT_HISTORY.filter(r =>
    !historyFilter || r.supplier.toLowerCase().includes(historyFilter.toLowerCase()) ||
    getTypeLabel(r.type).toLowerCase().includes(historyFilter.toLowerCase())
  );

  const tabs: { id: ImportTab; label: string; icon: typeof Upload }[] = [
    { id: 'upload', label: 'Завантаження файлу', icon: Upload },
    { id: 'api-sync', label: 'API Синхронізація', icon: RefreshCw },
    { id: 'mapping', label: 'Маппінг полів', icon: Layers },
    { id: 'preview', label: 'Попередній перегляд', icon: Eye },
    { id: 'history', label: 'Історія імпортів', icon: Clock },
    { id: 'price-rules', label: 'Правила цін', icon: DollarSign },
    { id: 'schedule', label: 'Розклад імпортів', icon: Calendar },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ArrowDownToLine size={22} /> Імпорт даних від постачальників
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Прайс-листи, залишки, строки доставки, повні каталоги
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition flex items-center gap-2 shadow-md">
            <Download size={16} /> Шаблони імпорту
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Database size={14} className="text-blue-500" />
            <span className="text-[10px] text-slate-500">Всього товарів</span>
          </div>
          <p className="text-lg font-bold text-slate-800">174,180</p>
          <p className="text-[10px] text-green-600">+3,450 сьогодні</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={14} className="text-green-500" />
            <span className="text-[10px] text-slate-500">Оновлень цін</span>
          </div>
          <p className="text-lg font-bold text-slate-800">12,780</p>
          <p className="text-[10px] text-slate-400">за сьогодні</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Box size={14} className="text-purple-500" />
            <span className="text-[10px] text-slate-500">Оновл. залишків</span>
          </div>
          <p className="text-lg font-bold text-slate-800">89,450</p>
          <p className="text-[10px] text-slate-400">за сьогодні</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Truck size={14} className="text-orange-500" />
            <span className="text-[10px] text-slate-500">Строків доставки</span>
          </div>
          <p className="text-lg font-bold text-slate-800">45,230</p>
          <p className="text-[10px] text-slate-400">актуальних</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={14} className="text-red-500" />
            <span className="text-[10px] text-slate-500">Помилок</span>
          </div>
          <p className="text-lg font-bold text-red-600">70</p>
          <p className="text-[10px] text-slate-400">потребують уваги</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition whitespace-nowrap
              ${activeTab === tab.id
                ? 'bg-orange-100 text-orange-700'
                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'}`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {/* ─── UPLOAD TAB ─── */}
      {activeTab === 'upload' && (
        <div className="space-y-4">
          {/* Supplier & Type Selection */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Settings size={16} /> Параметри імпорту
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Постачальник *</label>
                <select
                  value={selectedSupplier}
                  onChange={e => setSelectedSupplier(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">Оберіть постачальника</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.logo} {s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Тип імпорту *</label>
                <select
                  value={importType}
                  onChange={e => setImportType(e.target.value as typeof importType)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="pricelist">📋 Прайс-лист (ціни)</option>
                  <option value="stock">📦 Залишки / Наявність</option>
                  <option value="delivery">🚚 Строки доставки</option>
                  <option value="full">📁 Повний каталог (всі дані)</option>
                </select>
              </div>
            </div>

            {/* Import Type Description */}
            <div className={`rounded-xl p-4 text-sm ${
              importType === 'pricelist' ? 'bg-blue-50 border border-blue-200' :
              importType === 'stock' ? 'bg-green-50 border border-green-200' :
              importType === 'delivery' ? 'bg-purple-50 border border-purple-200' :
              'bg-orange-50 border border-orange-200'
            }`}>
              <div className="flex items-start gap-3">
                <Info size={18} className={
                  importType === 'pricelist' ? 'text-blue-500' :
                  importType === 'stock' ? 'text-green-500' :
                  importType === 'delivery' ? 'text-purple-500' :
                  'text-orange-500'
                } />
                <div>
                  <p className="font-semibold text-slate-800 mb-1">{getTypeLabel(importType)}</p>
                  {importType === 'pricelist' && <p className="text-slate-600 text-xs">Оновлює закупівельні ціни та РРЦ. Обов'язкові поля: Артикул, Бренд, Ціна закупки. Роздрібна ціна розраховується за правилами націнки.</p>}
                  {importType === 'stock' && <p className="text-slate-600 text-xs">Оновлює залишки на складах постачальника. Обов'язкові поля: Артикул, Бренд, Кількість, Склад. Товари з 0 залишком отримають статус "Під замовлення".</p>}
                  {importType === 'delivery' && <p className="text-slate-600 text-xs">Оновлює строки доставки від постачальника. Обов'язкові поля: Артикул, Бренд, Строк поставки (дні). Враховується при відображенні клієнту.</p>}
                  {importType === 'full' && <p className="text-slate-600 text-xs">Повний імпорт каталогу: ціни, залишки, строки, опис, фото, OEM/крос-номери, застосовність. Створює нові товари та оновлює існуючі.</p>}
                </div>
              </div>
            </div>
          </div>

          {/* File Upload Area */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Upload size={16} /> Завантаження файлу
            </h3>

            {!uploadedFile ? (
              <div
                onClick={handleFileUpload}
                className="border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition"
              >
                <Upload size={48} className="text-slate-300 mx-auto mb-4" />
                <p className="text-lg font-semibold text-slate-700 mb-2">Перетягніть файл сюди або натисніть для вибору</p>
                <p className="text-sm text-slate-500 mb-4">Підтримувані формати:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    { ext: 'XLSX', color: 'bg-green-100 text-green-700', icon: '📊' },
                    { ext: 'XLS', color: 'bg-green-100 text-green-700', icon: '📊' },
                    { ext: 'CSV', color: 'bg-blue-100 text-blue-700', icon: '📄' },
                    { ext: 'XML', color: 'bg-purple-100 text-purple-700', icon: '📋' },
                    { ext: 'JSON', color: 'bg-yellow-100 text-yellow-700', icon: '📦' },
                  ].map(f => (
                    <span key={f.ext} className={`${f.color} px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1`}>
                      {f.icon} .{f.ext}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-4">Макс. розмір: 50 МБ • До 500,000 рядків</p>
              </div>
            ) : (
              <div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500 text-white rounded-lg p-2">
                      <FileSpreadsheet size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{uploadedFile}</p>
                      <p className="text-xs text-slate-500">XLSX • 4.2 МБ • 45,230 рядків • 18 колонок</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-green-500" />
                    <button
                      onClick={() => { setUploadedFile(null); setShowPreview(false); }}
                      className="text-slate-400 hover:text-red-500 transition p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* File Analysis */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-slate-800">45,230</p>
                    <p className="text-[10px] text-slate-500">Рядків у файлі</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-slate-800">18</p>
                    <p className="text-[10px] text-slate-500">Колонок</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-green-600">44,890</p>
                    <p className="text-[10px] text-slate-500">Валідних записів</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-orange-600">340</p>
                    <p className="text-[10px] text-slate-500">Потребують уваги</p>
                  </div>
                </div>

                {/* Detected columns */}
                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                  <p className="text-sm font-semibold text-slate-700 mb-2">Виявлені колонки у файлі:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {fileColumns.map(col => (
                      <span key={col} className="text-[10px] bg-white text-slate-600 px-2 py-1 rounded-lg border border-slate-200">
                        {col}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('mapping')}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    <Layers size={16} /> Налаштувати маппінг полів
                  </button>
                  <button
                    onClick={() => { setShowPreview(true); setActiveTab('preview'); }}
                    className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-200 transition flex items-center gap-2"
                  >
                    <Eye size={16} /> Переглянути дані
                  </button>
                  <button
                    onClick={handleStartImport}
                    disabled={isImporting}
                    className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition flex items-center gap-2 shadow-md disabled:opacity-50"
                  >
                    {isImporting ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
                    {isImporting ? 'Імпортується...' : 'Почати імпорт'}
                  </button>
                </div>

                {/* Import Progress */}
                {isImporting && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-blue-800">Імпорт в процесі...</span>
                      <span className="text-sm font-bold text-blue-700">{Math.min(Math.round(importProgress), 100)}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(importProgress, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-blue-600">
                      <span>Оброблено: {Math.round(45230 * Math.min(importProgress, 100) / 100).toLocaleString()} / 45,230</span>
                      <span>~{Math.max(1, Math.round((100 - importProgress) / 10))} сек. залишилось</span>
                    </div>
                  </div>
                )}

                {importProgress >= 100 && !isImporting && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={24} className="text-green-500" />
                      <div>
                        <p className="font-semibold text-green-800">Імпорт завершено успішно!</p>
                        <p className="text-xs text-green-600">44,890 записів імпортовано • 38,450 оновлено • 340 пропущено • 0 помилок</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Saved Templates */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileSpreadsheet size={16} /> Збережені шаблони імпорту
            </h3>
            <div className="space-y-2">
              {IMPORT_TEMPLATES.map(template => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                  onClick={handleFileUpload}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold
                      ${template.format === 'xlsx' ? 'bg-green-500' :
                        template.format === 'csv' ? 'bg-blue-500' :
                        template.format === 'xml' ? 'bg-purple-500' :
                        template.format === 'json' ? 'bg-yellow-500' :
                        'bg-slate-500'
                      }`}
                    >
                      {template.format.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{template.name}</p>
                      <p className="text-xs text-slate-500">{template.supplier} • {template.fields.length} полів • Останнє використання: {template.lastUsed}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── API SYNC TAB ─── */}
      {activeTab === 'api-sync' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <RefreshCw size={16} /> Синхронізація через API постачальників
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Автоматичний імпорт прайсів, залишків та строків поставки через API
            </p>

            <div className="space-y-3">
              {suppliers.map(supplier => (
                <ApiSyncCard key={supplier.id} supplier={supplier} />
              ))}
            </div>
          </div>

          {/* API Endpoints */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Link2 size={16} /> Ендпоінти API постачальників
            </h3>
            <div className="space-y-3">
              {[
                { supplier: 'Омега Автопоставка', endpoints: [
                  { method: 'GET', path: '/api/v2/pricelist', desc: 'Прайс-лист (ціни + назви)' },
                  { method: 'GET', path: '/api/v2/stock', desc: 'Залишки по складах' },
                  { method: 'GET', path: '/api/v2/delivery-terms', desc: 'Строки доставки' },
                  { method: 'POST', path: '/api/v2/order', desc: 'Створення замовлення' },
                ]},
                { supplier: 'Елít Україна', endpoints: [
                  { method: 'GET', path: '/rest/catalog/search', desc: 'Пошук по артикулу/OEM' },
                  { method: 'GET', path: '/rest/catalog/price', desc: 'Ціни та залишки' },
                  { method: 'GET', path: '/rest/catalog/crosses', desc: 'Крос-номери' },
                ]},
                { supplier: 'Автотехнікс', endpoints: [
                  { method: 'GET', path: '/export/xml/pricelist', desc: 'Вивантаження XML прайсу' },
                  { method: 'GET', path: '/export/xml/stock', desc: 'Залишки XML' },
                ]},
                { supplier: 'Інтеркарс', endpoints: [
                  { method: 'GET', path: '/api/search/article', desc: 'Пошук артикулу з аналогами' },
                  { method: 'GET', path: '/api/catalog/full', desc: 'Повний каталог JSON' },
                  { method: 'GET', path: '/api/stock/availability', desc: 'Наявність + строки' },
                  { method: 'POST', path: '/api/orders/create', desc: 'Замовлення' },
                  { method: 'GET', path: '/api/orders/status', desc: 'Статус замовлення' },
                ]},
              ].map(s => (
                <div key={s.supplier} className="border border-slate-100 rounded-xl p-4">
                  <p className="font-semibold text-slate-800 mb-2">{s.supplier}</p>
                  <div className="space-y-1">
                    {s.endpoints.map((ep, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className={`px-1.5 py-0.5 rounded font-mono font-bold ${ep.method === 'GET' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {ep.method}
                        </span>
                        <code className="text-slate-600 font-mono">{ep.path}</code>
                        <span className="text-slate-400">— {ep.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── MAPPING TAB ─── */}
      {activeTab === 'mapping' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Layers size={16} /> Маппінг полів ({IMPORT_FIELDS.length} полів)
              </h3>
              <div className="relative w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchFields}
                  onChange={e => setSearchFields(e.target.value)}
                  placeholder="Пошук поля..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            <p className="text-sm text-slate-500 mb-4">
              Зіставте колонки вашого файлу з полями системи. Поля з <span className="text-red-500">*</span> — обов'язкові.
            </p>

            {/* Field mapping list */}
            <div className="space-y-2">
              {filteredFields.map(field => {
                const FieldIcon = field.icon;
                return (
                  <div key={field.id} className="border border-slate-100 rounded-xl overflow-hidden">
                    <div
                      className="flex items-center justify-between p-3 hover:bg-slate-50 transition cursor-pointer"
                      onClick={() => setExpandedField(expandedField === field.id ? null : field.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                          <FieldIcon size={14} className="text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </p>
                          <p className="text-[10px] text-slate-400">{field.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <select
                          value={mappingColumns[field.id] || ''}
                          onChange={e => setMappingColumns({ ...mappingColumns, [field.id]: e.target.value })}
                          onClick={e => e.stopPropagation()}
                          className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 w-48 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        >
                          <option value="">— Не маппити —</option>
                          {fileColumns.map(col => (
                            <option key={col} value={col}>{col}</option>
                          ))}
                        </select>
                        {mappingColumns[field.id] ? (
                          <CheckCircle2 size={16} className="text-green-500" />
                        ) : field.required ? (
                          <AlertCircle size={16} className="text-red-400" />
                        ) : (
                          <div className="w-4" />
                        )}
                        <ChevronDown size={14} className={`text-slate-400 transition-transform ${expandedField === field.id ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                    {expandedField === field.id && (
                      <div className="px-3 pb-3 pt-1 bg-slate-50 border-t border-slate-100">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <p className="text-slate-500 mb-1">Приклад значення:</p>
                            <code className="bg-white px-2 py-1 rounded border border-slate-200 text-slate-700">{field.example}</code>
                          </div>
                          <div>
                            <p className="text-slate-500 mb-1">Тип поля:</p>
                            <span className="bg-white px-2 py-1 rounded border border-slate-200 text-slate-700">
                              {field.id.includes('Price') || field.id.includes('rrp') ? 'Число (ціна)' :
                               field.id === 'stock' || field.id === 'deliveryDays' || field.id === 'minOrder' ? 'Ціле число' :
                               'Текст'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="mt-4 bg-slate-50 rounded-xl p-4 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Маповано: <span className="font-bold text-green-600">{Object.values(mappingColumns).filter(Boolean).length}</span> / {IMPORT_FIELDS.length} полів
                {' • '}
                Обов'язкових: <span className="font-bold text-slate-800">{IMPORT_FIELDS.filter(f => f.required && mappingColumns[f.id]).length}</span> / {IMPORT_FIELDS.filter(f => f.required).length}
              </div>
              <button
                onClick={() => setActiveTab('preview')}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition flex items-center gap-2"
              >
                <Eye size={14} /> Перегляд даних →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── PREVIEW TAB ─── */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Eye size={16} /> Попередній перегляд даних
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Показано 8 з 45,230 записів</span>
                <button
                  onClick={handleStartImport}
                  disabled={isImporting}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition flex items-center gap-2"
                >
                  <Play size={14} /> Імпортувати все
                </button>
              </div>
            </div>

            {/* Validation summary */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-green-600">{PREVIEW_DATA.filter(r => r.valid && r.warnings.length === 0).length}</p>
                <p className="text-[10px] text-green-700">✓ Готові до імпорту</p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-yellow-600">{PREVIEW_DATA.filter(r => r.warnings.length > 0).length}</p>
                <p className="text-[10px] text-yellow-700">⚠ З попередженнями</p>
              </div>
              <div className="bg-red-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-red-600">{PREVIEW_DATA.filter(r => !r.valid && r.warnings.length === 0).length}</p>
                <p className="text-[10px] text-red-700">✗ Помилки</p>
              </div>
            </div>

            {/* Data table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600">
                    <th className="text-left px-3 py-2 font-semibold whitespace-nowrap">Статус</th>
                    <th className="text-left px-3 py-2 font-semibold whitespace-nowrap">Артикул</th>
                    <th className="text-left px-3 py-2 font-semibold whitespace-nowrap">Бренд</th>
                    <th className="text-left px-3 py-2 font-semibold whitespace-nowrap">Назва</th>
                    <th className="text-left px-3 py-2 font-semibold whitespace-nowrap">OEM</th>
                    <th className="text-right px-3 py-2 font-semibold whitespace-nowrap">Закупка ₴</th>
                    <th className="text-right px-3 py-2 font-semibold whitespace-nowrap">Роздріб ₴</th>
                    <th className="text-right px-3 py-2 font-semibold whitespace-nowrap">Націнка %</th>
                    <th className="text-right px-3 py-2 font-semibold whitespace-nowrap">Залишок</th>
                    <th className="text-left px-3 py-2 font-semibold whitespace-nowrap">Склад</th>
                    <th className="text-right px-3 py-2 font-semibold whitespace-nowrap">Дні</th>
                    <th className="text-left px-3 py-2 font-semibold whitespace-nowrap">Категорія</th>
                  </tr>
                </thead>
                <tbody>
                  {PREVIEW_DATA.map((row, i) => (
                    <tr key={i} className={`border-t border-slate-100 hover:bg-slate-50 ${!row.valid ? 'bg-red-50/50' : row.warnings.length > 0 ? 'bg-yellow-50/50' : ''}`}>
                      <td className="px-3 py-2">
                        {row.valid && row.warnings.length === 0 ? (
                          <CheckCircle2 size={14} className="text-green-500" />
                        ) : row.warnings.length > 0 ? (
                          <div className="group relative">
                            <AlertTriangle size={14} className="text-yellow-500" />
                            <div className="hidden group-hover:block absolute left-6 top-0 bg-yellow-100 border border-yellow-300 rounded-lg p-2 text-[10px] text-yellow-800 whitespace-nowrap z-10 shadow-md">
                              {row.warnings.map((w, j) => <p key={j}>⚠ {w}</p>)}
                            </div>
                          </div>
                        ) : (
                          <XCircle size={14} className="text-red-500" />
                        )}
                      </td>
                      <td className="px-3 py-2 font-mono font-medium text-slate-800">{row.article}</td>
                      <td className="px-3 py-2 text-slate-700">{row.brand}</td>
                      <td className="px-3 py-2 text-slate-700 max-w-[200px] truncate">{row.name}</td>
                      <td className="px-3 py-2 font-mono text-slate-500 text-[10px]">{row.oem || '—'}</td>
                      <td className="px-3 py-2 text-right font-medium text-slate-800">{row.purchasePrice.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right font-bold text-green-700">{row.retailPrice.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${row.markup >= 50 ? 'bg-green-100 text-green-700' : row.markup >= 40 ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          +{row.markup}%
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <span className={`font-medium ${row.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {row.stock}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-slate-500">{row.warehouse}</td>
                      <td className="px-3 py-2 text-right text-slate-700">{row.deliveryDays}д</td>
                      <td className="px-3 py-2 text-slate-500">{row.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── HISTORY TAB ─── */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Clock size={16} /> Історія імпортів
              </h3>
              <div className="relative w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={historyFilter}
                  onChange={e => setHistoryFilter(e.target.value)}
                  placeholder="Фільтр..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              {filteredHistory.map(record => {
                const status = getStatusBadge(record.status);
                return (
                  <div
                    key={record.id}
                    onClick={() => setSelectedHistoryRecord(selectedHistoryRecord?.id === record.id ? null : record)}
                    className="border border-slate-100 rounded-xl overflow-hidden cursor-pointer hover:shadow-sm transition"
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                          ${record.method === 'api' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                          {record.method === 'api' ? <RefreshCw size={18} /> : <FileSpreadsheet size={18} />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-slate-800">{record.supplier}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getTypeColor(record.type)}`}>
                              {getTypeLabel(record.type)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            {record.date} • {record.format} {record.fileName ? `• ${record.fileName}` : ''} • {record.duration}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium ${status.color}`}>
                          {status.icon} {status.label}
                        </span>
                        <ChevronDown size={14} className={`text-slate-400 transition-transform ${selectedHistoryRecord?.id === record.id ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {selectedHistoryRecord?.id === record.id && (
                      <div className="bg-slate-50 border-t border-slate-100 p-4">
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                          <div className="text-center">
                            <p className="text-lg font-bold text-slate-800">{record.recordsTotal.toLocaleString()}</p>
                            <p className="text-[10px] text-slate-500">Всього записів</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-green-600">{record.recordsImported.toLocaleString()}</p>
                            <p className="text-[10px] text-slate-500">Імпортовано</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-blue-600">{record.recordsUpdated.toLocaleString()}</p>
                            <p className="text-[10px] text-slate-500">Оновлено</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-yellow-600">{record.recordsSkipped.toLocaleString()}</p>
                            <p className="text-[10px] text-slate-500">Пропущено</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-red-600">{record.recordsErrors.toLocaleString()}</p>
                            <p className="text-[10px] text-slate-500">Помилок</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── PRICE RULES TAB ─── */}
      {activeTab === 'price-rules' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <DollarSign size={16} /> Правила ціноутворення
              </h3>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition flex items-center gap-2">
                + Додати правило
              </button>
            </div>

            <p className="text-sm text-slate-500 mb-4">
              Автоматичний розрахунок роздрібної ціни на основі закупівельної ціни від постачальника
            </p>

            {/* Formula explanation */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <p className="text-sm font-semibold text-blue-800 mb-1">Формула розрахунку:</p>
              <code className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">
                Роздрібна ціна = Закупка × (1 + Націнка%) → округлення → перевірка мін. маржі
              </code>
            </div>

            <div className="space-y-3">
              {PRICE_RULES.map(rule => (
                <div key={rule.id} className={`border rounded-xl p-4 flex items-center justify-between ${rule.active ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-60'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${rule.active ? 'bg-green-500' : 'bg-slate-300'}`} />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{rule.supplier}</p>
                      <p className="text-xs text-slate-500">Категорія: {rule.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-lg font-bold text-orange-600">+{rule.markupPercent}%</p>
                      <p className="text-[10px] text-slate-500">Націнка</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-700">{rule.minMarginPercent}%</p>
                      <p className="text-[10px] text-slate-500">Мін. маржа</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-700">{rule.roundTo}</p>
                      <p className="text-[10px] text-slate-500">Округлення ₴</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-500 transition"><Settings size={14} /></button>
                      <button className="p-1.5 text-slate-400 hover:text-red-500 transition"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Calculator */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BarChart3 size={16} /> Калькулятор ціни
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Закупівельна ціна</label>
                <input type="number" defaultValue={1250} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Націнка %</label>
                <input type="number" defaultValue={45} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Роздрібна ціна</label>
                <div className="w-full bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 text-sm font-bold text-green-700">
                  1,810 ₴
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── SCHEDULE TAB ─── */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Calendar size={16} /> Розклад автоматичних імпортів
              </h3>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition flex items-center gap-2">
                + Додати розклад
              </button>
            </div>

            <div className="space-y-3">
              {SCHEDULES.map(sched => (
                <div key={sched.id} className={`border rounded-xl p-4 flex items-center justify-between ${sched.active ? 'border-slate-200' : 'border-slate-100 opacity-60'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${sched.active ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                      {sched.active ? <Play size={18} /> : <Pause size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{sched.supplier}</p>
                      <p className="text-xs text-slate-500">{sched.type} • {sched.frequency}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Наступний запуск:</p>
                      <p className="text-sm font-medium text-slate-800">{sched.nextRun}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={sched.active} className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── API Sync Card Sub-component ──
function ApiSyncCard({ supplier }: { supplier: typeof suppliers[0] }) {
  const [syncing, setSyncing] = useState(false);
  const [syncType, setSyncType] = useState<'pricelist' | 'stock' | 'delivery' | 'full'>('full');
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setProgress(0);
    setCompleted(false);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSyncing(false);
          setCompleted(true);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 300);
  };

  return (
    <div className="border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: supplier.color + '15' }}>
            {supplier.logo}
          </div>
          <div>
            <p className="font-semibold text-slate-800">{supplier.name}</p>
            <p className="text-xs text-slate-500">{supplier.productsCount.toLocaleString()} товарів • Останній: {supplier.lastSync}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium
          ${supplier.apiStatus === 'connected' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
        >
          {supplier.apiStatus === 'connected' ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
          {supplier.apiStatus === 'connected' ? "З'єднано" : "Від'єднано"}
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1">
          <label className="text-xs text-slate-500 mb-1 block">Що імпортувати:</label>
          <select
            value={syncType}
            onChange={e => setSyncType(e.target.value as typeof syncType)}
            className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="full">📁 Повний каталог</option>
            <option value="pricelist">📋 Тільки прайс (ціни)</option>
            <option value="stock">📦 Тільки залишки</option>
            <option value="delivery">🚚 Тільки строки доставки</option>
          </select>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
            syncing ? 'bg-blue-100 text-blue-600' :
            completed ? 'bg-green-500 text-white' :
            'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {syncing ? <><RefreshCw size={12} className="animate-spin" /> Синхронізація...</> :
           completed ? <><CheckCircle2 size={12} /> Завершено</> :
           <><RefreshCw size={12} /> Синхронізувати</>}
        </button>
      </div>

      {syncing && (
        <div className="mt-3">
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(progress, 100)}%` }} />
          </div>
          <p className="text-[10px] text-slate-500 mt-1">{Math.round(Math.min(progress, 100))}% — імпорт даних...</p>
        </div>
      )}

      {completed && (
        <div className="mt-3 flex items-center gap-2 text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">
          <CheckCircle2 size={14} /> Імпорт завершено: {supplier.productsCount.toLocaleString()} записів оброблено
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 mt-3">
        {['Прайс-лист', 'Залишки', 'Строки', 'OEM', 'Крос-номери', 'Застосовність'].map(cap => (
          <span key={cap} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
            {cap}
          </span>
        ))}
      </div>
    </div>
  );
}
