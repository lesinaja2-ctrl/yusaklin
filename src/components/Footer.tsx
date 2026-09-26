import React from 'react';
import { SiteSettings } from '../types';
import { ShieldCheck, Award } from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <img
                    src={settings.logoUrl || '/icon.svg'}
                    alt={settings.brandName}
                    className="w-7 h-7 object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/icon.svg';
                    }}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">
                  {settings.brandName}
                </h3>
                <p className="text-xs text-teal-400 font-semibold uppercase tracking-wider">
                  {settings.companyName}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Produsen aneka sabun pembersih berkualitas untuk kebutuhan Rumah Tangga, Laundry Kiloan, Hotel, Restoran, dan Fasilitas Medis. Bersertifikasi Izin Edar Kemenkes RI PKD & Halal.
            </p>

            <div className="text-xs text-slate-400 space-y-1">
              <p>📍 {settings.address}</p>
              <p>🗓️ Berdiri Resmi: {settings.establishmentDate}</p>
              <p>📞 CS: {settings.phone}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Navigasi</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#beranda" className="hover:text-teal-400 transition">Beranda</a>
              </li>
              <li>
                <a href="#produk" className="hover:text-teal-400 transition">Katalog Produk</a>
              </li>
              <li>
                <a href="#legalitas" className="hover:text-teal-400 transition">Legalitas & PKD</a>
              </li>
              <li>
                <a href="#tentang" className="hover:text-teal-400 transition">Profil Pabrik</a>
              </li>
              <li>
                <a href="#reseller" className="hover:text-teal-400 transition">Kemitraan Reseller</a>
              </li>
              <li>
                <a href="#kontak" className="hover:text-teal-400 transition">Lokasi & Kontak</a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Kategori Sabun</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>Cuci Piring Ekstra Jeruk</li>
              <li>Deterjen Liquid Laundry</li>
              <li>Karbol Pembersih Lantai</li>
              <li>Pewangi & Softener</li>
              <li>Hand Soap Antiseptik</li>
              <li>Disinfektan Medis Cair</li>
              <li>Karbol Sereh Alami</li>
            </ul>
          </div>

          {/* Socials & Compliance */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Standar Mutu</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Kemenkes RI PKD Terdaftar</span>
              </div>
              <div className="flex items-center gap-2 text-teal-400 font-semibold">
                <Award className="w-4 h-4 shrink-0" />
                <span>Sertifikasi Halal BPJPH & MUI</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Uji Daya Hambat Bakteri 99.9%</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2017 - 2026 <strong>{settings.companyName}</strong>. Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="flex items-center gap-2">
            <span>Dirancang dengan standar mutu & higienis terpercaya</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
