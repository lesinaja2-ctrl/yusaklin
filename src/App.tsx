import React, { useState, useEffect } from 'react';
import {
  SiteSettings,
  Product,
  LegalDocument,
  ResellerApplicant,
  ClientTestimonial
} from './types';
import {
  getStoredSettings,
  saveStoredSettings,
  getStoredProducts,
  saveStoredProducts,
  getStoredLegalDocs,
  saveStoredLegalDocs,
  getStoredResellers,
  saveStoredResellers,
  getStoredTestimonials
} from './utils/storage';
import {
  fetchSettingsFromSupabase,
  fetchProductsFromSupabase,
  fetchLegalDocsFromSupabase,
  fetchResellersFromSupabase,
  saveSettingsToSupabase,
  saveProductToSupabase,
  deleteProductFromSupabase,
  saveLegalDocToSupabase,
  deleteLegalDocFromSupabase,
  bulkSyncProductsToSupabase,
  bulkSyncLegalDocsToSupabase,
  insertResellerToSupabase,
  getSupabaseConfig
} from './lib/supabase';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductCatalog } from './components/ProductCatalog';
import { LegalSection } from './components/LegalSection';
import { AboutSection } from './components/AboutSection';
import { ResellerSection } from './components/ResellerSection';
import { ClientsTestimonialsSection } from './components/ClientsTestimonialsSection';
import { MapsContactSection } from './components/MapsContactSection';
import { Footer } from './components/Footer';
import { AdminModal } from './components/AdminModal';
import { SearchModal } from './components/SearchModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  // Persistence States
  const [settings, setSettings] = useState<SiteSettings>(getStoredSettings);
  const [products, setProducts] = useState<Product[]>(getStoredProducts);
  const [legalDocs, setLegalDocs] = useState<LegalDocument[]>(getStoredLegalDocs);
  const [resellers, setResellers] = useState<ResellerApplicant[]>(getStoredResellers);
  const [testimonials] = useState<ClientTestimonial[]>(getStoredTestimonials);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('yusaklin_theme_mode');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // UI Interactive States
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [activeSection, setActiveSection] = useState('beranda');

  // Supabase Hydration Effect on mount
  useEffect(() => {
    const loadFromSupabase = async () => {
      const config = getSupabaseConfig();
      if (!config.isConfigured) return;

      try {
        const [remoteSettings, remoteProducts, remoteLegal, remoteResellers] = await Promise.all([
          fetchSettingsFromSupabase(),
          fetchProductsFromSupabase(),
          fetchLegalDocsFromSupabase(),
          fetchResellersFromSupabase()
        ]);

        if (remoteSettings) {
          setSettings(remoteSettings);
          saveStoredSettings(remoteSettings);
        }
        if (remoteProducts && remoteProducts.length > 0) {
          setProducts(remoteProducts);
          saveStoredProducts(remoteProducts);
        }
        if (remoteLegal && remoteLegal.length > 0) {
          setLegalDocs(remoteLegal);
          saveStoredLegalDocs(remoteLegal);
        }
        if (remoteResellers && remoteResellers.length > 0) {
          setResellers(remoteResellers);
          saveStoredResellers(remoteResellers);
        }
      } catch (e) {
        console.warn('Initial Supabase fetch fallback to offline cache:', e);
      }
    };

    loadFromSupabase();
  }, []);

  // Handle Dark Mode toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('yusaklin_theme_mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('yusaklin_theme_mode', 'light');
    }
  }, [isDarkMode]);

  // Handle Scroll Spy for active nav link
  useEffect(() => {
    const sections = ['beranda', 'produk', 'legalitas', 'tentang', 'reseller', 'klien', 'kontak'];
    const handleScroll = () => {
      const scrollY = window.scrollY + 200;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handlers for updating settings and data (Local + Supabase dual persistence)
  const handleSaveSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
    saveSettingsToSupabase(newSettings).catch(console.error);
  };

  const handleSaveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    saveStoredProducts(newProducts);
    bulkSyncProductsToSupabase(newProducts).catch(console.error);
  };

  const handleUpdateSingleProduct = (updatedProduct: Product) => {
    const updated = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
    setProducts(updated);
    saveStoredProducts(updated);
    saveProductToSupabase(updatedProduct).catch(console.error);
  };

  const handleSaveLegalDocs = (newDocs: LegalDocument[]) => {
    setLegalDocs(newDocs);
    saveStoredLegalDocs(newDocs);
    bulkSyncLegalDocsToSupabase(newDocs).catch(console.error);
  };

  const handleSaveResellers = (newResellers: ResellerApplicant[]) => {
    setResellers(newResellers);
    saveStoredResellers(newResellers);
  };

  const handleAddResellerApplicant = (applicant: ResellerApplicant) => {
    const updated = [applicant, ...resellers];
    setResellers(updated);
    saveStoredResellers(updated);
    insertResellerToSupabase(applicant).catch(console.error);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Offline Status Badge */}
      <OfflineIndicator />

      {/* Main Header / Navbar */}
      <Navbar
        settings={settings}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        activeSection={activeSection}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {/* Hero Section */}
        {settings.sectionsVisibility.hero && (
          <HeroSection
            settings={settings}
            onExploreCatalog={() => {
              const el = document.getElementById('produk');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenReseller={() => {
              const el = document.getElementById('reseller');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}

        {/* Product Catalog */}
        {settings.sectionsVisibility.catalog && (
          <ProductCatalog
            products={products}
            settings={settings}
          />
        )}

        {/* Legal & PKD Certification Gallery */}
        {settings.sectionsVisibility.legal && (
          <LegalSection
            documents={legalDocs}
            settings={settings}
          />
        )}

        {/* About Company & History */}
        {settings.sectionsVisibility.about && (
          <AboutSection
            settings={settings}
          />
        )}

        {/* Reseller Partnership & Profit Calculator */}
        {settings.sectionsVisibility.reseller && (
          <ResellerSection
            settings={settings}
            onAddApplicant={handleAddResellerApplicant}
          />
        )}

        {/* Client Portfolios & Testimonials */}
        {settings.sectionsVisibility.testimonials && (
          <ClientsTestimonialsSection
            testimonials={testimonials}
          />
        )}

        {/* Google Maps & Contact Batang */}
        {settings.sectionsVisibility.contact && (
          <MapsContactSection
            settings={settings}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Floating WhatsApp Quick Action Button */}
      <FloatingWhatsApp settings={settings} />

      {/* Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProductDetail(p)}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductDetail}
        settings={settings}
        onClose={() => setSelectedProductDetail(null)}
      />

      {/* Secret Admin Modal Dashboard (triggered by 3x taps on logo) */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        products={products}
        onSaveProducts={handleSaveProducts}
        legalDocs={legalDocs}
        onSaveLegalDocs={handleSaveLegalDocs}
        resellers={resellers}
        onSaveResellers={handleSaveResellers}
      />
    </div>
  );
}
