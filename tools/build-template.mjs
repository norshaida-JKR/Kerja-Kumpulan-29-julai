import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const workbook = Workbook.create();
const navy = "#123C32";
const green = "#176B55";
const mint = "#DFF1EB";
const pale = "#F3F6F5";
const line = "#DDE6E2";

const schemas = {
  ASSETS: [
    "asset_id", "registration_no", "room_tag", "equipment_tag", "asset_name",
    "brand_model", "serial_no", "usage_description", "asset_status",
    "size_capacity", "manufacture_year", "purchase_price", "purchase_year",
    "acquisition_method", "contract_registration", "supplier",
    "current_location", "custodian", "manual_id", "disposal_status",
    "created_at", "updated_at", "created_by",
  ],
  MAINTENANCE: [
    "maintenance_id", "asset_id", "maintenance_date", "work_type", "vendor",
    "cost", "notes", "next_maintenance_date", "status", "document_url",
    "created_at", "updated_at", "created_by",
  ],
  CALIBRATION: [
    "calibration_id", "asset_id", "calibration_date", "result",
    "certificate_no", "certificate_url", "calibration_item",
    "calibration_interval", "calibration_range", "condition_before",
    "next_calibration_date", "notes", "created_at", "updated_at", "created_by",
  ],
  MOVEMENTS: [
    "movement_id", "asset_id", "from_location", "to_location",
    "movement_date", "released_by", "received_by", "purpose", "status",
    "created_at", "updated_at", "created_by",
  ],
  USAGE_LOG: [
    "usage_id", "asset_id", "user_name", "purpose", "check_out", "check_in",
    "condition_after", "notes", "created_at", "updated_at", "created_by",
  ],
  DISPOSALS: [
    "disposal_id", "asset_id", "reason", "method", "request_date",
    "disposal_date", "approval_status", "document_url", "notes",
    "created_at", "updated_at", "created_by",
  ],
  MANUALS: [
    "manual_id", "manual_name", "model_category", "version", "drive_url",
    "file_id", "status", "created_at", "updated_at", "created_by",
  ],
  USERS: [
    "user_id", "name", "email", "role", "department", "status",
    "created_at", "updated_at",
  ],
  AUDIT_LOG: [
    "audit_id", "timestamp", "user_email", "action", "module",
    "record_id", "detail",
  ],
};

const readme = workbook.worksheets.add("README");
readme.showGridLines = false;
readme.getRange("A1:H2").merge();
readme.getRange("A1").values = [["ASET MPE — Templat Pangkalan Data"]];
readme.getRange("A1:H2").format = {
  fill: navy,
  font: { bold: true, color: "#FFFFFF", size: 18 },
  verticalAlignment: "center",
};
readme.getRange("A4:B11").values = [
  ["Langkah", "Arahan"],
  ["1", "Muat naik fail ini ke Google Drive dan buka sebagai Google Sheets."],
  ["2", "Jangan ubah nama tab atau tajuk lajur tanpa menyelaraskan Apps Script."],
  ["3", "Gunakan asset_id sebagai penghubung semua rekod."],
  ["4", "Jangan padam aset yang dilupuskan; tukar status kepada Dilupuskan."],
  ["5", "Simpan dokumen di Drive dan rekodkan pautannya sahaja."],
  ["6", "Gunakan tab LOOKUPS untuk pilihan dropdown."],
  ["7", "Lindungi tab AUDIT_LOG daripada suntingan staf biasa."],
];
readme.getRange("A4:B4").format = { fill: green, font: { bold: true, color: "#FFFFFF" } };
readme.getRange("A4:B11").format.borders = { preset: "inside", style: "thin", color: line };
readme.getRange("A4:A11").format.columnWidth = 12;
readme.getRange("B4:B11").format.columnWidth = 72;
readme.getRange("B5:B11").format.wrapText = true;
readme.getRange("A13:H14").merge();
readme.getRange("A13").values = [["Fail master asal perlu dimigrasikan: satu baris ASSETS bagi setiap peralatan, dan satu baris CALIBRATION / MAINTENANCE bagi setiap kejadian."]];
readme.getRange("A13:H14").format = { fill: mint, font: { color: navy }, wrapText: true, verticalAlignment: "center" };
readme.freezePanes.freezeRows(2);

