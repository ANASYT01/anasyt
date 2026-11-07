import { useMemo } from 'react';
import { motion } from 'motion/react';
import { MapPin, ChevronRight, ChevronLeft, Sparkles, Layers, ShieldCheck, ArrowRight } from 'lucide-react';
import { SupportedCity, SUPPORTED_CITIES, CityOption, VideoItem, isProductInCity } from '../types';

interface CitySelectorProps {
  selectedCity: SupportedCity | null;
  onSelectCity: (city: SupportedCity) => void;
  onClearCity: () => void;
  products: VideoItem[];
  triggerHaptic: (style: 'light' | 'medium' | 'heavy') => void;
}

export default function CitySelector({
  selectedCity,
  onSelectCity,
  onClearCity,
  products,
  triggerHaptic
}: CitySelectorProps) {
  // Compute count of products per city
  const cityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    SUPPORTED_CITIES.forEach((c) => {
      counts[c.id] = (products || []).filter((p) => isProductInCity(p, c.id)).length;
    });
    return counts;
  }, [products]);

  const activeCityObj = useMemo(() => {
    if (!selectedCity) return null;
    return SUPPORTED_CITIES.find((c) => c.id === selectedCity) || null;
  }, [selectedCity]);

  // If a city is already selected, render the dedicated top city navigation banner
  if (selectedCity && activeCityObj) {
    return (
      <div className="w-full bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border border-amber-500/30 rounded-2xl p-3.5 sm:p-4 shadow-xl select-none relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                triggerHaptic('light');
                onClearCity();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 transition cursor-pointer active:scale-95 group"
              title="Changer de ville"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
              <span className="font-bold tracking-wider uppercase text-[10px]">Cities</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xl leading-none">{activeCityObj.flag}</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="font-mono text-sm sm:text-base font-black tracking-widest text-white uppercase leading-none">
                    {activeCityObj.name}
                  </h2>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <p className="text-[10px] font-mono text-amber-400/80 uppercase tracking-wider font-semibold mt-0.5">
                  Your selection
                </p>
              </div>
            </div>
          </div>

          {/* Quick city switch button */}
          <button
            onClick={() => {
              triggerHaptic('medium');
              onClearCity();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-[10px] font-mono uppercase font-bold transition cursor-pointer"
          >
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>Switch City</span>
          </button>
        </div>
      </div>
    );
  }

  // City selection screen
  return (
    <div className="w-full space-y-4 select-none">
      {/* Section Header */}
      <div className="text-center space-y-1.5 pt-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest">
          <MapPin className="w-3 h-3 text-amber-400" />
          <span>SELECT YOUR CITY • DISPONIBILITÉS LOCALES</span>
        </div>
        <h2 className="font-mono text-lg sm:text-xl font-black tracking-wider text-white uppercase">
          Choisissez votre Ville
        </h2>
        <p className="text-xs text-zinc-400 font-mono max-w-md mx-auto">
          Sélectionnez votre zone géographique pour accéder au menu exclusif et aux stocks disponibles.
        </p>
      </div>

      {/* 5 City Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        {SUPPORTED_CITIES.map((city, index) => {
          const count = cityCounts[city.id] ?? 0;
          return (
            <motion.div
              key={city.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => {
                triggerHaptic('heavy');
                onSelectCity(city.id);
              }}
              className="group relative p-4 rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border border-white/10 hover:border-amber-400/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(245,158,11,0.15)] flex items-center justify-between overflow-hidden"
            >
              {/* Subtle hover golden aura */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="flex items-center gap-3.5 relative z-10">
                <div className="w-11 h-11 rounded-xl bg-black/60 border border-white/10 group-hover:border-amber-400/40 flex items-center justify-center text-2xl shadow-inner transition-colors">
                  {city.flag}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono text-base font-black tracking-wider text-white group-hover:text-amber-300 transition-colors uppercase">
                      {city.name}
                    </h3>
                  </div>
                  <p className="text-[11px] font-mono text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    {city.subtitle}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                      {count > 0 ? `${count} RÉF. DISPONIBLES` : 'SÉLECTION RÉSERVÉE'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex items-center gap-1 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all">
                <span className="hidden sm:inline text-[10px] font-mono font-bold uppercase tracking-wider">
                  Menu
                </span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
