import message from "./message.js";

export default {
  configCache: {
    windowLeft: 600,
    windowTop: 80,
    windowWidth: 580,
    windowHeight: 600,
  },

  async init() {
    message.on("setting", () => {
      return this.configCache;
    });
    message.on("save setting", (request) => {
      return this.setValue(request.key, request.value);
    });

    const savedData = await chrome.storage.sync.get("config");
    if (savedData?.config) {
      Object.assign(this.configCache, savedData.config);
    }
  },

  setValues(obj) {
    Object.entries(obj).forEach(([k, v]) => this.setValue(k, v));
  },

  setValue(key, value) {
    if (this.configCache[key] != value) {
      this.configCache[key] = value;
      chrome.storage.sync.set({ config: this.configCache });
    }
    return value;
  },

  getValue(key, defaultValue) {
    let v = this.configCache[key];
    v ??= defaultValue;
    return v;
  },

  clear() {
    return chrome.storage.sync.remove("config");
  },
};
