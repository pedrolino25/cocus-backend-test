import { isEmptyString } from "./validations";

describe("isEmptyString", () => {
  it("should return true for empty string", () => {
    expect(isEmptyString("")).toBe(true);
  });

  it("should return true for string with only spaces", () => {
    expect(isEmptyString("  ")).toBe(true);
  });

  it("should return false for non-empty string", () => {
    expect(isEmptyString("text")).toBe(false);
  });

  it("should return false for string with spaces around text", () => {
    expect(isEmptyString(" text ")).toBe(false);
  });

  it("should return true for string with tabs or newlines only", () => {
    expect(isEmptyString("\t\n")).toBe(true);
  });
});
