import React from 'react';
import { 
  Home, 
  Info, 
  MapPin, 
  Heart, 
  MessageSquare, 
  User 
} from 'lucide-react';

export type BottomNavTab = 'home' | 'info' | 'map' | 'favorites' | 'contact' | 'profile';

interface BottomNavBarProps {
  activeTab: string;
  onNavigateTab: (tab: any) => void;
  favoritesCount?: number;
  triggerHaptic?: (type?: 'light' | 'medium' | 'heavy' | 'selection') => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onNavigateTab,
  favoritesCount = 0,
  triggerHaptic
}) => {
  const navItems = [
    {
      id: 'home',
      label: 'Accueil',
      icon: Home,
      targetTab: 'home',
      match: ['home', 'catalog', 'categories']
    },
    {
      id: 'info',
      label: 'Infos',
      icon: Info,
      targetTab: 'info',
      match: ['info']
    },
    {
      id: 'map',
      label: 'Carte',
      icon: MapPin,
      targetTab: 'map',
      match: ['map']
    },
    {
      id: 'favorites',
      label: 'Favoris',
      icon: Heart,
      targetTab: 'favorites',
      match: ['favorites'],
      badge: favoritesCount > 0 ? favoritesCount : null
    },
    {
      id: 'contact',
      label: 'Messages',
      icon: MessageSquare,
      targetTab: 'contact',
      match: ['contact']
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: User,
      targetTab: 'profile',
      match: ['profile']
    }
  ];

  const handleNavClick = (targetTab: string) => {
    if (triggerHaptic) {
      triggerHaptic('selection');
    }
    onNavigateTab(targetTab);
  };

  return (
    <nav 
      aria-label="Navigation principale"
      className="fixed bottom-0 inset-x-0 z-40 bg-[#090412]/92 backdrop-blur-2xl border-t border-purple-900/40 shadow-[0_-10px_35px_rgba(0,0,0,0.9)] pb-[max(env(safe-area-inset-bottom,0.75rem),0.75rem)] pt-2"
    >
      <div className="max-w-md mx-auto px-3">
        <div className="grid grid-cols-6 items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.match.includes(activeTab);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.targetTab)}
                className={`relative flex flex-col items-center justify-center py-1 transition-all duration-200 group active:scale-90 ${
                  isActive ? 'text-purple-300' : 'text-purple-400/50 hover:text-purple-300'
                }`}
              >
                {/* Active Indicator Top Glow */}
                {isActive && (
                  <span className="absolute -top-2 w-7 h-1 rounded-full bg-gradient-to-r from-purple-500 via-indigo-400 to-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)] animate-pulse" />
                )}

                {/* Icon Container with subtle background pill when active */}
                <div className={`relative p-1.5 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-purple-600/20 text-purple-200 shadow-[0_0_14px_rgba(147,51,234,0.35)] scale-105' 
                    : 'group-hover:bg-purple-950/30'
                }`}>
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                  
                  {/* Badge */}
                  {item.badge !== null && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-purple-600 text-white text-[9px] font-black flex items-center justify-center border border-[#090412] shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span className={`text-[10px] tracking-tight mt-0.5 font-bold transition-all duration-200 ${
                  isActive ? 'text-white' : 'text-purple-300/60'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
