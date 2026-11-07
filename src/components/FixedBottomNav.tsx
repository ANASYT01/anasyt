import { Home, Info, ShoppingBag, Star, Headphones, Send, User } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export type NavTabType = 'home' | 'catalog' | 'categories' | 'contact' | 'info' | 'reviews' | 'favorites' | 'profile' | 'support';

interface FixedBottomNavProps {
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  cartCount: number;
  onOpenCart: () => void;
  triggerHaptic: (style: 'light' | 'medium' | 'heavy') => void;
  userFirstName?: string;
}

export default function FixedBottomNav({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  triggerHaptic,
  userFirstName = 'VIP'
}: FixedBottomNavProps) {
  const { t } = useLanguage();

  const userInitial = (userFirstName || 'Y').charAt(0).toUpperCase();

  // 7 Tabs matching the exact reference structure of PIRATE 69:
  // Accueil | Infos | Panier (with badge) | Avis | Support | Contact | Profil
  const tabs = [
    { id: 'home' as const, label: 'Accueil', icon: Home, isCart: false, isProfile: false },
    { id: 'info' as const, label: 'Infos', icon: Info, isCart: false, isProfile: false },
    { id: 'cart' as const, label: 'Panier', icon: ShoppingBag, isCart: true, isProfile: false },
    { id: 'reviews' as const, label: 'Avis', icon: Star, isCart: false, isProfile: false },
    { id: 'support' as const, label: 'Support', icon: Headphones, isCart: false, isProfile: false },
    { id: 'contact' as const, label: 'Contact', icon: Send, isCart: false, isProfile: false },
    { id: 'profile' as const, label: 'Profil', icon: User, isCart: false, isProfile: true },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-2xl border-t border-amber-500/25 px-1 sm:px-3 py-1.5 select-none shadow-[0_-12px_30px_rgba(0,0,0,0.9)]"
      id="bottom-nav"
    >
      <div className="max-w-md sm:max-w-lg mx-auto flex items-center justify-between gap-0.5 relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.isCart ? false : (activeTab === tab.id || (tab.id === 'support' && activeTab === 'contact'));

          if (tab.isCart) {
            return (
              <button
                key="cart-tab"
                onClick={() => {
                  triggerHaptic('medium');
                  onOpenCart();
                }}
                className="flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-300 relative cursor-pointer group"
                title="Panier"
              >
                <div className="relative">
                  <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-zinc-400 group-hover:text-amber-400 transition" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-red-600 to-rose-500 text-white font-mono text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-black shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[8px] sm:text-[9px] font-mono tracking-tight mt-0.5 text-zinc-400 group-hover:text-zinc-200">
                  {tab.label}
                </span>
              </button>
            );
          }

          if (tab.isProfile) {
            return (
              <button
                key="profile-tab"
                onClick={() => {
                  triggerHaptic('light');
                  setActiveTab('profile');
                }}
                className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-300 relative cursor-pointer ${
                  isActive ? 'text-amber-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Profil"
              >
                {/* Circular Profile Avatar badge matching PIRATE 69 */}
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-mono font-black border transition-all ${
                  isActive 
                    ? 'bg-gradient-to-br from-amber-400 to-yellow-600 text-black border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.6)]' 
                    : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                }`}>
                  {userInitial}
                </div>
                <span className="text-[8px] sm:text-[9px] font-mono tracking-tight mt-0.5">
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => {
                triggerHaptic('light');
                if (tab.id === 'support') {
                  setActiveTab('contact');
                } else if (tab.id !== 'cart') {
                  setActiveTab(tab.id as NavTabType);
                }
              }}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-300 relative cursor-pointer ${
                isActive
                  ? 'text-amber-400 font-extrabold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {/* Active round highlight / icon halo matching reference */}
              <div className="relative flex items-center justify-center">
                <Icon className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-300 ${
                  isActive 
                    ? 'scale-110 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]' 
                    : ''
                }`} />
              </div>
              <span className={`text-[8px] sm:text-[9px] font-mono tracking-tight mt-0.5 ${
                isActive ? 'text-amber-300' : 'text-zinc-400'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
