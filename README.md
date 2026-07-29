# Sistem Pengurusan Aset — Kerja Kumpulan 29 Julai

Website pengurusan aset menggunakan **Google Sheets** sebagai pangkalan data dan **GitHub Pages** sebagai hosting (percuma, tanpa server).

## Cara Ia Berfungsi

```
Website (GitHub Pages)  →  fetch()  →  Google Apps Script (Web App)  →  Google Sheets
```

Google Sheet menyimpan semua data. Google Apps Script (kod dalam `apps-script/Code.gs`) bertindak sebagai "API" yang membenarkan website baca & tulis data ke Sheet tersebut. Staf hanya perlu key-in melalui borang di website — tidak perlu sentuh Google Sheet terus.

## Langkah Setup (buat oleh 1 orang — Ketua Kumpulan)

### 1. Sediakan Google Sheet
1. Buat satu Google Sheet baru.
2. Buat 8 tab dengan nama **tepat** seperti berikut, dan isi baris pertama (header) mengikut senarai lajur:

| Nama Tab | Lajur (baris 1) |
|---|---|
| `SenaraiAset` | IDAset, Nama, Kategori, NoPendaftaran, TarikhDaftar, StatusSemasa, LokasiSemasa |
| `StatusAset` | IDAset, Status, TarikhKemaskini, Catatan |
| `Penyelenggaraan` | IDAset, TarikhServis, Jenis, Vendor, Kos, Nota |
| `Pelupusan` | IDAset, TarikhLulus, Sebab, NoKelulusan |
| `Penempatan` | IDAset, Lokasi, TarikhMula |
| `Pergerakan` | IDAset, Dari, Ke, Tarikh, DiluluskanOleh |
| `Penggunaan` | IDAset, TarikhGuna, Pengguna, Tujuan |
| `ManualOperation` | IDAset, LinkManual, Versi |

### 2. Sediakan Apps Script (API)
1. Dalam Google Sheet tadi: **Extensions > Apps Script**.
2. Padam kod sedia ada, salin-tampal kandungan `apps-script/Code.gs` (dalam repo ini).
3. **Deploy > New deployment > Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Salin URL yang diberikan (`https://script.google.com/macros/s/.../exec`).

### 3. Sambungkan Website ke Apps Script
1. Buka `js/api.js` dalam repo GitHub ini.
2. Tampal URL Apps Script tadi ke pemboleh ubah `BASE_URL`.
3. Commit & push.

### 4. Aktifkan GitHub Pages
1. Repo Settings > Pages.
2. Source: branch `main`, folder `/ (root)`.
3. Website akan live di `https://norshaida-jkr.github.io/Kerja-Kumpulan-29-julai/`.

## Struktur Folder

```
├── index.html                      ← Dashboard utama
├── css/style.css                   ← Reka bentuk (kongsi semua halaman)
├── js/api.js                       ← Sambungan ke Google Sheets (JANGAN ubah BASE_URL kecuali setup)
├── pages/
│   ├── pendaftaran.html             ← Modul 1
│   ├── status-penempatan.html       ← Modul 2
│   ├── penyelenggaraan.html         ← Modul 3
│   ├── pelupusan-penggunaan.html    ← Modul 4
│   └── manual-dashboard.html        ← Modul 5
└── apps-script/Code.gs             ← Letak dalam Google Sheet (bukan di-push ke website)
```

## Pembahagian Tugasan (5 Ahli)

| Ahli | Modul | Fail |
|---|---|---|
| Ahli 1 | Pendaftaran & Senarai Aset | `pages/pendaftaran.html` |
| Ahli 2 | Status, Penempatan & Pergerakan Aset | `pages/status-penempatan.html` |
| Ahli 3 | Penyelenggaraan & Kalibrasi | `pages/penyelenggaraan.html` |
| Ahli 4 | Pelupusan & Rekod Penggunaan | `pages/pelupusan-penggunaan.html` |
| Ahli 5 | Manual Operation & Carian Rekod Aset | `pages/manual-dashboard.html` |

Setiap fail **sudah berfungsi** (boleh key-in & papar data) — ahli boleh terus perbaiki reka bentuk, tambah medan (field), atau tambah ciri tambahan mengikut keperluan modul masing-masing.

## Cara Kerja Berpasukan (Git)

1. Setiap ahli buat branch sendiri:
   ```
   git checkout -b modul1-pendaftaran
   ```
2. Kerja **hanya** dalam fail modul sendiri (elak konflik dengan ahli lain).
3. Commit & push branch:
   ```
   git add .
   git commit -m "Siapkan modul pendaftaran aset"
   git push origin modul1-pendaftaran
   ```
4. Buka **Pull Request** di GitHub → Ketua kumpulan semak → **Merge** ke `main`.
5. Jangan edit terus di branch `main` untuk elak pertindihan kerja.

## Nota Penting

- `IDAset` (No. Pendaftaran) dijana **automatik** oleh sistem (format `AST-0001`, `AST-0002`, ...) — tidak perlu key-in manual.
- Semua modul dipautkan melalui `IDAset` yang sama — ini yang membolehkan "link aset dengan manual operation" dan carian rekod merentasi semua modul (lihat Modul 5).
- Jika data tidak muncul di website, semak dahulu sama ada `BASE_URL` dalam `js/api.js` sudah betul dan deployment Apps Script masih aktif.
