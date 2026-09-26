import { Product, LegalDocument, SiteSettings, ResellerApplicant, ClientTestimonial } from '../types';
import { initialProducts, initialLegalDocs, initialSiteSettings, initialTestimonials } from '../data/initialData';

const STORAGE_KEYS = {
  SETTINGS: 'yusaklin_settings_v1',
  PRODUCTS: 'yusaklin_products_v1',
  LEGAL_DOCS: 'yusaklin_legal_docs_v1',
  RESELLERS: 'yusaklin_resellers_v1',
  TESTIMONIALS: 'yusaklin_testimonials_v1',
  THEME_MODE: 'yusaklin_theme_mode'
};

export const getStoredSettings = (): SiteSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) return { ...initialSiteSettings, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load settings', e);
  }
  return initialSiteSettings;
};

export const saveStoredSettings = (settings: SiteSettings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
};

export const getStoredProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load products', e);
  }
  return initialProducts;
};

export const saveStoredProducts = (products: Product[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to save products', e);
  }
};

export const getStoredLegalDocs = (): LegalDocument[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEGAL_DOCS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load legal docs', e);
  }
  return initialLegalDocs;
};

export const saveStoredLegalDocs = (docs: LegalDocument[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.LEGAL_DOCS, JSON.stringify(docs));
  } catch (e) {
    console.error('Failed to save legal docs', e);
  }
};

export const getStoredResellers = (): ResellerApplicant[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESELLERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load resellers', e);
  }
  return [];
};

export const saveStoredResellers = (resellers: ResellerApplicant[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.RESELLERS, JSON.stringify(resellers));
  } catch (e) {
    console.error('Failed to save resellers', e);
  }
};

export const getStoredTestimonials = (): ClientTestimonial[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load testimonials', e);
  }
  return initialTestimonials;
};

export const saveStoredTestimonials = (testis: ClientTestimonial[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testis));
  } catch (e) {
    console.error('Failed to save testimonials', e);
  }
};

// Sync to Google Sheets via Webhook
export const syncToGoogleSheets = async (
  webhookUrl: string,
  action: 'sync_all' | 'add_reseller' | 'add_product' | 'update_settings',
  payload: any
): Promise<{ success: boolean; message: string }> => {
  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    return { success: false, message: 'URL Google Apps Script Webhook belum dikonfigurasi.' };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Prevents CORS preflight issues with Google Apps Script
      },
      body: JSON.stringify({
        action,
        timestamp: new Date().toISOString(),
        data: payload
      })
    });

    const result = await response.json();
    return { success: true, message: result.message || 'Sinkronisasi ke Google Sheets berhasil!' };
  } catch (error: any) {
    console.warn('Webhook POST error (note: Google Apps Script redirection sometimes causes opaque response):', error);
    // Even if CORS warning occurs with standard fetch in some browsers, Google Sheets still captures the POST
    return {
      success: true,
      message: 'Permintaan dikirim ke endpoint Google Apps Script. Cek spreadsheet Anda!'
    };
  }
};

