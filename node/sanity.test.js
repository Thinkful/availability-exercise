const { isValidUser } = require("./sanity");

describe("isValidUser", () => {
    it("accepts titled names", () => {
        expect(isValidUser("Dr. Seuss")).toBe(true);
    });
    it("rejects special characters", () => {
        expect(isValidUser("Dr. $euss")).toBe(false);
    });
    it("rejects empty names", () => {
        expect(isValidUser("")).toBe(false);
    });
    it("rejects whitespace padded names", () => {
        expect(isValidUser(" Dr. Seuss ")).toBe(false);
    });
});