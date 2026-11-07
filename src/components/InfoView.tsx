import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Truck, Lock, CreditCard, ChevronDown, Sparkles, HelpCircle, FileText, Award, PackageCheck, Send } from 'lucide-react';

interface InfoViewProps {
  triggerHaptic: (style: 'light' | 'medium' | 'heavy') => void;
  onNavigateTab: (tab: 'home' | 'catalog' | 'contact' | 'reviews' | 'profile') => void;
}

export default function InfoView({ triggerHaptic, onNavigateTab }: InfoViewProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    triggerHaptic('light');
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: 'Comment passer commande sur l\'application ?',
      a: 'Parcourez le menu de la réserve, sélectionnez vos produits avec le grammage souhaité (100G, 500G, 1KG) et ajoutez-les à votre panier. Vous pouvez ensuite choisir votre mode de livraison (Domicile, Point Relais ou Locker 24/7).'
    },
    {
      q: 'Comment est garantie la discrétion de l\'emballage ?',
      a: 'Toutes les expéditions bénéficient d\'un double scellage sous vide thermique étanche 100% anti-odeur, inséré dans un colis neutre cartonné sans aucune mention extérieure.'
    },
    {
      q: 'Quels sont les délais et modes d\'expédition ?',
      a: 'Les commandes sont traitées et remises au transporteur sous 24h. Le délai moyen est de 24h à 48h selon votre ville au Maroc (Casablanca, Rabat, Marrakech, Tanger, etc.). Un numéro de suivi vous est transmis.'
    },
    {
      q: 'Quels sont les moyens de règlement et comment s\'effectue le paiement ?',
      a: 'Les paiements ne sont pas traités directement sur la mini-application afin de garantir votre confidentialité 0-Log. Nous acceptons les Cryptomonnaies (USDT, BTC) ainsi que la Mise à disposition. Après validation du panier, vous êtes redirigé vers notre contact privé Telegram officiel pour finaliser le règlement en direct et en toute sécurité.'
    },
    {
      q: 'Quelle est la politique de conservation des données (0-Log) ?',
      a: 'Nous appliquons une politique stricte 0-Log. Aucune coordonnée personnelle ni adresse postale n\'est conservée sur des serveurs permanents une fois la commande honorée.'
    }
  ];

  return (
    <div className="space-y-4 pb-28 pt-1 px-3 sm:px-4 max-w-2xl mx-auto" id="info-view">
      
      {/* 1. HEADER BANNER */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black p-5 sm:p-6 text-center space-y-2 shadow-[0_10px_35px_rgba(0,0,0,0.85)]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono uppercase tracking-widest font-bold">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>CHARTE QUALITÉ & ENGAGEMENT</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black font-sans tracking-tight text-white uppercase">
          INFORMATIONS & <span className="text-amber-400">EXPÉDITION</span>
        </h1>

        <p className="text-xs text-zinc-400 font-mono max-w-md mx-auto leading-relaxed">
          Découvrez notre protocole d'expédition discrète 24/48h, notre charte de sélection et les réponses aux questions fréquentes.
        </p>
      </div>

      {/* 2. THREE PILLARS OF EXCELLENCE */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="p-4 rounded-2xl bg-zinc-950 border border-white/10 space-y-2 shadow-md">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Truck className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold uppercase text-white font-mono">
            Expédition 24/48H
          </h3>
          <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
            Colis expédiés avec numéro de suivi en temps réel et emballage neutre.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950 border border-white/10 space-y-2 shadow-md">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold uppercase text-white font-mono">
            Double Sous-Vide
          </h3>
          <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
            Scellage thermique hermétique garantissant 100% d'étanchéité sans odeur.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950 border border-white/10 space-y-2 shadow-md">
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold uppercase text-white font-mono">
            Protocole 0-Log
          </h3>
          <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
            Suppression automatique de vos coordonnées dès validation de la livraison.
          </p>
        </div>
      </div>

      {/* 3. FAQ ACCORDION */}
      <div className="p-4 sm:p-5 rounded-3xl bg-zinc-950 border border-white/10 space-y-3 shadow-lg">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <h2 className="font-mono text-xs font-black uppercase tracking-wider text-white">
            FOIRE AUX QUESTIONS (FAQ)
          </h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/5 bg-zinc-900/80 overflow-hidden transition"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-3.5 text-left flex items-center justify-between gap-3 font-sans font-bold text-xs sm:text-sm text-white hover:text-amber-300 transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-amber-400' : ''}`} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-3.5 pb-3.5 pt-0 text-xs text-zinc-300 font-sans leading-relaxed border-t border-white/5"
                    >
                      <div className="pt-2">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
