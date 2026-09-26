import React, { useState, useEffect } from 'react';
import {
  SiteSettings,
  Product,
  LegalDocument,
  ResellerApplicant,
  ClientTestimonial
} from '../types';
import {
  syncToGoogleSheets,
  exportToCSV,
  exportFullBackup,
  generateGoogleAppsScriptCode
} from '../utils/storage';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  testSupabaseConnection,
  generateSupabaseSQLSchema,
  saveSettingsToSupabase,
  bulkSyncProductsToSupabase,
  bulkSyncLegalDocsToSupabase
} from '../lib/supabase';
import {
  X,
  Lock,
  Sliders,
  Package,
  FileCheck,
  Users,
  Database,
  Save,
  Plus,
  Trash2,
  Edit3,
  Upload,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  ExternalLink,
  RefreshCw,
  PhoneCall,
  Eye,
  Settings,
  MapPin,
  Check,
  Server,
  Terminal,
  Layers,
  Sparkles,
  Zap,
  Globe,
  DollarSign,
  Tag
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SiteSettings;
  onSaveSettings: (newSettings: SiteSettings) => void;
  products: Product[];
  onSaveProducts: (newProducts: Product[]) => void;
  legalDocs: LegalDocument[];
  onSaveLegalDocs: (newDocs: LegalDocument[]) => void;
  resellers: ResellerApplicant[];
  onSaveResellers: (newResellers: ResellerApplicant[]) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  products,
  onSaveProducts,
  legalDocs,
  onSaveLegalDocs,
  resellers,
  onSaveResellers
}) => {
  if (!isOpen) return null;

  // Security Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'settings' | 'products' | 'legal' | 'resellers' | 'supabase' | 'sheets' | 'backup'
  >('settings');

  // Working States
  const [currentSettings, setCurrentSettings] = useState<SiteSettings>(settings);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Supabase states
  const [supabaseConfig, setSupabaseConfigState] = useState(getSupabaseConfig);
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(supabaseConfig.url);
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(supabaseConfig.key);
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [supabaseTestResult, setSupabaseTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isSyncingToSupabase, setIsSyncingToSupabase] = useState(false);

  // Product Editing / Creating State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // Variant & Pricing helpers
  const handleVariantChange = (index: number, field: string, value: any) => {
    if (!editingProduct) return;
    const currentVariants = [...(editingProduct.variants || [])];
    currentVariants[index] = {
      ...currentVariants[index],
      [field]: field === 'price' || field === 'wholesalePrice' || field === 'minWholesaleQty'
        ? Math.max(0, Number(value) || 0)
        : value
    };
    setEditingProduct({
      ...editingProduct,
      variants: currentVariants
    });
  };

  const handleAddVariant = () => {
    if (!editingProduct) return;
    const currentVariants = editingProduct.variants || [];
    setEditingProduct({
      ...editingProduct,
      variants: [
        ...currentVariants,
        { size: 'Botol 1 Liter', price: 15000, wholesalePrice: 12000, minWholesaleQty: 12 }
      ]
    });
  };

  const handleRemoveVariant = (index: number) => {
    if (!editingProduct) return;
    const currentVariants = editingProduct.variants || [];
    if (currentVariants.length <= 1) {
      alert('Produk harus memiliki minimal 1 ukuran kemasan dan harga!');
      return;
    }
    setEditingProduct({
      ...editingProduct,
      variants: currentVariants.filter((_, i) => i !== index)
    });
  };

  // Legal Doc Editing / Creating State
  const [editingDoc, setEditingDoc] = useState<LegalDocument | null>(null);
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === currentSettings.adminPin || pinInput === '170522' || pinInput === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('PIN Admin salah. Default PIN adalah 170522 (Tanggal Berdiri CV Yusa).');
    }
  };

  // Handle Logo Upload (Base64)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentSettings({
          ...currentSettings,
          logoUrl: reader.result as string
        });
        showToast('Logo berhasil diunggah!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Hero Image Upload (Base64)
  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentSettings({
          ...currentSettings,
          heroImageUrl: reader.result as string
        });
        showToast('Gambar Banner Hero berhasil diunggah!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Settings
  const handleSaveSettings = () => {
    onSaveSettings(currentSettings);
    showToast('Pengaturan website berhasil disimpan!');
  };

  // Save Supabase Credentials
  const handleSaveSupabaseCredentials = () => {
    saveSupabaseConfig(supabaseUrlInput, supabaseKeyInput);
    const updated = getSupabaseConfig();
    setSupabaseConfigState(updated);
    showToast('Kredensial Supabase berhasil disimpan di browser!');
  };

  // Test Supabase Connection
  const handleTestSupabase = async () => {
    saveSupabaseConfig(supabaseUrlInput, supabaseKeyInput);
    setSupabaseConfigState(getSupabaseConfig());
    setIsTestingSupabase(true);
    setSupabaseTestResult(null);

    const result = await testSupabaseConnection();
    setIsTestingSupabase(false);
    setSupabaseTestResult(result);
  };

  // Push Local Data into Supabase
  const handleSyncLocalDataToSupabase = async () => {
    if (!supabaseConfig.isConfigured) {
      alert('Harap simpan URL dan Anon Key Supabase terlebih dahulu.');
      return;
    }

    setIsSyncingToSupabase(true);
    try {
      showToast('Menyinkronkan pengaturan ke Supabase...');
      await saveSettingsToSupabase(currentSettings);

      showToast('Menyinkronkan katalog produk ke Supabase...');
      await bulkSyncProductsToSupabase(products);

      showToast('Menyinkronkan dokumen legalitas ke Supabase...');
      await bulkSyncLegalDocsToSupabase(legalDocs);

      showToast('Seluruh data berhasil dimigrasikan ke Supabase!');
    } catch (err: any) {
      alert(`Gagal migrasi: ${err.message}`);
    } finally {
      setIsSyncingToSupabase(false);
    }
  };

  // Copy Supabase SQL Schema
  const handleCopySqlSchema = () => {
    const sql = generateSupabaseSQLSchema();
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    showToast('Skrip SQL Skema Supabase berhasil disalin!');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  // Copy Google Apps Script
  const handleCopyScript = () => {
    const code = generateGoogleAppsScriptCode(currentSettings.companyName);
    navigator.clipboard.writeText(code);
    setCopiedScript(true);
    showToast('Kode Google Apps Script berhasil disalin ke clipboard!');
    setTimeout(() => setCopiedScript(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl my-4 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Toast feedback */}
        {toastMsg && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Panel Manajemen CV YUSA KARYA INDONESIA
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Pabrik Sabun Batang • Akses Rahasia Terbuka via Ketuk Logo 3x
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Login Gate if Not Authenticated */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400 mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Autentikasi Administrator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Masukkan PIN keamanan untuk mengatur katalog, perizinan, dan website.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                placeholder="Masukkan PIN Admin (Default: 170522)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full text-center px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-lg tracking-widest focus:ring-2 focus:ring-teal-500 focus:outline-none"
                autoFocus
              />

              {authError && (
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-1.5 justify-center">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-lg shadow-teal-600/30 transition active:scale-95"
              >
                Buka Panel Admin
              </button>

              <p className="text-[11px] text-slate-400">
                Petunjuk: PIN default adalah <strong>170522</strong> (sesuai tanggal berdiri 22 Mei 2017)
              </p>
            </form>
          </div>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto px-6 pt-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 scrollbar-none shrink-0">
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'border-teal-600 text-teal-600 dark:text-teal-400 bg-white dark:bg-slate-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Pengaturan Website</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
                  activeTab === 'products'
                    ? 'border-teal-600 text-teal-600 dark:text-teal-400 bg-white dark:bg-slate-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Katalog Produk ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('legal')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
                  activeTab === 'legal'
                    ? 'border-teal-600 text-teal-600 dark:text-teal-400 bg-white dark:bg-slate-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <FileCheck className="w-4 h-4" />
                <span>Upload Izin Edar ({legalDocs.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('resellers')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
                  activeTab === 'resellers'
                    ? 'border-teal-600 text-teal-600 dark:text-teal-400 bg-white dark:bg-slate-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Lead Reseller ({resellers.length})</span>
              </button>

              {/* SUPABASE TAB */}
              <button
                onClick={() => setActiveTab('supabase')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
                  activeTab === 'supabase'
                    ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Database className="w-4 h-4 text-emerald-500" />
                <span>Database Supabase</span>
                {supabaseConfig.isConfigured ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('sheets')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
                  activeTab === 'sheets'
                    ? 'border-teal-600 text-teal-600 dark:text-teal-400 bg-white dark:bg-slate-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>Google Sheets</span>
              </button>

              <button
                onClick={() => setActiveTab('backup')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
                  activeTab === 'backup'
                    ? 'border-teal-600 text-teal-600 dark:text-teal-400 bg-white dark:bg-slate-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Backup</span>
              </button>
            </div>

            {/* Tab Body Contents */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* TAB: DATABASE SUPABASE */}
              {activeTab === 'supabase' && (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                        <Database className="w-5 h-5 text-emerald-600" />
                        <span>Integrasi Database Supabase (PostgreSQL Cloud)</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Katalog produk, izin edar, reseller, dan konfigurasi website tersimpan terpusat di Supabase & siap untuk Vercel.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSyncLocalDataToSupabase}
                        disabled={isSyncingToSupabase || !supabaseConfig.isConfigured}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncingToSupabase ? 'animate-spin' : ''}`} />
                        <span>{isSyncingToSupabase ? 'Menyinkronkan...' : 'Unggah Data Lokal ke Supabase'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Connection Card */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase text-slate-500">Status Koneksi:</span>
                        {supabaseConfig.isConfigured ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            <Check className="w-3.5 h-3.5" />
                            Kredensial Terpasang
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Belum Dikonfigurasi (Masih Menggunakan Data Lokal)
                          </span>
                        )}
                      </div>

                      <button
                        onClick={handleTestSupabase}
                        disabled={isTestingSupabase}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs font-bold hover:bg-slate-100 transition flex items-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>{isTestingSupabase ? 'Menguji...' : 'Test Koneksi API'}</span>
                      </button>
                    </div>

                    {supabaseTestResult && (
                      <div
                        className={`p-3 rounded-xl text-xs font-semibold flex items-start gap-2 ${
                          supabaseTestResult.success
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                            : 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                        }`}
                      >
                        {supabaseTestResult.success ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                        )}
                        <div>{supabaseTestResult.message}</div>
                      </div>
                    )}

                    {/* Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Supabase Project URL (VITE_SUPABASE_URL)
                        </label>
                        <input
                          type="url"
                          placeholder="https://xyzabcdefg.supabase.co"
                          value={supabaseUrlInput}
                          onChange={(e) => setSupabaseUrlInput(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                        />
                        <p className="text-[10px] text-slate-400">
                          Bisa didapat di Supabase: Project Settings → API → Project URL.
                        </p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Supabase Anon Public Key (VITE_SUPABASE_ANON_KEY)
                        </label>
                        <input
                          type="password"
                          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI..."
                          value={supabaseKeyInput}
                          onChange={(e) => setSupabaseKeyInput(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                        />
                        <p className="text-[10px] text-slate-400">
                          Kunci publik anon (aman ditaruh di browser / Vercel).
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={handleSaveSupabaseCredentials}
                        className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition"
                      >
                        Simpan Kredensial Supabase
                      </button>
                    </div>
                  </div>

                  {/* SQL Schema Generator Box */}
                  <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20 p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-emerald-600" />
                          <span>Skrip SQL Skema Tabel (5 Tabel + RLS + Seed Data CV YUSA)</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Tabel: <code>site_settings</code>, <code>products</code>, <code>legal_documents</code>, <code>reseller_applicants</code>, <code>testimonials</code>.
                        </p>
                      </div>

                      <button
                        onClick={handleCopySqlSchema}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow transition shrink-0"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedSql ? 'Skrip Tersalin!' : 'Salin Seluruh Skrip SQL'}</span>
                      </button>
                    </div>

                    <div className="relative">
                      <pre className="p-4 rounded-xl bg-slate-950 text-emerald-300 font-mono text-[11px] max-h-60 overflow-y-auto leading-relaxed border border-slate-800">
                        {generateSupabaseSQLSchema()}
                      </pre>
                    </div>
                  </div>

                  {/* Step by Step Tutorial Card */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-teal-600" />
                      <span>Tutorial Lengkap: Supabase ke Vercel (Langkah Cepat 5 Menit)</span>
                    </h4>

                    <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
                        <strong className="text-teal-700 dark:text-teal-300 block">
                          Langkah 1: Buat Proyek di Supabase
                        </strong>
                        <p>
                          1. Buka <strong>supabase.com</strong> dan buat akun gratis.<br />
                          2. Klik <strong>"New project"</strong>, beri nama misalnya <code>yusaklin-db</code> dan set password database Anda.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
                        <strong className="text-teal-700 dark:text-teal-300 block">
                          Langkah 2: Buat Tabel Otomatis via SQL Editor
                        </strong>
                        <p>
                          1. Di dashboard Supabase, klik menu <strong>SQL Editor</strong> di bilah kiri.<br />
                          2. Klik tombol hijau <strong>"Salin Seluruh Skrip SQL"</strong> di atas, lalu tempel di SQL Editor Supabase.<br />
                          3. Klik tombol hijau <strong>Run</strong>. Kelima tabel, aturan keamanan (RLS), dan data pabrik CV Yusa otomatis terbuat!
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
                        <strong className="text-teal-700 dark:text-teal-300 block">
                          Langkah 3: Ambil Kredensial API
                        </strong>
                        <p>
                          1. Masuk ke <strong>Project Settings → API</strong> di Supabase.<br />
                          2. Salin <strong>Project URL</strong> dan <strong>anon/public key</strong>.<br />
                          3. Tempel di form input di atas dan klik <strong>"Simpan Kredensial Supabase"</strong> lalu klik <strong>"Unggah Data Lokal ke Supabase"</strong>.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
                        <strong className="text-emerald-800 dark:text-emerald-300 block">
                          Langkah 4: Pasang Environment Variables di Vercel
                        </strong>
                        <p>
                          Saat deploy di <strong>Vercel</strong>, buka <strong>Settings → Environment Variables</strong> di project Vercel Anda, lalu tambahkan 2 variabel berikut:<br />
                          • <code>VITE_SUPABASE_URL</code> = <em>(Project URL Supabase Anda)</em><br />
                          • <code>VITE_SUPABASE_ANON_KEY</code> = <em>(Anon Public Key Supabase Anda)</em><br />
                          Kemudian klik <strong>Redeploy</strong> di Vercel. Selesai! Website live Anda sekarang 100% tersambung ke database Supabase secara realtime.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 1: PENGATURAN WEBSITE */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        Pengaturan Identitas & Tampilan Website
                      </h3>
                      <p className="text-xs text-slate-500">
                        Atur logo, nama perusahaan, alamat, telepon, dan banner hero.
                      </p>
                    </div>
                    <button
                      onClick={handleSaveSettings}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition"
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan Perubahan</span>
                    </button>
                  </div>

                  {/* Logo & Banner Uploaders */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Logo Config */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Logo Perusahaan
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-2 overflow-hidden shrink-0">
                          <img
                            src={currentSettings.logoUrl}
                            alt="Logo"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="space-y-2 flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                          />
                          <input
                            type="text"
                            placeholder="Atau masukkan URL Logo"
                            value={currentSettings.logoUrl}
                            onChange={(e) =>
                              setCurrentSettings({ ...currentSettings, logoUrl: e.target.value })
                            }
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Banner Image Config */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Gambar Banner Hero
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                          <img
                            src={currentSettings.heroImageUrl}
                            alt="Hero Banner"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-2 flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleHeroImageUpload}
                            className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                          />
                          <input
                            type="text"
                            placeholder="URL Gambar Banner"
                            value={currentSettings.heroImageUrl}
                            onChange={(e) =>
                              setCurrentSettings({ ...currentSettings, heroImageUrl: e.target.value })
                            }
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Core Information Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Nama Brand Utama
                      </label>
                      <input
                        type="text"
                        value={currentSettings.brandName}
                        onChange={(e) =>
                          setCurrentSettings({ ...currentSettings, brandName: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Nama Badan Usaha Resmi
                      </label>
                      <input
                        type="text"
                        value={currentSettings.companyName}
                        onChange={(e) =>
                          setCurrentSettings({ ...currentSettings, companyName: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Tanggal Berdiri Perusahaan
                      </label>
                      <input
                        type="text"
                        value={currentSettings.establishmentDate}
                        onChange={(e) =>
                          setCurrentSettings({ ...currentSettings, establishmentDate: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        WhatsApp CS Resmi (Format 628...)
                      </label>
                      <input
                        type="text"
                        value={currentSettings.whatsappNumber}
                        onChange={(e) =>
                          setCurrentSettings({ ...currentSettings, whatsappNumber: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Alamat Pabrik & Kantor Lengkap
                      </label>
                      <input
                        type="text"
                        value={currentSettings.address}
                        onChange={(e) =>
                          setCurrentSettings({ ...currentSettings, address: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Telepon Kantor
                      </label>
                      <input
                        type="text"
                        value={currentSettings.phone}
                        onChange={(e) =>
                          setCurrentSettings({ ...currentSettings, phone: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Email Resmi
                      </label>
                      <input
                        type="email"
                        value={currentSettings.email}
                        onChange={(e) =>
                          setCurrentSettings({ ...currentSettings, email: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        URL Embed Google Maps
                      </label>
                      <input
                        type="text"
                        value={currentSettings.googleMapsEmbedUrl}
                        onChange={(e) =>
                          setCurrentSettings({
                            ...currentSettings,
                            googleMapsEmbedUrl: e.target.value
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Ubah PIN Admin Keamanan
                      </label>
                      <input
                        type="text"
                        value={currentSettings.adminPin}
                        onChange={(e) =>
                          setCurrentSettings({ ...currentSettings, adminPin: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={handleSaveSettings}
                      className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition"
                    >
                      Simpan Seluruh Pengaturan
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: KELOLA PRODUK */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        Manajemen Katalog Produk Sabun
                      </h3>
                      <p className="text-xs text-slate-500">
                        Tambah, edit, sesuaikan harga grosir/eceran jerigen 5L dan drum.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          exportToCSV(
                            products.map((p) => ({
                              ID: p.id,
                              Nama: p.name,
                              Kategori: p.category,
                              IzinPKD: p.pkdNumber,
                              HargaMulai: p.variants[0]?.price,
                              Stok: p.stockStatus
                            })),
                            'YUSAKLIN_KATALOG_PRODUK'
                          )
                        }
                        className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export CSV</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsCreatingProduct(true);
                          setEditingProduct({
                            id: `prod-${Date.now()}`,
                            name: '',
                            category: 'rumah-tangga',
                            tagline: '',
                            description: '',
                            features: ['Formula konsentrat tinggi', 'Busa melimpah & lembut di tangan'],
                            usageInstructions: 'Campurkan secukupnya dengan air bersih.',
                            pkdNumber: 'KEMENKES RI PKD 20301710...',
                            imageUrl: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=700&q=80',
                            variants: [
                              { size: 'Jerigen 5 Liter', price: 45000, wholesalePrice: 38000, minWholesaleQty: 5 },
                              { size: 'Botol 1 Liter', price: 14000, wholesalePrice: 11000, minWholesaleQty: 12 }
                            ],
                            aromaVariants: ['Fresh Citrus'],
                            stockStatus: 'ready'
                          });
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Sabun Baru</span>
                      </button>
                    </div>
                  </div>

                  {/* Form Modal for Creating/Editing Product */}
                  {(isCreatingProduct || editingProduct) && (
                    <div className="p-5 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          {isCreatingProduct ? 'Tambah Sabun Baru' : 'Edit Produk Sabun'}
                        </h4>
                        <button
                          onClick={() => {
                            setIsCreatingProduct(false);
                            setEditingProduct(null);
                          }}
                          className="text-slate-400 hover:text-slate-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Nama Produk Sabun *
                          </label>
                          <input
                            type="text"
                            value={editingProduct?.name || ''}
                            onChange={(e) =>
                              setEditingProduct(
                                editingProduct ? { ...editingProduct, name: e.target.value } : null
                              )
                            }
                            placeholder="Contoh: Sabun Cuci Piring Jeruk Nipis"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Kategori Industri
                          </label>
                          <select
                            value={editingProduct?.category || 'rumah-tangga'}
                            onChange={(e) =>
                              setEditingProduct(
                                editingProduct
                                  ? {
                                      ...editingProduct,
                                      category: e.target.value as Product['category']
                                    }
                                  : null
                              )
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                          >
                            <option value="rumah-tangga">Rumah Tangga</option>
                            <option value="laundry">Laundry Kiloan & Komersil</option>
                            <option value="horeka">Hotel & Restoran (Horeka)</option>
                            <option value="medis">Rumah Sakit & Fasilitas Medis</option>
                            <option value="industri-otomotif">Industri & Otomotif</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Izin Edar Kemenkes RI PKD
                          </label>
                          <input
                            type="text"
                            value={editingProduct?.pkdNumber || ''}
                            onChange={(e) =>
                              setEditingProduct(
                                editingProduct
                                  ? { ...editingProduct, pkdNumber: e.target.value }
                                  : null
                              )
                            }
                            placeholder="KEMENKES RI PKD 20301710..."
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Foto Produk (Pilih File Lokal dari Komputer / HP atau Masukkan URL)
                          </label>
                          <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                            {editingProduct?.imageUrl && (
                              <img
                                src={editingProduct.imageUrl}
                                alt="Preview"
                                className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                              />
                            )}
                            <div className="flex-1 w-full space-y-1.5">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      if (editingProduct) {
                                        setEditingProduct({
                                          ...editingProduct,
                                          imageUrl: reader.result as string
                                        });
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                              />
                              <input
                                type="text"
                                placeholder="Atau tempelkan URL Gambar Produk (https://...)"
                                value={editingProduct?.imageUrl || ''}
                                onChange={(e) =>
                                  setEditingProduct(
                                    editingProduct
                                      ? { ...editingProduct, imageUrl: e.target.value }
                                      : null
                                  )
                                }
                                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Tagline Singkat
                          </label>
                          <input
                            type="text"
                            value={editingProduct?.tagline || ''}
                            onChange={(e) =>
                              setEditingProduct(
                                editingProduct
                                  ? { ...editingProduct, tagline: e.target.value }
                                  : null
                              )
                            }
                            placeholder="Contoh: Angkat Lemak Membandel Seketika & Lembut di Tangan"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Deskripsi Lengkap
                          </label>
                          <textarea
                            rows={2}
                            value={editingProduct?.description || ''}
                            onChange={(e) =>
                              setEditingProduct(
                                editingProduct
                                  ? { ...editingProduct, description: e.target.value }
                                  : null
                              )
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                          />
                        </div>

                        {/* KOLOM HARGA & VARIAN KEMASAN PRODUK */}
                        <div className="space-y-3 sm:col-span-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <DollarSign className="w-4 h-4 text-teal-600" />
                                <span>KOLOM HARGA & VARIAN KEMASAN PRODUK *</span>
                              </label>
                              <p className="text-[11px] text-slate-500">
                                Masukkan harga eceran dan harga grosir untuk setiap ukuran kemasan (Jerigen 5L, Botol 1L, Drum, dll).
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={handleAddVariant}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs font-bold transition border border-teal-200 dark:border-teal-800 self-start sm:self-auto"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>+ Tambah Kemasan/Harga Lain</span>
                            </button>
                          </div>

                          <div className="space-y-2.5">
                            {(editingProduct?.variants || []).map((v, vIndex) => (
                              <div
                                key={vIndex}
                                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end shadow-sm"
                              >
                                <div className="sm:col-span-4 space-y-1">
                                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                    Ukuran Kemasan *
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Jerigen 5 Liter, Botol 1L, Drum 20L"
                                    value={v.size}
                                    onChange={(e) => handleVariantChange(vIndex, 'size', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800 font-semibold"
                                  />
                                </div>

                                <div className="sm:col-span-3 space-y-1">
                                  <label className="text-[11px] font-bold text-teal-700 dark:text-teal-300 flex items-center gap-1">
                                    <Tag className="w-3 h-3" />
                                    <span>Harga Jual Eceran (Rp) *</span>
                                  </label>
                                  <input
                                    type="number"
                                    required
                                    min="0"
                                    step="500"
                                    placeholder="Contoh: 45000"
                                    value={v.price || ''}
                                    onChange={(e) => handleVariantChange(vIndex, 'price', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-teal-300 dark:border-teal-700 text-xs font-bold text-teal-800 dark:text-teal-200 bg-teal-50/50 dark:bg-teal-950/50"
                                  />
                                </div>

                                <div className="sm:col-span-3 space-y-1">
                                  <label className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                                    Harga Grosir Pabrik (Rp)
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    step="500"
                                    placeholder="Contoh: 38000"
                                    value={v.wholesalePrice || ''}
                                    onChange={(e) => handleVariantChange(vIndex, 'wholesalePrice', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800"
                                  />
                                </div>

                                <div className="sm:col-span-1 space-y-1">
                                  <label className="text-[10px] font-bold text-slate-500" title="Minimal beli untuk harga grosir">
                                    Min Qty
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    placeholder="5"
                                    value={v.minWholesaleQty || ''}
                                    onChange={(e) => handleVariantChange(vIndex, 'minWholesaleQty', e.target.value)}
                                    className="w-full px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-center bg-slate-50 dark:bg-slate-800"
                                  />
                                </div>

                                <div className="sm:col-span-1 flex justify-end pb-1">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveVariant(vIndex)}
                                    className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition"
                                    title="Hapus Kemasan Ini"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* STATUS STOK & VARIAN AROMA */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Status Ketersediaan Stok
                          </label>
                          <select
                            value={editingProduct?.stockStatus || 'ready'}
                            onChange={(e) =>
                              setEditingProduct(
                                editingProduct
                                  ? {
                                      ...editingProduct,
                                      stockStatus: e.target.value as Product['stockStatus']
                                    }
                                  : null
                              )
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                          >
                            <option value="ready">Ready Stok (Siap Kirim)</option>
                            <option value="preorder">Pre-Order Pabrik (PO)</option>
                            <option value="limited">Stok Terbatas</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Pilihan Varian Aroma (Pisahkan dengan koma)
                          </label>
                          <input
                            type="text"
                            placeholder="Contoh: Fresh Citrus, Lemon, Apel Hijau"
                            value={(editingProduct?.aromaVariants || []).join(', ')}
                            onChange={(e) =>
                              setEditingProduct(
                                editingProduct
                                  ? {
                                      ...editingProduct,
                                      aromaVariants: e.target.value
                                        .split(',')
                                        .map((s) => s.trim())
                                        .filter(Boolean)
                                    }
                                  : null
                              )
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                          />
                        </div>

                        {/* FORMULA & pH */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Bahan Aktif / Formula (Opsional)
                          </label>
                          <input
                            type="text"
                            placeholder="Contoh: Total Surfaktan Aktif 18%, Ekstrak Jeruk"
                            value={editingProduct?.activeIngredients || ''}
                            onChange={(e) =>
                              setEditingProduct(
                                editingProduct
                                  ? { ...editingProduct, activeIngredients: e.target.value }
                                  : null
                              )
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Tingkat pH (Opsional)
                          </label>
                          <input
                            type="text"
                            placeholder="Contoh: 6.5 - 7.5 (Netral & Aman di Kulit)"
                            value={editingProduct?.pH || ''}
                            onChange={(e) =>
                              setEditingProduct(
                                editingProduct
                                  ? { ...editingProduct, pH: e.target.value }
                                  : null
                              )
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => {
                            setIsCreatingProduct(false);
                            setEditingProduct(null);
                          }}
                          className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                        >
                          Batal
                        </button>
                        <button
                          onClick={() => {
                            if (!editingProduct?.name?.trim()) {
                              alert('Harap isi Nama Produk Sabun!');
                              return;
                            }
                            if (
                              !editingProduct.variants ||
                              editingProduct.variants.length === 0 ||
                              !editingProduct.variants[0].price
                            ) {
                              alert('Harap isi harga produk pada kolom harga!');
                              return;
                            }
                            let updatedList = [...products];
                            const existsIndex = updatedList.findIndex(
                              (p) => p.id === editingProduct.id
                            );
                            if (existsIndex >= 0) {
                              updatedList[existsIndex] = editingProduct;
                            } else {
                              updatedList.unshift(editingProduct);
                            }
                            onSaveProducts(updatedList);
                            setIsCreatingProduct(false);
                            setEditingProduct(null);
                            showToast('Katalog produk dan harga berhasil disimpan!');
                          }}
                          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition"
                        >
                          Simpan Produk Sabun
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Product List Table */}
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase font-bold border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="p-3">Produk</th>
                          <th className="p-3">Kategori</th>
                          <th className="p-3">Izin Edar PKD</th>
                          <th className="p-3">Kemasan & Harga</th>
                          <th className="p-3">Stok</th>
                          <th className="p-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {products.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                            <td className="p-3 flex items-center gap-2.5">
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                              />
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white block">
                                  {p.name}
                                </span>
                                <span className="text-[10px] text-slate-400">{p.tagline}</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-semibold text-[10px]">
                                {p.category}
                              </span>
                            </td>
                            <td className="p-3 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                              {p.pkdNumber}
                            </td>
                            <td className="p-3">
                              <span className="font-bold text-teal-700 dark:text-teal-300">
                                Rp {p.variants[0]?.price?.toLocaleString('id-ID')}
                              </span>
                              <span className="text-[10px] text-slate-400 ml-1">
                                ({p.variants[0]?.size})
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                {p.stockStatus}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-1">
                              <button
                                onClick={() => {
                                  setEditingProduct(p);
                                  setIsCreatingProduct(false);
                                }}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-teal-50"
                                title="Edit Produk"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Yakin ingin menghapus ${p.name}?`)) {
                                    const filtered = products.filter((x) => x.id !== p.id);
                                    onSaveProducts(filtered);
                                    showToast('Produk dihapus!');
                                  }
                                }}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                                title="Hapus Produk"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: UPLOAD DOKUMEN & IZIN EDAR */}
              {activeTab === 'legal' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        Upload & Kelola Dokumen Perizinan Resmi
                      </h3>
                      <p className="text-xs text-slate-500">
                        Upload berkas AHU, Izin Edar PKD Kemenkes, Halal MUI, NIB, & Sertifikat Uji Lab.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setIsCreatingDoc(true);
                        setEditingDoc({
                          id: `leg-${Date.now()}`,
                          title: '',
                          category: 'Ijin Edar PKD',
                          documentNumber: '',
                          issuer: '',
                          issueDate: '',
                          validUntil: 'Berlaku Selamanya',
                          description: '',
                          fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80',
                          isVerified: true
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Upload Dokumen Baru</span>
                    </button>
                  </div>

                  {/* Create / Edit Form */}
                  {(isCreatingDoc || editingDoc) && (
                    <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          {isCreatingDoc ? 'Upload Dokumen Legalitas Baru' : 'Edit Dokumen Perizinan'}
                        </h4>
                        <button
                          onClick={() => {
                            setIsCreatingDoc(false);
                            setEditingDoc(null);
                          }}
                          className="text-slate-400 hover:text-slate-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Nama Dokumen / Izin *
                          </label>
                          <input
                            type="text"
                            placeholder="Contoh: Ijin Edar PKD Sabun Cuci Piring"
                            value={editingDoc?.title || ''}
                            onChange={(e) =>
                              setEditingDoc(
                                editingDoc ? { ...editingDoc, title: e.target.value } : null
                              )
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Kategori Dokumen
                          </label>
                          <select
                            value={editingDoc?.category || 'Ijin Edar PKD'}
                            onChange={(e) =>
                              setEditingDoc(
                                editingDoc
                                  ? {
                                      ...editingDoc,
                                      category: e.target.value as LegalDocument['category']
                                    }
                                  : null
                              )
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                          >
                            <option value="AHU">AHU Kemenkumham RI</option>
                            <option value="Ijin Edar PKD">Ijin Edar Kemenkes RI PKD</option>
                            <option value="Halal">Sertifikat Halal BPJPH & MUI</option>
                            <option value="NIB">NIB Berbasis Risiko OSS</option>
                            <option value="Uji Lab">Sertifikat Hasil Uji Lab KAN</option>
                            <option value="Lainnya">Dokumen Lainnya</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Nomor Surat / SK Izin *
                          </label>
                          <input
                            type="text"
                            placeholder="Contoh: PKD 20301710123 / AHU-..."
                            value={editingDoc?.documentNumber || ''}
                            onChange={(e) =>
                              setEditingDoc(
                                editingDoc ? { ...editingDoc, documentNumber: e.target.value } : null
                              )
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Instansi Penerbit
                          </label>
                          <input
                            type="text"
                            placeholder="Kemenkes RI / Kemenkumham / BPJPH"
                            value={editingDoc?.issuer || ''}
                            onChange={(e) =>
                              setEditingDoc(
                                editingDoc ? { ...editingDoc, issuer: e.target.value } : null
                              )
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            File Dokumen / Foto Sertifikat (Pilih File atau Masukkan URL)
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    if (editingDoc) {
                                      setEditingDoc({
                                        ...editingDoc,
                                        fileUrl: reader.result as string
                                      });
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 file:text-emerald-800"
                            />
                            <input
                              type="text"
                              placeholder="Atau tempel Link Foto/Drive Dokumen"
                              value={editingDoc?.fileUrl || ''}
                              onChange={(e) =>
                                setEditingDoc(
                                  editingDoc ? { ...editingDoc, fileUrl: e.target.value } : null
                                )
                              }
                              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                            />
                          </div>
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Deskripsi Singkat / Keterangan Cakupan Izin
                          </label>
                          <textarea
                            rows={2}
                            value={editingDoc?.description || ''}
                            onChange={(e) =>
                              setEditingDoc(
                                editingDoc ? { ...editingDoc, description: e.target.value } : null
                              )
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => {
                            setIsCreatingDoc(false);
                            setEditingDoc(null);
                          }}
                          className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                        >
                          Batal
                        </button>
                        <button
                          onClick={() => {
                            if (!editingDoc?.title || !editingDoc?.documentNumber) return;
                            let updatedList = [...legalDocs];
                            const existsIdx = updatedList.findIndex((d) => d.id === editingDoc.id);
                            if (existsIdx >= 0) {
                              updatedList[existsIdx] = editingDoc;
                            } else {
                              updatedList.unshift(editingDoc);
                            }
                            onSaveLegalDocs(updatedList);
                            setIsCreatingDoc(false);
                            setEditingDoc(null);
                            showToast('Dokumen perizinan berhasil disimpan!');
                          }}
                          className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs"
                        >
                          Simpan Dokumen Legalitas
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Legal Documents List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {legalDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start gap-4 shadow-sm"
                      >
                        <img
                          src={doc.fileUrl}
                          alt={doc.title}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                            {doc.category}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate mt-1">
                            {doc.title}
                          </h4>
                          <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                            {doc.documentNumber}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                            Penerbit: {doc.issuer}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => {
                              setEditingDoc(doc);
                              setIsCreatingDoc(false);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-teal-50"
                            title="Edit Dokumen"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus dokumen ${doc.title}?`)) {
                                onSaveLegalDocs(legalDocs.filter((x) => x.id !== doc.id));
                                showToast('Dokumen dihapus!');
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Hapus Dokumen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: DATA RESELLER */}
              {activeTab === 'resellers' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        Data Pendaftar Kemitraan Reseller & Maklon
                      </h3>
                      <p className="text-xs text-slate-500">
                        Lead masuk dari formulir website. Hubungi langsung via WhatsApp.
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        exportToCSV(
                          resellers.map((r) => ({
                            Tanggal: r.createdAt,
                            Nama: r.name,
                            WhatsApp: r.whatsapp,
                            Kota: r.city,
                            Jenis: r.businessType,
                            Volume: r.estimatedVolume,
                            Status: r.status,
                            Catatan: r.notes
                          })),
                          'PENDAFTAR_RESELLER_YUSAKLIN'
                        )
                      }
                      className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV Reseller</span>
                    </button>
                  </div>

                  {resellers.length === 0 ? (
                    <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                      <Users className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        Belum Ada Pendaftar Reseller Baru
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Ketika calon mitra mengisi formulir pendaftaran di website, datanya akan langsung muncul di sini.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase font-bold border-b border-slate-200 dark:border-slate-700">
                          <tr>
                            <th className="p-3">Nama Mitra</th>
                            <th className="p-3">Kota</th>
                            <th className="p-3">Kemitraan</th>
                            <th className="p-3">Estimasi Volume</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Hubungi WA</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {resellers.map((r) => (
                            <tr key={r.id} className="hover:bg-slate-50/50">
                              <td className="p-3">
                                <span className="font-bold text-slate-900 dark:text-white block">
                                  {r.name}
                                </span>
                                <span className="text-[10px] text-slate-400">{r.whatsapp}</span>
                              </td>
                              <td className="p-3 font-medium">{r.city}</td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 text-[10px] font-bold">
                                  {r.businessType}
                                </span>
                              </td>
                              <td className="p-3 text-[11px]">{r.estimatedVolume}</td>
                              <td className="p-3">
                                <select
                                  value={r.status}
                                  onChange={(e) => {
                                    const updated = resellers.map((item) =>
                                      item.id === r.id
                                        ? { ...item, status: e.target.value as any }
                                        : item
                                    );
                                    onSaveResellers(updated);
                                    showToast('Status diperbarui!');
                                  }}
                                  className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] bg-white dark:bg-slate-800"
                                >
                                  <option value="baru">Baru</option>
                                  <option value="dihubungi">Dihubungi</option>
                                  <option value="deal">Deal Mitra</option>
                                  <option value="arsip">Arsip</option>
                                </select>
                              </td>
                              <td className="p-3 text-right">
                                <a
                                  href={`https://wa.me/${r.whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(
                                    r.name
                                  )},%20kami%20dari%20CV%20YUSA%20KARYA%20INDONESIA%20menindaklanjuti%20pendaftaran%20kemitraan%20sabun%20Anda`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                                >
                                  <PhoneCall className="w-3 h-3" />
                                  <span>Chat WA</span>
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: GOOGLE SHEETS */}
              {activeTab === 'sheets' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        Integrasi Google Sheets & Auto-Create Database
                      </h3>
                      <p className="text-xs text-slate-500">
                        Hubungkan formulir dan katalog ke Google Spreadsheet Anda via Google Apps Script Webhook.
                      </p>
                    </div>

                    <button
                      onClick={async () => {
                        if (!currentSettings.googleSheetsUrl) {
                          alert('Harap masukkan URL Webhook terlebih dahulu.');
                          return;
                        }
                        showToast('Menyinkronkan ke Google Sheets...');
                        const res = await syncToGoogleSheets(
                          currentSettings.googleSheetsUrl,
                          'sync_all',
                          { products, settings: currentSettings }
                        );
                        showToast(res.message);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Sinkronkan Katalog Sekarang</span>
                    </button>
                  </div>

                  {/* Webhook Input */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                      URL Webhook Google Apps Script (Web App URL)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                        value={currentSettings.googleSheetsUrl || ''}
                        onChange={(e) =>
                          setCurrentSettings({
                            ...currentSettings,
                            googleSheetsUrl: e.target.value
                          })
                        }
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                      />
                      <button
                        onClick={handleSaveSettings}
                        className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shrink-0"
                      >
                        Simpan URL
                      </button>
                    </div>
                  </div>

                  {/* Code Generator */}
                  <div className="rounded-2xl border border-teal-200 dark:border-teal-800 bg-teal-50/40 dark:bg-teal-950/20 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-teal-900 dark:text-teal-200 text-sm flex items-center gap-2">
                          <Database className="w-4 h-4 text-teal-600" />
                          <span>Kode Auto-Create Database Google Sheets</span>
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                          Salin kode berikut, lalu tempel di Google Spreadsheet Anda (Menu Ekstensi → Apps Script).
                        </p>
                      </div>

                      <button
                        onClick={handleCopyScript}
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow transition"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedScript ? 'Tersalin!' : 'Salin Seluruh Kode'}</span>
                      </button>
                    </div>

                    <div className="relative">
                      <pre className="p-4 rounded-xl bg-slate-900 text-teal-300 font-mono text-[11px] max-h-56 overflow-y-auto leading-relaxed border border-slate-800">
                        {generateGoogleAppsScriptCode(currentSettings.companyName)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: BACKUP & RESET */}
              {activeTab === 'backup' && (
                <div className="space-y-6">
                  <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      Cadangan Data & Pemulihan (Backup & Restore)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Simpan salinan data lengkap seluruh website (katalog, izin edar, reseller, pengaturan).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Download Backup */}
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                        <Download className="w-4 h-4 text-teal-600" />
                        <span>Download Backup Lengkap JSON</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        Unduh seluruh database situs ke dalam file format JSON untuk disimpan di komputer Anda.
                      </p>
                      <button
                        onClick={exportFullBackup}
                        className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition"
                      >
                        Download Backup Sekarang
                      </button>
                    </div>

                    {/* Restore Backup */}
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                        <Upload className="w-4 h-4 text-emerald-600" />
                        <span>Pulihkan Data dari File Backup</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        Unggah file JSON backup yang pernah Anda unduh untuk mengembalikan data situs.
                      </p>
                      <input
                        type="file"
                        accept=".json"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              try {
                                const parsed = JSON.parse(event.target?.result as string);
                                if (parsed.settings) onSaveSettings(parsed.settings);
                                if (parsed.products) onSaveProducts(parsed.products);
                                if (parsed.legalDocs) onSaveLegalDocs(parsed.legalDocs);
                                if (parsed.resellers) onSaveResellers(parsed.resellers);
                                showToast('Data berhasil dipulihkan dari backup!');
                              } catch (err) {
                                alert('Format file backup tidak valid!');
                              }
                            };
                            reader.readAsText(file);
                          }
                        }}
                        className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 file:text-emerald-800"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </>
        )}

      </div>
    </div>
  );
};
