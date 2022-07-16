const fs = require("fs").promises;

type Businesses = {
  [key: string]: string;
};

let cachedBusiness: { [key: string]: Businesses } = {};

async function getBusinesses(path: string): Promise<Businesses> {
  if (cachedBusiness[path]) return cachedBusiness[path];
  const file = await fs.readFile(path, { encoding: "utf-8" });
  cachedBusiness[path] = JSON.parse(file) as {};
  return cachedBusiness[path];
}

async function setBusinesses(path: string, businesses: Businesses) {
  await fs.writeFile(path, JSON.stringify(businesses));
}

const businessRepository = {
  getBusinesses,
  setBusinesses,
};

export default businessRepository;