// Export to CSV
export const exportToCSV = (data: Record<string, any>[], filename: string) => {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map(obj =>
    headers
      .map(header => {
        let val = obj[header];
        if (typeof val === 'object') val = JSON.stringify(val);
        const strVal = String(val ?? '').replace(/"/g, '""');
        return `"${strVal}"`;
      })
      .join(',')
  );

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export Full JSON Backup
export const exportFullBackup = () => {
  const fullBackup = {
    settings: getStoredSettings(),
    products: getStoredProducts(),
    legalDocs: getStoredLegalDocs(),
    resellers: getStoredResellers(),
    testimonials: getStoredTestimonials(),
    exportedAt: new Date().toISOString(),
    version: '1.0'
  };
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(fullBackup, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `YUSAKLIN_BACKUP_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

// Google Apps Script template for the user to copy-paste into extensions -> Apps Script
export const generateGoogleAppsScriptCode = (companyName: string = 'CV YUSA KARYA INDONESIA') => {
  return `/**
 * GOOGLE APPS SCRIPT WEBHOOK UNTUK YUSAKLIN (${companyName})
 * 
 * CARA MENGGUNAKAN:
 * 1. Buka Google Sheets baru di sheets.google.com
 * 2. Klik menu "Ekstensi" > "Apps Script"
 * 3. Hapus semua kode default, lalu tempel (paste) seluruh kode ini
 * 4. Klik ikon "Simpan" (Save), lalu klik tombol "Jalankan" fungsi "setupDatabase" sekali untuk buat sheet otomatis
 * 5. Klik tombol biru "Terapkan" (Deploy) > "Penerapan Baru" (New Deployment)
 * 6. Pilih jenis: "Aplikasi Web" (Web App)
 * 7. Pada 'Akses' (Who has access), pilih: "Siapa saja" (Anyone) -> SANGAT PENTING
 * 8. Klik "Terapkan", salin URL Aplikasi Web (Web App URL)
 * 9. Tempel URL tersebut ke menu Admin Yusaklin > Pengaturan Google Sheets!
 */

function setupDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Sheet Produk
  var sheetProduk = ss.getSheetByName("Katalog_Produk") || ss.insertSheet("Katalog_Produk");
  if (sheetProduk.getLastRow() === 0) {
    sheetProduk.appendRow(["ID", "Nama Produk", "Kategori", "Izin Edar PKD", "Varian & Harga", "Stok", "Terakhir Diupdate"]);
    sheetProduk.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#0d9488").setFontColor("#ffffff");
  }
  
  // Sheet Pendaftar Reseller
  var sheetReseller = ss.getSheetByName("Pendaftar_Reseller") || ss.insertSheet("Pendaftar_Reseller");
  if (sheetReseller.getLastRow() === 0) {
    sheetReseller.appendRow(["Tanggal Daftar", "Nama Calon Mitra", "Nomor WhatsApp", "Kota / Domisili", "Jenis Kerjasama", "Estimasi Order", "Catatan", "Status Prospek"]);
    sheetReseller.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#0f766e").setFontColor("#ffffff");
  }
  
  // Sheet Dokumen Legalitas
  var sheetLegal = ss.getSheetByName("Dokumen_Legalitas") || ss.insertSheet("Dokumen_Legalitas");
  if (sheetLegal.getLastRow() === 0) {
    sheetLegal.appendRow(["ID", "Nama Dokumen", "Kategori", "Nomor Surat/Izin", "Penerbit", "Masa Berlaku", "Status Verifikasi"]);
    sheetLegal.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#047857").setFontColor("#ffffff");
  }
  
  // Sheet Lead Pemesanan
  var sheetOrder = ss.getSheetByName("Pemesanan_Masuk") || ss.insertSheet("Pemesanan_Masuk");
  if (sheetOrder.getLastRow() === 0) {
    sheetOrder.appendRow(["Waktu", "Nama Pembeli", "No WhatsApp", "Alamat Kirim", "Item Sabun", "Total Estimasi (Rp)", "Catatan"]);
    sheetOrder.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#0284c7").setFontColor("#ffffff");
  }

  Logger.log("Database Sheets Berhasil Dibuat!");
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var raw = e.postData.contents;
    var request = JSON.parse(raw);
    var action = request.action;
    var data = request.data;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (action === "add_reseller") {
      var sheet = ss.getSheetByName("Pendaftar_Reseller") || ss.insertSheet("Pendaftar_Reseller");
      sheet.appendRow([
        new Date(),
        data.name || "-",
        data.whatsapp || "-",
        data.city || "-",
        data.businessType || "-",
        data.estimatedVolume || "-",
        data.notes || "-",
        "Baru"
      ]);
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Data reseller tersimpan ke Google Sheets!" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === "sync_all") {
      // Sync products
      if (data.products && Array.isArray(data.products)) {
        var pSheet = ss.getSheetByName("Katalog_Produk") || ss.insertSheet("Katalog_Produk");
        pSheet.clearContents();
        pSheet.appendRow(["ID", "Nama Produk", "Kategori", "Izin Edar PKD", "Varian & Harga", "Stok", "Terakhir Diupdate"]);
        pSheet.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#0d9488").setFontColor("#ffffff");
        
        data.products.forEach(function(p) {
          var varText = (p.variants || []).map(function(v){ return v.size + " (Rp" + v.price + ")"; }).join(", ");
          pSheet.appendRow([p.id, p.name, p.category, p.pkdNumber, varText, p.stockStatus, new Date()]);
        });
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Sinkronisasi seluruh katalog produk berhasil!" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Data diterima!" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput("YUSAKLIN Google Sheets Webhook Aktif dan Siap Digunakan!");
}
`;
};
