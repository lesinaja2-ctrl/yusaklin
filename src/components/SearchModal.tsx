import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { Search, X, ShieldCheck, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct
}) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.pkdNumber.toLowerCase().includes(q) ||
        (p.aromaVariants || []).some((a) => a.toLowerCase().includes(q))
    );
  }, [products, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-teal-600 shrink-0" />
          <input
            type="text"
            placeholder="Ketik nama sabun, pembersih lantai, deterjen, atau nomor PKD..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500"
            >
              Hapus
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 divide-y divide-slate-100 dark:divide-slate-800/60">
          {!query.trim() ? (
            <div className="py-8 text-center text-xs text-slate-400 space-y-2">
              <p>Pencarian instan sabun & chemical higienis CV YUSA KARYA INDONESIA</p>
              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                {['Cuci Piring', 'Deterjen Matic', 'Karbol Sereh', 'Hand Soap', 'Disinfektan'].map(
                  (s, i) => (
                    <button
                      key={i}
                      onClick={() => setQuery(s)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-teal-50 hover:text-teal-700 text-xs"
                    >
                      {s}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Tidak ditemukan produk untuk kata kunci "{query}".
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="p-3 rounded-2xl hover:bg-teal-50/60 dark:hover:bg-teal-950/40 flex items-center justify-between gap-4 cursor-pointer transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-teal-600 block">
                      {product.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {product.name}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{product.tagline}</p>
                  </div>
                </div>

                <div className="text-right shrink-0 flex items-center gap-3">
                  <div>
                    <div className="text-xs font-bold text-teal-700 dark:text-teal-300">
                      Rp {product.variants[0]?.price?.toLocaleString('id-ID')}
                    </div>
                    <div className="text-[10px] text-emerald-600 flex items-center gap-0.5 justify-end">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{product.pkdNumber}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
