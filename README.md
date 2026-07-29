# ASET MPE

Sistem pengurusan aset mudah alih untuk merekod pendaftaran, status,
penyelenggaraan, kalibrasi, penempatan, pergerakan, penggunaan, pelupusan dan
manual operasi.

## Seni bina

- Website responsif: HTML, CSS dan JavaScript, diterbitkan melalui GitHub Pages.
- Pangkalan data: Google Sheets.
- API: Google Apps Script.
- Manual dan sijil: Google Drive.

Website bermula dalam mod demo. Data demo membolehkan semua ahli membangunkan
modul tanpa menunggu sambungan Google Sheets.

## Lihat website

Buka `index.html` atau jalankan pelayan statik tempatan.

## Sambungkan Google Sheets

1. Import `templates/ASET-MPE-Google-Sheets-Template.xlsx` ke Google Drive dan
   pilih **Open with Google Sheets**.
2. Dalam Google Sheet, buka **Extensions → Apps Script**.
3. Salin `apps-script/Code.gs` dan `apps-script/appsscript.json`.
4. Dalam **Project Settings → Script Properties**, tambah `SPREADSHEET_ID`.
5. Deploy sebagai **Web app**.
6. Salin URL deployment ke `assets/js/config.js`.
7. Tukar `USE_DEMO_DATA` kepada `false`.

Untuk penggunaan sebenar, hadkan akses deployment kepada organisasi atau
tambahkan pengesahan pengguna sebelum memproses data sensitif.

## GitHub Pages

Dalam repositori GitHub, buka **Settings → Pages**, pilih **Deploy from a
branch**, kemudian gunakan branch `main` dan folder `/ (root)`.

## Dokumentasi

- [Skema pangkalan data](docs/database-schema.md)
- [Kontrak API](docs/api-contract.md)
- [Aliran kerja lima ahli](docs/team-workflow.md)
