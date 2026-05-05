import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ha';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'welcome': 'Welcome to Bakiyawa Hub',
    'slogan': 'Abuja\'s Trusted Construction Partner',
    'get_started': 'Get Started',
    'home': 'Home',
    'store': 'Store',
    'book': 'Book',
    'account': 'Account',
    'browse_materials': 'Browse Materials',
    'book_services': 'Book Services',
    'order_history': 'Order History',
    'contact_us': 'Contact Us',
    'fast_delivery': 'Fast delivery, best prices!',
    'sand': 'Sand',
    'stones': 'Stones',
    'equipment': 'Equipment',
    'others': 'Others',
    'add_to_cart': 'Add to Cart',
    'checkout': 'Checkout',
    'cart': 'Cart',
    'total': 'Total',
    'delivery': 'Delivery',
    'pickup': 'Pickup',
    'place_order': 'Place Order',
    'track_order': 'Track Order',
    'history': 'History',
    'about': 'About Us',
    'settings': 'Settings',
    'logout': 'Logout',
    'login_google': 'Sign in with Google',
    'hausa': 'Hausa',
    'english': 'English',
    'track': 'Track',
    'back': 'Back',
    'all': 'All'
  },
  ha: {
    'welcome': 'Barka da zuwa Bakiyawa Hub',
    'slogan': 'Abokin Gina na Abuja da aka Aminta da shi',
    'get_started': 'Fara Yanzu',
    'home': 'Gida',
    'store': 'Shago',
    'book': 'Littafi',
    'account': 'Asusu',
    'browse_materials': 'Duba Kayan Gini',
    'book_services': 'Yi Rajista na Musamman',
    'order_history': 'Tarihin Oda',
    'contact_us': 'Tuntube mu',
    'fast_delivery': 'Isarwa da sauri, mafi kyawun farashi!',
    'sand': 'Yashi',
    'stones': 'Duwatsu',
    'equipment': 'Kayan Aiki',
    'others': 'Wasu',
    'add_to_cart': 'Saka a Kwando',
    'checkout': 'Biyan Oda',
    'cart': 'Kwando',
    'total': 'Jimilla',
    'delivery': 'Isarwa',
    'pickup': 'Dauka',
    'place_order': 'Yi Oda',
    'track_order': 'Bibiyar Oda',
    'history': 'Tarihi',
    'about': 'Game da mu',
    'settings': 'Saituna',
    'logout': 'Fita',
    'login_google': 'Shiga da Google',
    'hausa': 'Hausa',
    'english': 'Ingilishi',
    'track': 'Bibi',
    'back': 'Baya',
    'all': 'Duka'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
