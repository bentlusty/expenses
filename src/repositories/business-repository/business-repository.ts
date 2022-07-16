const fs = require("fs").promises;

export type BusinessRepository = {
  getNormalizedBusinessName(props: GetProps): Promise<string | null>;
  setNormalizedBusinessName(props: SetProps): void;
};
type GetProps = {
  path: string;
  originalBusinessName: string;
};

type SetProps = {
  originalBusinessName: string;
  normalizedBusinessName: string;
  path: string;
};

let cachedBusiness: { [key: string]: string } | null = null;

async function getCachedFile(path: string): Promise<{ [key: string]: string }> {
  if (cachedBusiness) return cachedBusiness;
  const file = await fs.readFile(path, { encoding: "utf-8" });
  cachedBusiness = JSON.parse(file) as {};
  return cachedBusiness;
}

async function getNormalizedBusinessName({
  path,
  originalBusinessName,
}: GetProps): Promise<string | null> {
  const cachedFile = await getCachedFile(path);
  const businessName = cachedFile[originalBusinessName];
  if (businessName) {
    return businessName;
  }
  return null;
}

async function setNormalizedBusinessName({
  originalBusinessName,
  normalizedBusinessName,
  path,
}: SetProps) {
  const cachedFile = await getCachedFile(path);
  cachedFile[originalBusinessName] = normalizedBusinessName;
  await fs.writeFile(path, JSON.stringify(cachedFile), "utf-8");
}

const businessRepository = {
  getNormalizedBusinessName,
  setNormalizedBusinessName,
};

export default businessRepository;
