# Data Center — Versi HTML/CSS/JS Murni (Tanpa Server)

Website ini menampilkan data dari 5 spreadsheet Google Sheets (AXA, Retail Funding, TBR, TBW, Wealth) lewat Google Apps Script yang sudah Anda buat. Tidak butuh PHP, XAMPP, atau server apapun — cukup buka file `index.html` 2x klik di browser.

## 1. Cara menjalankan

1. Ekstrak ZIP ini ke folder mana saja di laptop Anda, misalnya `Documents\DataCenter`.
2. Buka folder tersebut, lalu **double klik `index.html`**.
3. Browser default Anda akan terbuka dan menampilkan dashboard 5 menu kategori.

Tidak perlu install apa pun. Selama laptop terhubung ke internet (untuk mengambil data dari Google Apps Script dan memuat ikon/font dari CDN), website ini akan berjalan normal.

## 2. Login

- Klik salah satu kategori (misalnya **AXA**).
- Masukkan password: **Ponkelaku**
- Anda akan diarahkan ke halaman data dengan tab per sheet, kotak pencarian, dan tombol **Download Excel**.

## 3. Bagaimana cara kerjanya (tanpa server)

- **Mengambil data**: halaman langsung memanggil URL Web App Google Apps Script Anda dari browser (`fetch()`), sama seperti membuka URL itu langsung di address bar.
- **Password**: dicek di JavaScript yang berjalan di browser Anda. Status "sudah login" disimpan sementara di `sessionStorage` — otomatis hilang begitu tab/browser ditutup, jadi Anda akan diminta password lagi di sesi berikutnya.
- **Download Excel**: dibuat langsung di browser menggunakan library [SheetJS](https://sheetjs.com) (dimuat dari CDN), tanpa perlu generate di server.

## 4. Catatan tentang keamanan password

Karena tidak ada server, password **"Ponkelaku"** tersimpan sebagai teks biasa di file `js/config.js`. Siapapun yang membuka file itu dengan text editor bisa membacanya. Ini cocok untuk **mencegah orang awam membuka data secara tidak sengaja**, tapi bukan keamanan yang serius. Jika Anda butuh keamanan sungguhan (misalnya data ini sensitif dan harus benar-benar dibatasi), sebaiknya:
- Gunakan otentikasi asli di sisi Google Apps Script (cek token/login Google), atau
- Gunakan versi berbasis server (PHP/Node) dengan password tersimpan di server, bukan di browser.

## 5. Mengganti password atau URL Apps Script

Edit file `js/config.js`:

```js
const SITE_PASSWORD = 'Ponkelaku';   // ganti password di sini

const CATEGORIES = {
  'axa': {
    label: 'AXA',
    url: 'https://script.google.com/macros/s/XXXXX/exec',  // ganti URL di sini jika re-deploy
    icon: 'bi-shield-check'
  },
  // ...dst
};
```

Simpan file, lalu refresh browser (tidak perlu setup ulang apapun).

## 6. Struktur file

```
project-html/
├── index.html        -> Dashboard 5 menu kategori
├── login.html         -> Halaman password per kategori
├── data.html           -> Halaman tab + tabel + search + download
├── css/
│   └── theme.css        -> Tema gelap biru
└── js/
    ├── config.js         -> Password, daftar URL Apps Script, helper session
    └── data.js           -> Logic fetch data, render tabel, search, export Excel
```

## 7. Troubleshooting

### "Terjadi kesalahan saat memuat data" / tabel tidak muncul

Kemungkinan sebab:
1. **Tidak ada koneksi internet** — cek koneksi laptop.
2. **URL Apps Script sudah tidak aktif** — buka Google Sheets > Extensions > Apps Script > Deploy > Manage deployments, pastikan masih ada deployment aktif dan URL-nya sama dengan yang di `js/config.js`.
3. **Browser memblokir request** — sangat jarang terjadi untuk Apps Script karena sudah didesain bisa diakses dari domain manapun, tapi jika terjadi, coba buka URL Apps Script itu langsung di tab baru (`...exec?action=list`) untuk memastikan responnya muncul sebagai JSON.

### Ikon atau font tidak muncul / tampilan polos

Berarti laptop sedang offline saat membuka halaman (ikon dan font dimuat dari CDN internet). Tabel data tetap akan berfungsi, hanya tampilannya yang menjadi sederhana.

### Lupa password

Edit `js/config.js`, baris `SITE_PASSWORD`.

### Tombol download tidak men-download apa-apa

Pastikan ada data yang sedang tampil di tabel (bukan hasil pencarian yang kosong). Coba hapus kata di kotak pencarian dulu, lalu klik Download Excel lagi.
