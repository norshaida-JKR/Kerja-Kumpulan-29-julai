/**
 * ============================================================
 * api.js — Jambatan antara website ini dengan Google Sheets
 * ============================================================
 * SEMUA modul (Modul 1 - 5) guna fail ini untuk baca/tulis data.
 * Jangan ubah fail ini kecuali BASE_URL — supaya semua ahli
 * kekal guna cara yang sama.
 *
 * LANGKAH WAJIB:
 * Selepas deploy Apps Script (lihat apps-script/Code.gs),
 * tampal URL Web App di sini:
 */
const BASE_URL = 'PASTE_URL_WEB_APP_APPS_SCRIPT_DI_SINI';

/**
 * Dapatkan semua rekod dari satu tab/sheet.
 * @param {string} sheetName - contoh: 'SenaraiAset', 'Penyelenggaraan'
 * @param {string} [idAset] - jika diisi, tapis ikut ID Aset
 * @returns {Promise<Array<Object>>}
 */
async function getData(sheetName, idAset) {
  let url = `${BASE_URL}?sheet=${encodeURIComponent(sheetName)}`;
  if (idAset) url += `&idAset=${encodeURIComponent(idAset)}`;

  const res = await fetch(url);
  const json = await res.json();

  if (!json.ok) {
    console.error('Ralat getData:', json.error);
    throw new Error(json.error || 'Gagal ambil data.');
  }
  return json.data;
}

/**
 * Tambah satu rekod baru ke satu tab/sheet.
 * @param {string} sheetName - contoh: 'SenaraiAset'
 * @param {Object} record - contoh: { Nama: 'Komputer Riba', Kategori: 'ICT' }
 * @returns {Promise<Object>} - hasil { ok, message, idAset }
 */
async function postData(sheetName, record) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    // text/plain elak isu CORS preflight dengan Apps Script
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ sheet: sheetName, data: record })
  });
  const json = await res.json();

  if (!json.ok) {
    console.error('Ralat postData:', json.error);
    throw new Error(json.error || 'Gagal simpan data.');
  }
  return json;
}

/**
 * Bantuan kecil: papar mesej status pada mana-mana elemen halaman.
 * @param {HTMLElement} el
 * @param {string} msg
 * @param {'ok'|'error'} type
 */
function showStatus(el, msg, type = 'ok') {
  el.textContent = msg;
  el.className = 'status-msg ' + (type === 'ok' ? 'status-ok' : 'status-error');
}
