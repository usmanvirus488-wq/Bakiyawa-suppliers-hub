import React, { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Package, 
  Truck, 
  MapPin, 
  Phone, 
  ShoppingCart, 
  Clock, 
  Menu, 
  X,
  ChevronRight,
  HardHat,
  Droplets,
  Users,
  MessageCircle,
  Mail,
  ArrowRight,
  Heart,
  LogOut,
  Settings,
  User as UserIcon,
  Plus,
  Trash2,
  Globe,
  CheckCircle2,
  CreditCard,
  Banknote,
  Minus,
  Star,
  Share2
} from 'lucide-react';
import { cn } from './lib/utils';
import { PRODUCTS, CONTACT_INFO, SERVICES, type Category, type Product } from './constants';
import { useAuth } from './components/FirebaseProvider';
import { useLanguage } from './components/LanguageContext';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc, 
  onSnapshot, 
  serverTimestamp,
  updateDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';

// --- Components ---

const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' }) => {
  const variants = {
    primary: 'bg-brand-yellow text-brand-black hover:bg-brand-yellow/90',
    secondary: 'bg-brand-black text-white hover:bg-brand-black/90',
    outline: 'border-2 border-brand-black text-brand-black hover:bg-brand-black hover:text-white',
    ghost: 'text-brand-black hover:bg-neutral-100'
  };
  
  return (
    <button 
      className={cn(
        'px-6 py-3 rounded-xl font-bold flex items-center justify-center transition-all active:scale-95 disabled:opacity-50',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className, ...props }: { children: ReactNode; className?: string; [key: string]: any }) => (
  <div 
    className={cn('bg-white rounded-3xl p-6 shadow-sm border border-neutral-100', className)}
    {...props}
  >
    {children}
  </div>
);

// --- Views ---

const AppDownloadSection = () => (
  <div className="space-y-4 pt-10 border-t border-neutral-100">
     <div className="text-center space-y-1">
        <h3 className="text-sm font-black uppercase tracking-tight">Our Mobile App</h3>
        <p className="text-[10px] text-neutral-400 font-bold uppercase">Experience faster ordering on mobile</p>
     </div>
     <div className="flex justify-center gap-3">
        <button 
          onClick={() => alert("Coming soon to Apple App Store")}
          className="flex items-center gap-2 bg-brand-black text-white px-4 py-2 rounded-xl transition-transform active:scale-95"
        >
          <div className="bg-white/10 p-1 rounded-md">
             <img src="https://upload.wikimedia.org/wikipedia/commons/3/31/Apple_logo_white.svg" className="w-4 h-4" alt="Apple" />
          </div>
          <div className="text-left">
             <p className="text-[8px] font-bold uppercase leading-none opacity-60">Coming Soon</p>
             <p className="text-[10px] font-black uppercase leading-none mt-0.5">App Store</p>
          </div>
        </button>
        <button 
          onClick={() => alert("Coming soon to Google Play Store")}
          className="flex items-center gap-2 bg-brand-black text-white px-4 py-2 rounded-xl transition-transform active:scale-95"
        >
          <div className="bg-white/10 p-1 rounded-md">
             <img src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Google_Play_Store_logo_2022.svg" className="w-4 h-4" alt="Google Play" />
          </div>
          <div className="text-left">
             <p className="text-[8px] font-bold uppercase leading-none opacity-60">Get it on</p>
             <p className="text-[10px] font-black uppercase leading-none mt-0.5">Google Play</p>
          </div>
        </button>
     </div>
     <div className="flex justify-center pt-2">
        <button 
          onClick={async () => {
            const shareData = {
              title: 'Bakiyawa Supplies Hub',
              text: 'Abuja\'s most reliable building materials delivery service.',
              url: window.location.origin,
            };
            try {
              if (navigator.share) await navigator.share(shareData);
              else {
                await navigator.clipboard.writeText(window.location.origin);
                alert('App link copied to clipboard!');
              }
            } catch (err) { console.error(err); }
          }}
          className="text-[10px] font-bold uppercase text-brand-yellow flex items-center gap-1 bg-brand-black px-4 py-2 rounded-full"
        >
          <Share2 size={12} /> Share App Link
        </button>
     </div>
  </div>
);

const HomeView = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  const { t } = useLanguage();
  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <section className="relative h-[220px] rounded-3xl overflow-hidden yellow-gradient p-8 flex flex-col justify-end">
        <div className="absolute top-4 right-4 bg-brand-black text-brand-yellow px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Abuja's Trusted Partner
        </div>
        <h1 className="text-4xl font-extrabold text-brand-black leading-tight drop-shadow-sm">
          {t('fast_delivery').split(',')[0]}, <br /> {t('fast_delivery').split(',')[1]}
        </h1>
        <p className="text-brand-black/70 font-medium mt-2">Bakiyawa Supplies Hub – Built with trust.</p>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-2 gap-4">
        <Button 
          variant="secondary" 
          className="h-32 flex-col gap-2 rounded-3xl"
          onClick={() => onNavigate('catalog')}
        >
          <Package className="w-8 h-8" />
          <span className="text-sm">{t('browse_materials')}</span>
        </Button>
        <Button 
          variant="primary" 
          className="h-32 flex-col gap-2 rounded-3xl"
          onClick={() => onNavigate('booking')}
        >
          <Truck className="w-8 h-8" />
          <span className="text-sm">{t('book_services')}</span>
        </Button>
      </section>

    {/* Promo Banner */}
    <Card className="bg-brand-black text-white overflow-hidden relative border-none">
      <div className="relative z-10 space-y-4">
        <h2 className="text-brand-yellow text-2xl font-bold uppercase tracking-tighter">Reliable Supplies</h2>
        <p className="text-neutral-400 text-sm">Everything you need from sand to excavators at Guzape, Abuja.</p>
        <Button 
          variant="primary" 
          className="w-fit py-2 px-4 text-xs"
          onClick={() => onNavigate('about')}
        >
          Company History
        </Button>
      </div>
      <div className="absolute -right-10 -bottom-10 opacity-20 transform rotate-12">
        <HardHat size={160} />
      </div>
    </Card>

    {/* Order Tracking Peek */}
    <Button 
      variant="outline" 
      className="w-full justify-between p-6 rounded-3xl"
      onClick={() => onNavigate('tracking')}
    >
      <div className="flex items-center gap-4">
        <div className="bg-brand-yellow text-brand-black p-2 rounded-full">
          <Clock className="w-6 h-6" />
        </div>
        <div className="text-left">
          <p className="font-bold">Track My Order</p>
          <p className="text-sm font-normal text-neutral-500 underline">Check your delivery status</p>
        </div>
      </div>
      <ChevronRight className="w-6 h-6 text-neutral-300" />
    </Button>

    {/* Featured Items Peek */}
    <div className="space-y-4">
       <div className="flex justify-between items-center px-1">
         <h3 className="font-bold text-lg">Top Materials</h3>
         <button onClick={() => onNavigate('catalog')} className="text-brand-yellow font-bold text-sm">View all</button>
       </div>
       <div className="grid grid-cols-2 gap-4">
          {PRODUCTS.slice(0, 2).map(p => (
            <Card key={p.id} className="p-2 pb-4 space-y-2">
              <div className="h-24 bg-neutral-100 rounded-2xl overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <p className="font-bold text-xs truncate px-2">{p.name}</p>
              <p className="text-[10px] text-neutral-500 font-mono px-2">{p.price}</p>
            </Card>
          ))}
       </div>
    </div>

    <AppDownloadSection />
  </div>
);
};

