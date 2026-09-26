import React from 'react';
import { ClientTestimonial } from '../types';
import { Star, Quote, Building2, Sparkles, CheckCircle2 } from 'lucide-react';

interface ClientsTestimonialsSectionProps {
  testimonials: ClientTestimonial[];
}

export const ClientsTestimonialsSection: React.FC<ClientsTestimonialsSectionProps> = ({
  testimonials
}) => {
  return (
    <section id="klien" className="py-16 lg:py-24 bg-white dark:bg-slate-900/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Kepercayaan Konsumen</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Dipercaya 500+ Bisnis Laundry, Horeka & Medis
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300">
            Dengar langsung pengalaman para pengusaha, manajer operasional hotel, dan praktisi kesehatan yang mengandalkan kebersihan dari sabun produksi CV YUSA KARYA INDONESIA.
          </p>
        </div>

        {/* Client Categories Trust Strip */}
        <div className="mt-10 py-5 px-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-around gap-6 text-center">
          <div className="space-y-0.5">
            <div className="text-xl font-black text-teal-600 dark:text-teal-400">180+</div>
            <div className="text-xs font-bold text-slate-600 dark:text-slate-300">Usaha Laundry Kiloan</div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-slate-300 dark:bg-slate-700" />
          <div className="space-y-0.5">
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">85+</div>
            <div className="text-xs font-bold text-slate-600 dark:text-slate-300">Hotel & Penginapan</div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-slate-300 dark:bg-slate-700" />
          <div className="space-y-0.5">
            <div className="text-xl font-black text-cyan-600 dark:text-cyan-400">120+</div>
            <div className="text-xs font-bold text-slate-600 dark:text-slate-300">Restoran & Cafe</div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-slate-300 dark:bg-slate-700" />
          <div className="space-y-0.5">
            <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">45+</div>
            <div className="text-xs font-bold text-slate-600 dark:text-slate-300">Klinik & Faskes</div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="p-6 sm:p-7 rounded-3xl bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Rating & Sector */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                    {item.businessType}
                  </span>
                </div>

                {/* Quote */}
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              {/* Client Info & Product Tag */}
              <div className="pt-4 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatarUrl}
                    alt={item.clientName}
                    className="w-11 h-11 rounded-full object-cover border-2 border-teal-500/40"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.clientName}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.businessName} • {item.city}
                    </p>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Produk Dipakai:</div>
                  <div className="text-[11px] font-bold text-teal-700 dark:text-teal-300 line-clamp-1">
                    {item.productsUsed}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
