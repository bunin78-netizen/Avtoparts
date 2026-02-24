export interface Product {
  id: number;
  name: string;
  sku: string;
  brand: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  supplier: string;
  inStock: boolean;
  description: string;
  oem: string;
  compatibility: string[];
}

export interface Supplier {
  id: string;
  name: string;
  logo: string;
  apiStatus: 'connected' | 'disconnected' | 'syncing';
  lastSync: string;
  productsCount: number;
  color: string;
}

export const suppliers: Supplier[] = [
  { id: 'omega', name: 'Омега Автопоставка', logo: '🔧', apiStatus: 'connected', lastSync: '2024-01-15 14:30', productsCount: 45230, color: '#2563eb' },
  { id: 'elit', name: 'Елít Україна', logo: '⚙️', apiStatus: 'connected', lastSync: '2024-01-15 13:45', productsCount: 38750, color: '#dc2626' },
  { id: 'autotechnix', name: 'Автотехнікс', logo: '🔩', apiStatus: 'syncing', lastSync: '2024-01-15 12:00', productsCount: 22400, color: '#059669' },
  { id: 'intercars', name: 'Інтеркарс', logo: '🚗', apiStatus: 'connected', lastSync: '2024-01-15 14:00', productsCount: 67800, color: '#7c3aed' },
];

export const categories = [
  'Всі категорії',
  'Двигун',
  'Гальмівна система',
  'Підвіска',
  'Фільтри',
  'Масла та рідини',
  'Електрика',
  'Кузовні деталі',
  'Трансмісія',
  'Охолодження',
  'Вихлопна система',
];

export const brands = [
  'Bosch', 'Mann-Filter', 'Sachs', 'TRW', 'SKF', 'Gates',
  'Valeo', 'LuK', 'Mahle', 'NGK', 'Denso', 'Febi',
  'Lemförder', 'Continental', 'Hella', 'Brembo',
];

const productImages = [
  'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop',
];

