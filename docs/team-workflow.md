# Pembahagian kerja lima ahli

| Ahli | Branch | Modul |
|---|---|---|
| 1 — Ketua integrasi | `feature/dashboard-assets` | Dashboard, daftar aset, profil aset dan integrasi |
| 2 | `feature/maintenance-calibration` | Status, penyelenggaraan dan kalibrasi |
| 3 | `feature/movements-placement` | Penempatan dan pergerakan |
| 4 | `feature/usage-disposal` | Penggunaan dan pelupusan |
| 5 | `feature/manuals-apps-script` | Manual operasi, Google Drive dan Apps Script API |

## Cara bekerja

1. Ambil satu Issue yang belum mempunyai pemilik.
2. Cipta branch modul daripada `main`.
3. Commit kecil dengan mesej seperti `feat: tambah borang kalibrasi`.
4. Uji pada telefon dan komputer.
5. Buka Pull Request ke `main`.
6. Minta sekurang-kurangnya seorang ahli menyemak.
7. Ketua integrasi menggabungkan Pull Request.

## Sempadan fail

- Ahli tidak boleh mengubah `assets/js/api.js`, `apps-script/Code.gs` atau
  struktur tab Sheets tanpa perbincangan.
- Perubahan gaya bersama dibuat melalui Pull Request berasingan.
- Nama medan mesti sama seperti `docs/database-schema.md`.
- Jangan simpan ID Google Sheet, kata laluan atau token dalam GitHub.

## Definition of done

- Borang mempunyai validasi.
- Senarai boleh dicari.
- Keadaan kosong dan ralat dipaparkan.
- Paparan berfungsi pada lebar 360 px.
- Data menggunakan ID stabil.
- Tiada data sensitif dalam commit.
