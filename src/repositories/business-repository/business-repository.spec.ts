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
    const result = await businessRepository.getNormalizedBusinessName({
      originalBusinessName,
      path,
    });

    expect(result).toStrictEqual("Super Yoda");
  });

  it("should save a new Business Name", async () => {
    const originalBusinessName = "Not Normalized";
    await fs.writeFile(path, JSON.stringify({}), "utf-8");

    await businessRepository.setNormalizedBusinessName({
      originalBusinessName: originalBusinessName,
      normalizedBusinessName: "Normalized",
      path,
    });

    const expectedResult = await businessRepository.getNormalizedBusinessName({
      path,
      originalBusinessName,
    });
    expect(expectedResult).toBeTruthy();
  });
});
