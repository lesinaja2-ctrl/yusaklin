import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Product,
  LegalDocument,
  SiteSettings,
  ResellerApplicant,
  ClientTestimonial
} from '../types';
import {
  initialSiteSettings,
  initialProducts,
  initialLegalDocs,
  initialTestimonials
} from '../data/initialData';

const SUPABASE_URL_KEY = 'yusaklin_supabase_url';
const SUPABASE_ANON_KEY = 'yusaklin_supabase_anon_key';

// Helper to get active credentials
export const getSupabaseConfig = () => {
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem(SUPABASE_URL_KEY) : '';
  const localKey = typeof window !== 'undefined' ? localStorage.getItem(SUPABASE_ANON_KEY) : '';

  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

  const url = (localUrl || envUrl || '').trim();
  const key = (localKey || envKey || '').trim();

  return {
    url,
    key,
    isConfigured: Boolean(url && key && url.startsWith('http') && !url.includes('your-project-id'))
  };
};

export const saveSupabaseConfig = (url: string, key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SUPABASE_URL_KEY, url.trim());
    localStorage.setItem(SUPABASE_ANON_KEY, key.trim());
  }
};

let cachedClient: SupabaseClient | null = null;
let lastUrl = '';
let lastKey = '';

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  if (cachedClient && lastUrl === url && lastKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, key, {
      auth: {
        persistSession: false
      }
    });
    lastUrl = url;
    lastKey = key;
    return cachedClient;
  } catch (err) {
    console.error('Failed to create Supabase client', err);
    return null;
  }
};

// ==========================================
// 1. SETTINGS OPERATIONS
// ==========================================
export const fetchSettingsFromSupabase = async (): Promise<SiteSettings | null> => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('site_settings')
      .select('*')
      .eq('id', 'primary')
      .single();

    if (error || !data) {
      console.warn('Supabase fetchSettings notice:', error?.message);
      return null;
    }

    return {
      brandName: data.brand_name,
      companyName: data.company_name,
      tagline: data.tagline,
      establishmentDate: data.establishment_date,
      address: data.address,
      phone: data.phone,
      whatsappNumber: data.whatsapp_number,
      email: data.email,
      operationalHours: data.operational_hours,
      logoUrl: data.logo_url,
      heroHeadline: data.hero_headline,
      heroSubheadline: data.hero_subheadline,
      heroImageUrl: data.hero_image_url,
      themeColor: data.theme_color || 'teal',
      googleSheetsUrl: data.google_sheets_url || '',
      googleMapsEmbedUrl: data.google_maps_embed_url,
      socials: data.socials || initialSiteSettings.socials,
      adminPin: data.admin_pin || '170522',
      sectionsVisibility: data.sections_visibility || initialSiteSettings.sectionsVisibility
    };
  } catch (err) {
    console.error('Error fetching settings from Supabase:', err);
    return null;
  }
};

export const saveSettingsToSupabase = async (
  settings: SiteSettings
): Promise<{ success: boolean; message: string }> => {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase belum terkonfigurasi.' };
  }

  try {
    const payload = {
      id: 'primary',
      brand_name: settings.brandName,
      company_name: settings.companyName,
      tagline: settings.tagline,
      establishment_date: settings.establishmentDate,
      address: settings.address,
      phone: settings.phone,
      whatsapp_number: settings.whatsappNumber,
      email: settings.email,
      operational_hours: settings.operationalHours,
      logo_url: settings.logoUrl,
      hero_headline: settings.heroHeadline,
      hero_subheadline: settings.heroSubheadline,
      hero_image_url: settings.heroImageUrl,
      theme_color: settings.themeColor,
      google_sheets_url: settings.googleSheetsUrl,
      google_maps_embed_url: settings.googleMapsEmbedUrl,
      socials: settings.socials,
      admin_pin: settings.adminPin,
      sections_visibility: settings.sectionsVisibility,
      updated_at: new Date().toISOString()
    };

    const { error } = await client
      .from('site_settings')
      .upsert(payload, { onConflict: 'id' });

    if (error) throw error;
    return { success: true, message: 'Pengaturan website berhasil disimpan ke Supabase!' };
  } catch (err: any) {
    return { success: false, message: `Gagal simpan ke Supabase: ${err.message}` };
  }
};

