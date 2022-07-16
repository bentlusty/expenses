import businessRepository from "./business-repository";
const fs = require("fs").promises;

describe("Business Repository", () => {
  const path = "./tmp/tmp-businesses.json";

  afterEach(async () => {
    await fs.unlink(path);
  });

  it("should return an Original Business Name to normalize Business Name", async () => {
    const originalBusinessName = "סופר יודה";
    let originalBusinessNameToNormalized = {
      [originalBusinessName]: "Super Yoda",
    };
    await fs.writeFile(
      path,
      JSON.stringify(originalBusinessNameToNormalized),
      "utf-8"
    );
    const result = await businessRepository.getBusinesses(path);

    expect(result).toStrictEqual({ [originalBusinessName]: "Super Yoda" });
  });

  it("should save a new Business Name", async () => {
    await businessRepository.setBusinesses(path, { business: "10" });

    const expectedResult = await fs.readFile(path, "utf-8");
    expect(JSON.parse(expectedResult)).toStrictEqual({ business: "10" });
  });
});
