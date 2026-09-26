import React from 'react';
import { SiteSettings } from '../types';
import {
  Factory,
  History,
  Target,
  Sparkles,
  Users,
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin
} from 'lucide-react';

interface AboutSectionProps {
  settings: SiteSettings;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings }) => {
  return (
    <section id="tentang" className="py-16 lg:py-24 bg-white dark:bg-slate-900/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
            <History className="w-4 h-4 text-teal-600" />
            <span>Profil Perusahaan Produsen</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Dedikasi Kebersihan Higienis Sejak 2017
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300">
            Mengenal lebih dekat <strong>{settings.companyName}</strong>, produsen lokal kebanggaan Kabupaten Batang yang menghadirkan chemical pembersih bermutu tinggi dengan harga terjangkau.
          </p>
        </div>

        {/* Story Grid */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Image & Establishment Stamp */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-teal-950 shadow-2xl border border-slate-200 dark:border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80"
                alt="Fasilitas Produksi CV YUSA KARYA INDONESIA Batang"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              
              {/* Badge Berdiri Sejak */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex flex-col items-center justify-center font-bold text-center leading-none">
                    <span className="text-lg">22</span>
                    <span className="text-[10px] uppercase">Mei</span>
                  </div>
                  <div>
                    <div className="text-xs uppercase font-extrabold tracking-wider text-teal-700 dark:text-teal-400">
                      Resmi Didirikan
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      22 Mei 2017 di Batang
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Akta Notaris & Pengesahan Kemenkumham
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Factory Specs */}
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5 font-bold text-teal-700 dark:text-teal-300">
                  <Factory className="w-4 h-4" />
                  Kapasitas Pabrik
                </div>
                <div className="text-slate-600 dark:text-slate-300 mt-1">
                  Kapasitas mixing tonase harian siap suplai skala besar
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300">
                  <MapPin className="w-4 h-4" />
                  Lokasi Strategis
                </div>
                <div className="text-slate-600 dark:text-slate-300 mt-1">
                  Jalur Pantura Batang, mudah distribusi se-Jawa & Luar Pulau
                </div>
              </div>
            </div>
          </div>

          {/* Narrative Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              <p>
                <strong>CV YUSA KARYA INDONESIA</strong> berdiri secara resmi pada tanggal <strong>22 Mei 2017</strong> dengan domisili di <strong>Jalan Yos Sudarso No.260 Batang, Jawa Tengah</strong>. Berangkat dari komitmen kuat untuk menyediakan perlengkapan kimia pembersih berkualitas bagi masyarakat dan industri di daerah Pantura maupun nasional.
              </p>
              <p>
                Melalui merek dagang <strong>{settings.brandName}</strong>, kami memformulasi sabun cuci piring konsentrat, pembersih lantai karbol wangi, deterjen liquid laundry rendah busa, pelembut pakaian, hand soap antiseptik, hingga disinfektan medis dan degreaser industri.
              </p>
              <p>
                Kami percaya bahwa kebersihan yang prima tidak harus mahal. Dengan memotong rantai perantara dan memproduksi langsung dari pabrik sendiri di Batang, mitra bisnis kami mendapatkan margin keuntungan terbaik serta jaminan suplai yang konsisten.
              </p>
            </div>

            {/* Visi & Misi Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-900/50 space-y-1.5">
                <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 font-bold text-sm">
                  <Target className="w-4 h-4 text-teal-600" />
                  <span>Visi Perusahaan</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Menjadi produsen sabun pembersih terkemuka di Indonesia yang dipercaya karena kualitas higienis, legalitas sah, serta kemitraan yang saling menguntungkan.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/50 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Misi Perusahaan</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Menghadirkan formula ramah lingkungan yang lulus uji efikasi, memberdayakan tenaga kerja lokal, dan mendukung pertumbuhan UKM laundry serta Horeka.
                </p>
              </div>
            </div>

            {/* Pillar Bullets */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Prinsip Manufaktur Kami:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Formula Biodegradable Ramah Lingkungan</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Quality Control Setiap Batch Produksi</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Legalitas & MSDS Lengkap</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Garansi Kualitas & Penggantian Barang</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
