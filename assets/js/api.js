window.AssetAPI = {
  demoKey: "aset-mpe-demo-records-v1",

  getDemoRecords() {
    try {
      return JSON.parse(localStorage.getItem(this.demoKey) || "{}");
    } catch {
      return {};
    }
  },

  saveDemoRecord(moduleName, payload) {
    const records = this.getDemoRecords();
    const items = records[moduleName] || [];
    const prefixes = {
      assets: "AST", maintenance: "MNT", calibration: "CAL",
      movements: "MOV", usage: "USE", disposals: "DSP", manuals: "MAN",
    };
    const idField = moduleName === "usage" ? "usage_id" : `${moduleName.replace(/s$/, "")}_id`;
    const record = {
      ...payload,
      [idField]: `${prefixes[moduleName] || "REC"}-D${String(items.length + 1).padStart(4, "0")}`,
      created_at: new Date().toISOString(),
    };
    items.push(record);
    records[moduleName] = items;
    localStorage.setItem(this.demoKey, JSON.stringify(records));
    return record;
  },

  demoDashboard() {
    const records = this.getDemoRecords();
    const assets = records.assets || [];
    const maintenance = records.maintenance || [];
    const calibrations = records.calibration || [];
    const disposals = records.disposals || [];
    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 86400000);
    let calibrationDue = 10;
    let calibrationExpired = 3;

    // AST-000003 ialah aset tamat tempoh dalam set demo asal. Rekod baharu
    // dengan tarikh seterusnya melebihi 30 hari menyelesaikan tindakan itu.
    const latestByAsset = {};
    calibrations.forEach((item) => { latestByAsset[item.asset_id] = item; });
    const resolvedDemoDue = latestByAsset["AST-000003"];
    if (resolvedDemoDue) {
      const next = new Date(resolvedDemoDue.next_calibration_date);
      if (!Number.isNaN(next.getTime()) && next > in30Days) {
        calibrationDue -= 1;
        calibrationExpired -= 1;
      }
    }
    Object.entries(latestByAsset).forEach(([assetId, item]) => {
      if (assetId === "AST-000003") return;
      const next = new Date(item.next_calibration_date);
      if (!Number.isNaN(next.getTime()) && next <= in30Days) {
        calibrationDue += 1;
        if (next < now) calibrationExpired += 1;
      }
    });

    return {
      total: 173 + assets.length,
      functioning: 142 + assets.filter((item) => item.asset_status === "Berfungsi").length,
      damaged: 10 + assets.filter((item) => item.asset_status === "Rosak").length,
      maintenance: 11 + maintenance.filter((item) => item.status !== "Selesai").length,
      calibrationDue,
      calibrationExpired,
      pendingDisposals: 1 + disposals.filter((item) => item.approval_status !== "Selesai").length,
      recentCalibration: calibrations.at(-1) || null,
    };
  },

  async request(action, payload = {}) {
    const config = window.ASET_CONFIG;
    if (!config.API_URL || config.USE_DEMO_DATA) {
      if (action === "dashboard") {
        return { ok: true, demo: true, data: this.demoDashboard() };
      }
      if (action.startsWith("create_")) {
        return {
          ok: true,
          demo: true,
          data: this.saveDemoRecord(action.slice(7), payload),
        };
      }
      if (action.startsWith("list_")) {
        const records = this.getDemoRecords();
        return { ok: true, demo: true, data: records[action.slice(5)] || [] };
      }
      return { ok: true, demo: true, data: payload };
    }

    const response = await fetch(config.API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action, payload }),
    });
    if (!response.ok) throw new Error(`Ralat rangkaian: ${response.status}`);
    const result = await response.json();
    if (!result.ok) throw new Error(result.message || "Permintaan gagal");
    return result;
  },
};
