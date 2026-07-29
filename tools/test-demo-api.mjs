import fs from "node:fs";
import vm from "node:vm";

const store = new Map();
const context = {
  window: {
    ASET_CONFIG: { API_URL: "", USE_DEMO_DATA: true },
  },
  localStorage: {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, value),
  },
  Date,
  JSON,
  Number,
};
vm.createContext(context);
vm.runInContext(fs.readFileSync("assets/js/api.js", "utf8"), context);

const before = await context.window.AssetAPI.request("dashboard");
await context.window.AssetAPI.request("create_calibration", {
  asset_id: "AST-000003",
  calibration_date: "2026-07-29",
  result: "Lulus",
  next_calibration_date: "2027-07-29",
});
const after = await context.window.AssetAPI.request("dashboard");

if (before.data.calibrationDue !== 10 || after.data.calibrationDue !== 9) {
  throw new Error(`Dashboard tidak berubah seperti dijangka: ${JSON.stringify({ before, after })}`);
}
if (!after.data.recentCalibration || after.data.recentCalibration.asset_id !== "AST-000003") {
  throw new Error("Aktiviti kalibrasi terkini tidak ditemui.");
}

console.log(JSON.stringify({
  before: before.data.calibrationDue,
  after: after.data.calibrationDue,
  recent: after.data.recentCalibration.asset_id,
}));
