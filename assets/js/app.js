const demoAssets = [
  { id: "AST-000001", tag: "D.01", name: "Dust Test Chamber", model: "UC Tech", location: "Diagnostic & Material Lab", status: "Berfungsi", calibration: "15 Ogos 2026" },
  { id: "AST-000002", tag: "D.02", name: "IPX1/2 Drip Box Tester", model: "Shen Zhen Autostrong", location: "Diagnostic & Material Lab", status: "Berfungsi", calibration: "22 September 2026" },
  { id: "AST-000003", tag: "D.06", name: "Digital Caliper", model: "Mitutoyo 500-155-30", location: "Diagnostic & Material Lab", status: "Kalibrasi", calibration: "Tamat tempoh" },
  { id: "AST-000004", tag: "B.14", name: "Digital Caliper", model: "Mitutoyo 500-155-30", location: "Circuit Breaker Lab", status: "Rosak", calibration: "—" },
  { id: "AST-000005", tag: "D.07", name: "Platform Scale", model: "KERN IFB 600K-2", location: "Diagnostic & Material Lab", status: "Berfungsi", calibration: "03 November 2026" },
];

const modules = {
  assets: {
    title: "Daftar Aset", eyebrow: "REKOD INDUK", heading: "Semua aset dalam satu rekod tersusun",
    description: "Daftar, cari dan semak profil penuh setiap peralatan.",
    button: "Daftar aset baharu",
    columns: ["No. aset", "Peralatan", "Penempatan", "Status", "Kalibrasi", "Tindakan"],
    rows: demoAssets.map((a) => [a.id, `<div class="asset-name"><strong>${a.name}</strong><small>${a.tag} · ${a.model}</small></div>`, a.location, badge(a.status), a.calibration, `<button class="link" data-toast="Profil ${a.id} akan dibuka">Lihat profil →</button>`]),
    fields: [
      ["Nama peralatan", "asset_name"], ["Tag peralatan", "equipment_tag"], ["No. siri", "serial_no"],
      ["Model / jenama", "brand_model"], ["Penempatan", "current_location", "select", ["Diagnostic & Material Lab", "Circuit Breaker Lab", "Makmal Lain"]],
      ["Status", "asset_status", "select", ["Berfungsi", "Rosak", "Dalam Penyelenggaraan", "Kalibrasi"]], ["Kegunaan peralatan", "usage_description", "textarea", [], true],
    ],
  },
  maintenance: {
    title: "Penyelenggaraan", eyebrow: "KEADAAN PERALATAN", heading: "Pastikan aset sentiasa bersedia digunakan",
    description: "Rekod aduan kerosakan, kerja pembaikan, vendor dan kos.",
    button: "Tambah rekod penyelenggaraan",
    columns: ["ID rekod", "Aset", "Tarikh", "Jenis kerja", "Vendor", "Kos", "Status"],
    rows: [
      ["MNT-00031", "Dust Test Chamber", "25 Jul 2026", "Pemeriksaan berkala", "ATSE Solutions", "RM 750.00", badge("Selesai")],
      ["MNT-00030", "Digital Caliper", "21 Jul 2026", "Pembaikan", "Non Stop Power Services", "RM 1,235.00", badge("Dalam tindakan")],
    ],
    fields: recordFields("maintenance", ["Pemeriksaan berkala", "Pembaikan", "Servis"]),
  },
  calibration: {
    title: "Kalibrasi", eyebrow: "PEMATUHAN", heading: "Jejaki tarikh kalibrasi tanpa terlepas tempoh",
    description: "Simpan keputusan, sijil dan tarikh kalibrasi seterusnya.",
    button: "Tambah rekod kalibrasi",
    columns: ["ID kalibrasi", "Aset", "Tarikh", "Keputusan", "Sijil", "Kalibrasi seterusnya", "Status"],
    rows: [
      ["CAL-00018", "Digital Caliper · D.06", "18 Jul 2026", "Lulus", `<a class="link" href="#" data-toast="Pautan Google Drive belum ditetapkan">Buka sijil</a>`, "18 Jul 2027", badge("Sah")],
      ["CAL-00017", "Platform Scale · D.07", "03 Nov 2025", "Lulus", "—", "03 Nov 2026", badge("Akan tamat")],
    ],
    fields: [["Aset", "asset_id", "select", demoAssets.map(a => `${a.id} — ${a.name}`)], ["Tarikh kalibrasi", "calibration_date", "date"], ["Keputusan", "result", "select", ["Lulus", "Gagal", "Bersyarat"]], ["No. sijil", "certificate_no"], ["Tarikh seterusnya", "next_calibration_date", "date"], ["Pautan sijil Google Drive", "certificate_url", "url", [], true]],
  },
  movements: {
    title: "Penempatan & Pergerakan", eyebrow: "JEJAK LOKASI", heading: "Ketahui lokasi semasa setiap aset",
    description: "Rekod lokasi asal, lokasi baharu, penghantar dan penerima.",
    button: "Rekod pergerakan",
    columns: ["ID", "Aset", "Dari", "Ke", "Tarikh", "Penerima", "Status"],
    rows: [["MOV-00012", "Digital Caliper · D.06", "Store MPE", "Diagnostic & Material Lab", "28 Jul 2026", "Ahmad Faiz", badge("Diterima")]],
    fields: [["Aset", "asset_id", "select", demoAssets.map(a => `${a.id} — ${a.name}`)], ["Lokasi asal", "from_location"], ["Lokasi baharu", "to_location"], ["Tarikh pergerakan", "movement_date", "date"], ["Pegawai menyerah", "released_by"], ["Pegawai menerima", "received_by"], ["Tujuan", "purpose", "textarea", [], true]],
  },
  usage: {
    title: "Rekod Penggunaan", eyebrow: "LOG OPERASI", heading: "Rekod siapa menggunakan aset dan tujuannya",
    description: "Daftar masa keluar, masa pulang dan keadaan selepas penggunaan.",
    button: "Daftar penggunaan",
    columns: ["ID", "Aset", "Pengguna", "Tujuan", "Masa keluar", "Masa pulang", "Status"],
    rows: [["USE-00042", "Dust Test Chamber", "Nur Izzati", "Ujian IP", "29 Jul · 09:15", "29 Jul · 11:40", badge("Dipulangkan")]],
    fields: [["Aset", "asset_id", "select", demoAssets.map(a => `${a.id} — ${a.name}`)], ["Nama pengguna", "user_name"], ["Tujuan", "purpose"], ["Masa keluar", "check_out", "datetime-local"], ["Masa pulang", "check_in", "datetime-local"], ["Keadaan selepas digunakan", "condition_after", "select", ["Baik", "Rosak", "Perlu diperiksa"]]],
  },
  disposals: {
    title: "Pelupusan Aset", eyebrow: "KITAR HAYAT ASET", heading: "Urus pelupusan tanpa memadam sejarah aset",
    description: "Rekod sebab, kaedah, kelulusan dan dokumen pelupusan.",
    button: "Mohon pelupusan",
    columns: ["ID", "Aset", "Sebab", "Kaedah", "Tarikh mohon", "Status", "Dokumen"],
    rows: [["DSP-00004", "Air Compressor", "Tidak ekonomik dibaiki", "E-waste", "12 Jul 2026", badge("Menunggu kelulusan"), "—"]],
    fields: [["Aset", "asset_id", "select", demoAssets.map(a => `${a.id} — ${a.name}`)], ["Sebab pelupusan", "reason", "textarea"], ["Kaedah", "method", "select", ["E-waste", "Jualan", "Musnah", "Pindahan"]], ["Tarikh permohonan", "request_date", "date"], ["Pautan dokumen Google Drive", "document_url", "url", [], true]],
  },
  manuals: {
    title: "Manual Operasi", eyebrow: "RUJUKAN KERJA", heading: "Manual yang betul, terus pada aset yang betul",
    description: "Simpan pautan Google Drive dan hubungkan satu manual kepada beberapa aset.",
    button: "Tambah manual",
    columns: ["ID manual", "Nama manual", "Model / kategori", "Versi", "Aset dipautkan", "Tarikh kemas kini", "Fail"],
    rows: [
      ["MAN-00001", "Manual Operasi Dust Test Chamber", "UC Tech", "2.1", "1 aset", "20 Jul 2026", `<a class="link" href="#" data-toast="Pautan Google Drive belum ditetapkan">Buka PDF →</a>`],
      ["MAN-00002", "Manual Digital Caliper 500 Series", "Mitutoyo", "1.4", "2 aset", "18 Jul 2026", `<a class="link" href="#" data-toast="Pautan Google Drive belum ditetapkan">Buka PDF →</a>`],
    ],
    fields: [["Nama manual", "manual_name"], ["Model / kategori", "model_category"], ["Versi", "version"], ["Pautan fail Google Drive", "drive_url", "url"], ["Aset berkaitan", "asset_id", "select", demoAssets.map(a => `${a.id} — ${a.name}`), true]],
  },
};

