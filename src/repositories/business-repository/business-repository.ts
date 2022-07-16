import * as fs from "fs";

type Businesses = {
  [key: string]: string;
};

const cachedBusiness: { [key: string]: Businesses } = {};

async function getBusinesses(path: string): Promise<Businesses> {
  if (cachedBusiness[path]) return cachedBusiness[path];
  const file = await fs.promises.readFile(path, { encoding: "utf-8" });
  cachedBusiness[path] = JSON.parse(file) as Businesses;
  return cachedBusiness[path];
}

async function setBusinesses(path: string, businesses: Businesses) {
  await fs.promises.writeFile(path, JSON.stringify(businesses));
}

const businessRepository = {
  getBusinesses,
  setBusinesses,
};

export default businessRepository;
