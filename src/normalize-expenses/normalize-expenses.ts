import { ScraperCredentials } from "israeli-bank-scrapers/lib/scrapers/base-scraper";
import { BankScraperClient } from "../clients/bank-scraper-client";
import { ExpenseRepository } from "../repositories/expense-repository/types";
import { BusinessRepository } from "../repositories/business-repository/business-repository";
import path from "path";

type Props = {
  fromDate: Date;
  credentials: ScraperCredentials;
};

type Dependencies = {
  bankScraperClient: BankScraperClient;
  expenseRepository: ExpenseRepository;
  businessRepository: BusinessRepository;
};

export default async function normalizeExpenses(
  { expenseRepository, bankScraperClient, businessRepository }: Dependencies,
  { fromDate, credentials }: Props
) {
  const allExpenses = await expenseRepository.getAllExpenses(
    { bankScraperClient, businessRepository },
    {
      fromDate,
      credentials,
    }
  );

  for (const expense of allExpenses) {
    const normalizedBusinessName =
      await businessRepository.getNormalizedBusinessName({
        originalBusinessName: expense.businessName,
        path: path.join(__dirname, "../src/db/businesses.json"),
      });
    if (!normalizedBusinessName) {
      console.log("Found one!", expense);
    }
  }
}