function badge(status) {
  const text = status.toLowerCase();
  const tone = text.includes("rosak") || text.includes("gagal") ? "red" : text.includes("tamat") || text.includes("tindakan") || text.includes("menunggu") || text.includes("kalibrasi") ? "amber" : text.includes("sah") ? "blue" : "green";
  return `<span class="badge ${tone}">${status}</span>`;
}

function recordFields(prefix, types) {
  return [["Aset", "asset_id", "select", demoAssets.map(a => `${a.id} — ${a.name}`)], ["Tarikh", `${prefix}_date`, "date"], ["Jenis kerja", "work_type", "select", types], ["Vendor / syarikat", "vendor"], ["Kos (RM)", "cost", "number"], ["Catatan", "notes", "textarea", [], true]];
}

function renderDashboard() {
  return `
    <div class="hero">
      <div><p class="eyebrow">RINGKASAN HARI INI · 29 JULAI 2026</p><h2>Pantau keadaan aset dan tindakan yang perlu dibuat.</h2><p>Data demo berdasarkan struktur fail master aset. Sambungkan Google Sheets untuk data sebenar.</p></div>
      <button class="button" data-open-form="assets">＋ Daftar aset baharu</button>
    </div>
    <div class="kpi-grid">
      ${kpi("Jumlah aset", "173", "▦", "Semua aset berdaftar", "#dff1eb")}
      ${kpi("Berfungsi", "142", "✓", "<strong>82%</strong> daripada semua aset", "#dff1eb")}
      ${kpi("Perlu perhatian", "21", "!", "Rosak atau diselenggara", "#fff1dd")}
      ${kpi("Kalibrasi ≤ 30 hari", "10", "◎", "3 sudah tamat tempoh", "#fae9e9")}
    </div>
    <div class="dashboard-grid">
      <section class="panel"><div class="panel-header"><div><h3>Aset mengikut lokasi</h3><p>Taburan enam lokasi utama</p></div><a class="link" href="#assets">Lihat aset →</a></div>
        <div class="bar-chart">
          ${bar("Diagnostic", 58, 92)}${bar("Circuit Breaker", 35, 65)}${bar("Store MPE", 28, 52)}${bar("Material", 21, 42)}${bar("HV Lab", 17, 34)}${bar("Lain-lain", 14, 28)}
        </div>
      </section>
      <section class="panel"><div class="panel-header"><div><h3>Status keseluruhan</h3><p>Keadaan semasa aset</p></div></div>
        <div class="status-ring"><span>173<small>jumlah aset</small></span></div>
        <div class="legend">
          ${legend("Berfungsi", "142", "#176b55")}${legend("Penyelenggaraan", "21", "#c97816")}${legend("Rosak", "10", "#c24f4f")}
        </div>
      </section>
      <section class="panel"><div class="panel-header"><div><h3>Aktiviti terkini</h3><p>Kemas kini daripada semua modul</p></div><button class="link" data-toast="Semua aktiviti akan dipaparkan selepas API disambung">Lihat semua</button></div>
        <div class="activity-list">
          ${activity("⇄", "Aset D.06 dipindahkan", "Store MPE → Diagnostic & Material Lab", "12 min")}
          ${activity("◎", "Sijil kalibrasi ditambah", "Digital Caliper · CAL-00018", "1 jam")}
          ${activity("⌁", "Penyelenggaraan selesai", "Dust Test Chamber · MNT-00031", "3 jam")}
        </div>
      </section>
      <section class="panel"><div class="panel-header"><div><h3>Tindakan segera</h3><p>Keutamaan untuk pegawai aset</p></div></div>
        <div class="activity-list">
          ${activity("!", "3 kalibrasi tamat tempoh", "Perlu jadualkan vendor", "Tinggi")}
          ${activity("♲", "1 pelupusan menunggu", "Semakan dan kelulusan", "Sederhana")}
          ${activity("▤", "12 aset tiada manual", "Pautkan dokumen Drive", "Rendah")}
        </div>
      </section>
    </div>`;
}

