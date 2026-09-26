import React, { useState, useMemo } from 'react';
import { Product, ProductCategory, SiteSettings } from '../types';
import { ProductDetailModal } from './ProductDetailModal';
import {
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Eye,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  settings: SiteSettings;
  searchQuery?: string;
  onClearSearch?: () => void;
  onUpdateProduct?: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  settings,
  searchQuery: externalSearch = '',
  onClearSearch,
  onUpdateProduct
}) => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [internalSearch, setInternalSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Synchronize internal search with external search if passed
  const searchQuery = externalSearch || internalSearch;

  const categories: { id: ProductCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'Semua Produk', icon: '✨' },
    { id: 'rumah-tangga', label: 'Rumah Tangga', icon: '🏠' },
    { id: 'laundry', label: 'Laundry Kiloan', icon: '🧺' },
    { id: 'horeka', label: 'Hotel & Resto', icon: '🍽️' },
    { id: 'medis', label: 'Rumah Sakit / Medis', icon: '🏥' },
    { id: 'industri-otomotif', label: 'Otomotif & Industri', icon: '🚗' },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory =
        activeCategory === 'all' || p.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.pkdNumber.toLowerCase().includes(q) ||
        (p.aromaVariants || []).some((a) => a.toLowerCase().includes(q));

      return matchCategory && matchSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const handleQuickWhatsAppOrder = (product: Product, sizeName: string, price: number) => {
    const text = `Halo CV YUSA KARYA INDONESIA, saya tertarik memesan produk berikut:
- Produk: ${product.name}
- Kemasan: ${sizeName} (Rp ${price.toLocaleString('id-ID')})
- Izin Edar: ${product.pkdNumber}

Bisa minta informasi stok dan estimasi pengiriman ke alamat saya? Terima kasih.`;
    window.open(
      `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  };

  return (
    <section id="produk" className="py-16 lg:py-24 bg-slate-50/50 dark:bg-slate-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/80 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Katalog Resmi Pabrik</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Aneka Sabun Pembersih Higienis & Teruji
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300">
            Dibuat dari formula aktif pilihan berstandar industri dengan legalitas Kemenkes RI PKD lengkap. Tersedia kemasan curah jerigen 5L, drum 20L, hingga botol eceran.
          </p>
        </div>

        {/* Search and Category Filter Toolbar */}
        <div className="mt-10 space-y-4">
          {/* Search Box */}
          <div className="max-w-xl mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari sabun cuci piring, deterjen laundry, karbol lantai, PKD..."
              value={searchQuery}
              onChange={(e) => {
                setInternalSearch(e.target.value);
                if (onClearSearch && !e.target.value) onClearSearch();
              }}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setInternalSearch('');
                  if (onClearSearch) onClearSearch();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg bg-slate-100 dark:bg-slate-700"
              >
                Reset
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-teal-500/50 hover:bg-teal-50/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count & Current Filter */}
        <div className="mt-6 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span>Menampilkan <strong>{filteredProducts.length}</strong> produk kimia pembersih</span>
          {activeCategory !== 'all' && (
            <button
              onClick={() => setActiveCategory('all')}
              className="text-teal-600 dark:text-teal-400 font-semibold hover:underline"
            >
              Lihat Semua Kategori
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="mt-12 text-center py-16 px-4 bg-white dark:bg-slate-800/60 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600 mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              Tidak Ada Produk yang Cocok
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Coba gunakan kata kunci pencarian yang lain atau jelajahi kategori lainnya.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setInternalSearch('');
                if (onClearSearch) onClearSearch();
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition"
            >
              Tampilkan Semua Produk
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => {
              const primaryVariant = product.variants[0] || { size: 'Jerigen 5L', price: 0 };
              return (
                <div
                  key={product.id}
                  className="group rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Header with Badges */}
                    <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-900 overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* PKD Badge */}
                      <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-md border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Izin Resmi PKD</span>
                      </div>

                      {/* Stock Badge */}
                      <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2 py-0.5 rounded-lg text-[10px] font-bold shadow uppercase tracking-wider">
                        {product.stockStatus === 'ready' ? 'Ready Stok' : 'PO'}
                      </div>

                      {/* Aroma Pills on Image Footer */}
                      {product.aromaVariants && product.aromaVariants.length > 0 && (
                        <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1">
                          {product.aromaVariants.slice(0, 2).map((a, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-medium"
                            >
                              🌸 {a}
                            </span>
                          ))}
                          {product.aromaVariants.length > 2 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-medium">
                              +{product.aromaVariants.length - 2} aroma
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                          {product.category.replace('-', ' ')}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                          {product.tagline}
                        </p>
                      </div>

                      {/* Feature Highlights */}
                      <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                        {(product.features || []).slice(0, 2).map((feat, i) => (
                          <div key={i} className="flex items-center gap-1.5 line-clamp-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>

                      {/* Price & Packaging Overview */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-baseline justify-between">
                        <div className="text-base sm:text-lg font-black text-teal-700 dark:text-teal-300">
                          Rp {primaryVariant.price.toLocaleString('id-ID')}
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {primaryVariant.size}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(product)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50 transition active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5 text-teal-600" />
                      <span>Detail & Izin</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleQuickWhatsAppOrder(
                          product,
                          primaryVariant.size,
                          primaryVariant.price
                        )
                      }
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition active:scale-95"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Pesan WA</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Custom Order / Maklon Sabun Banner */}
        <div className="mt-14 rounded-3xl bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-teal-700/40">
          <div className="space-y-2 text-center md:text-left">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30">
              Layanan Maklon Sabun (Private Label)
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              Ingin Bikin Brand Sabun Sendiri atau Formula Khusus?
            </h3>
            <p className="text-sm text-teal-100/80 max-w-2xl">
              CV YUSA KARYA INDONESIA melayani jasa maklon kimia pembersih (OEM/ODM). Kami bantu riset formula, perizinan edar Kemenkes RI PKD, hingga kemasan siap jual ke pasar!
            </p>
          </div>

          <a
            href={`https://wa.me/${settings.whatsappNumber}?text=Halo%20CV%20YUSA%20KARYA%20INDONESIA,%20saya%20tertarik%20konsultasi%20jasa%20Maklon%20Sabun%20(Private%20Label)`}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg transition active:scale-95"
          >
            <PhoneCall className="w-4 h-4 text-slate-950" />
            <span>Konsultasi Maklon Sabun</span>
          </a>
        </div>

      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        settings={settings}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
};
