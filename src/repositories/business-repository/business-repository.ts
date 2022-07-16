const fs = require("fs").promises;

export type BusinessRepository = {
  getNormalizedBusinessName(props: Props): Promise<string>;
};
type Props = {
  path: string;
  originalBusinessName: string;
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
}: Props) {
  const cachedFile = await getCachedFile(path);
  const businessName = cachedFile[originalBusinessName];
  if (businessName) {
    return businessName;
  }
  return originalBusinessName;
}

const businessRepository = {
  getNormalizedBusinessName,
};

export default businessRepository;