function kpi(label, value, icon, foot, tint) { return `<article class="kpi-card" style="--card-tint:${tint}"><div class="kpi-head"><span>${label}</span><span class="kpi-icon">${icon}</span></div><div class="kpi-value">${value}</div><div class="kpi-foot">${foot}</div></article>`; }
function bar(label, value, height) { return `<div class="bar-column"><span class="bar-value">${value}</span><div class="bar" style="height:${height}%"></div><span class="bar-label">${label}</span></div>`; }
function legend(label, value, color) { return `<div class="legend-row" style="--dot:${color}"><span>${label}</span><strong>${value}</strong></div>`; }
function activity(icon, title, detail, time) { return `<div class="activity"><span class="activity-icon">${icon}</span><div><strong>${title}</strong><small>${detail}</small></div><time>${time}</time></div>`; }

function renderModule(moduleKey) {
  const m = modules[moduleKey];
  return `<div class="hero"><div><p class="eyebrow">${m.eyebrow}</p><h2>${m.heading}</h2><p>${m.description}</p></div><button class="button" data-open-form="${moduleKey}">＋ ${m.button}</button></div>
    <div class="module-toolbar"><label class="search-field"><span>⌕</span><input class="table-search" type="search" placeholder="Cari dalam modul ini..."></label><select class="filter-select"><option>Semua status</option><option>Berfungsi</option><option>Perlu tindakan</option></select><button class="button secondary" data-toast="Fungsi eksport tersedia selepas Google Sheets disambung">⇩ Eksport</button></div>
    <section class="panel table-panel"><table class="data-table"><thead><tr>${m.columns.map(c => `<th>${c}</th>`).join("")}</tr></thead><tbody>${m.rows.map(row => `<tr>${row.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></section>`;
}

function makeForm(moduleKey) {
  const m = modules[moduleKey];
  document.querySelector("#modalTitle").textContent = m.button;
  document.querySelector("#recordForm").innerHTML = m.fields.map(([label, name, type = "text", options = [], full = false]) => {
    let control;
    if (type === "select") control = `<select name="${name}" required><option value="">Pilih...</option>${options.map(o => `<option>${o}</option>`).join("")}</select>`;
    else if (type === "textarea") control = `<textarea name="${name}" rows="3" required></textarea>`;
    else control = `<input type="${type}" name="${name}" required>`;
    return `<label class="field ${full ? "full" : ""}">${label}${control}</label>`;
  }).join("") + `<div class="form-actions"><button type="button" class="button secondary" data-close-modal>Batal</button><button type="submit" class="button">Simpan rekod</button></div>`;
  document.querySelector("#recordForm").dataset.module = moduleKey;
  document.querySelector("#modal").hidden = false;
  document.querySelector("#recordForm input, #recordForm select")?.focus();
}

function route() {
  const routeName = location.hash.replace("#", "") || "dashboard";
  const validRoute = routeName === "dashboard" || modules[routeName] ? routeName : "dashboard";
  document.querySelector("#pageTitle").textContent = validRoute === "dashboard" ? "Dashboard" : modules[validRoute].title;
  document.querySelector("#app").innerHTML = validRoute === "dashboard" ? renderDashboard() : renderModule(validRoute);
  document.querySelectorAll("[data-route]").forEach(a => a.classList.toggle("active", a.dataset.route === validRoute));
  document.querySelector("#sidebar").classList.remove("open");
}

function toast(message) {
  const el = document.querySelector("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

document.addEventListener("click", (event) => {
  const formButton = event.target.closest("[data-open-form]");
  if (formButton) makeForm(formButton.dataset.openForm);
  if (event.target.closest("[data-close-modal], #modalClose")) document.querySelector("#modal").hidden = true;
  const toastButton = event.target.closest("[data-toast]");
  if (toastButton) { event.preventDefault(); toast(toastButton.dataset.toast); }
});
document.querySelector("#recordForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const payload = Object.fromEntries(new FormData(form));
  try {
    await AssetAPI.request(`create_${form.dataset.module}`, payload);
    document.querySelector("#modal").hidden = true;
    form.reset();
    toast(window.ASET_CONFIG.USE_DEMO_DATA ? "Rekod demo berjaya disimpan." : "Rekod berjaya disimpan ke Google Sheets.");
  } catch (error) { toast(error.message); }
});
document.querySelector("#menuButton").addEventListener("click", () => document.querySelector("#sidebar").classList.toggle("open"));
document.querySelector("#globalSearch").addEventListener("keydown", (event) => {
  if (event.key === "Enter") { location.hash = "assets"; setTimeout(() => { const input = document.querySelector(".table-search"); if (input) { input.value = event.target.value; input.dispatchEvent(new Event("input")); } }, 50); }
});
document.addEventListener("input", (event) => {
  if (!event.target.matches(".table-search")) return;
  const query = event.target.value.toLowerCase();
  document.querySelectorAll(".data-table tbody tr").forEach(row => row.hidden = !row.textContent.toLowerCase().includes(query));
});
window.addEventListener("hashchange", route);
route();
