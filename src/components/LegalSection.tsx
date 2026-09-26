import React, { useState } from 'react';
import { LegalDocument, SiteSettings } from '../types';
import {
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  ExternalLink,
  Eye,
  X,
  Sparkles,
  Lock,
  Building2,
  Scale
} from 'lucide-react';

interface LegalSectionProps {
  documents: LegalDocument[];
  settings: SiteSettings;
}

export const LegalSection: React.FC<LegalSectionProps> = ({ documents, settings }) => {
  const [activeDoc, setActiveDoc] = useState<LegalDocument | null>(null);

  return (
    <section id="legalitas" className="py-16 lg:py-24 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Transparansi & Kepastian Hukum</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Galeri Legalitas & Izin Edar Resmi
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300">
            Seluruh produk yang diproduksi oleh <strong>{settings.companyName}</strong> mematuhi regulasi perundang-undangan Republik Indonesia. Terdaftar di Kemenkumham, OSS NIB, serta memiliki Izin Edar Kemenkes RI PKD dan Sertifikasi Halal.
          </p>
        </div>

        {/* Legal Trust Stats Cards */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-600 mx-auto mb-2">
              <Scale className="w-5 h-5" />
            </div>
            <div className="text-xs uppercase font-bold text-slate-400">Legalitas Usaha</div>
            <div className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">AHU Kemenkumham</div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 mx-auto mb-2">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-xs uppercase font-bold text-slate-400">Izin Edar PKRT</div>
            <div className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">Kemenkes RI PKD</div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center text-cyan-600 mx-auto mb-2">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-xs uppercase font-bold text-slate-400">Sertifikasi Halal</div>
            <div className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">BPJPH & MUI</div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 mx-auto mb-2">
              <FileCheck className="w-5 h-5" />
            </div>
            <div className="text-xs uppercase font-bold text-slate-400">Efikasi & Standar</div>
            <div className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">Uji Lab KAN 99.9%</div>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Certificate Preview Top */}
                <div
                  onClick={() => setActiveDoc(doc)}
                  className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-900 cursor-pointer overflow-hidden group"
                >
                  <img
                    src={doc.fileUrl}
                    alt={doc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/10 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-xl bg-black/75 text-white text-xs font-semibold flex items-center gap-1.5 backdrop-blur-sm">
                      <Eye className="w-3.5 h-3.5" />
                      Perbesar Dokumen
                    </span>
                  </div>
                  <span className="absolute top-3 left-3 bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow uppercase">
                    {doc.category}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Terverifikasi Resmi</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                    {doc.title}
                  </h3>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 break-all">
                    No: {doc.documentNumber}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {doc.description}
                  </p>

                  <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                    <span>Penerbit: {doc.issuer}</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {doc.validUntil}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-5 pt-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveDoc(doc)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/80 text-teal-800 dark:text-teal-200 text-xs font-bold transition active:scale-95"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Fisik Dokumen</span>
                </button>

                {doc.verificationUrl && (
                  <a
                    href={doc.verificationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    title="Cek Database Resmi Pemerintah"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Institutional Guarantee Note */}
        <div className="mt-12 p-6 rounded-3xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              Butuh Berkas Legalitas Lengkap untuk Tender / Pengadaan Rumah Sakit & Hotel?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Tim legal CV YUSA KARYA INDONESIA siap menyediakan company profile bermaterai, NPWP perusahaan, SPPKP, dan MSDS (Material Safety Data Sheet).
            </p>
          </div>
          <a
            href={`https://wa.me/${settings.whatsappNumber}?text=Halo%20CV%20YUSA%20KARYA%20INDONESIA,%20kami%20membutuhkan%20berkas%20legalitas%20lengkap%20dan%20MSDS%20untuk%20pengadaan%20perusahaan`}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition active:scale-95"
          >
            Minta Berkas Pengadaan
          </a>
        </div>

      </div>

      {/* Document Zoom / Preview Modal */}
      {activeDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 text-xs font-bold">
                  {activeDoc.category}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base line-clamp-1">
                  {activeDoc.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveDoc(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 flex items-center justify-center max-h-[65vh] overflow-hidden">
              <img
                src={activeDoc.fileUrl}
                alt={activeDoc.title}
                className="max-h-[60vh] w-auto object-contain rounded-lg shadow-lg"
              />
            </div>

            <div className="p-5 space-y-2 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  Nomor: {activeDoc.documentNumber}
                </div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Status: Terdaftar & Aktif
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeDoc.description}
              </p>
              <div className="pt-2 text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Diterbitkan oleh: {activeDoc.issuer}</span>
                <span>Berlaku hingga: {activeDoc.validUntil}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
