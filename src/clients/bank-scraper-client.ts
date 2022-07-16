import { CompanyTypes, createScraper } from "israeli-bank-scrapers";
import { Transaction } from "israeli-bank-scrapers/lib/transactions";
import { ScraperCredentials } from "israeli-bank-scrapers/lib/scrapers/base-scraper";

type GetParams = {
  fromDate: Date;
  credentials: ScraperCredentials;
  company: CompanyTypes;
};

export type BankScraperClient = {
  get: (props: GetParams) => Promise<Transaction[]> | [];
};

async function get({
  fromDate,
  credentials,
  company,
}: GetParams): Promise<Transaction[]> {
  const options = {
    companyId: company,
    startDate: fromDate,
    combineInstallments: false,
    showBrowser: false,
  };
  const scraper = createScraper(options);

  const scrapeResult = await scraper.scrape(credentials);
  const transactions: Transaction[] = [];
  if (scrapeResult.success) {
    scrapeResult.accounts?.forEach((account) =>
      transactions.push(...account.txns)
    );
  }
  return transactions;
}

const bankScraperClient: BankScraperClient = {
  get,
};

export default bankScraperClient;
