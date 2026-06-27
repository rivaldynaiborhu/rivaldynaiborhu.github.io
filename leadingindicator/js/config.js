// ============================================
// KONFIGURASI UTAMA
// Ubah password atau URL Apps Script di sini
// ============================================

const SITE_PASSWORD = 'Ponkelaku';

const CATEGORIES = {
  'axa': {
    label: 'AXA',
    url: 'https://script.google.com/macros/s/AKfycbw71iFt8TIJnI3hc93Wn8oxA_lqN6_n6fnkKfSjUcw2rB0C1sX3cKiP87lneViElcI46g/exec',
    icon: 'bi-shield-check'
  },
  'retail-funding': {
    label: 'Retail Funding',
    url: 'https://script.google.com/macros/s/AKfycbz4z5lCTH2IML6LX60HwXu6kyfRGfVQpjMq7NHl2M6uYoQ8xbX413lpfn2NXIQBni8G/exec',
    icon: 'bi-piggy-bank'
  },
  'tbr': {
    label: 'TBR',
    url: 'https://script.google.com/macros/s/AKfycbzhzTSnrz4P_eFhlaeBbQzaadA2LDnAoO55lg_erSa83EEW_3qpiAk6MsVWsU03nIMH/exec',
    icon: 'bi-bank'
  },
  'tbw': {
    label: 'TBW',
    url: 'https://script.google.com/macros/s/AKfycbw33cFTkBuXmS426DjLGgGRFWnUVSi697ENKwpcS2nB_KIl4kyfRp4JzXycMNd0fiNkJw/exec',
    icon: 'bi-bank2'
  },
  'wealth': {
    label: 'Wealth',
    url: 'https://script.google.com/macros/s/AKfycbwie7UUw0wxRkItQJoQQ91fKD11cAgwMgOm6C3QetGJojsJmNl7Lw9nS0ttVneru1ljIA/exec',
    icon: 'bi-gem'
  }
};

/** Ambil konfigurasi kategori berdasarkan slug, atau null jika tidak ada */
function getCategory(slug) {
  return CATEGORIES[slug] || null;
}

/** Cek apakah user sudah login untuk kategori tertentu (per tab/session browser) */
function isAuthenticated(slug) {
  return sessionStorage.getItem('auth_' + slug) === '1';
}

/** Set status login untuk kategori tertentu */
function setAuthenticated(slug) {
  sessionStorage.setItem('auth_' + slug, '1');
}

/** Hapus status login untuk kategori tertentu */
function clearAuthenticated(slug) {
  sessionStorage.removeItem('auth_' + slug);
}

/** Ambil parameter dari query string URL, misal ?cat=axa */
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}
