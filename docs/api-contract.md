# Kontrak Google Apps Script API

Semua permintaan menggunakan `POST` dan badan JSON.

```json
{
  "action": "list_assets",
  "payload": {}
}
```

## Tindakan

| Tindakan | Tujuan |
|---|---|
| `dashboard` | Dapatkan angka ringkasan |
| `list_assets` | Senarai aset |
| `create_assets` | Daftar aset |
| `update_assets` | Kemas kini aset |
| `list_maintenance` | Senarai penyelenggaraan |
| `create_maintenance` | Tambah penyelenggaraan |
| `list_calibration` | Senarai kalibrasi |
| `create_calibration` | Tambah kalibrasi |
| `list_movements` | Senarai pergerakan |
| `create_movements` | Tambah pergerakan |
| `list_usage` | Senarai penggunaan |
| `create_usage` | Tambah penggunaan |
| `list_disposals` | Senarai pelupusan |
| `create_disposals` | Mohon pelupusan |
| `list_manuals` | Senarai manual |
| `create_manuals` | Tambah manual |

Respons berjaya:

```json
{ "ok": true, "data": [] }
```

Respons gagal:

```json
{ "ok": false, "message": "Keterangan ralat" }
```
