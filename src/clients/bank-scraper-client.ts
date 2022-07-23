import { CompanyTypes, createScraper } from "israeli-bank-scrapers";
import { Transaction } from "israeli-bank-scrapers/lib/transactions";
import { ScraperCredentials } from "israeli-bank-scrapers/lib/scrapers/base-scraper";
import moment from "moment";

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
    startDate: moment(fromDate).subtract(1, "month").toDate(),
    combineInstallments: false,
    showBrowser: false,
    verbose: true,
  };
  const scraper = createScraper(options);
  const transactions: Transaction[] = [];
  const scrapeResult = await scraper.scrape(credentials);
  if (scrapeResult.success) {
    scrapeResult.accounts?.forEach((account) =>
      transactions.push(
        ...account.txns.filter((transaction) => {
          let startOfMonth = moment(fromDate).startOf("month");
          let endOfMonth = moment(fromDate).endOf("month");
          return moment(transaction.processedDate).isBetween(
            startOfMonth,
            endOfMonth,
            "days",
            "[]"
          );
        })
      )
    );
  } else {
    console.error("`Error fetching data", {
      company,
      type: scrapeResult.errorType,
      message: scrapeResult.errorMessage,
    });
  }

  if (transactions.length === 0) {
    throw new Error("Can't find expenses. Check your credentials");
  }

  return transactions;
}

const bankScraperClient = {
  get,
};

export default bankScraperClient;
