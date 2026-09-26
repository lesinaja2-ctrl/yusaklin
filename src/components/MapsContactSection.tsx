import React, { useState } from 'react';
import { SiteSettings } from '../types';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Navigation,
  PhoneCall,
  Send,
  Building2,
  CheckCircle2
} from 'lucide-react';

interface MapsContactSectionProps {
  settings: SiteSettings;
}

export const MapsContactSection: React.FC<MapsContactSectionProps> = ({ settings }) => {
  const [quickMsg, setQuickMsg] = useState({
    name: '',
    phone: '',
    subject: 'Tanya Produk Sabun',
    message: ''
  });

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMsg.name || !quickMsg.message) return;

    const text = `Halo CV YUSA KARYA INDONESIA (YUSAKLIN):
- Nama: ${quickMsg.name}
- No Kontak: ${quickMsg.phone || '-'}
- Kebutuhan: ${quickMsg.subject}
- Pesan: ${quickMsg.message}

Mohon bantuannya untuk informasi lebih lanjut. Terima kasih!`;

    window.open(
      `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`,
      '_blank'
    );

    setQuickMsg({
      name: '',
      phone: '',
      subject: 'Tanya Produk Sabun',
      message: ''
    });
  };

  return (
    <section id="kontak" className="py-16 lg:py-24 bg-slate-50 dark:bg-slate-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-teal-600" />
            <span>Pabrik & Kantor Operasional</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Kunjungi Pabrik Kami di Batang
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300">
            Kami menyambut kunjungan mitra bisnis, calon distributor, dan pemilik usaha laundry/hotel untuk melihat sampel produk langsung di pabrik kami.
          </p>
        </div>

        {/* Content Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Cards & Quick Inquiry Form */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Contact Details Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-600" />
                <span>{settings.companyName}</span>
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3.5 text-slate-600 dark:text-slate-300">
                  <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 dark:text-white">Alamat Pabrik & Kantor:</strong>
                    <span>{settings.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-slate-600 dark:text-slate-300">
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 dark:text-white">WhatsApp & Telepon:</strong>
                    <span>{settings.phone} / +{settings.whatsappNumber}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-slate-600 dark:text-slate-300">
                  <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 dark:text-white">Email Resmi:</strong>
                    <span>{settings.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-slate-600 dark:text-slate-300">
                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 dark:text-white">Jam Operasional:</strong>
                    <span>{settings.operationalHours}</span>
                  </div>
                </div>
              </div>

              {/* Direct Maps Route Button */}
              <div className="pt-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${settings.address}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Buka Petunjuk Arah Google Maps</span>
                </a>
              </div>
            </div>

            {/* Quick Inquiry Form */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Kirim Pesan Langsung ke Pabrik
              </h4>

              <form onSubmit={handleSendInquiry} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Nama Anda *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap / Bisnis"
                    value={quickMsg.name}
                    onChange={(e) => setQuickMsg({ ...quickMsg, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Kebutuhan
                  </label>
                  <select
                    value={quickMsg.subject}
                    onChange={(e) => setQuickMsg({ ...quickMsg, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="Tanya Produk Sabun">Pemesanan Sabun Jerigen / Botol</option>
                    <option value="Kemitraan Reseller">Peluang Reseller / Keagenan</option>
                    <option value="Maklon Sabun (Private Label)">Jasa Maklon Sabun (Brand Sendiri)</option>
                    <option value="Pengadaan Hotel / Rumah Sakit">Pengadaan Rutin Hotel / RS</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Pesan / Pertanyaan *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Tuliskan pertanyaan atau kebutuhan Anda..."
                    value={quickMsg.message}
                    onChange={(e) => setQuickMsg({ ...quickMsg, message: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim via WhatsApp CS</span>
                </button>
              </form>
            </div>

          </div>

          {/* Right Column: Google Maps Embed Card */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl">
              {/* Header inside Map Card */}
              <div className="p-4 sm:p-5 bg-teal-900 text-white flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm sm:text-base">Peta Lokasi Pabrik YUSAKLIN</h4>
                  <p className="text-xs text-teal-200">Jalan Yos Sudarso No.260 Batang, Jawa Tengah</p>
                </div>
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-teal-800 text-teal-200 text-xs font-semibold">
                  Akses Jalur Pantura
                </span>
              </div>

              {/* Responsive Google Maps Iframe */}
              <div className="relative w-full h-[400px] sm:h-[480px] bg-slate-100 dark:bg-slate-900">
                <iframe
                  title="Lokasi CV YUSA KARYA INDONESIA di Batang"
                  src={settings.googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              {/* Footer inside Map Card */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Tersedia area parkir kendaraan bongkar muat & truk ekspedisi</span>
                </div>
                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=Halo%20CV%20YUSA%20KARYA%20INDONESIA,%20saya%20berencana%20berkunjung%20ke%20pabrik%20di%20Jl.%20Yos%20Sudarso%20No.260%20Batang`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-600 dark:text-teal-400 font-bold hover:underline"
                >
                  Jadwalkan Kunjungan Pabrik →
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
