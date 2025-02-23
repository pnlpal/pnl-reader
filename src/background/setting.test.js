import message from "./message.js";
import setting from "./setting.js";

const { expect } = chai;

describe("setting.js", () => {
  let chrome;

  beforeEach(() => {
    chrome = {
      storage: {
        sync: {
          get: sinon.stub(),
          set: sinon.stub(),
          remove: sinon.stub(),
        },
      },
    };
    window.chrome = chrome;
    sinon.stub(message, "on");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("init", () => {
    it("should initialize with default config if no saved config", async () => {
      chrome.storage.sync.get.resolves({});
      await setting.init();
      expect(setting.configCache.windowLeft).to.equal(600);
    });

    it("should initialize with saved config if available", async () => {
      chrome.storage.sync.get.resolves({ config: { windowLeft: 700 } });
      await setting.init();
      expect(setting.configCache.windowLeft).to.equal(700);
    });
  });

  describe("setValue", () => {
    it("should set value and save to storage", () => {
      setting.setValue("windowLeft", 750);
      expect(setting.configCache.windowLeft).to.equal(750);
      expect(
        chrome.storage.sync.set.calledWith({ config: setting.configCache })
      ).to.be.true;
    });
  });

  describe("getValue", () => {
    it("should get value if key exists", () => {
      setting.configCache.windowLeft = 700;
      expect(setting.getValue("windowLeft")).to.equal(700);
    });

    it("should get default value if key does not exist", () => {
      expect(setting.getValue("not-exist", 800)).to.equal(800);
    });
  });

  describe("clear", () => {
    it("should clear storage", () => {
      setting.clear();
      expect(chrome.storage.sync.remove.calledWith("config")).to.be.true;
    });
  });
});
