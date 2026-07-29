# Skema pangkalan data ASET MPE

Google Sheets digunakan sebagai pangkalan data. Setiap tab ialah satu jadual.
`asset_id` ialah kunci hubungan antara rekod dan tidak boleh diubah selepas
dihasilkan.

## Hubungan data

```text
ASSETS.asset_id
 ├── MAINTENANCE.asset_id
 ├── CALIBRATION.asset_id
 ├── MOVEMENTS.asset_id
 ├── USAGE_LOG.asset_id
 └── DISPOSALS.asset_id

ASSETS.manual_id → MANUALS.manual_id
```

## Peraturan

1. Jangan gunakan nombor baris sebagai ID.
2. Jangan padam aset yang telah dilupuskan; tukar `asset_status` kepada
   `Dilupuskan`.
3. Pergerakan yang diterima perlu mengemas kini `ASSETS.current_location`.
4. Semua fail PDF disimpan di Google Drive. Sheets hanya menyimpan pautan.
5. Pilihan status dan lokasi datang daripada tab `LOOKUPS`.
6. Setiap perubahan dicatat dalam `AUDIT_LOG`.
7. Tarikh disimpan sebagai nilai tarikh sebenar, bukan teks.

## Migrasi fail master

Fail asal mempunyai satu baris bagi setiap aset dan lajur kalibrasi mengikut
tahun. Semasa migrasi:

- satu baris aset dipindahkan ke `ASSETS`;
- setiap kejadian kalibrasi dipindahkan sebagai baris tersendiri dalam
  `CALIBRATION`;
- setiap kejadian pembaikan dipindahkan sebagai baris tersendiri dalam
  `MAINTENANCE`;
- tag ruang, tag peralatan, model, nombor siri, perolehan dan pendaftaran aset
  dikekalkan.
