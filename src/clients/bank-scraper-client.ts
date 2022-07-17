import { CompanyTypes, createScraper } from "israeli-bank-scrapers";
import { Transaction } from "israeli-bank-scrapers/lib/transactions";
import { ScraperCredentials } from "israeli-bank-scrapers/lib/scrapers/base-scraper";

type GetParams = {
  fromDate: Date;
  credentials: ScraperCredentials;
  company: CompanyTypes;
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
  const transactions: Transaction[] = [];

  try {
    const scrapeResult = await scraper.scrape(credentials);
    if (scrapeResult.success) {
      scrapeResult.accounts?.forEach((account) =>
        transactions.push(...account.txns)
      );
    } else {
      console.error("`Error fetching data", {
        company,
        type: scrapeResult.errorType,
        message: scrapeResult.errorMessage,
      });
    }
  } catch (error: any) {
    console.error("`Error was thrown fetching data", {
      company,
      message: error?.message,
    });
  }

  return transactions;
}

const bankScraperClient = {
  get,
};

export default bankScraperClient;
