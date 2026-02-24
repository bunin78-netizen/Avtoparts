import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface Order {
  id: string;
  date: string;
  items: { name: string; sku: string; qty: number; price: number }[];
  total: number;
  status: 'pending' | 'paid' | 'shipping' | 'delivered' | 'cancelled';
  paymentMethod: string;
  delivery: { city: string; warehouse: string; ttn?: string };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'customer' | 'admin';
  avatar?: string;
  registeredAt: string;
  wishlist: number[];
  orders: Order[];
  messenger: 'telegram' | 'viber';
  city?: string;
  warehouse?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (data: { email: string; password: string; firstName: string; lastName: string; phone: string; messenger: 'telegram' | 'viber' }) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  toggleWishlist: (productId: number) => void;
  addOrder: (order: Order) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_ORDERS: Order[] = [
  {
    id: 'AP-28471',
    date: '2024-01-12',
    items: [
      { name: 'Гальмівні колодки передні Brembo', sku: 'BP-2345-F', qty: 1, price: 1850 },
      { name: 'Масляний фільтр Mann-Filter', sku: 'OF-1122-M', qty: 2, price: 285 },
    ],
    total: 2420,
    status: 'delivered',
    paymentMethod: 'mono',
    delivery: { city: 'Київ', warehouse: 'Відділення №5: просп. Перемоги, 67', ttn: '20450000789012' },
  },
  {
    id: 'AP-31205',
    date: '2024-01-14',
    items: [
      { name: 'Амортизатор задній Sachs', sku: 'SA-5567-R', qty: 2, price: 3200 },
    ],
    total: 6400,
    status: 'shipping',
    paymentMethod: 'privat',
    delivery: { city: 'Київ', warehouse: 'Відділення №12: вул. Велика Васильківська, 100', ttn: '20450000891234' },
  },
  {
    id: 'AP-33087',
    date: '2024-01-15',
    items: [
      { name: 'Ремінь ГРМ Gates (комплект)', sku: 'TB-3344-G', qty: 1, price: 4500 },
      { name: 'Термостат Mahle', sku: 'TH-6677-W', qty: 1, price: 890 },
    ],
    total: 5390,
    status: 'paid',
    paymentMethod: 'mono',
    delivery: { city: 'Львів', warehouse: 'Відділення №3: просп. Свободи, 28' },
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((email: string, _password: string) => {
    if (!email) return { success: false, error: 'Введіть email' };

    // Admin login
    if (email === 'admin@avtopro.ua') {
      setUser({
        id: 'admin-1',
        email: 'admin@avtopro.ua',
        firstName: 'Адмін',
        lastName: 'АвтоПро',
        phone: '+380441234567',
        role: 'admin',
        registeredAt: '2023-01-01',
        wishlist: [],
        orders: [],
        messenger: 'telegram',
      });
      return { success: true };
    }

    // Customer login (demo)
    setUser({
      id: 'user-' + Date.now(),
      email,
      firstName: 'Іван',
      lastName: 'Петренко',
      phone: '+380671234567',
      role: 'customer',
      registeredAt: '2024-01-01',
      wishlist: [1, 5, 11],
      orders: DEMO_ORDERS,
      messenger: 'telegram',
      city: 'Київ',
      warehouse: 'Відділення №5: просп. Перемоги, 67',
    });
    return { success: true };
  }, []);

  const register = useCallback((data: { email: string; password: string; firstName: string; lastName: string; phone: string; messenger: 'telegram' | 'viber' }) => {
    if (!data.email || !data.firstName || !data.phone) {
      return { success: false, error: 'Заповніть всі обов\'язкові поля' };
    }
    if (!data.password || data.password.length < 6) {
      return { success: false, error: 'Пароль має бути мінімум 6 символів' };
    }

    setUser({
      id: 'user-' + Date.now(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: 'customer',
      registeredAt: new Date().toISOString().split('T')[0],
      wishlist: [],
      orders: [],
      messenger: data.messenger,
    });
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  }, []);

  const toggleWishlist = useCallback((productId: number) => {
    setUser(prev => {
      if (!prev) return null;
      const exists = prev.wishlist.includes(productId);
      return {
        ...prev,
        wishlist: exists
          ? prev.wishlist.filter(id => id !== productId)
          : [...prev.wishlist, productId],
      };
    });
  }, []);

  const addOrder = useCallback((order: Order) => {
    setUser(prev => prev ? { ...prev, orders: [order, ...prev.orders] } : null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
      updateProfile,
      toggleWishlist,
      addOrder,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
