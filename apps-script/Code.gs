/**
 * ASET MPE — Google Apps Script API
 * 1. Cipta Google Sheet daripada template yang dibekalkan.
 * 2. Extensions > Apps Script, salin fail dalam folder ini.
 * 3. Project Settings > Script Properties:
 *    SPREADSHEET_ID = ID Google Sheet
 * 4. Deploy > New deployment > Web app.
 */

const SHEET_MAP = {
  assets: "ASSETS",
  maintenance: "MAINTENANCE",
  calibration: "CALIBRATION",
  movements: "MOVEMENTS",
  usage: "USAGE_LOG",
  disposals: "DISPOSALS",
  manuals: "MANUALS",
};

function doGet() {
  return jsonResponse_({
    ok: true,
    service: "ASET MPE API",
    timestamp: new Date().toISOString(),
  });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const request = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    const action = String(request.action || "");
    const payload = request.payload || {};

    if (action === "dashboard") return jsonResponse_({ ok: true, data: getDashboard_() });
    if (action.startsWith("list_")) return jsonResponse_({ ok: true, data: listRecords_(action.slice(5)) });
    if (action.startsWith("create_")) return jsonResponse_({ ok: true, data: createRecord_(action.slice(7), payload) });
    if (action.startsWith("update_")) return jsonResponse_({ ok: true, data: updateRecord_(action.slice(7), payload) });

    return jsonResponse_({ ok: false, message: "Tindakan API tidak dikenali." });
  } catch (error) {
    return jsonResponse_({ ok: false, message: error.message });
  } finally {
    lock.releaseLock();
  }
}

function spreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  if (!id) throw new Error("SPREADSHEET_ID belum ditetapkan dalam Script Properties.");
  return SpreadsheetApp.openById(id);
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function sheetFor_(moduleName) {
  const sheetName = SHEET_MAP[moduleName];
  if (!sheetName) throw new Error("Modul tidak sah.");
  const sheet = spreadsheet_().getSheetByName(sheetName);
  if (!sheet) throw new Error("Tab " + sheetName + " tidak dijumpai.");
  return sheet;
}

function headers_(sheet) {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    .map(function (value) { return String(value).trim(); });
}

function listRecords_(moduleName) {
  const sheet = sheetFor_(moduleName);
  const headers = headers_(sheet);
  if (sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues()
    .filter(function (row) { return row[0] !== ""; })
    .map(function (row) {
      return headers.reduce(function (record, header, index) {
        record[header] = row[index];
        return record;
      }, {});
    });
}

function createRecord_(moduleName, payload) {
  const sheet = sheetFor_(moduleName);
  const headers = headers_(sheet);
  const idHeader = headers[0];
  const now = new Date();
  const record = Object.assign({}, payload);
  record[idHeader] = nextId_(sheet, prefixFor_(moduleName));
  if (headers.indexOf("created_at") >= 0) record.created_at = now;
  if (headers.indexOf("updated_at") >= 0) record.updated_at = now;
  if (headers.indexOf("created_by") >= 0) record.created_by = Session.getActiveUser().getEmail() || "web-user";

  validateRecord_(moduleName, record);
  sheet.appendRow(headers.map(function (header) { return record[header] === undefined ? "" : record[header]; }));
  appendAudit_("CREATE", moduleName, record[idHeader], record);
  return record;
}

function updateRecord_(moduleName, payload) {
  const sheet = sheetFor_(moduleName);
  const headers = headers_(sheet);
  const idHeader = headers[0];
  const id = payload[idHeader];
  if (!id) throw new Error("ID rekod diperlukan.");

  const ids = sheet.getRange(2, 1, Math.max(sheet.getLastRow() - 1, 1), 1).getValues().flat();
  const index = ids.indexOf(id);
  if (index < 0) throw new Error("Rekod tidak dijumpai.");

  const rowNumber = index + 2;
  const current = sheet.getRange(rowNumber, 1, 1, headers.length).getValues()[0];
  const record = headers.reduce(function (result, header, column) {
    result[header] = payload[header] === undefined ? current[column] : payload[header];
    return result;
  }, {});
  if (headers.indexOf("updated_at") >= 0) record.updated_at = new Date();

  validateRecord_(moduleName, record);
  sheet.getRange(rowNumber, 1, 1, headers.length).setValues([
    headers.map(function (header) { return record[header]; }),
  ]);
  appendAudit_("UPDATE", moduleName, id, payload);
  return record;
}

function nextId_(sheet, prefix) {
  const props = PropertiesService.getScriptProperties();
  const key = "COUNTER_" + prefix;
  let current = Number(props.getProperty(key) || 0);
  if (!current && sheet.getLastRow() > 1) {
    current = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues()
      .flat()
      .map(function (id) { return Number(String(id).split("-").pop()) || 0; })
      .reduce(function (max, value) { return Math.max(max, value); }, 0);
  }
  current += 1;
  props.setProperty(key, String(current));
  return prefix + "-" + String(current).padStart(6, "0");
}

function prefixFor_(moduleName) {
  return {
    assets: "AST", maintenance: "MNT", calibration: "CAL",
    movements: "MOV", usage: "USE", disposals: "DSP", manuals: "MAN",
  }[moduleName];
}

function validateRecord_(moduleName, record) {
  if (moduleName !== "assets" && moduleName !== "manuals" && !record.asset_id) {
    throw new Error("Aset mesti dipilih.");
  }
  if (moduleName === "assets" && !record.asset_name) throw new Error("Nama aset diperlukan.");
  if (record.asset_status && ["Berfungsi", "Rosak", "Dalam Penyelenggaraan", "Kalibrasi", "Dilupuskan"].indexOf(record.asset_status) < 0) {
    throw new Error("Status aset tidak sah.");
  }
}

function appendAudit_(action, moduleName, recordId, detail) {
  const sheet = spreadsheet_().getSheetByName("AUDIT_LOG");
  if (!sheet) return;
  sheet.appendRow([
    Utilities.getUuid(),
    new Date(),
    Session.getActiveUser().getEmail() || "web-user",
    action,
    moduleName,
    recordId,
    JSON.stringify(detail),
  ]);
}

function getDashboard_() {
  const assets = listRecords_("assets");
  const today = new Date();
  const in30Days = new Date(today.getTime() + 30 * 86400000);
  const calibrations = listRecords_("calibration");
  return {
    total: assets.length,
    functioning: assets.filter(function (item) { return item.asset_status === "Berfungsi"; }).length,
    damaged: assets.filter(function (item) { return item.asset_status === "Rosak"; }).length,
    maintenance: assets.filter(function (item) { return item.asset_status === "Dalam Penyelenggaraan"; }).length,
    calibrationDue: calibrations.filter(function (item) {
      const due = new Date(item.next_calibration_date);
      return !isNaN(due) && due <= in30Days;
    }).length,
  };
}
