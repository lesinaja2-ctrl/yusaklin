import { Product, LegalDocument, SiteSettings, ClientTestimonial } from '../types';

export const initialSiteSettings: SiteSettings = {
  brandName: 'YUSAKLIN',
  companyName: 'CV YUSA KARYA INDONESIA',
  tagline: 'Solusi Bersih Higienis, Hemat & Terpercaya untuk Rumah Tangga & Industri',
  establishmentDate: '22 Mei 2017',
  address: 'Jalan Yos Sudarso No.260 Batang, Jawa Tengah 51211',
  phone: '0812-2577-8899',
  whatsappNumber: '6281225778899',
  email: 'yusakaryaindonesia@gmail.com',
  operationalHours: 'Senin - Sabtu: 08.00 - 17.00 WIB',
  logoUrl: '/icon.svg',
  heroHeadline: 'Produsen Sabun & Pembersih Higienis Bersertifikasi Resmi',
  heroSubheadline: 'CV YUSA KARYA INDONESIA memproduksi aneka deterjen, pembersih lantai, sabun cuci piring, dan chemical higienis berkualitas pabrik untuk rumah tangga, laundry, Horeka, dan rumah sakit.',
  heroImageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
  themeColor: 'teal',
  googleSheetsUrl: '',
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15844.75704929828!2d109.721415!3d-6.899052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e702517f8a9e701%3A0x6b8764032a9ba942!2sJl.%20Yos%20Sudarso%2C%20Batang%2C%20Kec.%20Batang%2C%20Kabupaten%20Batang%2C%20Jawa%20Tengah!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
  socials: {
    instagram: 'https://instagram.com/yusaklin.official',
    facebook: 'https://facebook.com/yusakaryaindonesia',
    tiktok: 'https://tiktok.com/@yusaklin',
    shopee: 'https://shopee.co.id/yusaklin_official',
    tokopedia: 'https://tokopedia.com/yusaklin'
  },
  adminPin: '170522', // tanggal berdiri 22 Mei 2017
  sectionsVisibility: {
    hero: true,
    catalog: true,
    legal: true,
    about: true,
    reseller: true,
    testimonials: true,
    contact: true
  }
};

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Sabun Cuci Piring Ekstra Jeruk Nipis',
    category: 'rumah-tangga',
    tagline: 'Angkat Lemak Membandel Seketika & Lembut di Tangan',
    description: 'Sabun cuci piring konsentrat tinggi dengan formula active degreaser dan ekstrak jeruk nipis asli. Busa melimpah, cepat membilas tanpa meninggalkan bau amis pada piring, wajan berminyak, maupun wadah plastik.',
    features: [
      'Ekstra ekstrak jeruk nipis murni',
      'Formula anti-lemak membandel & anti-bau amis',
      'pH seimbang, aman dan lembut di kulit tangan',
      'Lebih hemat: 1 tetes untuk mencuci banyak perabot'
    ],
    usageInstructions: 'Larutkan 1 sendok teh Yusaklin Cuci Piring ke dalam mangkuk berisi 200ml air bersih. Remas spons hingga berbusa, usapkan pada perabot lalu bilas hingga kesat.',
    pkdNumber: 'KEMENKES RI PKD 20301710123',
    imageUrl: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=700&q=80',
    variants: [
      { size: 'Jerigen 5 Liter', price: 45000, wholesalePrice: 38000, minWholesaleQty: 5 },
      { size: 'Botol Pump 1 Liter', price: 14000, wholesalePrice: 11000, minWholesaleQty: 12 },
      { size: 'Pouch Refill 450ml', price: 7500, wholesalePrice: 5800, minWholesaleQty: 24 }
    ],
    aromaVariants: ['Jeruk Nipis Fresh', 'Lemon Segar'],
    isFeatured: true,
    stockStatus: 'ready',
    activeIngredients: 'Linear Alkylbenzene Sulfonate 14%, Sodium Lauryl Ether Sulfate, Lime Extract',
    pH: '6.5 - 7.5'
  },
  {
    id: 'prod-2',
    name: 'Deterjen Liquid Laundry Matic (Low Foam)',
    category: 'laundry',
    tagline: 'Khusus Mesin Cuci Bukaan Depan & Atas, Bersih Cemerlang Tanpa Residu',
    description: 'Deterjen cair laundry konsentrat dengan teknologi rendah busa (low foam) yang aman untuk modul elektronik mesin cuci matic. Mengandung optical brightener yang menjaga serat kain tetap awet dan warna baju tetap cerah.',
    features: [
      'Busa terkontrol (aman untuk mesin cuci front load & top load)',
      'Teknologi Deep Clean menembus serat kain terdalam',
      'Mencegah bau apek saat jemur di dalam ruangan',
      'Mengandung formula anti-redeposisi kotoran'
    ],
    usageInstructions: 'Gunakan 35-50ml deterjen untuk 6-7 kg cucian kotor. Tuangkan ke laci deterjen mesin cuci. Untuk noda membandel, oleskan sedikit deterjen langsung ke atas noda sebelum dicuci.',
    pkdNumber: 'KEMENKES RI PKD 20202710145',
    imageUrl: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=700&q=80',
    variants: [
      { size: 'Jerigen 5 Liter', price: 48000, wholesalePrice: 39000, minWholesaleQty: 5 },
      { size: 'Drum 20 Liter', price: 180000, wholesalePrice: 155000, minWholesaleQty: 2 },
      { size: 'Botol 1 Liter', price: 15000, wholesalePrice: 12000, minWholesaleQty: 12 }
    ],
    aromaVariants: ['Floral Blue Blossom', 'Ocean Breeze', 'Sakura Blossom'],
    isFeatured: true,
    stockStatus: 'ready',
    activeIngredients: 'Surfactant Non-ionik & Anionik 16%, Protease Enzyme, Anti-redeposition agent',
    pH: '7.0 - 8.0'
  },
  {
    id: 'prod-3',
    name: 'Pembersih Lantai Karbol Wangi Antibakterial',
    category: 'rumah-tangga',
    tagline: 'Lantai Mengkilap, Harum Segar Sepanjang Hari & Bebas Kuman 99.9%',
    description: 'Cairan pembersih lantai dengan formula ganda: membersihkan noda minyak dan debu lantai sekaligus membasmi kuman dan bakteri patogen. Cepat kering dan tidak meninggalkan rasa lengket di telapak kaki.',
    features: [
      'Membunuh kuman dan bakteri hingga 99.9%',
      'Cepat kering, kilap seketika dan tidak lengket',
      'Wangi tahan lama hingga 8 jam setelah dipel',
      'Aman untuk berbagai jenis lantai: keramik, granit, marmer, dan vinyl'
    ],
    usageInstructions: 'Campurkan 30ml (1 tutup botol) karbol wangi ke dalam ember berisi 3 liter air. Basahi kain pel, peras, dan pel permukaan lantai secara merata.',
    pkdNumber: 'KEMENKES RI PKD 20501710189',
    imageUrl: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=700&q=80',
    variants: [
      { size: 'Jerigen 5 Liter', price: 42000, wholesalePrice: 35000, minWholesaleQty: 5 },
      { size: 'Botol 1 Liter', price: 12500, wholesalePrice: 9500, minWholesaleQty: 12 },
      { size: 'Refill 450ml', price: 6500, wholesalePrice: 4800, minWholesaleQty: 24 }
    ],
    aromaVariants: ['Pine Pinus Hutan', 'Lavender Mewah', 'Apel Manis', 'Lemon Sparkling'],
    isFeatured: true,
    stockStatus: 'ready',
    activeIngredients: 'Benzalkonium Chloride 1.5%, Pine Oil, Non-ionic surfactant',
    pH: '6.5 - 7.5'
  },
  {
    id: 'prod-4',
    name: 'Softener & Pewangi Pakaian Konsentrat',
    category: 'laundry',
    tagline: 'Serat Pakaian Lembut, Mudah Disetrika & Wangi Mewah Tahan Lama',
    description: 'Pelembut dan pewangi pakaian khusus laundry komersial maupun rumah tangga. Mengandung encapsulation fragrance yang melepaskan aroma harum saat pakaian bergesekan atau dipakai seharian.',
    features: [
      'Teknologi mikro-kapsul wangi tahan hingga 14 hari',
      'Melembutkan serat kain katun, denim, sprei, dan handuk',
      'Mengurangi kusut sehingga menyetrika 2x lebih cepat',
      'Mencegah timbulnya listrik statis pada pakaian'
    ],
    usageInstructions: 'Pada bilasan terakhir, tuangkan 30ml softener untuk 5 kg pakaian. Rendam selama 5-10 menit, peras tanpa perlu dibilas lagi dengan air.',
    pkdNumber: 'KEMENKES RI PKD 20203710210',
    imageUrl: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=700&q=80',
    variants: [
      { size: 'Jerigen 5 Liter', price: 50000, wholesalePrice: 42000, minWholesaleQty: 5 },
      { size: 'Botol 1 Liter', price: 15500, wholesalePrice: 12500, minWholesaleQty: 12 }
    ],
    aromaVariants: ['Mystique Royale', 'Morning Fresh', 'Sweet Romance', 'Downy Passion'],
    isFeatured: true,
    stockStatus: 'ready',
    activeIngredients: 'Dialkyl Ester Dimethyl Ammonium Chloride 8%, Parfum Encapsulated',
    pH: '5.0 - 6.0'
  },
  {
    id: 'prod-5',
    name: 'Hand Soap Antiseptik Fresh Floral',
    category: 'horeka',
    tagline: 'Perlindungan Kuman dengan Ekstrak Pelembab Aloe Vera',
    description: 'Sabun cuci tangan cair yang diformulasikan khusus untuk dispenser hotel, restoran, kantor, klinik, dan toilet umum. Busa melimpah membersihkan kotoran dan minyak tanpa mengeringkan kulit.',
    features: [
      'Bahan antiseptik efektif basmi bakteri kuman',
      'Diperkaya pelembab Aloe Vera & Vitamin E',
      'Busa lembut dan wangi elegan floral',
      'Konsistensi kental tidak boros di pompa dispenser'
    ],
    usageInstructions: 'Tuangkan sedikit sabun pada telapak tangan yang telah dibasahi. Gosok secara menyeluruh sela-sela jari dan punggung tangan selama 20 detik, lalu bilas hingga bersih.',
    pkdNumber: 'KEMENKES RI PKD 20501710235',
    imageUrl: 'https://images.unsplash.com/photo-1608248597359-00f682855593?auto=format&fit=crop&w=700&q=80',
    variants: [
      { size: 'Jerigen 5 Liter', price: 45000, wholesalePrice: 37000, minWholesaleQty: 5 },
      { size: 'Botol Pump 500ml', price: 13500, wholesalePrice: 10000, minWholesaleQty: 12 }
    ],
    aromaVariants: ['Strawberry Sweet', 'Apple Fresh', 'Floral Garden', 'Melon Splash'],
    isFeatured: false,
    stockStatus: 'ready',
    activeIngredients: 'Chloroxylenol, SLES, Glycerin, Aloe Vera Leaf Extract',
    pH: '6.0 - 7.0'
  },
  {
    id: 'prod-6',
    name: 'Karbol Sereh Alami Pengusir Serangga',
    category: 'horeka',
    tagline: 'Minyak Sereh Murni Alami, Basmi Bau & Usir Nyamuk Serta Kecoa',
    description: 'Formula tradisional modern dengan minyak sereh (citronella oil) alami bermutu tinggi. Sangat diminati rumah makan, warung makan, hotel, dan peternakan untuk menghilangkan bau pesing, mengusir lalat, nyamuk, dan kecoa secara aman.',
    features: [
      '100% Minyak Sereh (Citronella Oil) murni pilihan',
      'Aroma alami sangat efektif mengusir lalat, kecoa, dan semut',
      'Sangat ampuh melenyapkan bau pesing di toilet umum & saluran air',
      'Ramah lingkungan dan tidak meninggalkan residu beracun'
    ],
    usageInstructions: 'Untuk lantai: campurkan 30ml karbol sereh ke 2 liter air. Untuk saluran air atau tempat sampah yang berbau: siramkan langsung 100ml tanpa diencerkan.',
    pkdNumber: 'KEMENKES RI PKD 20502710311',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=700&q=80',
    variants: [
      { size: 'Jerigen 5 Liter', price: 47000, wholesalePrice: 39000, minWholesaleQty: 5 },
      { size: 'Botol 1 Liter', price: 14000, wholesalePrice: 11000, minWholesaleQty: 12 }
    ],
    aromaVariants: ['Citronella Sereh Alami'],
    isFeatured: false,
    stockStatus: 'ready',
    activeIngredients: 'Citronella Oil murni, Emulsifier Nabati, Pine Extract',
    pH: '6.5 - 7.5'
  },
  {
    id: 'prod-7',
    name: 'Glass Cleaner Crystal Shine',
    category: 'horeka',
    tagline: 'Kaca Bening Berkilau Tanpa Bekas Goresan & Debu Anti-Menempel',
    description: 'Cairan pembersih kaca dengan formula anti-static dan crystal clean. Menghilangkan noda minyak, bekas sidik jari, dan asap pada kaca gedung, etalase toko, cermin hotel, dan kaca mobil.',
    features: [
      'Formula cepat menguap tanpa meninggalkan bekas goresan (streak-free)',
      'Efek anti-static memperlambat debu menempel kembali',
      'Aman untuk kaca film mobil dan cermin kamar mandi',
      'Aroma segar menyegarkan ruangan'
    ],
    usageInstructions: 'Semprotkan Glass Cleaner ke permukaan kaca dari jarak 20 cm. Seka menggunakan wiper karet atau kain microfiber kering hingga bening berkilau.',
    pkdNumber: 'KEMENKES RI PKD 20302710280',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=80',
    variants: [
      { size: 'Jerigen 5 Liter', price: 40000, wholesalePrice: 33000, minWholesaleQty: 5 },
      { size: 'Botol Spray 500ml', price: 12000, wholesalePrice: 9000, minWholesaleQty: 12 }
    ],
    aromaVariants: ['Ocean Blue Fresh'],
    isFeatured: false,
    stockStatus: 'ready',
    activeIngredients: 'Isopropanol 5%, Surfactant Anionik, Anti-dust agent',
    pH: '7.0 - 8.0'
  },
  {
    id: 'prod-8',
    name: 'Heavy Duty Kitchen Degreaser',
    category: 'horeka',
    tagline: 'Penghancur Kerak Minyak & Lemak Gosong Dapur Komersial',
    description: 'Cairan pembersih alkali kuat khusus peralatan dapur restoran, catering, dan hotel. Melarutkan kerak minyak hangus pada exhaust hood kompor gas, frypan, oven, deep fryer, dan dinding keramik berminyak tebal.',
    features: [
      'Reaksi cepat melarutkan lemak jenuh & kerak gosong membandel',
      'Menghemat tenaga gosok hingga 80% pada dapur resto',
      'Non-korosif pada stainless steel food grade dengan pembilasan benar',
      'Formula konsentrat bisa diencerkan sesuai tingkat keparahan kerak'
    ],
    usageInstructions: 'Semprotkan atau oleskan langsung ke area berkerak gosong, diamkan 5-10 menit hingga lemak melunak. Gosok dengan tapas kasar lalu bilas air hingga bersih.',
    pkdNumber: 'KEMENKES RI PKD 20301710405',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=700&q=80',
    variants: [
      { size: 'Jerigen 5 Liter', price: 65000, wholesalePrice: 55000, minWholesaleQty: 5 },
      { size: 'Botol 1 Liter', price: 20000, wholesalePrice: 16500, minWholesaleQty: 12 }
    ],
    aromaVariants: ['Original Unscented'],
    isFeatured: false,
    stockStatus: 'ready',
    activeIngredients: 'Potassium Hydroxide solution, Glycol Ether, Penetrating agents',
    pH: '11.5 - 12.5'
  },
  {
    id: 'prod-9',
    name: 'Hospital Disinfectant & Sanitizing Liquid',
    category: 'medis',
    tagline: 'Standar Rumah Sakit, Basmi Patogen Bakteri, Virus & Jamur',
    description: 'Cairan disinfektan medis serbaguna untuk sterilisasi lantai ruang perawatan, meja periksa, handle pintu, ambulans, dan peralatan non-kritis klinik. Teruji membunuh mikroorganisme spektrum luas.',
    features: [
      'Uji efikasi membunuh Staphylococcus, E. coli, Salmonella, dan Candida',
      'Non-corrosive dan tidak merusak bahan vinil rumah sakit',
      'Formula bebas klorin tajam (tidak menyebabkan iritasi pernafasan)',
      'Standar akreditasi higienitas fasilitas pelayanan kesehatan'
    ],
    usageInstructions: 'Encerkan 20ml ke dalam 1 liter air bersih. Aplikasikan dengan kain lap microfiber atau mopping pada permukaan, biarkan kontak basah selama minimal 3 menit.',
    pkdNumber: 'KEMENKES RI PKD 20502710499',
    imageUrl: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=700&q=80',
    variants: [
      { size: 'Jerigen 5 Liter', price: 75000, wholesalePrice: 65000, minWholesaleQty: 5 },
      { size: 'Drum 20 Liter', price: 270000, wholesalePrice: 235000, minWholesaleQty: 2 }
    ],
    aromaVariants: ['Hospital Clean', 'Fresh Mint Clean'],
    isFeatured: true,
    stockStatus: 'ready',
    activeIngredients: 'Dual Quaternary Ammonium Compound 3.0%, Glutaraldehyde trace, Stabilizer',
    pH: '6.5 - 7.5'
  },
  {
    id: 'prod-10',
    name: 'Shampoo Mobil & Motor High Foam Wash & Wax',
    category: 'industri-otomotif',
    tagline: 'Busa Salju Melimpah, Cat Mengkilap & Efek Daun Talas Wet Look',
    description: 'Shampoo cuci kendaraan formula busa salju tebal (snow foam). Mengandung carnauba wax yang melindungi cat kendaraan dari paparan sinar UV dan memberikan efek hydrophobic daun talas.',
    features: [
      'pH netral aman untuk cat original, lapisan coating, dan wrapping stiker',
      'Menghasilkan busa salju kental bila menggunakan foam lance',
      'Mengandung Premium Carnauba Wax untuk kilau wet-look',
      'Mencegah timbulnya baret halus (swirl mark) saat mencuci'
    ],
    usageInstructions: 'Campurkan 30ml shampoo ke dalam 4 liter air untuk cuci manual, atau 100ml per 1 liter tabung foam lance cuci salju bertekanan.',
    pkdNumber: 'KEMENKES RI PKD 20302710520',
    imageUrl: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=700&q=80',
    variants: [
      { size: 'Jerigen 5 Liter', price: 42000, wholesalePrice: 34000, minWholesaleQty: 5 },
      { size: 'Drum 20 Liter', price: 155000, wholesalePrice: 130000, minWholesaleQty: 2 },
      { size: 'Botol 1 Liter', price: 13000, wholesalePrice: 10000, minWholesaleQty: 12 }
    ],
    aromaVariants: ['Bubble Gum', 'Strawberry Sweet'],
    isFeatured: false,
    stockStatus: 'ready',
    activeIngredients: 'Anionic Surfactant, Carnauba Wax Emulsion, Silicone Polymer',
    pH: '7.0'
  }
];

