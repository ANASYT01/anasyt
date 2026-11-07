import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Instagram, Lock, ExternalLink, Copy, Check, ShieldCheck, Sparkles, Headphones, MessageSquare } from 'lucide-react';
import { BrandingSettings } from '../types';

interface ContactViewProps {
  branding: BrandingSettings | null;
  triggerHaptic: (style: 'light' | 'medium' | 'heavy') => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function ContactView({ branding, triggerHaptic, showToast }: ContactViewProps) {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const telegramChannel = branding?.telegramChannelUrl || 'https://t.me/yoru47';
  const telegramSupport = branding?.telegramSupportUrl || 'https://t.me/yoru47';
  const rawInstagram = (branding?.instagramUrl || '').trim();
  const isSuspiciousUrl = (url: string) => /north47|shelf|tricoma|pornhub|xvideos|sex|porn|onlyfans|adult/i.test(url);
  const instagram = isSuspiciousUrl(rawInstagram) ? '' : rawInstagram;

  const contacts = [
    {
      id: 'tg-support',
      title: 'Contact Unique Telegram (@yoru47)',
      subtitle: 'Liaison directe exclusive, conseils, commandes et assistance 24/7',
      handle: 'https://t.me/yoru47',
      displayHandle: '@yoru47',
      badge: 'OFFICIEL 🟢',
      badgeColor: 'bg-purple-500/20 border-purple-500/40 text-purple-300',
      icon: Send,
      color: 'from-purple-950/40 via-zinc-900 to-black border-purple-500/40 hover:border-purple-400',
      btnText: 'Ouvrir le Contact (@yoru47)',
      btnClass: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black',
    },

    {
      id: 'tg-channel',
      title: 'Canal Officiel Telegram',
      subtitle: 'Arrivages exclusifs, menus en direct et drops réservés',
      handle: telegramChannel,
      displayHandle: 'Canal Officiel VIP',
      badge: 'CANAL OFFICIEL',
      badgeColor: 'bg-zinc-700/30 border-zinc-600/30 text-zinc-300',
      icon: Send,
      color: 'from-zinc-900 via-zinc-900 to-black border-zinc-700/40 hover:border-zinc-500',
      btnText: 'Rejoindre le Canal',
      btnClass: 'bg-zinc-800 hover:bg-zinc-700 text-white font-bold',
    },
    ...(instagram ? [{
      id: 'instagram',
      title: 'Instagram Officiel',
      subtitle: 'Visuels haute définition, coulisses et présentations',
      handle: instagram,
      displayHandle: instagram.includes('instagram.com/') ? `@${instagram.split('instagram.com/')[1].replace(/\/.*$/, '')}` : '@reserveprivee',
      badge: 'COMMUNAUTÉ',
      badgeColor: 'bg-pink-500/10 border-pink-500/30 text-pink-400',
      icon: Instagram,
      color: 'from-pink-950/40 via-zinc-900 to-black border-pink-500/30 hover:border-pink-400',
      btnText: 'Consulter la page Instagram',
      btnClass: 'bg-zinc-800 hover:bg-zinc-700 text-white font-bold',
    }] : []),
  ];

  const handleOpenLink = (url: string) => {
    triggerHaptic('medium');
    if (!url) {
      showToast('Lien non disponible', 'info');
      return;
    }

    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.startsWith('@')) {
        finalUrl = `https://t.me/${url.replace('@', '')}`;
      } else {
        finalUrl = `https://${url}`;
      }
    }

    try {
      const tg = (window as any).Telegram?.WebApp;
      if (tg?.openTelegramLink && (finalUrl.includes('t.me') || finalUrl.includes('telegram.me'))) {
        tg.openTelegramLink(finalUrl);
        return;
      }
      if (tg?.openLink) {
        tg.openLink(finalUrl);
        return;
      }
      window.open(finalUrl, '_blank', 'noopener,noreferrer');
    } catch {
      window.open(finalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    triggerHaptic('light');
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    showToast('Lien copié dans le presse-papier !', 'success');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-4 pb-28 pt-1 px-3 sm:px-4 max-w-2xl mx-auto" id="contact-view">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black p-5 sm:p-6 text-center space-y-2 shadow-[0_10px_35px_rgba(0,0,0,0.85)]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono uppercase tracking-widest font-bold">
          <Headphones className="w-3.5 h-3.5 text-amber-400" />
          <span>LIAISON PRIVÉE 24/7</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black font-sans tracking-tight text-white uppercase">
          SUPPORT & <span className="text-amber-400">CONTACT</span>
        </h1>

        <p className="text-xs text-zinc-400 font-mono max-w-md mx-auto leading-relaxed">
          Une équipe dédiée pour vous assister en direct sur Telegram pour vos commandes, paiements et questions.
        </p>
      </div>

      {/* Cards List */}
      <div className="space-y-3">
        {contacts.map((c) => {
          const Icon = c.icon;
          const isCopied = copiedIndex === c.id;

          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-b ${c.color} border transition-all duration-300 shadow-lg space-y-3`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 text-amber-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-sans font-bold text-sm text-white">
                        {c.title}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase border ${c.badgeColor}`}>
                        {c.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
                      {c.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleOpenLink(c.handle)}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-mono text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-md ${c.btnClass}`}
                >
                  <span>{c.btnText}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={(e) => handleCopy(e, c.handle, c.id)}
                  className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white transition cursor-pointer"
                  title="Copier le lien"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Security Note */}
      <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 flex items-center gap-3 text-zinc-400 font-mono text-[10px]">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
        <p>
          Toutes les communications sont chiffrées de bout en bout selon notre politique de sécurité stricte.
        </p>
      </div>

    </div>
  );
}
