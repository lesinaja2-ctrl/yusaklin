import React from 'react';
import { SiteSettings } from '../types';
import {
  ShieldCheck,
  Award,
  Factory,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  PhoneCall,
  FileCheck,
  Building2,
  Truck
} from 'lucide-react';

interface HeroSectionProps {
  settings: SiteSettings;
  onExploreCatalog: () => void;
  onOpenReseller: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  onExploreCatalog,
  onOpenReseller
}) => {
  return (
    <section id="beranda" className="relative overflow-hidden pt-8 pb-16 lg:py-24">
      {/* Decorative Background Glows */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs sm:text-sm font-semibold shadow-sm">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Pabrik Sabun Resmi Batang — Berdiri Sejak 22 Mei 2017</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Solusi Sabun & Pembersih{' '}
              <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 dark:from-teal-300 dark:via-emerald-300 dark:to-cyan-300 bg-clip-text text-transparent">
                Berkualitas Pabrik
              </span>{' '}
              Berizin Edar Resmi
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              <strong>{settings.companyName}</strong> (Brand: <strong>{settings.brandName}</strong>) memproduksi aneka sabun pembersih higienis untuk kebutuhan 
              <span className="font-semibold text-teal-700 dark:text-teal-300"> Rumah Tangga, Laundry Kiloan, Hotel, Restoran, Rumah Sakit</span>, dan Industri. Bersertifikat Kemenkes RI PKD & Halal.
            </p>

            {/* Value Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Izin Edar Kemenkes PKD</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Sertifikasi Halal Resmi</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Harga Grosir Langsung Pabrik</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Melayani Maklon (Private Label)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Kemasan 5L, 20L & Botol</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Kirim Seluruh Indonesia</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-4">
              <a
                href="#produk"
                onClick={onExploreCatalog}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-lg shadow-teal-600/30 hover:shadow-teal-600/50 transition-all active:scale-95"
              >
                <span>Lihat Katalog Produk</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#reseller"
                onClick={onOpenReseller}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl border-2 border-teal-600 dark:border-teal-400 text-teal-700 dark:text-teal-300 font-bold text-sm hover:bg-teal-50 dark:hover:bg-teal-950/50 transition-all active:scale-95"
              >
                <Award className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Daftar Kemitraan / Reseller</span>
              </a>

              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=Halo%20CV%20YUSA%20KARYA%20INDONESIA,%20saya%20ingin%20tanya%20harga%20grosir%20sabun%20pembersih`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
                title="Chat Langsung ke WhatsApp"
              >
                <PhoneCall className="w-4 h-4" />
                <span>WhatsApp CS</span>
              </a>
            </div>

            {/* Location Banner */}
            <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center lg:justify-start gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Pabrik & Kantor:</span>
              <span>{settings.address}</span>
            </div>
          </div>

          {/* Right Visual Card Column */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative glow frame */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-teal-500 to-emerald-500 opacity-20 blur-xl"></div>
              
              {/* Main Card */}
              <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
                <div className="relative h-64 sm:h-72 overflow-hidden bg-teal-950">
                  <img
                    src={settings.heroImageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80'}
                    alt="Pabrik CV Yusa Karya Indonesia"
                    className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  
                  {/* Floating Badge Top Left */}
                  <div className="absolute top-4 left-4 bg-teal-900/90 backdrop-blur-md text-teal-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-teal-500/40 flex items-center gap-1.5 shadow-lg">
                    <Factory className="w-3.5 h-3.5 text-teal-400" />
                    <span>Pabrik Batang, Jawa Tengah</span>
                  </div>

                  {/* Floating Badge Bottom Left */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs uppercase tracking-wider text-teal-300 font-bold">PRODUSEN TANGAN PERTAMA</p>
                    <h3 className="text-xl font-bold">CV YUSA KARYA INDONESIA</h3>
                    <p className="text-xs text-slate-300 mt-0.5">Memproduksi sabun higienis berkualitas sejak 22 Mei 2017</p>
                  </div>
                </div>

                {/* Stat Grid below image */}
                <div className="p-5 grid grid-cols-3 gap-3 bg-slate-50/80 dark:bg-slate-800/40 text-center border-t border-slate-100 dark:border-slate-800">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                    <div className="text-xl sm:text-2xl font-black text-teal-600 dark:text-teal-400">9+ Thn</div>
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Pengalaman</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                    <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">100%</div>
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Resmi & PKD</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                    <div className="text-xl sm:text-2xl font-black text-cyan-600 dark:text-cyan-400">500+</div>
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Mitra Usaha</div>
                  </div>
                </div>

                {/* Trust Seal Footer */}
                <div className="px-5 py-3.5 bg-teal-50/50 dark:bg-teal-950/30 flex items-center justify-between text-xs text-teal-900 dark:text-teal-200 border-t border-teal-100/60 dark:border-teal-900/40">
                  <div className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Lulus Uji Laboratorium Terakreditasi KAN</span>
                  </div>
                  <a href="#legalitas" className="font-semibold text-teal-700 dark:text-teal-300 hover:underline">
                    Lihat Izin →
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