const CatalogView = ({ onAddToCart, onSelectProduct }: { onAddToCart: (p: Product) => void, onSelectProduct: (p: Product) => void }) => {
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const { user } = useAuth();
  const { t } = useLanguage();
  
  useEffect(() => {
    if (!user) return;
    const favPath = `users/${user.uid}/favorites`;
    const unsub = onSnapshot(collection(db, favPath), 
      (snap) => {
        setFavorites(snap.docs.map(d => d.id));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, favPath)
    );
    return () => unsub();
  }, [user]);

  const toggleFavorite = async (p: Product) => {
    if (!user) {
      alert('Please sign in to save favorites');
      return;
    }
    const favDoc = doc(db, `users/${user.uid}/favorites`, p.id);
    try {
      if (favorites.includes(p.id)) {
        await deleteDoc(favDoc);
      } else {
        await setDoc(favDoc, {
          userId: user.uid,
          productId: p.id,
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/favorites/${p.id}`);
    }
  };

  const filteredProducts = activeCategory === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  const categories: (Category | 'All')[] = ['All', 'Sand', 'Stones', 'Equipment', 'Others'];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex overflow-x-auto gap-2 no-scrollbar py-2 -mx-6 px-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'px-5 py-2 rounded-full font-bold whitespace-nowrap transition-all border-2',
              activeCategory === cat 
                ? 'bg-brand-black text-white border-brand-black' 
                : 'bg-white text-neutral-500 border-neutral-100'
            )}
          >
            {t(cat.toLowerCase())}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredProducts.map(product => {
          const isFav = favorites.includes(product.id);
          return (
            <motion.div layout key={product.id}>
              <Card className="flex gap-4 p-4 items-center relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product);
                  }}
                  className="absolute top-2 right-2 p-2 rounded-full bg-neutral-50/80 backdrop-blur shadow-sm z-10"
                >
                  <Heart size={16} className={cn(isFav ? "fill-red-500 text-red-500" : "text-neutral-300")} />
                </button>
                <div 
                  className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-neutral-100 cursor-pointer"
                  onClick={() => onSelectProduct(product)}
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 
                    className="font-bold text-lg truncate cursor-pointer"
                    onClick={() => onSelectProduct(product)}
                  >
                    {product.name}
                  </h3>
                  <p className="text-neutral-500 text-sm mb-3">
                    {product.price} <span className="text-xs font-normal">({product.unit})</span>
                  </p>
                  <Button 
                    className="w-full py-2 text-xs" 
                    onClick={() => {
                      onAddToCart(product);
                    }}
                  >
                    <ShoppingCart className="w-3 h-3 mr-2" /> {t('add_to_cart')}
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
      <AppDownloadSection />
    </div>
  );
};

const BookingView = () => {
  const [step, setStep] = useState(1);
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    quantity: '',
    location: ''
  });

  return (
    <div className="space-y-6 min-h-[60vh]">
      <div className="text-center space-y-2 py-4">
        <h2 className="text-3xl font-black uppercase tracking-tighter">{t('book_services')}</h2>
        <p className="text-neutral-500 text-sm">Professional equipment for your construction project.</p>
      </div>

      <Card className="p-8 space-y-6 bg-brand-yellow/5 border-dashed border-2 border-brand-yellow/30 relative">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-yellow text-brand-black px-3 py-1 rounded-full text-[10px] font-black uppercase">
          Step {step} of 2
        </div>
        
        {step === 1 ? (
          <div className="space-y-4">
            <label className="text-sm font-black block text-neutral-700 uppercase">Select Service Type</label>
            <div className="grid grid-cols-2 gap-3">
              {SERVICES.map(s => (
                <button
                  key={s.id}
                  onClick={() => setFormData({...formData, service: s.name})}
                  className={cn(
                    "p-4 rounded-3xl flex flex-col items-center gap-2 border-2 transition-all",
                    formData.service === s.name ? "border-brand-black bg-brand-black text-white" : "bg-white border-neutral-100"
                  )}
                >
                  {s.icon === 'Truck' && <Truck />}
                  {s.icon === 'HardHat' && <HardHat />}
                  {s.icon === 'Users' && <Users />}
                  {s.icon === 'Droplets' && <Droplets />}
                  <span className="text-[10px] font-black uppercase mt-1">{s.name}</span>
                </button>
              ))}
            </div>
            <Button className="w-full mt-4" disabled={!formData.service} onClick={() => setStep(2)}>
              Next Step
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-500 block uppercase">Project Schedule & Location</label>
                <input 
                  type="date" 
                  className="w-full p-4 rounded-xl border border-neutral-200 focus:outline-brand-yellow" 
                />
                <input 
                  type="text" 
                  className="w-full p-4 rounded-xl border border-neutral-200 focus:outline-brand-yellow" 
                  placeholder="Street Address in Abuja"
                />
                <textarea 
                  className="w-full p-4 rounded-xl border border-neutral-200 focus:outline-brand-yellow" 
                  placeholder="Material & Quantity Details"
                />
             </div>
             <Button className="w-full" onClick={() => alert('Booking Request Received! Our team will contact you in 15 mins.')}>
               Confirm Request
             </Button>
             <button className="w-full text-xs font-bold text-neutral-400 uppercase" onClick={() => setStep(1)}>
               Change Service
             </button>
          </div>
        )}
      </Card>
      <AppDownloadSection />
    </div>
  );
};

const ContactView = () => (
  <div className="space-y-8 pb-12">
    <div className="text-center space-y-2 py-4">
      <h2 className="text-3xl font-black uppercase">Contact Support</h2>
      <p className="text-neutral-500 px-8">Our Guzape team is ready to assist you directly.</p>
    </div>

    <div className="grid grid-cols-1 gap-4">
      <Card className="flex items-center gap-6 p-6 border-none shadow-md overflow-hidden relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-bl-full flex items-center justify-center">
           <MessageCircle className="text-green-500 translate-x-4 -translate-y-4" size={40} />
        </div>
        <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shrink-0">
          <MessageCircle size={28} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold">WhatsApp Chat</h3>
          <p className="text-xs text-neutral-500">Fastest for quote inquiries</p>
        </div>
        <Button className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shrink-0" onClick={() => window.open(`https://wa.me/${CONTACT_INFO.whatsapp}`, '_blank')}>
          <ArrowRight />
        </Button>
      </Card>

      <Card className="flex items-center gap-6 p-6 border-none shadow-md overflow-hidden relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-yellow/10 rounded-bl-full flex items-center justify-center">
           <Phone className="text-brand-yellow translate-x-4 -translate-y-4" size={40} />
        </div>
        <div className="w-14 h-14 bg-brand-yellow rounded-full flex items-center justify-center text-brand-black shrink-0">
          <Phone size={28} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold">Direct Call</h3>
          <p className="text-xs text-neutral-500 font-mono">{CONTACT_INFO.phones[0]}</p>
        </div>
        <Button className="bg-brand-black text-white p-3 rounded-full shrink-0" onClick={() => window.open(`tel:${CONTACT_INFO.phones[0].replace(/\s/g, '')}`)}>
          <ArrowRight />
        </Button>
      </Card>

      <Card className="flex items-center gap-6 p-6 border-none shadow-md overflow-hidden relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-neutral-100 rounded-bl-full flex items-center justify-center">
           <Mail className="text-neutral-400 translate-x-4 -translate-y-4" size={40} />
        </div>
        <div className="w-14 h-14 bg-brand-black rounded-full flex items-center justify-center text-white shrink-0">
          <Mail size={28} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold">Email Link</h3>
          <p className="text-xs text-neutral-500">{CONTACT_INFO.email}</p>
        </div>
        <Button className="border-2 border-brand-black p-3 rounded-full shrink-0" variant="ghost" onClick={() => window.open(`mailto:${CONTACT_INFO.email}`)}>
          <ArrowRight />
        </Button>
      </Card>
    </div>

    <Card className="text-center p-8 bg-brand-black text-white rounded-[40px] border-none">
       <MapPin className="text-brand-yellow w-12 h-12 mx-auto mb-4" />
       <h3 className="text-xl font-black uppercase mb-2">Visit Our Office</h3>
       <p className="text-neutral-400 text-sm mb-6 px-4">Guzape, Abuja Location. Our staff ensure quality service on every project.</p>
       <Button className="w-full py-4 text-xs">View on Google Maps</Button>
    </Card>
    <AppDownloadSection />
  </div>
);

const ProfileView = () => {
  const { user, login, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    // Listen to user profile
    const unsubProfile = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      setProfile(snap.data());
    });

    // Listen to orders
    const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
    const unsubOrders = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubProfile();
      unsubOrders();
    };
  }, [user]);

  const addAddress = async () => {
    if (!newAddress.trim() || !user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        addresses: arrayUnion(newAddress.trim())
      });
      setNewAddress('');
      setIsAddingAddress(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  const removeAddress = async (addr: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        addresses: arrayRemove(addr)
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  if (!user) {
    return (
      <div className="space-y-8 py-10 text-center">
        <div className="w-24 h-24 bg-brand-yellow/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <UserIcon size={40} className="text-brand-yellow" />
        </div>
        <h2 className="text-3xl font-black uppercase">My Account</h2>
        <p className="text-neutral-500 max-w-xs mx-auto">Sign in to track your orders, save addresses, and more.</p>
        <Button className="w-full max-w-xs mx-auto py-4" onClick={login}>
          {t('login_google')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32">
      {/* Header */}
      <section className="flex items-center gap-4 py-4">
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-brand-yellow flex items-center justify-center">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <UserIcon size={32} />
          )}
        </div>
        <div className="flex-1">
          <h2 className="font-black text-xl">{user.displayName}</h2>
          <p className="text-xs text-neutral-400 font-mono">{user.email}</p>
        </div>
        <button onClick={logout} className="p-3 bg-neutral-100 rounded-xl text-neutral-500">
          <LogOut size={20} />
        </button>
      </section>

      {/* Language Selection */}
      <section className="space-y-4">
        <h3 className="font-black text-sm uppercase tracking-wider px-1">Language / Yare</h3>
        <div className="grid grid-cols-2 gap-3">
           <button 
             onClick={() => setLanguage('en')}
             className={cn(
               "p-4 rounded-2xl flex items-center gap-3 border-2 transition-all",
               language === 'en' ? "border-brand-black bg-brand-black text-white" : "bg-white border-neutral-100"
             )}
           >
             <Globe size={18} />
             <span className="font-bold text-sm">English</span>
           </button>
           <button 
             onClick={() => setLanguage('ha')}
             className={cn(
               "p-4 rounded-2xl flex items-center gap-3 border-2 transition-all",
               language === 'ha' ? "border-brand-black bg-brand-black text-white" : "bg-white border-neutral-100"
             )}
           >
             <Globe size={18} />
             <span className="font-bold text-sm">Hausa</span>
           </button>
        </div>
      </section>

      {/* Addresses */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-black text-sm uppercase tracking-wider">Saved Addresses</h3>
          <button 
            onClick={() => setIsAddingAddress(!isAddingAddress)}
            className="text-brand-yellow p-1"
          >
            <Plus size={20} />
          </button>
        </div>
        
        {isAddingAddress && (
          <div className="flex gap-2">
            <input 
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Enter new address..."
              className="flex-1 p-3 rounded-xl border-2 border-brand-yellow/20 outline-none text-sm"
            />
            <Button className="py-2 px-4 shadow-none" onClick={addAddress}>Add</Button>
          </div>
        )}

        <div className="space-y-3">
          {profile?.addresses?.map((addr: string, i: number) => (
            <Card key={i} className="py-4 px-6 flex justify-between items-center border-none shadow-md">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-neutral-300" />
                <span className="text-sm font-medium">{addr}</span>
              </div>
              <button onClick={() => removeAddress(addr)} className="text-neutral-300 hover:text-red-500">
                <Trash2 size={16} />
              </button>
            </Card>
          ))}
          {(!profile?.addresses || profile.addresses.length === 0) && (
            <p className="text-xs text-neutral-400 text-center py-4 bg-neutral-100 rounded-2xl border-2 border-dashed border-neutral-200">
              No addresses saved yet.
            </p>
          )}
        </div>
      </section>

      {/* Order History */}
      <section className="space-y-4">
        <h3 className="font-black text-sm uppercase tracking-wider px-1">Order History</h3>
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-5 border-none shadow-md space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black uppercase text-neutral-400">Order ID</p>
                  <p className="text-xs font-mono font-bold">#{order.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase",
                  order.status === 'delivered' ? "bg-green-100 text-green-600" : "bg-brand-yellow/20 text-brand-black"
                )}>
                  {order.status}
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                 {order.items.map((item: any, i: number) => (
                    <div key={i} className="w-12 h-12 rounded-lg bg-neutral-100 shrink-0 overflow-hidden">
                       <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                 ))}
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-neutral-50 text-sm">
                <span className="text-neutral-400">Total Amount</span>
                <span className="font-black">{order.totalAmount}</span>
              </div>
            </Card>
          ))}
          {orders.length === 0 && (
            <div className="text-center py-10 space-y-4 grayscale opacity-30">
               <Package size={48} className="mx-auto" />
               <p className="text-xs font-black uppercase">No orders found</p>
            </div>
          )}
        </div>
      </section>

      <AppDownloadSection />
    </div>
  );
};

