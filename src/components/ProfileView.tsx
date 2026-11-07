import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Award, 
  Calendar, 
  ShoppingBag, 
  Globe, 
  ShieldCheck, 
  ChevronRight, 
  Lock, 
  KeyRound, 
  ExternalLink, 
  RefreshCw,
  Sparkles,
  Headphones,
  MapPin,
  CheckCircle2,
  Package
} from 'lucide-react';
import { UserProfile, Order, VIP_LEVELS } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface ProfileViewProps {
  tgUser: any;
  userProfile: UserProfile | null;
  userOrders: Order[];
  triggerHaptic: (style: 'light' | 'medium' | 'heavy') => void;
  showToast: (msg: string) => void;
  onRefreshOrders?: () => void;
}

export default function ProfileView({
  tgUser,
  userProfile,
  userOrders,
  triggerHaptic,
  showToast,
  onRefreshOrders
}: ProfileViewProps) {
  const { language, setLanguage, t } = useLanguage();
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // User Stats
  const firstName = tgUser?.first_name || userProfile?.pseudo || 'Membre VIP';
  const username = tgUser?.username ? `@${tgUser.username}` : '@client_vip';
  const telegramId = tgUser?.id ? String(tgUser.id) : (userProfile?.telegramId || '858781160');
  const dateJoined = userProfile?.dateJoined || '2026-07-28';
  const totalOrders = userProfile?.totalOrders || userOrders.filter((o) => o.status === 'completed').length;
  const points = userProfile?.points || 2500;
  const vipLevelName = userProfile?.level || 'Elite';

  const userInitial = (firstName || 'Y').charAt(0).toUpperCase();

  // Configured VIP levels
  const currentLevelConfig = VIP_LEVELS.find((l) => l.name === vipLevelName) || VIP_LEVELS[3] || VIP_LEVELS[0];

  const languages = [
    { code: 'FR', label: 'Français', flag: '🇫🇷' },
    { code: 'EN', label: 'English', flag: '🇬🇧' },
    { code: 'ES', label: 'Español', flag: '🇪🇸' },
    { code: 'DE', label: 'Deutsch', flag: '🇩🇪' },
  ] as const;

  const filteredOrders = userOrders.filter(o => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  return (
    <div className="space-y-4 pb-28 pt-1 px-3 sm:px-4 max-w-2xl mx-auto" id="profile-view">
      
      {/* 1. LUXURY MEMBER VIP CARD (PIRATE 69 STYLE) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border border-amber-500/35 shadow-[0_10px_35px_rgba(0,0,0,0.85)] relative overflow-hidden space-y-4">
        
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {/* Avatar Circle with Gold Ring */}
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 border border-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.5)] flex items-center justify-center text-black font-mono font-black text-xl uppercase">
                {userInitial}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5 border border-amber-400">
                <span className="text-xs">💎</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white truncate max-w-[160px]">
                  {firstName}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-mono text-[9px] font-black uppercase">
                  VIP {vipLevelName}
                </span>
              </div>
              <p className="text-xs font-mono text-amber-300">
                {username}
              </p>
              <p className="text-[10px] font-mono text-zinc-400">
                ID TELEGRAM : <span className="text-zinc-200 font-bold">{telegramId}</span>
              </p>
            </div>
          </div>
        </div>

        {/* STATS MATRIX */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-center font-mono">
          <div className="p-2.5 rounded-2xl bg-black/60 border border-white/5 space-y-0.5">
            <Calendar className="w-3.5 h-3.5 text-zinc-400 mx-auto" />
            <span className="text-[9px] text-zinc-400 uppercase block">MEMBRE DEPUIS</span>
            <span className="text-xs font-bold text-white">{dateJoined}</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-black/60 border border-white/5 space-y-0.5">
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400 mx-auto" />
            <span className="text-[9px] text-zinc-400 uppercase block">COMMANDES</span>
            <span className="text-xs font-extrabold text-white">{totalOrders} Livrée{totalOrders > 1 ? 's' : ''}</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-black/60 border border-white/5 space-y-0.5">
            <Award className="w-3.5 h-3.5 text-amber-300 mx-auto" />
            <span className="text-[9px] text-zinc-400 uppercase block">NIVEAU VIP</span>
            <span className="text-xs font-extrabold text-amber-300">{vipLevelName}</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-black/60 border border-white/5 space-y-0.5">
            <span className="text-xs">⚡</span>
            <span className="text-[9px] text-zinc-400 uppercase block">POINTS FIDÉLITÉ</span>
            <span className="text-xs font-extrabold text-amber-400">{points} PTS</span>
          </div>
        </div>
      </div>

      {/* 2. DIRECT SUPPORT ACTION BUTTON */}
      <a
        href="https://t.me/yoru47"
        target="_blank"

        rel="noreferrer"
        className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/60 via-zinc-900 to-black border border-sky-500/30 flex items-center justify-between group hover:border-sky-400 transition cursor-pointer shadow-md block"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-sans font-bold text-xs sm:text-sm text-white group-hover:text-sky-300 transition">
              Besoin d'aide ? Support VIP Direct
            </h4>
            <p className="text-[10px] font-mono text-zinc-400">
              Assistance Telegram 24/7 disponible en direct
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-sky-400 transition" />
      </a>

      {/* 3. ORDER HISTORY */}
      <div className="p-4 sm:p-5 rounded-3xl bg-zinc-950/80 border border-white/10 space-y-3 shadow-lg">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-400" />
            <h3 className="font-mono text-xs font-black uppercase text-white tracking-wider">
              Historique de mes commandes
            </h3>
          </div>

          {onRefreshOrders && (
            <button
              onClick={() => {
                triggerHaptic('light');
                onRefreshOrders();
                showToast('Historique actualisé');
              }}
              className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition"
              title="Actualiser"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 font-mono text-[10px]">
          <button
            onClick={() => setOrderFilter('all')}
            className={`px-3 py-1 rounded-full border transition cursor-pointer ${
              orderFilter === 'all'
                ? 'bg-amber-400 text-black border-amber-300 font-bold'
                : 'bg-zinc-900 text-zinc-400 border-white/5 hover:text-white'
            }`}
          >
            Toutes ({userOrders.length})
          </button>
          <button
            onClick={() => setOrderFilter('pending')}
            className={`px-3 py-1 rounded-full border transition cursor-pointer ${
              orderFilter === 'pending'
                ? 'bg-amber-400 text-black border-amber-300 font-bold'
                : 'bg-zinc-900 text-zinc-400 border-white/5 hover:text-white'
            }`}
          >
            En cours ({userOrders.filter(o => o.status === 'pending').length})
          </button>
          <button
            onClick={() => setOrderFilter('completed')}
            className={`px-3 py-1 rounded-full border transition cursor-pointer ${
              orderFilter === 'completed'
                ? 'bg-amber-400 text-black border-amber-300 font-bold'
                : 'bg-zinc-900 text-zinc-400 border-white/5 hover:text-white'
            }`}
          >
            Livrées ({userOrders.filter(o => o.status === 'completed').length})
          </button>
        </div>

        {/* Order Items */}
        {filteredOrders.length === 0 ? (
          <div className="py-8 text-center space-y-1 text-zinc-500 font-mono text-xs">
            <p>Aucune commande enregistrée pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrderDetails(order)}
                className="p-3 rounded-2xl bg-zinc-900/90 border border-white/5 hover:border-amber-500/30 flex items-center justify-between gap-2 transition cursor-pointer font-mono"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">#{order.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      order.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {order.status === 'completed' ? 'LIVRÉE' : 'EN COURS'}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 truncate">
                    {order.items.map(i => i.title).join(', ')}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-amber-300 block">
                    {order.totalAmount} €
                  </span>
                  <span className="text-[9px] text-zinc-500">
                    {new Date(order.date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. LANGUAGE SELECTOR */}
      <div className="p-4 rounded-3xl bg-zinc-950/80 border border-white/10 space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-wider text-amber-300">
          <Globe className="w-4 h-4 text-amber-400" />
          <span>CHOISIR LA LANGUE / LANGUAGE</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {languages.map((lang) => {
            const isActive = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  triggerHaptic('light');
                  setLanguage(lang.code);
                  showToast(`Langue configurée : ${lang.label}`);
                }}
                className={`py-2 px-3 rounded-2xl font-mono text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer border ${
                  isActive
                    ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                    : 'bg-zinc-900 text-zinc-400 border-white/5 hover:text-white'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
