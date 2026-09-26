import React, { useState } from 'react';
import { SiteSettings, ResellerApplicant } from '../types';
import { syncToGoogleSheets } from '../utils/storage';
import {
  Award,
  TrendingUp,
  Percent,
  CheckCircle2,
  Send,
  Building2,
  Sparkles,
  PhoneCall,
  DollarSign,
  PackageCheck
} from 'lucide-react';

interface ResellerSectionProps {
  settings: SiteSettings;
  onAddApplicant: (applicant: ResellerApplicant) => void;
}

export const ResellerSection: React.FC<ResellerSectionProps> = ({
  settings,
  onAddApplicant
}) => {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    city: '',
    businessType: 'Reseller Kemitraan' as ResellerApplicant['businessType'],
    estimatedVolume: '50 - 100 Jerigen / Bulan',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Profit Calculator State
  const [calcQty, setCalcQty] = useState(100); // 100 jerigen per bulan
  const wholesaleCost = 35000; // rata-rata modal beli pabrik
  const sellingPrice = 45000; // harga jual eceran pasar
  const profitPerJerigen = sellingPrice - wholesaleCost;
  const monthlyProfit = profitPerJerigen * calcQty;
  const annualProfit = monthlyProfit * 12;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.whatsapp || !formData.city) return;

    setIsSubmitting(true);

    const newApplicant: ResellerApplicant = {
      id: `res-${Date.now()}`,
      name: formData.name,
      whatsapp: formData.whatsapp,
      city: formData.city,
      businessType: formData.businessType,
      estimatedVolume: formData.estimatedVolume,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      status: 'baru'
    };

    // Save to local storage state
    onAddApplicant(newApplicant);

    // Sync to Google Sheets if configured
    if (settings.googleSheetsUrl) {
      await syncToGoogleSheets(
        settings.googleSheetsUrl,
        'add_reseller',
        newApplicant
      );
    }

    // Open WhatsApp directly
    const waText = `Halo Admin Kemitraan CV YUSA KARYA INDONESIA, saya ingin mendaftar sebagai mitra usaha:
- Nama Lengkap: ${formData.name}
- WhatsApp: ${formData.whatsapp}
- Kota / Domisili: ${formData.city}
- Jenis Kemitraan: ${formData.businessType}
- Estimasi Kebutuhan/Bulan: ${formData.estimatedVolume}
- Catatan: ${formData.notes || '-'}

Mohon informasi katalog harga khusus distributor/reseller dan syarat kemitraannya. Terima kasih!`;

    window.open(
      `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(waText)}`,
      '_blank'
    );

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({
      name: '',
      whatsapp: '',
      city: '',
      businessType: 'Reseller Kemitraan',
      estimatedVolume: '50 - 100 Jerigen / Bulan',
      notes: ''
    });
  };

  return (
    <section id="reseller" className="py-16 lg:py-24 bg-slate-50 dark:bg-slate-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Peluang Usaha Menguntungkan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Kemitraan Reseller, Agen & Maklon Sabun
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300">
            Dapatkan harga langsung dari pabrik <strong>{settings.companyName}</strong>. Produk pembersih adalah kebutuhan pokok habis pakai yang selalu dibeli ulang setiap bulan oleh rumah tangga, hotel, restoran, dan jasa laundry!
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-600 font-bold">
              <Percent className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Margin Keuntungan Tinggi
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Margin keuntungan reseller 25% hingga 40% per jerigen dengan harga modal langsung dari pabrik Batang tanpa perantara distributor bertingkat.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 font-bold">
              <PackageCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Legalitas Kemenkes PKD & Halal
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Anda berbisnis dengan tenang dan percaya diri karena seluruh produk memiliki izin edar resmi, lulus uji lab, dan siap masuk toko modern maupun pengadaan resmi.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center text-cyan-600 font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Dukungan Promosi & Materi
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Disediakan foto produk berkualitas tinggi, banner promosi, brosur cetak, dan konsultasi teknis seputar formulasi maupun takaran pakai chemical.
            </p>
          </div>
        </div>

        {/* Profit Calculator & Registration Form Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive Profit Calculator */}
          <div className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-teal-900 via-teal-950 to-slate-950 text-white p-6 sm:p-8 shadow-xl border border-teal-800/60 space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider">
                <DollarSign className="w-4 h-4" />
                <span>Simulasi Keuntungan</span>
              </div>
              <h3 className="text-2xl font-black">
                Kalkulator Cuan Reseller
              </h3>
              <p className="text-xs text-teal-100/70">
                Geser slider untuk menghitung potensi keuntungan bersih Anda per bulan dengan menjual sabun jerigen 5 Liter:
              </p>
            </div>

            {/* Slider */}
            <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex justify-between items-center text-sm font-bold">
                <span>Target Penjualan:</span>
                <span className="text-emerald-400 text-base">{calcQty} Jerigen / Bulan</span>
              </div>
              <input
                type="range"
                min="20"
                max="1000"
                step="10"
                value={calcQty}
                onChange={(e) => setCalcQty(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-teal-200/60 font-semibold">
                <span>20 Jerigen</span>
                <span>500 Jerigen</span>
                <span>1.000 Jerigen</span>
              </div>
            </div>

            {/* Calculation Result Breakdown */}
            <div className="space-y-2.5 text-xs text-teal-100/80">
              <div className="flex justify-between py-1 border-b border-white/10">
                <span>Harga Beli Modal Pabrik (Jerigen 5L):</span>
                <span className="font-mono font-bold text-white">Rp {wholesaleCost.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span>Rekomendasi Harga Jual Pasar:</span>
                <span className="font-mono font-bold text-white">Rp {sellingPrice.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10 text-emerald-300 font-bold">
                <span>Margin Keuntungan / Jerigen:</span>
                <span className="font-mono">Rp {profitPerJerigen.toLocaleString('id-ID')} (28.5%)</span>
              </div>
            </div>

            {/* Highlight Total Profit Box */}
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-center space-y-1">
              <div className="text-xs text-emerald-200 font-semibold">Estimasi Keuntungan Bersih / Bulan:</div>
              <div className="text-3xl font-black text-emerald-400">
                Rp {monthlyProfit.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-teal-200/80">
                Setara dengan <strong>Rp {annualProfit.toLocaleString('id-ID')}</strong> per tahun!
              </div>
            </div>

            <div className="text-[11px] text-teal-200/60 leading-relaxed italic">
              * Perhitungan di atas berdasarkan estimasi rata-rata produk cuci piring & lantai. Belum termasuk omset dari deterjen laundry & kemasan botol lainnya.
            </div>
          </div>

          {/* Right: Registration Form */}
          <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-slate-800 p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Formulir Pendaftaran Kemitraan
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Isi data di bawah ini, tim manajemen CV YUSA KARYA INDONESIA akan segera menghubungi Anda dengan penawaran harga grosir khusus.
              </p>
            </div>

            {isSubmitted && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Pendaftaran Berhasil Dikirim!</strong> Formulir Anda telah tersimpan dan diarahkan ke WhatsApp tim pabrik. Admin kami akan segera merespons Anda.
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Nama Lengkap / Nama Usaha *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso / Berkah Laundry"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Nomor WhatsApp Aktif *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 081234567890"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Kota / Kabupaten Domisili *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Batang, Pekalongan, Semarang, Jakarta"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Jenis Kerjasama yang Diminati
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        businessType: e.target.value as ResellerApplicant['businessType']
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="Reseller Kemitraan">Reseller Kemitraan Toko / Warung</option>
                    <option value="Distributor Agen">Distributor / Keagenan Wilayah</option>
                    <option value="Suplai Laundry / Hotel">Suplai Rutin Laundry / Hotel / Resto</option>
                    <option value="Maklon Sabun (Private Label)">Maklon Sabun (Bikin Brand Sendiri)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Estimasi Kebutuhan / Volume per Bulan
                </label>
                <select
                  value={formData.estimatedVolume}
                  onChange={(e) => setFormData({ ...formData, estimatedVolume: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="10 - 30 Jerigen / Bulan">10 - 30 Jerigen / Bulan (Paket Pemula)</option>
                  <option value="50 - 100 Jerigen / Bulan">50 - 100 Jerigen / Bulan (Paket Agen Berkembang)</option>
                  <option value="100 - 500 Jerigen / Bulan">100 - 500 Jerigen / Bulan (Distributor Kota)</option>
                  <option value="Diatas 500 Jerigen / Drum Curah">Diatas 500 Jerigen / Drum Curah Tonase</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Catatan Tambahan / Pertanyaan Khusus
                </label>
                <textarea
                  rows={2}
                  placeholder="Ceritakan rencana penjualan Anda atau kebutuhan khusus chemical..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Pendaftaran & Buka WhatsApp Pabrik</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
