import businessRepository from "./business-repository";
import * as fs from "fs";
import path from "path";

describe("Business Repository", () => {
  const jsonPath = path.join(__dirname, "./businesses.json");

  afterEach(async () => {
    await fs.promises.unlink(jsonPath);
  });

  it("should return an Original Business Name to normalize Business Name", async () => {
    const originalBusinessName = "סופר יודה";
    const originalBusinessNameToNormalized = {
      [originalBusinessName]: "Super Yoda",
    };
    await fs.promises.writeFile(
      jsonPath,
      JSON.stringify(originalBusinessNameToNormalized),
      "utf-8"
    );
    const result = await businessRepository.getBusinesses(jsonPath);

    expect(result).toStrictEqual({ [originalBusinessName]: "Super Yoda" });
  });

  it("should save a new Business Name", async () => {
    await businessRepository.setBusinesses(jsonPath, { business: "10" });

    const expectedResult = await fs.promises.readFile(jsonPath, "utf-8");
    expect(JSON.parse(expectedResult)).toStrictEqual({ business: "10" });
  });
});
