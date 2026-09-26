import React, { useState } from 'react';
import { Product, ProductVariant, SiteSettings } from '../types';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  Package,
  Layers,
  FlaskConical,
  Info,
  ChevronRight
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  settings: SiteSettings;
  onClose: () => void;
  onUpdateProduct?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  settings,
  onClose
}) => {
  if (!product) return null;

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedAroma, setSelectedAroma] = useState<string>(
    product.aromaVariants?.[0] || 'Original'
  );
  const [quantity, setQuantity] = useState(1);

  const selectedVariant: ProductVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const isWholesaleEligible =
    selectedVariant.wholesalePrice &&
    selectedVariant.minWholesaleQty &&
    quantity >= selectedVariant.minWholesaleQty;

  const unitPrice = isWholesaleEligible
    ? selectedVariant.wholesalePrice!
    : selectedVariant.price;

  const totalPrice = unitPrice * quantity;

  const handleOrderWhatsApp = () => {
    const text = `Halo CV YUSA KARYA INDONESIA, saya ingin memesan produk berikut:
- Nama Produk: ${product.name}
- Varian Kemasan: ${selectedVariant.size}
- Varian Aroma: ${selectedAroma}
- Jumlah Pesanan: ${quantity} pcs
- Estimasi Harga: Rp ${totalPrice.toLocaleString('id-ID')} ${isWholesaleEligible ? '(Harga Grosir Pabrik)' : ''}
- Izin Edar: ${product.pkdNumber}

Mohon informasi ketersediaan stok, pengiriman ke alamat saya, dan total pembayarannya. Terima kasih!`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl my-8 overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-300/40 dark:border-teal-700/40">
              {product.category.replace('-', ' ')}
            </span>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>{product.pkdNumber}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Image Column */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative rounded-2xl overflow-hidden aspect-square bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.stockStatus === 'ready' && (
                  <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow">
                    Stok Siap Kirim
                  </span>
                )}
              </div>

              {/* Chemical Specs pill card */}
              <div className="p-3 rounded-2xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/50 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-teal-800 dark:text-teal-300 font-semibold">
                  <FlaskConical className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Kandungan & Formula:</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  {product.activeIngredients || 'Formula biodegradable, ramah lingkungan dan aman pemakaian.'}
                </p>
                {product.pH && (
                  <div className="text-[11px] text-teal-700 dark:text-teal-400 font-medium">
                    Tingkat pH: <span className="font-bold">{product.pH}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info & Options Column */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {product.name}
                </h3>
                <p className="text-sm font-medium text-teal-600 dark:text-teal-400 mt-1">
                  {product.tagline}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Produksi resmi oleh {settings.companyName}
                </p>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.description}
              </p>

              {/* Features List */}
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Keunggulan Produk:
                </span>
                <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                  {(product.features || []).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Packaging Variants Selection */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Pilih Kemasan:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.variants.map((v, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedVariantIndex(i)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        selectedVariantIndex === i
                          ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 dark:border-teal-400 ring-2 ring-teal-600/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {v.size}
                      </div>
                      <div className="text-xs text-teal-600 dark:text-teal-400 font-semibold mt-0.5">
                        Rp {v.price.toLocaleString('id-ID')}
                      </div>
                      {v.wholesalePrice && (
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                          Grosir: Rp {v.wholesalePrice.toLocaleString('id-ID')}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aroma Variants Selection if available */}
              {product.aromaVariants && product.aromaVariants.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Pilihan Aroma:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.aromaVariants.map((aroma, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedAroma(aroma)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          selectedAroma === aroma
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {aroma}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Usage Instructions */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1 text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-teal-600" />
                  Petunjuk Pemakaian:
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {product.usageInstructions}
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Footer Order Calculator & WhatsApp Button */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quantity Selector & Total Price */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold"
              >
                -
              </button>
              <span className="px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white min-w-[32px] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold"
              >
                +
              </button>
            </div>

            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Total Perkiraan:</div>
              <div className="text-lg font-extrabold text-teal-700 dark:text-teal-300">
                Rp {totalPrice.toLocaleString('id-ID')}
              </div>
              {isWholesaleEligible && (
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  ✓ Termasuk Diskon Grosir Pabrik (Min {selectedVariant.minWholesaleQty} pcs)
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleOrderWhatsApp}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Pesan ke WhatsApp Pabrik</span>
          </button>
        </div>

      </div>
    </div>
  );
};