export const products: Product[] = [
  {
    id: 1, name: 'Гальмівні колодки передні', sku: 'BP-2345-F', brand: 'Brembo',
    category: 'Гальмівна система', price: 1850, oldPrice: 2200,
    image: productImages[0], supplier: 'Омега Автопоставка', inStock: true,
    description: 'Високоякісні гальмівні колодки Brembo для передньої осі. Забезпечують відмінне гальмування та довгий термін служби.',
    oem: '7L6698151', compatibility: ['VW Touareg', 'Audi Q7', 'Porsche Cayenne'],
  },
  {
    id: 2, name: 'Масляний фільтр', sku: 'OF-1122-M', brand: 'Mann-Filter',
    category: 'Фільтри', price: 285, oldPrice: 350,
    image: productImages[1], supplier: 'Елít Україна', inStock: true,
    description: 'Оригінальний масляний фільтр Mann-Filter. Надійний захист двигуна від забруднень.',
    oem: '06J115403Q', compatibility: ['VW Golf', 'Skoda Octavia', 'Audi A3'],
  },
  {
    id: 3, name: 'Амортизатор задній', sku: 'SA-5567-R', brand: 'Sachs',
    category: 'Підвіска', price: 3200, oldPrice: 3800,
    image: productImages[2], supplier: 'Інтеркарс', inStock: true,
    description: 'Газомасляний амортизатор Sachs для задньої осі. Забезпечує комфортну їзду та стабільність.',
    oem: '1K0513029', compatibility: ['VW Golf V', 'VW Golf VI', 'Skoda Octavia A5'],
  },
  {
    id: 4, name: 'Свічки запалювання (комплект 4шт)', sku: 'SP-8890-N', brand: 'NGK',
    category: 'Електрика', price: 720,
    image: productImages[3], supplier: 'Автотехнікс', inStock: true,
    description: 'Іридієві свічки запалювання NGK. Покращена ефективність згоряння палива.',
    oem: '101905617C', compatibility: ['VW Passat', 'Audi A4', 'Skoda Superb'],
  },
  {
    id: 5, name: 'Ремінь ГРМ (комплект)', sku: 'TB-3344-G', brand: 'Gates',
    category: 'Двигун', price: 4500, oldPrice: 5200,
    image: productImages[0], supplier: 'Омега Автопоставка', inStock: true,
    description: 'Повний комплект ГРМ Gates: ремінь, ролики, помпа. Все необхідне для заміни.',
    oem: 'K025649XS', compatibility: ['VW Passat 1.9 TDI', 'Skoda Octavia 1.9 TDI', 'Audi A4 1.9 TDI'],
  },
  {
    id: 6, name: 'Повітряний фільтр', sku: 'AF-7712-M', brand: 'Mahle',
    category: 'Фільтри', price: 380,
    image: productImages[1], supplier: 'Елít Україна', inStock: true,
    description: 'Повітряний фільтр Mahle для ефективного очищення повітря, що надходить у двигун.',
    oem: '1F0129620', compatibility: ['VW Passat B6', 'VW Passat CC', 'VW Tiguan'],
  },
  {
    id: 7, name: 'Диск гальмівний передній', sku: 'BD-4456-T', brand: 'TRW',
    category: 'Гальмівна система', price: 1450, oldPrice: 1700,
    image: productImages[2], supplier: 'Інтеркарс', inStock: false,
    description: 'Вентильований гальмівний диск TRW. Ефективне відведення тепла при гальмуванні.',
    oem: '1K0615301AA', compatibility: ['VW Golf V', 'VW Golf VI', 'Audi A3'],
  },
  {
    id: 8, name: 'Моторне масло 5W-30 (5л)', sku: 'MO-9901-C', brand: 'Valeo',
    category: 'Масла та рідини', price: 1680,
    image: productImages[3], supplier: 'Автотехнікс', inStock: true,
    description: 'Синтетичне моторне масло 5W-30 преміум класу. Відповідає стандартам VW 504.00/507.00.',
    oem: 'G052195M4', compatibility: ['VW', 'Audi', 'Skoda', 'Seat'],
  },
  {
    id: 9, name: 'Стійка стабілізатора', sku: 'SL-6678-L', brand: 'Lemförder',
    category: 'Підвіска', price: 560, oldPrice: 680,
    image: productImages[0], supplier: 'Омега Автопоставка', inStock: true,
    description: 'Оригінальна якість Lemförder. Забезпечує стабільність автомобіля при маневруванні.',
    oem: '1K0411315R', compatibility: ['VW Golf V/VI', 'Audi A3', 'Skoda Octavia A5'],
  },
  {
    id: 10, name: 'Генератор', sku: 'GN-1234-H', brand: 'Hella',
    category: 'Електрика', price: 8500, oldPrice: 9800,
    image: productImages[1], supplier: 'Елít Україна', inStock: true,
    description: 'Генератор Hella 140A. Надійне електроживлення для всіх систем автомобіля.',
    oem: '06F903023F', compatibility: ['VW Passat B6', 'Audi A4 B7', 'Skoda Superb'],
  },
  {
    id: 11, name: 'Радіатор охолодження', sku: 'RD-5566-V', brand: 'Valeo',
    category: 'Охолодження', price: 4200, oldPrice: 4900,
    image: productImages[2], supplier: 'Інтеркарс', inStock: true,
    description: 'Алюмінієвий радіатор охолодження Valeo. Відмінне відведення тепла.',
    oem: '1K0121251EH', compatibility: ['VW Golf V', 'VW Touran', 'Audi A3'],
  },
  {
    id: 12, name: 'Комплект зчеплення', sku: 'CK-7788-L', brand: 'LuK',
    category: 'Трансмісія', price: 6800,
    image: productImages[3], supplier: 'Автотехнікс', inStock: true,
    description: 'Повний комплект зчеплення LuK: диск, корзина, підшипник. Оригінальна якість.',
    oem: '623315600', compatibility: ['VW Passat 2.0 TDI', 'Skoda Octavia 2.0 TDI'],
  },
  {
    id: 13, name: 'Каталізатор', sku: 'CT-3399-B', brand: 'Bosch',
    category: 'Вихлопна система', price: 12500, oldPrice: 14000,
    image: productImages[0], supplier: 'Омега Автопоставка', inStock: false,
    description: 'Каталітичний нейтралізатор Bosch. Відповідає стандартам Euro 5.',
    oem: '1K0254512HX', compatibility: ['VW Golf VI 1.6', 'Skoda Octavia A5 1.6'],
  },
  {
    id: 14, name: 'Підшипник маточини передній', sku: 'WB-2211-S', brand: 'SKF',
    category: 'Підвіска', price: 2100,
    image: productImages[1], supplier: 'Елít Україна', inStock: true,
    description: 'Підшипник маточини SKF преміум якості. Тихий хід та довговічність.',
    oem: '8V0498625', compatibility: ['VW Golf VII', 'Audi A3 8V', 'Skoda Octavia A7'],
  },
  {
    id: 15, name: 'Фара головного світла ліва', sku: 'HL-4455-H', brand: 'Hella',
    category: 'Кузовні деталі', price: 7600, oldPrice: 8500,
    image: productImages[2], supplier: 'Інтеркарс', inStock: true,
    description: 'Фара головного світла Hella з лінзою. Відмінне освітлення дороги.',
    oem: '5G0941005', compatibility: ['VW Golf VII'],
  },
  {
    id: 16, name: 'Термостат', sku: 'TH-6677-W', brand: 'Mahle',
    category: 'Охолодження', price: 890, oldPrice: 1050,
    image: productImages[3], supplier: 'Автотехнікс', inStock: true,
    description: 'Термостат Mahle з корпусом. Точне регулювання температури двигуна.',
    oem: '06B121111K', compatibility: ['VW Passat B5', 'Audi A4 B6', 'Skoda Superb I'],
  },
];
