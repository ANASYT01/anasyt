import { useMemo } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Sparkles, Layers, ArrowRight, Snowflake, Award, Zap } from 'lucide-react';
import { SupportedCity, SUPPORTED_CITIES, VideoItem, isProductInCity } from '../types';

interface CityMenuProps {
  cityId: SupportedCity;
  onBackToCities: () => void;
  selectedCategory: string;
  onSelectCategory: (catQuery: string) => void;
  cityProducts: VideoItem[];
  triggerHaptic: (style: 'light' | 'medium' | 'heavy') => void;
}

interface MenuItem {
  id: string;
  label: string;
  query: string;
  icon: any;
  emoji: string;
  description: string;
}

export default function CityMenu({
  cityId,
  onBackToCities,
  selectedCategory,
  onSelectCategory,
  cityProducts,
  triggerHaptic
}: CityMenuProps) {
  const city = useMemo(() => {
    return SUPPORTED_CITIES.find((c) => c.id === cityId) || {
      id: cityId,
      name: cityId.toUpperCase(),
      flag: '📍',
      country: '',
      subtitle: 'Menu Privé'
    };
  }, [cityId]);

  // City-specific menu options as explicitly requested:
  // All Products, Fresh Frozen, WPPF, Static
  const menuItems: MenuItem[] = useMemo(() => {
    return [
      {
        id: 'all',
        label: 'All Products',
        query: 'Tous',
        icon: Sparkles,
        emoji: '✨',
        description: 'Tous les arrivages & extractions de la ville'
      },
      {
        id: 'frozen',
        label: 'Fresh Frozen',
        query: 'Frozen',
        icon: Snowflake,
        emoji: '🧊',
        description: 'Trichomes vivants & extractions basse température'
      },
      {
        id: 'wppf',
        label: 'WPPF',
        query: 'WPFF',
        icon: Award,
        emoji: '🧈',
        description: 'Whole Plant Fresh Frozen sans solvant'
      },
      {
        id: 'static',
        label: 'Static',
        query: 'Static',
        icon: Zap,
        emoji: '🧤',
        description: 'Purification par charge électrostatique'
      }
    ];
  }, []);

  // Compute counts for each category specifically in this city
  const counts = useMemo(() => {
    const map: Record<string, number> = {
      all: cityProducts.length,
      frozen: 0,
      wppf: 0,
      static: 0
    };

    cityProducts.forEach((p) => {
      const cat = (p.category || '').toLowerCase();
      if (cat.includes('frozen') || cat.includes('fresh')) {
        map.frozen++;
      }
      if (cat.includes('wppf') || cat.includes('wpff')) {
        map.wppf++;
      }
      if (cat.includes('static')) {
        map.static++;
      }
    });

    return map;
  }, [cityProducts]);

  return (
    <div className="w-full space-y-4 select-none" id="city-menu">
      {/* City Header with Navigation */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border border-amber-500/30 rounded-2xl p-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                triggerHaptic('light');
                onBackToCities();
              }}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 transition cursor-pointer active:scale-95 group"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
              <span className="font-bold tracking-wider uppercase text-[10px]">Cities</span>
            </button>

            <div className="flex items-center gap-2.5">
              <span className="text-2xl leading-none">{city.flag}</span>
              <div>
                <h1 className="font-mono text-base sm:text-lg font-black tracking-widest text-white uppercase leading-tight">
                  {city.name}
                </h1>
                <p className="text-[10px] font-mono text-amber-400/90 uppercase tracking-wider font-bold">
                  Your selection
                </p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
              Disponibilités
            </span>
            <span className="text-xs font-mono font-black text-amber-300">
              {cityProducts.length} RÉFÉRENCES
            </span>
          </div>
        </div>
      </div>

      {/* City Specific Menu List */}
      <div className="space-y-2">
        <div className="px-1 flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-semibold">
            {city.name.toUpperCase()} • MENU DÉDIÉ
          </span>
          <span className="text-[9px] font-mono text-amber-400/80 uppercase">
            SÉLECTION PAR NIVEAU
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const count = counts[item.id] ?? 0;
            const isSelected =
              (item.id === 'all' && (selectedCategory === 'Tous' || selectedCategory === 'All' || !selectedCategory)) ||
              (item.id === 'frozen' && (selectedCategory === 'Frozen' || selectedCategory.toLowerCase().includes('frozen'))) ||
              (item.id === 'wppf' && (selectedCategory === 'WPFF' || selectedCategory.toLowerCase().includes('wpff') || selectedCategory.toLowerCase().includes('wppf'))) ||
              (item.id === 'static' && (selectedCategory === 'Static' || selectedCategory.toLowerCase().includes('static')));

            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  triggerHaptic('medium');
                  onSelectCategory(item.query);
                }}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between relative overflow-hidden group ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500/20 via-zinc-900 to-black border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                    : 'bg-zinc-950/80 hover:bg-zinc-900/90 border-white/10 hover:border-amber-500/40 text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-3 relative z-10">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg border transition-colors ${
                      isSelected
                        ? 'bg-amber-400 text-black border-amber-300'
                        : 'bg-black/60 text-zinc-400 border-white/10 group-hover:border-amber-400/40'
                    }`}
                  >
                    <span>{item.emoji}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-black tracking-wider uppercase text-white">
                        {item.label}
                      </span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      )}
                    </div>
                    <p className="text-[10px] font-mono text-zinc-400 leading-tight">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 relative z-10 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      count > 0
                        ? isSelected
                          ? 'bg-amber-400/30 text-amber-300 border border-amber-400/50'
                          : 'bg-white/5 text-zinc-300 border border-white/10'
                        : 'bg-zinc-900 text-zinc-600 border border-zinc-800'
                    }`}
                  >
                    {count} Réf.
                  </span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${
                      isSelected ? 'text-amber-400' : 'text-zinc-500'
                    }`}
                  />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
