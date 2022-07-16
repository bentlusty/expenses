export const isracardCredentials: {
  ID: string;
  SIX_DIGITS: string;
  PASSWORD: string;
} = {
  ID: process.env["ID"] || "",
  SIX_DIGITS: process.env["SIX_DIGITS"] || "",
  PASSWORD: process.env["PASSWORD"] || "",
};