export const initialLegalDocs: LegalDocument[] = [
  {
    id: 'leg-1',
    title: 'Akta Pendirian & Pengesahan Kemenkumham (AHU)',
    category: 'AHU',
    documentNumber: 'AHU-0024912.AH.01.01.TAHUN 2017',
    issuer: 'Kementerian Hukum dan HAM Republik Indonesia',
    issueDate: '22 Mei 2017',
    validUntil: 'Berlaku Selamanya',
    description: 'Legalitas resmi pendirian badan usaha CV YUSA KARYA INDONESIA yang disahkan oleh Notaris dan Menkumham RI sebagai produsen produk kimia pembersih dan perlengkapan higienis.',
    fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=900&q=80',
    verificationUrl: 'https://ahu.go.id',
    isVerified: true
  },
  {
    id: 'leg-2',
    title: 'Nomor Induk Berusaha (NIB) Berbasis Risiko',
    category: 'NIB',
    documentNumber: 'NIB 9120003492811',
    issuer: 'Lembaga OSS - Kementerian Investasi / BKPM RI',
    issueDate: '15 Juni 2018',
    validUntil: 'Berlaku Selama Beroperasi',
    description: 'Izin legal operasional industri manufaktur sabun, deterjen, dan bahan pembersih rumah tangga (KBLI 20231 & 20232) di wilayah Kabupaten Batang, Jawa Tengah.',
    fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=900&q=80',
    verificationUrl: 'https://oss.go.id',
    isVerified: true
  },
  {
    id: 'leg-3',
    title: 'Ijin Edar Perbekalan Kesehatan Rumah Tangga (PKD)',
    category: 'Ijin Edar PKD',
    documentNumber: 'KEMENKES RI PKD 20301710123 / PKD 20501710189',
    issuer: 'Direktorat Jenderal Kefarmasian & Alat Kesehatan Kemenkes RI',
    issueDate: '10 Agustus 2019',
    validUntil: '10 Agustus 2029',
    description: 'Izin edar resmi Perbekalan Kesehatan Rumah Tangga (PKRT) untuk produk Sabun Cuci Piring, Deterjen Liquid, Karbol Pembersih Lantai, dan Hand Soap yang menjamin keamanan konsumen dan lingkungan.',
    fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80',
    verificationUrl: 'https://infoalkes.kemkes.go.id',
    isVerified: true
  },
  {
    id: 'leg-4',
    title: 'Sertifikat Halal Produk & Fasilitas Produksi',
    category: 'Halal',
    documentNumber: 'ID33110000452310822',
    issuer: 'Badan Penyelenggara Jaminan Produk Halal (BPJPH) & MUI',
    issueDate: '14 September 2022',
    validUntil: '14 September 2026',
    description: 'Sertifikasi kehalalan bahan baku kimia, proses pengolahan, dan rantai pasok sabun pembersih CV YUSA KARYA INDONESIA bebas dari unsur najis dan zat haram.',
    fileUrl: 'https://images.unsplash.com/photo-1607703703520-bb638e84caf2?auto=format&fit=crop&w=900&q=80',
    verificationUrl: 'https://halal.go.id',
    isVerified: true
  },
  {
    id: 'leg-5',
    title: 'Sertifikat Hasil Uji Laboratorium Terakreditasi KAN',
    category: 'Uji Lab',
    documentNumber: 'LAB-KAN/KIM-BTG/V/2023/889',
    issuer: 'Balai Riset & Standardisasi Industri (KAN LP-145-IDN)',
    issueDate: '28 Mei 2023',
    validUntil: '28 Mei 2026',
    description: 'Hasil uji laboratorium independen terakreditasi KAN yang membuktikan daya hambat bakteri (zona hambat > 99.9%), biodegradabilitas ramah lingkungan, dan kestabilan formula produk.',
    fileUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=900&q=80',
    verificationUrl: 'https://kan.or.id',
    isVerified: true
  }
];