// ==========================================
// 2. PRODUCTS OPERATIONS
// ==========================================
export const fetchProductsFromSupabase = async (): Promise<Product[] | null> => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return null;
    }

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      tagline: item.tagline,
      description: item.description,
      features: item.features || [],
      usageInstructions: item.usage_instructions || '',
      pkdNumber: item.pkd_number || '',
      imageUrl: item.image_url || '',
      variants: item.variants || [],
      aromaVariants: item.aroma_variants || [],
      isFeatured: item.is_featured || false,
      stockStatus: item.stock_status || 'ready',
      activeIngredients: item.active_ingredients || '',
      pH: item.ph || ''
    }));
  } catch (err) {
    console.error('Error fetching products from Supabase:', err);
    return null;
  }
};

export const saveProductToSupabase = async (
  product: Product
): Promise<{ success: boolean; message: string }> => {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase belum dikonfigurasi.' };
  }

  try {
    const payload = {
      id: product.id,
      name: product.name,
      category: product.category,
      tagline: product.tagline,
      description: product.description,
      features: product.features,
      usage_instructions: product.usageInstructions,
      pkd_number: product.pkdNumber,
      image_url: product.imageUrl,
      variants: product.variants,
      aroma_variants: product.aromaVariants,
      is_featured: product.isFeatured || false,
      stock_status: product.stockStatus,
      active_ingredients: product.activeIngredients,
      ph: product.pH,
      updated_at: new Date().toISOString()
    };

    const { error } = await client
      .from('products')
      .upsert(payload, { onConflict: 'id' });

    if (error) throw error;
    return { success: true, message: 'Produk berhasil disimpan ke Supabase!' };
  } catch (err: any) {
    return { success: false, message: `Gagal simpan produk: ${err.message}` };
  }
};

export const deleteProductFromSupabase = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const client = getSupabaseClient();
  if (!client) return { success: false, message: 'Supabase belum terkonfigurasi.' };

  try {
    const { error } = await client.from('products').delete().eq('id', id);
    if (error) throw error;
    return { success: true, message: 'Produk berhasil dihapus dari Supabase.' };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
};

export const bulkSyncProductsToSupabase = async (
  products: Product[]
): Promise<{ success: boolean; message: string }> => {
  const client = getSupabaseClient();
  if (!client) return { success: false, message: 'Supabase belum dikonfigurasi.' };

  try {
    const records = products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      tagline: p.tagline,
      description: p.description,
      features: p.features,
      usage_instructions: p.usageInstructions,
      pkd_number: p.pkdNumber,
      image_url: p.imageUrl,
      variants: p.variants,
      aroma_variants: p.aromaVariants,
      is_featured: p.isFeatured || false,
      stock_status: p.stockStatus,
      active_ingredients: p.activeIngredients,
      ph: p.pH,
      updated_at: new Date().toISOString()
    }));

    const { error } = await client.from('products').upsert(records, { onConflict: 'id' });
    if (error) throw error;
    return { success: true, message: `Berhasil sinkronkan ${records.length} produk ke Supabase!` };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
};

// ==========================================
// 3. LEGAL DOCUMENTS OPERATIONS
// ==========================================
export const fetchLegalDocsFromSupabase = async (): Promise<LegalDocument[] | null> => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('legal_documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return null;

    return data.map((d: any) => ({
      id: d.id,
      title: d.title,
      category: d.category,
      documentNumber: d.document_number,
      issuer: d.issuer,
      issueDate: d.issue_date,
      validUntil: d.valid_until,
      description: d.description,
      fileUrl: d.file_url,
      verificationUrl: d.verification_url,
      isVerified: d.is_verified ?? true
    }));
  } catch (err) {
    console.error('Error fetching legal documents from Supabase:', err);
    return null;
  }
};