for (const [name, headers] of Object.entries(schemas)) {
  const sheet = workbook.worksheets.add(name);
  sheet.showGridLines = false;
  sheet.getRangeByIndexes(0, 0, 1, headers.length).values = [headers];
  sheet.getRangeByIndexes(0, 0, 1, headers.length).format = {
    fill: navy,
    font: { bold: true, color: "#FFFFFF" },
    rowHeight: 28,
    wrapText: true,
  };
  sheet.getRangeByIndexes(1, 0, 20, headers.length).format = {
    fill: "#FFFFFF",
    borders: { preset: "inside", style: "thin", color: line },
  };
  sheet.getRangeByIndexes(1, 0, 20, 1).format.fill = pale;
  sheet.getRangeByIndexes(0, 0, 21, headers.length).format.columnWidth = 18;
  headers.forEach((header, index) => {
    const range = sheet.getRangeByIndexes(1, index, 20, 1);
    if (header.includes("date") || header.includes("_at") || header === "timestamp") {
      range.format.numberFormat = "yyyy-mm-dd hh:mm";
    }
    if (header === "cost" || header === "purchase_price") range.format.numberFormat = '"RM" #,##0.00';
    if (header.includes("url") || header === "detail" || header.includes("description") || header === "notes") {
      range.format.columnWidth = 30;
      range.format.wrapText = true;
    }
  });
  sheet.freezePanes.freezeRows(1);
  sheet.tables.add(
    sheet.getRangeByIndexes(0, 0, 21, headers.length).address,
    true,
    `${name.replace(/_/g, "")}Table`,
  ).style = "TableStyleMedium4";
}

const lookup = workbook.worksheets.add("LOOKUPS");
lookup.showGridLines = false;
lookup.getRange("A1:F6").values = [
  ["asset_status", "maintenance_status", "calibration_result", "movement_status", "disposal_status", "user_role"],
  ["Berfungsi", "Baharu", "Lulus", "Dalam proses", "Menunggu kelulusan", "Pentadbir"],
  ["Rosak", "Dalam tindakan", "Gagal", "Diterima", "Diluluskan", "Pegawai aset"],
  ["Dalam Penyelenggaraan", "Selesai", "Bersyarat", "Dibatalkan", "Ditolak", "Staf"],
  ["Kalibrasi", "Dibatalkan", "", "", "Selesai", "Pembaca"],
  ["Dilupuskan", "", "", "", "", ""],
];
lookup.getRange("A1:F1").format = { fill: navy, font: { bold: true, color: "#FFFFFF" }, wrapText: true };
lookup.getRange("A1:F20").format.columnWidth = 23;
lookup.getRange("A2:F20").format.borders = { preset: "inside", style: "thin", color: line };
lookup.freezePanes.freezeRows(1);

workbook.worksheets.getItem("ASSETS").getRange("I2:I21").dataValidation = {
  rule: { type: "list", formula1: "LOOKUPS!$A$2:$A$6" },
};
workbook.worksheets.getItem("MAINTENANCE").getRange("I2:I21").dataValidation = {
  rule: { type: "list", formula1: "LOOKUPS!$B$2:$B$5" },
};
workbook.worksheets.getItem("CALIBRATION").getRange("D2:D21").dataValidation = {
  rule: { type: "list", formula1: "LOOKUPS!$C$2:$C$4" },
};
workbook.worksheets.getItem("MOVEMENTS").getRange("I2:I21").dataValidation = {
  rule: { type: "list", formula1: "LOOKUPS!$D$2:$D$4" },
};
workbook.worksheets.getItem("DISPOSALS").getRange("G2:G21").dataValidation = {
  rule: { type: "list", formula1: "LOOKUPS!$E$2:$E$5" },
};
workbook.worksheets.getItem("USERS").getRange("D2:D21").dataValidation = {
  rule: { type: "list", formula1: "LOOKUPS!$F$2:$F$5" },
};

await fs.mkdir("templates", { recursive: true });
await fs.mkdir("tools/previews", { recursive: true });

for (const sheetName of ["README", ...Object.keys(schemas), "LOOKUPS"]) {
  const preview = await workbook.render({
    sheetName,
    autoCrop: "all",
    scale: 0.8,
    format: "png",
  });
  await fs.writeFile(
    `tools/previews/${sheetName}.png`,
    new Uint8Array(await preview.arrayBuffer()),
  );
}

const inspection = await workbook.inspect({
  kind: "sheet,table",
  maxChars: 6000,
  tableMaxRows: 4,
  tableMaxCols: 8,
});
console.log(inspection.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save("templates/ASET-MPE-Google-Sheets-Template.xlsx");
