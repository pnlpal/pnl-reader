import { justForTest } from "./inject.js";

describe("inject.js", () => {
  it("first test", () => {
    const result = justForTest();
    chai.expect(result).to.equal(true);
  });
});
