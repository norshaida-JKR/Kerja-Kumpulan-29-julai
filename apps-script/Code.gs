/**
 * ============================================================
 * SISTEM PENGURUSAN ASET - API (Google Apps Script)
 * ============================================================
 * Fail ini diletakkan DALAM Google Sheet (Extensions > Apps Script),
 * BUKAN dalam repo GitHub. Ia bertindak sebagai "API" yang
 * membenarkan website (di GitHub Pages) baca & tulis data terus
 * ke Google Sheet ini.
 *
 * CARA SETUP:
 * 1. Buka Google Sheet database projek ini.
 * 2. Extensions > Apps Script.
 * 3. Padam kod default, tampal SEMUA kod dalam fail ini.
 * 4. Pastikan nama tab (sheet) dalam Google Sheet SAMA PERSIS
 *    dengan senarai SHEET_NAMES di bawah. Kalau belum ada, buat
 *    tab baru & baris pertama (header) ikut senarai lajur di bawah.
 * 5. Klik "Deploy" > "New deployment" > pilih type "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Salin URL Web App yang diberi (contoh:
 *    https://script.google.com/macros/s/XXXXXXXX/exec)
 * 7. Tampal URL tersebut ke dalam js/api.js (BASE_URL) di repo GitHub.
 * ============================================================
 */

// Senarai tab (sheet) & lajur header untuk setiap satu.
// Baris pertama setiap tab MESTI sama dengan senarai ini.
const SHEET_NAMES = {
  SenaraiAset:      ['IDAset', 'Nama', 'Kategori', 'NoPendaftaran', 'TarikhDaftar', 'StatusSemasa', 'LokasiSemasa'],
  StatusAset:       ['IDAset', 'Status', 'TarikhKemaskini', 'Catatan'],
  Penyelenggaraan:  ['IDAset', 'TarikhServis', 'Jenis', 'Vendor', 'Kos', 'Nota'],
  Pelupusan:        ['IDAset', 'TarikhLulus', 'Sebab', 'NoKelulusan'],
  Penempatan:       ['IDAset', 'Lokasi', 'TarikhMula'],
  Pergerakan:       ['IDAset', 'Dari', 'Ke', 'Tarikh', 'DiluluskanOleh'],
  Penggunaan:       ['IDAset', 'TarikhGuna', 'Pengguna', 'Tujuan'],
  ManualOperation:  ['IDAset', 'LinkManual', 'Versi']
};

/**
 * GET request — baca data.
 * Contoh panggilan dari website:
 *   ?sheet=SenaraiAset                -> semua rekod dalam tab SenaraiAset
 *   ?sheet=Penyelenggaraan&idAset=A001 -> tapis ikut IDAset
 */
function doGet(e) {
  try {
    const sheetName = e.parameter.sheet;
    if (!sheetName || !SHEET_NAMES[sheetName]) {
      return jsonResponse({ ok: false, error: 'Nama sheet tidak sah. Guna: ' + Object.keys(SHEET_NAMES).join(', ') });
    }

    const rows = readSheet(sheetName);
    let data = rows;

    // Tapis ikut IDAset jika parameter idAset dihantar
    if (e.parameter.idAset) {
      data = rows.filter(row => String(row.IDAset) === String(e.parameter.idAset));
    }

    return jsonResponse({ ok: true, sheet: sheetName, count: data.length, data: data });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

/**
 * POST request — tambah rekod baru.
 * Body (JSON) contoh:
 * {
 *   "sheet": "SenaraiAset",
 *   "data": { "Nama": "Komputer Riba", "Kategori": "ICT", ... }
 * }
 * IDAset akan dijana automatik jika tidak dihantar.
 */
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const sheetName = body.sheet;
    const record = body.data;

    if (!sheetName || !SHEET_NAMES[sheetName]) {
      return jsonResponse({ ok: false, error: 'Nama sheet tidak sah. Guna: ' + Object.keys(SHEET_NAMES).join(', ') });
    }
    if (!record || typeof record !== 'object') {
      return jsonResponse({ ok: false, error: 'Data tidak sah.' });
    }

    // Jana IDAset automatik untuk pendaftaran aset baru jika kosong
    if (sheetName === 'SenaraiAset' && !record.IDAset) {
      record.IDAset = generateNewAssetId();
    }
    if (!record.IDAset) {
      return jsonResponse({ ok: false, error: 'IDAset diperlukan.' });
    }

    appendRow(sheetName, record);
    return jsonResponse({ ok: true, message: 'Rekod berjaya disimpan.', idAset: record.IDAset });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

// ------------------------------------------------------------
// Fungsi bantuan (helper) — tidak perlu diubah
// ------------------------------------------------------------

function getSheet_(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error('Tab "' + sheetName + '" tidak wujud dalam Google Sheet ini.');
  return sheet;
}

function readSheet(sheetName) {
  const sheet = getSheet_(sheetName);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0];
  return values.slice(1)
    .filter(row => row.some(cell => cell !== '')) // buang baris kosong
    .map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i]; });
      return obj;
    });
}

function appendRow(sheetName, record) {
  const sheet = getSheet_(sheetName);
  const headers = SHEET_NAMES[sheetName];
  const row = headers.map(h => record[h] !== undefined ? record[h] : '');
  sheet.appendRow(row);
}

// Jana No. Pendaftaran / ID Aset baru automatik: AST-0001, AST-0002, ...
function generateNewAssetId() {
  const rows = readSheet('SenaraiAset');
  let maxNum = 0;
  rows.forEach(r => {
    const match = String(r.IDAset).match(/(\d+)$/);
    if (match) maxNum = Math.max(maxNum, parseInt(match[1], 10));
  });
  const next = String(maxNum + 1).padStart(4, '0');
  return 'AST-' + next;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
