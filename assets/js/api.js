window.AssetAPI = {
  async request(action, payload = {}) {
    const config = window.ASET_CONFIG;
    if (!config.API_URL || config.USE_DEMO_DATA) {
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
