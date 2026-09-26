import React, { useState } from 'react';
import { SiteSettings } from '../types';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

interface FloatingWhatsAppProps {
  settings: SiteSettings;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);

  const quickMessages = [
    'Halo, saya mau tanya harga grosir sabun pembersih untuk reseller.',
    'Halo, apakah deterjen laundry matic low foam ready kirim ke kota saya?',
    'Halo, saya mau konsultasi jasa Maklon Sabun (bikin brand sendiri).',
    'Halo, bisakah dikirimkan daftar harga lengkap sabun jerigen 5 liter?'
  ];

  const handleSendMessage = (msg: string) => {
    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Popover Bubble */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 animate-fade-in space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  CS CV YUSA KARYA INDONESIA
                </h4>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Online Siap Melayani
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            Silakan pilih pesan cepat berikut untuk langsung terhubung dengan tim sales & pabrik kami:
          </p>

          <div className="space-y-1.5">
            {quickMessages.map((text, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(text)}
                className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-800 dark:hover:text-emerald-200 text-[11px] font-medium text-slate-700 dark:text-slate-300 transition border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between group"
              >
                <span className="line-clamp-2">{text}</span>
                <Send className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 shrink-0 ml-1.5" />
              </button>
            ))}
          </div>

          <div className="pt-1 text-center">
            <span className="text-[10px] text-slate-400">
              Respon cepat Senin - Sabtu 08.00 - 17.00 WIB
            </span>
          </div>
        </div>
      )}

      {/* Main Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
        title="Chat WhatsApp CV YUSA KARYA INDONESIA"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
        </div>
        <span className="text-xs sm:text-sm hidden sm:inline-block">Chat WhatsApp Pabrik</span>
      </button>
    </div>
  );
};
