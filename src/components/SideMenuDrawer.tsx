import { motion, AnimatePresence } from 'motion/react';
import { 
  Home,
  Layers, 
  ShoppingBag, 
  Crown, 
  User, 
  X, 
  ChevronRight,
  Sparkles,
  Star,
  Info,
  Headphones,
  Send,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { SupportedCity, SUPPORTED_CITIES } from '../types';

interface SideMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onNavigateTab: (tab: any) => void;
  onOpenCart: () => void;
  onOpenVip: () => void;
  cartCount: number;
  triggerHaptic: (style: 'light' | 'medium' | 'heavy') => void;
  logoUrl?: string;
  selectedCity?: SupportedCity | null;
  onClearCity?: () => void;
}

export default function SideMenuDrawer({
  isOpen,
  onClose,
  activeTab,
  onNavigateTab,
  onOpenCart,
  onOpenVip,
  cartCount,
  triggerHaptic,
  logoUrl,
  selectedCity,
  onClearCity
}: SideMenuDrawerProps) {
  const { t } = useLanguage();

  const currentCityInfo = SUPPORTED_CITIES.find((c) => c.id === selectedCity);

  const menuItems = [
    {
      id: 'home',
      label: 'Accueil & Villes',
      icon: Home,
      badge: null,
      action: () => {
        onNavigateTab('home');
        onClose();
      }
    },
    {
      id: 'map',
      label: 'Carte & Emplacements',
      icon: MapPin,
      badge: 'LIVE',
      action: () => {
        onNavigateTab('map');
        onClose();
      }
    },
    {
      id: 'categories',
      label: 'Collections & Catégories',
      icon: Layers,
      badge: '7',
      action: () => {
        onNavigateTab('categories');
        onClose();
      }
    },
    {
      id: 'cart',
      label: 'Mon Panier',
      icon: ShoppingBag,
      badge: cartCount > 0 ? String(cartCount) : null,
      action: () => {
        onOpenCart();
        onClose();
      }
    },
    {
      id: 'vip',
      label: 'Espace VIP & Récompenses',
      icon: Crown,
      badge: 'ELITE',
      action: () => {
        onOpenVip();
        onClose();
      }
    },
    {
      id: 'reviews',
      label: 'Avis Clients Vérifiés',
      icon: Star,
      badge: '5.0★',
      action: () => {
        onNavigateTab('reviews');
        onClose();
      }
    },
    {
      id: 'info',
      label: 'Infos, FAQ & Expédition',
      icon: Info,
      badge: null,
      action: () => {
        onNavigateTab('info');
        onClose();
      }
    },
    {
      id: 'contact',
      label: 'Support & Contact 24/7',
      icon: Headphones,
      badge: 'DIRECT',
      action: () => {
        onNavigateTab('contact');
        onClose();
      }
    },
    {
      id: 'profile',
      label: 'Mon Profil & Commandes',
      icon: User,
      badge: null,
      action: () => {
        onNavigateTab('profile');
        onClose();
      }
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex select-none pointer-events-auto">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Drawer Menu Container */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-[300px] max-w-[85vw] h-full bg-[#0D071B]/95 backdrop-blur-2xl border-r border-purple-800/40 shadow-[0_0_50px_rgba(0,0,0,0.95)] flex flex-col justify-between p-5 z-10 overflow-y-auto"
          >
            {/* Top Header inside Drawer */}
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-purple-900/40 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl border border-purple-500/40 bg-gradient-to-br from-purple-700/40 via-black to-indigo-700/40 flex items-center justify-center font-mono font-black text-purple-300 text-xs shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                    FG
                  </div>
                  <div>
                    <h3 className="font-sans text-sm font-black tracking-wider text-white uppercase flex items-center gap-1">
                      FRESH GENETICS 💎
                      <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                    </h3>
                    <span className="text-[8px] font-mono tracking-widest text-purple-300/80 uppercase font-bold block">
                      OFFICIAL DISPENSARY • MAROC
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    triggerHaptic('light');
                    onClose();
                  }}
                  className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition active:scale-90"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Active City Selection Card */}
              <div className="p-3 rounded-2xl bg-[#140C26]/80 border border-purple-700/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    <div>
                      <span className="text-[9px] font-mono uppercase text-purple-300/70 block">
                        Ville sélectionnée
                      </span>
                      <span className="text-xs font-mono font-black text-white">
                        {currentCityInfo ? `${currentCityInfo.flag} ${currentCityInfo.name}` : 'Toutes les villes (Maroc)'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      triggerHaptic('medium');
                      if (onClearCity) onClearCity();
                      onNavigateTab('map');
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-400/50 text-[10px] font-mono font-bold text-purple-200 transition cursor-pointer"
                  >
                    Carte
                  </button>
                </div>
              </div>

              {/* Menu Navigation List */}
              <nav className="space-y-1.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <motion.button
                      key={item.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        triggerHaptic('medium');
                        item.action();
                      }}
                      className={`w-full p-3 rounded-2xl border transition duration-200 flex items-center justify-between text-xs font-mono font-bold tracking-wider uppercase cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600/35 via-indigo-600/20 to-transparent border-purple-400 text-purple-200 shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                          : 'bg-[#120822]/70 hover:bg-[#1A0C30] border-purple-900/30 text-purple-200/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`p-1.5 rounded-xl border ${
                            isActive
                              ? 'bg-purple-600/30 border-purple-400 text-purple-200'
                              : 'bg-black/40 border-purple-900/30 text-purple-400/70'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[11px]">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {item.badge && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[8px] font-black font-mono ${
                              item.id === 'vip'
                                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm'
                                : 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight className="w-3.5 h-3.5 text-purple-400/50" />
                      </div>
                    </motion.button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Footer */}
            <div className="pt-6 border-t border-purple-900/40 text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-[9px] font-mono text-purple-300 font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>FRESH GENETICS 💎 — LIVE</span>
              </div>
              <p className="text-[8px] font-mono text-purple-400/60 uppercase tracking-widest">
                0-LOG SECURE TELEGRAM APP
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