// --- New Views ---

const OnboardingView = ({ onFinish }: { onFinish: () => void }) => {
  const { t } = useLanguage();
  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col p-10 overflow-hidden">
      <div className="flex-1 flex flex-col justify-center items-center space-y-8 text-center">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-48 h-48 bg-brand-yellow rounded-[40px] flex items-center justify-center shadow-2xl rotate-3"
        >
          <HardHat size={80} className="text-brand-black" />
        </motion.div>
        
        <div className="space-y-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-black uppercase tracking-tighter text-brand-black"
          >
            Bakiyawa <br />
            <span className="text-brand-yellow stroke-black stroke-2">Hub</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-neutral-500 font-medium px-4"
          >
            {t('slogan')}
          </motion.p>
        </div>
      </div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <Button className="w-full py-5 text-lg" onClick={onFinish}>
          {t('get_started')} <ArrowRight className="ml-2" />
        </Button>
        <p className="text-center text-[10px] uppercase font-black tracking-widest text-neutral-300">
          Guzape • Abuja • Nigeria
        </p>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl" />
    </div>
  );
};

const ProductDetailsView = ({ product, onAddToCart, onBack }: { product: Product, onAddToCart: (p: Product) => void, onBack: () => void }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'reviews'),
      where('productId', '==', product.id)
    );
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setReviews(docs.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    });
    return () => unsub();
  }, [product.id]);

  const submitReview = async () => {
    if (!user) {
      alert('Please sign in to leave a review.');
      return;
    }
    if (!comment.trim()) return;

    setSubmitting(true);
    const reviewId = `REV-${Date.now()}`;
    try {
      await setDoc(doc(db, 'reviews', reviewId), {
        reviewId,
        productId: product.id,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        rating,
        comment: comment.trim(),
        createdAt: serverTimestamp()
      });
      setComment('');
      setRating(5);
      alert('Review submitted successfully!');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `reviews/${reviewId}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Check out ${product.name} on Bakiyawa Hub`,
      text: `Interested in ${product.name}? High quality materials delivered to your site.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  return (
    <div className="space-y-8 pb-32">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="p-4 bg-white rounded-2xl shadow-sm border border-neutral-100 flex items-center gap-2 font-bold text-sm">
          <X size={18} /> {t('back')}
        </button>
        <button onClick={handleShare} className="p-4 bg-white rounded-2xl shadow-sm border border-neutral-100 flex items-center gap-2 font-bold text-sm text-brand-yellow">
          <Share2 size={18} /> Share
        </button>
      </div>

      <div className="relative aspect-square rounded-[40px] overflow-hidden shadow-2xl">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute top-6 left-6 whitespace-nowrap bg-brand-yellow text-brand-black px-4 py-2 rounded-full font-black text-xs uppercase tracking-tighter">
          {product.category}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-start">
           <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">{product.name}</h1>
           <div className="text-right">
              <p className="text-2xl font-black text-brand-yellow drop-shadow-sm">{product.price}</p>
              <p className="text-[10px] font-bold text-neutral-400 uppercase">{product.unit}</p>
           </div>
        </div>

        <div className="space-y-2">
           <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">Description</h3>
           <p className="text-neutral-600 leading-relaxed">{product.description}</p>
        </div>

        <Card className="bg-neutral-100 border-none flex items-center justify-between p-4">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                 <Truck size={18} className="text-brand-black" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase text-neutral-400 leading-none">Shipping</p>
                 <p className="text-xs font-bold">Abuja Delivery Ready</p>
              </div>
           </div>
           <CheckCircle2 className="text-green-500" />
        </Card>

        <Button className="w-full py-5" onClick={() => onAddToCart(product)}>
           <ShoppingCart className="mr-2" /> {t('add_to_cart')}
        </Button>

        {/* Reviews Section */}
        <div className="pt-8 space-y-8">
           <div className="space-y-2">
              <h3 className="text-xl font-black uppercase tracking-tight">Customer Reviews</h3>
              <div className="flex items-center gap-2">
                 <div className="flex text-brand-yellow">
                    {[1, 2, 3, 4, 5].map((s) => (
                       <Star key={s} size={14} className={cn(s <= (reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)) ? "fill-current" : "")} />
                    ))}
                 </div>
                 <span className="text-xs font-bold text-neutral-400">({reviews.length} reviews)</span>
              </div>
           </div>

           {/* Review Form */}
           {user ? (
              <Card className="p-6 space-y-4 border-2 border-dashed border-brand-yellow/30 bg-brand-yellow/5">
                 <div className="flex justify-between items-center">
                    <p className="text-xs font-black uppercase tracking-wider">Leave a Review</p>
                    <div className="flex gap-1">
                       {[1, 2, 3, 4, 5].map((s) => (
                          <button key={s} onClick={() => setRating(s)} className="p-1">
                             <Star size={20} className={cn(s <= rating ? "fill-brand-yellow text-brand-yellow" : "text-neutral-300")} />
                          </button>
                       ))}
                    </div>
                 </div>
                 <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell others about this material..."
                    className="w-full p-4 rounded-2xl border-none shadow-inner bg-white text-sm focus:ring-2 ring-brand-yellow outline-none min-h-[100px]"
                 />
                 <Button 
                    className="w-full py-3 text-xs" 
                    onClick={submitReview}
                    disabled={submitting || !comment.trim()}
                 >
                    {submitting ? 'Posting...' : 'Post Review'}
                 </Button>
              </Card>
           ) : (
              <p className="text-xs text-neutral-400 text-center py-4 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                 Sign in to share your experience with this product.
              </p>
           )}

           {/* Reviews List */}
           <div className="space-y-4">
              {reviews.map((review) => (
                 <Card key={review.id} className="p-5 border-none shadow-sm space-y-3 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                       <div>
                          <p className="font-bold text-sm">{review.userName}</p>
                          <div className="flex text-brand-yellow mt-1">
                             {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} size={10} className={cn(s <= review.rating ? "fill-current" : "")} />
                             ))}
                          </div>
                       </div>
                       <p className="text-[9px] font-bold text-neutral-300 uppercase">
                          {review.createdAt ? new Date(review.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                       </p>
                    </div>
                    <p className="text-neutral-600 text-sm italic">"{review.comment}"</p>
                 </Card>
              ))}
              {reviews.length === 0 && (
                 <div className="text-center py-10 opacity-30 grayscale space-y-2">
                    <MessageCircle size={32} className="mx-auto" />
                    <p className="text-[10px] font-black uppercase">No reviews yet. Be the first!</p>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

const CartView = ({ 
  cartItems, 
  onUpdateQty, 
  onRemove, 
  onCheckout 
}: { 
  cartItems: { product: Product, quantity: number }[],
  onUpdateQty: (id: string, delta: number) => void,
  onRemove: (id: string) => void,
  onCheckout: () => void
}) => {
  const { t } = useLanguage();
  const totalAmount = cartItems.reduce((acc, item) => {
    const priceNum = parseInt(item.product.price.replace(/[^0-9]/g, ''));
    return acc + (priceNum * item.quantity);
  }, 0);

  return (
    <div className="space-y-8 pb-32">
      <div className="text-center py-6">
        <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">{t('cart')}</h2>
        <p className="text-neutral-400 text-sm mt-2">{cartItems.length} Items Selected</p>
      </div>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <Card key={item.product.id} className="p-4 flex gap-4 border-none shadow-md items-center">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-neutral-100 shrink-0">
               <img src={item.product.image} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
               <h3 className="font-bold text-sm truncate">{item.product.name}</h3>
               <p className="text-brand-yellow font-black text-sm">{item.product.price}</p>
               
               <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center bg-neutral-100 rounded-full p-1 h-8">
                     <button 
                       onClick={() => onUpdateQty(item.product.id, -1)}
                       className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-full transition-colors"
                     >
                        <Minus size={12} />
                     </button>
                     <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                     <button 
                       onClick={() => onUpdateQty(item.product.id, 1)}
                       className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-full transition-colors"
                     >
                        <Plus size={12} />
                     </button>
                  </div>
                  <button onClick={() => onRemove(item.product.id)} className="text-neutral-300 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
               </div>
            </div>
          </Card>
        ))}
        {cartItems.length === 0 && (
          <div className="text-center py-20 grayscale opacity-20">
             <ShoppingCart size={64} className="mx-auto" />
             <p className="mt-4 font-black uppercase text-sm">Your cart is empty</p>
          </div>
        )}
      </div>

      {cartItems.length > 0 && (
         <div className="fixed bottom-[110px] left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-brand-black text-white p-6 rounded-[32px] shadow-2xl z-40">
            <div className="flex justify-between items-center mb-6">
               <span className="text-neutral-400 font-bold uppercase text-xs tracking-widest">{t('total')}</span>
               <span className="text-2xl font-black text-brand-yellow">₦{totalAmount.toLocaleString()}</span>
            </div>
            <Button className="w-full py-4 text-xs font-black uppercase tracking-widest" onClick={onCheckout}>
               {t('checkout')}
            </Button>
         </div>
      )}
    </div>
  );
};

const CheckoutView = ({ total, onConfirm }: { total: number, onConfirm: (data: any) => void }) => {
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'transfer' | 'mobile'>('cod');
  const { t } = useLanguage();

  return (
    <div className="space-y-8 pb-32">
       <div className="text-center py-6">
        <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">{t('checkout')}</h2>
      </div>

      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 px-1">Order Type</h3>
        <div className="grid grid-cols-2 gap-3">
           <button 
             onClick={() => setDeliveryType('delivery')}
             className={cn(
               "p-5 rounded-[24px] flex flex-col items-center gap-2 border-2 transition-all",
               deliveryType === 'delivery' ? "border-brand-black bg-brand-black text-white" : "bg-white border-neutral-100"
             )}
           >
             <Truck />
             <span className="text-[10px] font-black uppercase">{t('delivery')}</span>
           </button>
           <button 
             onClick={() => setDeliveryType('pickup')}
             className={cn(
               "p-5 rounded-[24px] flex flex-col items-center gap-2 border-2 transition-all",
               deliveryType === 'pickup' ? "border-brand-black bg-brand-black text-white" : "bg-white border-neutral-100"
             )}
           >
             <MapPin />
             <span className="text-[10px] font-black uppercase">{t('pickup')}</span>
           </button>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 px-1">Payment Method</h3>
        <div className="space-y-3">
           {[
             { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
             { id: 'transfer', label: 'Bank Transfer', icon: ArrowRight },
             { id: 'mobile', label: 'Mobile Payment', icon: CreditCard }
           ].map((m) => {
             const Icon = m.icon;
             return (
               <button 
                 key={m.id}
                 onClick={() => setPaymentMethod(m.id as any)}
                 className={cn(
                    "w-full p-5 rounded-3xl flex items-center gap-4 border-2 transition-all",
                    paymentMethod === m.id ? "border-brand-yellow bg-brand-yellow/5" : "bg-white border-neutral-100"
                 )}
               >
                 <Icon size={20} className={paymentMethod === m.id ? "text-brand-yellow" : "text-neutral-400"} />
                 <span className="font-bold text-sm text-neutral-800">{m.label}</span>
                 {paymentMethod === m.id && <div className="ml-auto w-2 h-2 bg-brand-yellow rounded-full" />}
               </button>
             );
           })}
        </div>
      </section>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-neutral-400 px-1">Delivery Address / Notes</label>
        <textarea className="w-full p-4 rounded-3xl border-2 border-neutral-100 focus:border-brand-yellow outline-none h-32 text-sm" placeholder="Any specific instructions for our team?"></textarea>
      </div>

      <Button className="w-full py-5 shadow-xl" onClick={() => onConfirm({ deliveryType, paymentMethod })}>
         Confirm Order (₦{total.toLocaleString()})
      </Button>
    </div>
  );
};

// --- App Shell ---

const TrackingView = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  const { t } = useLanguage();

  const trackOrder = async () => {
    const cleanId = orderId.trim().toUpperCase();
    if (!cleanId) return;
    setSearching(true);
    try {
      const q = query(collection(db, 'orders'), where('orderId', '==', cleanId));
      const docSnap = await getDocs(q);
      if (!docSnap.empty) {
        setOrder({ id: docSnap.docs[0].id, ...docSnap.docs[0].data() });
      } else {
        alert('Order not found. Please check the ID.');
        setOrder(null);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'orders');
    } finally {
      setSearching(false);
    }
  };

  const statuses = ['pending', 'processing', 'in transit', 'delivered'];
  const currentStatusIndex = order ? statuses.indexOf(order.status?.toLowerCase()) : -1;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'processing': return <HardHat size={16} />;
      case 'in transit': return <Truck size={16} />;
      case 'delivered': return <CheckCircle2 size={16} />;
      default: return <Package size={16} />;
    }
  };

  return (
    <div className="space-y-8 py-10">
      <div className="text-center space-y-4 mb-8">
        <motion.div 
          animate={searching ? { rotate: 360 } : {}}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-24 h-24 bg-brand-yellow/10 rounded-full flex items-center justify-center mx-auto border-4 border-brand-yellow/20"
        >
          <Truck size={40} className="text-brand-yellow" />
        </motion.div>
        <h2 className="text-4xl font-black uppercase tracking-tighter">{t('track_order')}</h2>
        <p className="text-neutral-500 max-w-xs mx-auto">Enter your Order ID (e.g. BK-17123456) to see your real-time delivery status.</p>
      </div>

      <div className="space-y-4 max-w-sm mx-auto">
        <div className="relative group">
          <input 
            type="text" 
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="ORDER ID" 
            className="w-full p-6 rounded-3xl border-2 border-neutral-100 focus:border-brand-yellow outline-none text-center font-mono uppercase text-xl bg-white shadow-inner transition-all"
            onKeyDown={(e) => e.key === 'Enter' && trackOrder()}
          />
        </div>
        <Button className="w-full py-5 text-sm uppercase font-black tracking-widest shadow-lg" onClick={trackOrder} disabled={searching}>
          {searching ? 'Locating Order...' : 'Track Package'}
        </Button>
      </div>

      <AnimatePresence>
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mt-12 space-y-6"
          >
            {/* Status Progress Tracker */}
            <Card className="p-8 border-none shadow-xl bg-white rounded-[40px]">
              <div className="mb-10 flex justify-between items-center">
                <div>
                   <p className="text-[10px] font-black uppercase text-neutral-400">Shipment Status</p>
                   <h3 className="text-2xl font-black uppercase tracking-tighter text-brand-black">{order.status}</h3>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black uppercase text-neutral-400">Order Ref</p>
                   <p className="font-mono font-bold text-neutral-800">{order.orderId}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative pt-12 pb-8 px-4">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-neutral-100 -translate-y-1/2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
                    className="h-full bg-brand-yellow shadow-[0_0_15px_rgba(255,215,0,0.5)]"
                  />
                </div>
                
                <div className="relative flex justify-between">
                  {statuses.map((s, i) => {
                    const isCompleted = i <= currentStatusIndex;
                    const isCurrent = i === currentStatusIndex;
                    return (
                      <div key={s} className="flex flex-col items-center">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-500",
                          isCompleted ? "bg-brand-yellow text-brand-black scale-110" : "bg-neutral-100 text-neutral-300",
                          isCurrent && "ring-4 ring-brand-yellow/30 shadow-xl"
                        )}>
                          {getStatusIcon(s)}
                        </div>
                        <span className={cn(
                          "absolute top-[-30px] whitespace-nowrap text-[9px] font-black uppercase tracking-tighter transition-colors",
                          isCompleted ? "text-brand-black" : "text-neutral-300"
                        )}>
                          {s}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Info Grid */}
              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-neutral-50 mt-4">
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase text-neutral-400 leading-none">Total Value</p>
                   <p className="text-lg font-black text-brand-black">{order.totalAmount}</p>
                </div>
                <div className="space-y-1 text-right">
                   <p className="text-[10px] font-black uppercase text-neutral-400 leading-none">Shipping Via</p>
                   <p className="font-bold text-sm capitalize">{order.deliveryType}</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-neutral-50 rounded-2xl">
                 <p className="text-[10px] font-black uppercase text-neutral-400 mb-2">Package Items</p>
                 <div className="flex flex-wrap gap-2">
                    {order.items?.map((item: any, i: number) => (
                       <div key={i} className="flex items-center gap-2 bg-white p-2 pr-4 rounded-xl border border-neutral-100 shadow-sm">
                          <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                          <span className="text-[10px] font-bold truncate max-w-[100px]">{item.name}</span>
                       </div>
                    ))}
                 </div>
              </div>
            </Card>

            <div className="flex gap-4">
               <Button className="flex-1 bg-white border-2 border-brand-black text-brand-black py-4 shadow-none" onClick={() => window.open(`https://wa.me/2348030488968?text=I am contacting about order ${order.orderId}`, '_blank')}>
                  <MessageCircle className="mr-2" /> Support
               </Button>
               <Button className="flex-1 py-4" onClick={() => setOrder(null)}>
                  New Search
               </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const OrderSuccessView = ({ order, onTrack, onHome }: { order: any, onTrack: () => void, onHome: () => void }) => {
  const { t } = useLanguage();
  
  if (!order) return null;

  const isTransfer = order.paymentMethod === 'transfer';
  const isMobile = order.paymentMethod === 'mobile';

  return (
    <div className="space-y-8 py-10">
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-500/20"
        >
          <CheckCircle2 size={48} className="text-white" />
        </motion.div>
        <h2 className="text-4xl font-black uppercase tracking-tighter">Order Placed!</h2>
        <div className="flex flex-col items-center gap-2">
           <p className="text-neutral-500">Your order <span className="font-mono font-bold text-brand-black">#{order.orderId.slice(-6)}</span> has been recorded.</p>
           <button 
             onClick={() => {
               navigator.clipboard.writeText(order.orderId);
               alert('Order ID copied!');
             }}
             className="text-[10px] font-black uppercase tracking-widest text-brand-yellow bg-brand-black px-3 py-1 rounded-full"
           >
             Copy ID: {order.orderId}
           </button>
        </div>
      </div>

      <Card className="p-8 space-y-6 border-2 border-green-500/10">
         <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">Payment Instructions</h3>
            
            {isTransfer && (
              <div className="space-y-4">
                 <div className="bg-brand-yellow/10 p-5 rounded-2xl border-l-4 border-brand-yellow">
                    <p className="text-xs font-bold text-brand-black mb-2">BANK TRANSFER DETAILS</p>
                    <div className="space-y-1">
                       <p className="text-sm font-medium">Bank Name: <span className="font-bold">Opay Bank</span></p>
                       <p className="text-sm font-medium">Account Name: <span className="font-bold">Usman abdullahi</span></p>
                       <p className="text-lg font-black font-mono">08127426052</p>
                    </div>
                 </div>
                 <p className="text-xs text-neutral-500">Please send your payment receipt to <span className="font-bold">0803 048 8968</span> via WhatsApp to begin processing.</p>
              </div>
            )}

            {isMobile && (
              <div className="space-y-4">
                 <div className="bg-blue-500/10 p-5 rounded-2xl border-l-4 border-blue-500">
                    <p className="text-xs font-bold text-blue-800 mb-2">MOBILE PAYMENT</p>
                    <p className="text-sm text-blue-900">Please contact our billing agent via WhatsApp to receive a secure payment link.</p>
                 </div>
                 <Button className="w-full bg-green-500 text-white" onClick={() => window.open(`https://wa.me/2348030488968?text=Hello, I want to pay for order ${order.orderId}`, '_blank')}>
                    <MessageCircle className="mr-2" /> Pay via WhatsApp
                 </Button>
              </div>
            )}

            {!isTransfer && !isMobile && (
              <div className="bg-neutral-100 p-5 rounded-2xl">
                 <p className="text-xs font-bold text-neutral-600 mb-2">CASH ON DELIVERY</p>
                 <p className="text-sm">Please ensure you have <span className="font-bold">{order.totalAmount}</span> ready when our delivery team arrives at your location.</p>
              </div>
            )}
         </div>

         <div className="pt-4 border-t border-neutral-100 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">Order Summary</h3>
            <div className="space-y-3">
               {order.items?.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-xl object-cover border border-neutral-100" />
                        <div>
                           <p className="text-sm font-bold leading-none text-brand-black">{item.name}</p>
                           <p className="text-[10px] text-neutral-400 font-black uppercase mt-1">Quantity: {item.quantity}</p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="pt-4 border-t border-neutral-100 space-y-2">
            <div className="flex justify-between items-center text-sm">
               <span className="text-neutral-400 font-bold uppercase text-[10px]">Total Amount</span>
               <span className="text-xl font-black text-brand-black">{order.totalAmount}</span>
            </div>
         </div>
      </Card>

      <div className="space-y-3">
         <Button className="w-full py-4 text-xs font-black uppercase tracking-widest" onClick={onTrack}>
            <Clock className="mr-2" /> Live Tracking
         </Button>
         <button onClick={onHome} className="w-full text-xs font-black uppercase tracking-widest text-neutral-400 py-3">
            Back to Home
         </button>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState('home');
  const [cartItems, setCartItems] = useState<{ product: Product, quantity: number }[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [latestOrder, setLatestOrder] = useState<any>(null);
  
  const { user } = useAuth();
  const { t } = useLanguage();

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => {
    const priceNum = parseInt(item.product.price.replace(/[^0-9]/g, ''));
    return acc + (priceNum * item.quantity);
  }, 0);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateCartQty = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== id));
  };

  const placeOrder = async (orderData: any) => {
    if (!user) {
      alert('Sign in to place order');
      setView('profile');
      return;
    }

    const orderId = `BK-${Date.now()}`;
    const orderInfo = {
      orderId,
      userId: user.uid,
      items: cartItems.map(i => ({ name: i.product.name, quantity: i.quantity, image: i.product.image })),
      totalAmount: `₦${cartTotal.toLocaleString()}`,
      status: 'pending',
      deliveryType: orderData.deliveryType,
      paymentMethod: orderData.paymentMethod,
      createdAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, 'orders', orderId), orderInfo);
      setCartItems([]);
      setLatestOrder(orderInfo);
      setView('order-success');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `orders/${orderId}`);
    }
  };

  const navItems = [
    { id: 'home', label: t('home'), icon: Home },
    { id: 'catalog', label: t('store'), icon: Package },
    { id: 'tracking', label: t('track'), icon: Truck },
    { id: 'cart', label: t('cart'), icon: ShoppingCart },
    { id: 'profile', label: t('account'), icon: UserIcon },
  ];

  if (loading) {
    return (
      <div className="fixed inset-0 bg-brand-black flex flex-col items-center justify-center z-[100]">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [1, 1.1, 1], opacity: 1 }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-32 h-32 bg-brand-yellow rounded-full flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(255,215,0,0.3)]"
        >
          <HardHat size={64} className="text-brand-black" />
        </motion.div>
        <h1 className="text-white font-display text-2xl font-black uppercase tracking-tighter">
          Bakiyawa <span className="text-brand-yellow">Supplies Hub</span>
        </h1>
        <div className="w-48 h-1 bg-neutral-800 rounded-full mt-6 overflow-hidden">
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-full h-full bg-brand-yellow"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-neutral-50 min-h-screen flex flex-col relative overflow-hidden font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-neutral-50/80 backdrop-blur-md px-6 py-5 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer active:opacity-70 transition-opacity" 
          onClick={() => setView('home')}
        >
           <div className="w-10 h-10 bg-brand-black rounded-xl flex items-center justify-center shadow-lg shadow-black/10">
             <HardHat size={22} className="text-brand-yellow" />
           </div>
           <div className="flex flex-col">
             <span className="font-display font-black text-[10px] uppercase leading-none tracking-tighter">Bakiyawa</span>
             <span className="font-display font-black text-[12px] uppercase leading-none tracking-tighter text-brand-black">Supplies Hub</span>
           </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-neutral-400 hover:text-brand-black transition-colors">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-brand-yellow text-brand-black w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-neutral-50">
                {cartCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2.5 bg-brand-yellow rounded-xl text-brand-black shadow-md active:scale-90 transition-transform"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 pt-2 pb-32">
        <AnimatePresence mode="wait">
          {!hasOnboarded ? (
            <OnboardingView onFinish={() => setHasOnboarded(true)} />
          ) : (
            <motion.div
              key={view + (selectedProduct?.id || '')}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              {view === 'home' && <HomeView onNavigate={setView} />}
              {view === 'catalog' && (
                selectedProduct ? (
                  <ProductDetailsView 
                    product={selectedProduct} 
                    onAddToCart={addToCart} 
                    onBack={() => setSelectedProduct(null)} 
                  />
                ) : (
                  <CatalogView onAddToCart={addToCart} onSelectProduct={setSelectedProduct} />
                )
              )}
              {view === 'booking' && <BookingView />}
              {view === 'contact' && <ContactView />}
              {view === 'cart' && <CartView cartItems={cartItems} onUpdateQty={updateCartQty} onRemove={removeFromCart} onCheckout={() => setView('checkout')} />}
              {view === 'checkout' && <CheckoutView total={cartTotal} onConfirm={placeOrder} />}
              {view === 'order-success' && (
                <OrderSuccessView 
                  order={latestOrder} 
                  onTrack={() => setView('tracking')} 
                  onHome={() => setView('home')} 
                />
              )}
              {view === 'orders' && <ProfileView />}
              {view === 'tracking' && <TrackingView />}
              {view === 'about' && (
               <div className="space-y-6">
                 <div className="text-center py-6 space-y-2">
                    <h2 className="text-3xl font-black uppercase">Our History</h2>
                    <p className="text-neutral-500">Building the future of Abuja since day one.</p>
                 </div>
                 <Card className="p-0 overflow-hidden border-none shadow-xl">
                    <div className="h-56 relative">
                      <img 
                        src="https://images.unsplash.com/photo-1541888946425-d81bb1930060?auto=format&fit=crop&q=80&w=800" 
                        alt="Project" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                        <span className="text-brand-yellow font-black text-[10px] uppercase tracking-widest mb-1">Bakiyawa Hub</span>
                        <h3 className="text-white text-xl font-bold">Reliable Service. <br /> Best Prices.</h3>
                      </div>
                    </div>
                    <div className="p-8 space-y-6">
                      <p className="text-neutral-600 leading-relaxed text-sm">
                        Bakiyawa Supplies Hub is a premier building materials supplier based in Guzape, Abuja. We focus on strength, reliability, and speed in delivering essential construction materials.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-neutral-50 rounded-2xl">
                          <p className="text-xs text-neutral-400 uppercase font-black mb-1">Location</p>
                          <p className="font-bold text-sm">Guzape, Abuja</p>
                        </div>
                        <div className="p-4 bg-neutral-50 rounded-2xl">
                          <p className="text-xs text-neutral-400 uppercase font-black mb-1">Status</p>
                          <p className="font-bold text-sm">Certified</p>
                        </div>
                      </div>
                      <Button variant="secondary" className="w-full py-4 uppercase tracking-widest text-xs" onClick={() => setView('contact')}>Contact Directly</Button>
                    </div>
                  </Card>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[340px] bg-white/90 backdrop-blur-xl rounded-[32px] p-2 flex justify-between items-center shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-50 border border-white/50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
                setIsMenuOpen(false);
              }}
              className={cn(
                'flex items-center justify-center gap-2 px-4 py-3 rounded-[24px] transition-all duration-500 ease-out',
                isActive ? 'bg-brand-black text-brand-yellow flex-1 shadow-lg' : 'text-neutral-400 hover:text-neutral-500'
              )}
            >
              <Icon className={cn('w-6 h-6 transition-transform duration-500', isActive && 'scale-110 rotate-[10deg]')} />
              {isActive && (
                <motion.span 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  className="text-[10px] font-black uppercase tracking-widest overflow-hidden whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Side Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-black/95 flex flex-col justify-center items-center p-12"
          >
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-8 right-8 text-white p-2"
            >
              <X size={32} />
            </button>
            <nav className="flex flex-col gap-10 text-center">
              {[
                { id: 'home', label: 'Dashboard' },
                { id: 'catalog', label: 'Material Store' },
                { id: 'booking', label: 'Service Booking' },
                { id: 'profile', label: 'My Account' },
                { id: 'tracking', label: 'Order Tracking' },
                { id: 'about', label: 'About Company' },
                { id: 'contact', label: 'Contact Support' }
              ].map((item, idx) => (
                 <motion.button
                  key={item.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => {
                    setView(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={cn(
                    "text-3xl font-black uppercase tracking-tighter transition-colors",
                    view === item.id ? "text-brand-yellow" : "text-white/60 hover:text-white"
                  )}
                 >
                   {item.label}
                 </motion.button>
              ))}
            </nav>
            <div className="absolute bottom-12 text-center">
               <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold">Bakiyawa Supplies Hub</p>
               <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold opacity-50 mt-1">Guzape, Abuja</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