export const initialTestimonials: ClientTestimonial[] = [
  {
    id: 'test-1',
    clientName: 'Bambang Prasetyo',
    businessName: 'Hotel Batang Pesona Indah',
    businessType: 'Perhotelan (Horeka)',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    quote: 'Kami sudah memakai sabun pembersih lantai, glass cleaner, dan hand soap dari CV YUSA KARYA INDONESIA sejak 2019. Kualitasnya bersaing dengan brand multinasional tapi dengan harga pabrik yang jauh lebih hemat. Layanan antar ke hotel selalu tepat waktu!',
    rating: 5,
    productsUsed: 'Karbol Wangi, Glass Cleaner, Hand Soap Jerigen 5L',
    city: 'Batang, Jawa Tengah'
  },
  {
    id: 'test-2',
    clientName: 'Ibu Ratna Dewi',
    businessName: 'Berkah Laundry Kiloan & Express',
    businessType: 'Usaha Laundry (8 Cabang)',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    quote: 'Deterjen matic low foam Yusaklin beneran bikin mesin cuci awet, cucian bersih tanpa residu putih di kain gelap, dan wangi softenernya tahan sampai baju masuk lemari pelanggan. Sangat merekomendasikan untuk pemilik usaha laundry!',
    rating: 5,
    productsUsed: 'Deterjen Liquid Matic & Softener Royale Jerigen 5L',
    city: 'Pekalongan, Jawa Tengah'
  },
  {
    id: 'test-3',
    clientName: 'H. Suryadi',
    businessName: 'Restoran Seafood Dermaga Batang',
    businessType: 'Restoran & Kuliner Horeka',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    quote: 'Sebagai resto seafood, tantangan terbesar kami adalah bau amis ikan dan wajan berminyak. Sabun cuci piring Yusaklin ampuh sekali meluruhkan lemak santan dan minyak ikan laut, sekali bilas langsung kesat. Terima kasih CV Yusa!',
    rating: 5,
    productsUsed: 'Sabun Cuci Piring Ekstra Jeruk Nipis Jerigen 5L',
    city: 'Batang, Jawa Tengah'
  },
  {
    id: 'test-4',
    clientName: 'dr. Hendra Wicaksono',
    businessName: 'Klinik Pratama Husada Sehat',
    businessType: 'Fasilitas Pelayanan Medis',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
    quote: 'Cairan disinfektan dan hand soap dari Yusaklin sudah memiliki izin edar resmi Kemenkes RI PKD yang valid. Sangat menunjang standar akreditasi kebersihan dan sterilisasi ruangan di klinik kami.',
    rating: 5,
    productsUsed: 'Hospital Disinfectant & Antiseptic Hand Soap',
    city: 'Kendal, Jawa Tengah'
  }
];
