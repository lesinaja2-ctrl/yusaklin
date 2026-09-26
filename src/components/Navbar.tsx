import React, { useState, useEffect, useRef } from 'react';
import { SiteSettings } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Sun,
  Moon,
  Menu,
  X,
  ShieldCheck,
  Search,
  Sparkles,
  PhoneCall
} from 'lucide-react';

interface NavbarProps {
  settings: SiteSettings;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAdmin: () => void;
  onOpenSearch: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  isDarkMode,
  onToggleDarkMode,
  onOpenAdmin,
  onOpenSearch,
  activeSection
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Stealth Triple click handler on Logo (No text or hint shown to regular users)
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    if (newCount >= 3) {
      setClickCount(0);
      onOpenAdmin();
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        setClickCount(0);
      }, 1200);
    }
  };

  const navLinks = [
    { id: 'beranda', label: 'Beranda', href: '#beranda' },
    { id: 'produk', label: 'Katalog Produk', href: '#produk' },
    { id: 'legalitas', label: 'Legalitas & PKD', href: '#legalitas' },
    { id: 'tentang', label: 'Tentang Pabrik', href: '#tentang' },
    { id: 'reseller', label: 'Kemitraan & Maklon', href: '#reseller' },
    { id: 'klien', label: 'Portofolio', href: '#klien' },
    { id: 'kontak', label: 'Lokasi & Kontak', href: '#kontak' },
  ];

  return (
    <>
      {/* Top Bar Info (Desktop) */}
      <div className="hidden lg:block bg-teal-900 text-teal-100 text-xs py-1.5 px-6 border-b border-teal-800/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {settings.companyName} — Berdiri Sejak {settings.establishmentDate}
            </span>
            <span className="text-teal-300">|</span>
            <span>📍 {settings.address}</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Izin Edar Kemenkes RI PKD & Halal Resmi
            </span>
            <span className="text-teal-300">|</span>
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=Halo%20CV%20YUSA%20KARYA%20INDONESIA,%20saya%20ingin%20konsultasi%20sabun%20pembersih`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-emerald-300 hover:text-emerald-200 font-semibold"
            >
              <PhoneCall className="w-3 h-3" />
              CS WhatsApp: {settings.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md border-b border-slate-200 dark:border-slate-800'
            : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo with Triple-Tap Admin Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogoClick}
              title={settings.companyName}
              className="group flex items-center gap-3 text-left focus:outline-none rounded-xl p-1 -m-1 transition-transform active:scale-95"
            >
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 p-0.5 shadow-md shadow-teal-600/30 group-hover:shadow-teal-600/50 transition-all">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center overflow-hidden">
                  <img
                    src={settings.logoUrl || '/icon.svg'}
                    alt={settings.brandName}
                    className="w-9 h-9 object-contain group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/icon.svg';
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 dark:from-teal-300 dark:to-emerald-400 bg-clip-text text-transparent">
                    {settings.brandName}
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-300/40 dark:border-teal-700/50">
                    RESMI
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                  {settings.companyName}
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60'
                      : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Action Tools: Search, Dark Mode, PWA Install, Admin Quick Lock */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Button */}
            <button
              onClick={onOpenSearch}
              title="Cari Sabun & Pembersih"
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Cari Produk"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600 transition-transform -rotate-12 hover:rotate-0" />
              )}
            </button>

            {/* PWA Install Button */}
            <div className="hidden sm:block">
              <PWAInstallButton compact />
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-xl">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500">
              <span>Menu Navigasi</span>
              <PWAInstallButton compact />
            </div>
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-teal-950/60 hover:text-teal-700 dark:hover:text-teal-300 transition"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=Halo%20CV%20YUSA%20KARYA%20INDONESIA,%20saya%20tertarik%20dengan%20produk%20sabun%20pembersih`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 text-white font-semibold shadow-md active:scale-95 transition"
              >
                <PhoneCall className="w-4 h-4" />
                Hubungi WhatsApp Pabrik
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