export const saveLegalDocToSupabase = async (
  doc: LegalDocument
): Promise<{ success: boolean; message: string }> => {
  const client = getSupabaseClient();
  if (!client) return { success: false, message: 'Supabase belum dikonfigurasi.' };

  try {
    const payload = {
      id: doc.id,
      title: doc.title,
      category: doc.category,
      document_number: doc.documentNumber,
      issuer: doc.issuer,
      issue_date: doc.issueDate,
      valid_until: doc.validUntil,
      description: doc.description,
      file_url: doc.fileUrl,
      verification_url: doc.verificationUrl,
      is_verified: doc.isVerified,
      updated_at: new Date().toISOString()
    };

    const { error } = await client
      .from('legal_documents')
      .upsert(payload, { onConflict: 'id' });

    if (error) throw error;
    return { success: true, message: 'Dokumen legalitas berhasil disimpan ke Supabase!' };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
};

export const deleteLegalDocFromSupabase = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const client = getSupabaseClient();
  if (!client) return { success: false, message: 'Supabase belum dikonfigurasi.' };

  try {
    const { error } = await client.from('legal_documents').delete().eq('id', id);
    if (error) throw error;
    return { success: true, message: 'Dokumen berhasil dihapus dari Supabase.' };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
};

export const bulkSyncLegalDocsToSupabase = async (
  docs: LegalDocument[]
): Promise<{ success: boolean; message: string }> => {
  const client = getSupabaseClient();
  if (!client) return { success: false, message: 'Supabase belum dikonfigurasi.' };

  try {
    const records = docs.map((d) => ({
      id: d.id,
      title: d.title,
      category: d.category,
      document_number: d.documentNumber,
      issuer: d.issuer,
      issue_date: d.issueDate,
      valid_until: d.validUntil,
      description: d.description,
      file_url: d.fileUrl,
      verification_url: d.verificationUrl,
      is_verified: d.isVerified,
      updated_at: new Date().toISOString()
    }));

    const { error } = await client.from('legal_documents').upsert(records, { onConflict: 'id' });
    if (error) throw error;
    return { success: true, message: `Berhasil sinkronkan ${records.length} dokumen legalitas ke Supabase!` };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
};

// ==========================================
// 4. RESELLER APPLICANTS OPERATIONS
// ==========================================
export const fetchResellersFromSupabase = async (): Promise<ResellerApplicant[] | null> => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('reseller_applicants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;

    return data.map((r: any) => ({
      id: r.id,
      name: r.name,
      whatsapp: r.whatsapp,
      city: r.city,
      businessType: r.business_type,
      estimatedVolume: r.estimated_volume,
      notes: r.notes || '',
      createdAt: r.created_at,
      status: r.status || 'baru'
    }));
  } catch (err) {
    console.error('Error fetching resellers from Supabase:', err);
    return null;
  }
};

export const insertResellerToSupabase = async (
  applicant: ResellerApplicant
): Promise<{ success: boolean; message: string }> => {
  const client = getSupabaseClient();
  if (!client) return { success: false, message: 'Supabase belum terkonfigurasi.' };

  try {
    const payload = {
      id: applicant.id,
      name: applicant.name,
      whatsapp: applicant.whatsapp,
      city: applicant.city,
      business_type: applicant.businessType,
      estimated_volume: applicant.estimatedVolume,
      notes: applicant.notes,
      status: applicant.status,
      created_at: applicant.createdAt || new Date().toISOString()
    };

    const { error } = await client
      .from('reseller_applicants')
      .upsert(payload, { onConflict: 'id' });

    if (error) throw error;
    return { success: true, message: 'Pendaftaran reseller tersimpan ke database Supabase!' };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
};

export const updateResellerStatusInSupabase = async (
  id: string,
  status: ResellerApplicant['status']
): Promise<{ success: boolean; message: string }> => {
  const client = getSupabaseClient();
  if (!client) return { success: false, message: 'Supabase belum terkonfigurasi.' };

  try {
    const { error } = await client
      .from('reseller_applicants')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    return { success: true, message: 'Status reseller berhasil diupdate!' };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
};

// ==========================================
// 5. TEST CONNECTION FUNCTION
// ==========================================
export const testSupabaseConnection = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'Kredensial Supabase (URL & Anon Key) belum diisi atau tidak valid.'
    };
  }

  try {
    // Try pinging site_settings or running a lightweight select
    const { data, error } = await client.from('site_settings').select('id').limit(1);
    if (error) {
      if (error.code === '42P01') {
        return {
          success: false,
          message: 'Terkoneksi ke Supabase, namun TABEL SKEMA belum dibuat! Jalankan SQL Query Skema di SQL Editor Supabase.'
        };
      }
      return {
        success: false,
        message: `Koneksi gagal: ${error.message} (Kode: ${error.code})`
      };
    }
    return {
      success: true,
      message: 'Koneksi ke Supabase PostgreSQL berhasil dan tabel terdeteksi!'
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Gagal menghubungi server Supabase: ${err.message}`
    };
  }
};

// ==========================================
// 6. GENERATE FULL SQL SCHEMA WITH SEED DATA
// ==========================================
export const generateSupabaseSQLSchema = (): string => {
  return `-- ==========================================================
-- SKEMA DATABASE SUPABASE: CV YUSA KARYA INDONESIA (YUSAKLIN)
-- Terdiri dari 5 Tabel Utama + Row Level Security (RLS) + Seed Data
-- Jalankan skrip ini di: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==========================================================

-- 1. TABEL PENGATURAN WEBSITE (SITE SETTINGS)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  brand_name TEXT NOT NULL DEFAULT 'YUSAKLIN',
  company_name TEXT NOT NULL DEFAULT 'CV YUSA KARYA INDONESIA',
  tagline TEXT,
  establishment_date TEXT DEFAULT '22 Mei 2017',
  address TEXT DEFAULT 'Jalan Yos Sudarso No.260 Batang, Jawa Tengah',
  phone TEXT DEFAULT '0812-2577-8899',
  whatsapp_number TEXT DEFAULT '6281225778899',
  email TEXT DEFAULT 'yusakaryaindonesia@gmail.com',
  operational_hours TEXT DEFAULT 'Senin - Sabtu: 08.00 - 17.00 WIB',
  logo_url TEXT DEFAULT '/icon.svg',
  hero_headline TEXT,
  hero_subheadline TEXT,
  hero_image_url TEXT,
  theme_color TEXT DEFAULT 'teal',
  google_sheets_url TEXT,
  google_maps_embed_url TEXT,
  socials JSONB DEFAULT '{"instagram":"","facebook":"","tiktok":"","shopee":"","tokopedia":""}'::jsonb,
  admin_pin TEXT DEFAULT '170522',
  sections_visibility JSONB DEFAULT '{"hero":true,"catalog":true,"legal":true,"about":true,"reseller":true,"testimonials":true,"contact":true}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. TABEL KATALOG PRODUK SABUN & PEMBERSIH (PRODUCTS)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'rumah-tangga', 'laundry', 'horeka', 'medis', 'industri-otomotif'
  tagline TEXT,
  description TEXT,
  features TEXT[] DEFAULT '{}',
  usage_instructions TEXT,
  pkd_number TEXT,
  image_url TEXT,
  variants JSONB DEFAULT '[]'::jsonb, -- [{size, price, wholesalePrice, minWholesaleQty}]
  aroma_variants TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  stock_status TEXT DEFAULT 'ready', -- 'ready', 'preorder', 'limited'
  active_ingredients TEXT,
  ph TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. TABEL DOKUMEN PERIJINAN & SERTIFIKAT (LEGAL DOCUMENTS)
CREATE TABLE IF NOT EXISTS public.legal_documents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'AHU', 'Ijin Edar PKD', 'Halal', 'NIB', 'Uji Lab', 'Lainnya'
  document_number TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date TEXT,
  valid_until TEXT,
  description TEXT,
  file_url TEXT,
  verification_url TEXT,
  is_verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. TABEL PENDAFTAR MITRA RESELLER & MAKLON (RESELLER APPLICANTS)
CREATE TABLE IF NOT EXISTS public.reseller_applicants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  city TEXT NOT NULL,
  business_type TEXT NOT NULL,
  estimated_volume TEXT,
  notes TEXT,
  status TEXT DEFAULT 'baru', -- 'baru', 'dihubungi', 'deal', 'arsip'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. TABEL TESTIMONI & PORTOFOLIO KLIEN (TESTIMONIALS)
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  business_type TEXT,
  avatar_url TEXT,
  quote TEXT,
  rating INTEGER DEFAULT 5,
  products_used TEXT,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Memberikan hak akses Baca Publik & Tulis Terbuka untuk SPA Vercel
-- ==========================================================
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Izinkan Pembacaan Publik (Anonim)
DROP POLICY IF EXISTS "Allow Public Read site_settings" ON public.site_settings;
CREATE POLICY "Allow Public Read site_settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow Public Read products" ON public.products;
CREATE POLICY "Allow Public Read products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow Public Read legal_documents" ON public.legal_documents;
CREATE POLICY "Allow Public Read legal_documents" ON public.legal_documents FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow Public Read reseller_applicants" ON public.reseller_applicants;
CREATE POLICY "Allow Public Read reseller_applicants" ON public.reseller_applicants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow Public Read testimonials" ON public.testimonials;
CREATE POLICY "Allow Public Read testimonials" ON public.testimonials FOR SELECT USING (true);

-- Izinkan Insert & Update untuk Pengaturan dan Data
DROP POLICY IF EXISTS "Allow Write site_settings" ON public.site_settings;
CREATE POLICY "Allow Write site_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow Write products" ON public.products;
CREATE POLICY "Allow Write products" ON public.products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow Write legal_documents" ON public.legal_documents;
CREATE POLICY "Allow Write legal_documents" ON public.legal_documents FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow Write reseller_applicants" ON public.reseller_applicants;
CREATE POLICY "Allow Write reseller_applicants" ON public.reseller_applicants FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow Write testimonials" ON public.testimonials;
CREATE POLICY "Allow Write testimonials" ON public.testimonials FOR ALL USING (true) WITH CHECK (true);

-- ==========================================================
-- DATA AWAL (SEED DEFAULT) CV YUSA KARYA INDONESIA
-- ==========================================================
INSERT INTO public.site_settings (
  id, brand_name, company_name, tagline, establishment_date, address, phone, whatsapp_number, email, operational_hours, logo_url, hero_headline, hero_subheadline, hero_image_url, google_maps_embed_url, admin_pin
) VALUES (
  'primary',
  'YUSAKLIN',
  'CV YUSA KARYA INDONESIA',
  'Solusi Bersih Higienis, Hemat & Terpercaya untuk Rumah Tangga & Industri',
  '22 Mei 2017',
  'Jalan Yos Sudarso No.260 Batang, Jawa Tengah 51211',
  '0812-2577-8899',
  '6281225778899',
  'yusakaryaindonesia@gmail.com',
  'Senin - Sabtu: 08.00 - 17.00 WIB',
  '/icon.svg',
  'Produsen Sabun & Pembersih Higienis Bersertifikasi Resmi',
  'CV YUSA KARYA INDONESIA memproduksi aneka deterjen, pembersih lantai, sabun cuci piring, dan chemical higienis berkualitas pabrik untuk rumah tangga, laundry, Horeka, dan rumah sakit.',
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15844.75704929828!2d109.721415!3d-6.899052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e702517f8a9e701%3A0x6b8764032a9ba942!2sJl.%20Yos%20Sudarso%2C%20Batang%2C%20Kec.%20Batang%2C%20Kabupaten%20Batang%2C%20Jawa%20Tengah!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
  '170522'
) ON CONFLICT (id) DO NOTHING;
`;
};
