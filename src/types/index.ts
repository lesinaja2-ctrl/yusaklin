export type ProductCategory =
  | 'all'
  | 'rumah-tangga'
  | 'laundry'
  | 'horeka'
  | 'medis'
  | 'industri-otomotif';

export interface ProductVariant {
  size: string; // e.g. "Jerigen 5 Liter", "Botol 1 Liter", "Pouch 450ml", "Drum 20L"
  price: number;
  wholesalePrice?: number;
  minWholesaleQty?: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'rumah-tangga' | 'laundry' | 'horeka' | 'medis' | 'industri-otomotif';
  tagline: string;
  description: string;
  features: string[];
  usageInstructions: string;
  pkdNumber: string; // Izin Edar Kemenkes RI PKD / BPOM
  imageUrl: string;
  variants: ProductVariant[];
  aromaVariants?: string[]; // e.g. "Lemon Fresh", "Apple Glow", "Lavender"
  isFeatured?: boolean;
  stockStatus: 'ready' | 'preorder' | 'limited';
  activeIngredients?: string;
  pH?: string;
}

export interface LegalDocument {
  id: string;
  title: string;
  category: 'AHU' | 'Ijin Edar PKD' | 'Halal' | 'NIB' | 'Uji Lab' | 'Lainnya';
  documentNumber: string;
  issuer: string;
  issueDate: string;
  validUntil: string;
  description: string;
  fileUrl: string; // image or PDF link or base64
  verificationUrl?: string;
  isVerified: boolean;
}

export interface SiteSettings {
  brandName: string;
  companyName: string;
  tagline: string;
  establishmentDate: string; // "22 Mei 2017"
  address: string; // "Jalan Yos Sudarso No.260 Batang, Jawa Tengah"
  phone: string;
  whatsappNumber: string; // e.g. "6281234567890"
  email: string;
  operationalHours: string;
  logoUrl: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroImageUrl: string;
  themeColor: 'teal' | 'emerald' | 'blue' | 'cyan' | 'indigo';
  googleSheetsUrl?: string; // Webhook / Google Apps Script URL
  googleMapsEmbedUrl: string;
  socials: {
    instagram: string;
    facebook: string;
    tiktok: string;
    shopee: string;
    tokopedia: string;
  };
  adminPin: string;
  sectionsVisibility: {
    hero: boolean;
    catalog: boolean;
    legal: boolean;
    about: boolean;
    reseller: boolean;
    testimonials: boolean;
    contact: boolean;
  };
}

export interface ResellerApplicant {
  id: string;
  name: string;
  whatsapp: string;
  city: string;
  businessType: 'Reseller Kemitraan' | 'Distributor Agen' | 'Maklon Sabun (Private Label)' | 'Suplai Laundry / Hotel';
  estimatedVolume: string;
  notes?: string;
  createdAt: string;
  status: 'baru' | 'dihubungi' | 'deal' | 'arsip';
}

export interface ClientTestimonial {
  id: string;
  clientName: string;
  businessName: string;
  businessType: string; // "Hotel & Resto", "Laundry Kiloan", "Klinik Medis", etc.
  avatarUrl: string;
  quote: string;
  rating: number;
  productsUsed: string;
  city: string;
}
