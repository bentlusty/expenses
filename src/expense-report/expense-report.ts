import { BankScraperClient } from "../clients/bank-scraper-client";
import { aggregateExpenses } from "../aggregate-expenses/aggregate-expenses";
import { ScraperCredentials } from "israeli-bank-scrapers/lib/scrapers/base-scraper";
import { ExpenseRepository } from "../repositories/expense-repository/types";

type Report = {
  [key: string]: { total: number; count: number };
};

type Dependencies = {
  bankScraperClient: BankScraperClient;
  expenseRepository: ExpenseRepository;
};

type Props = {
  fromDate: Date;
  credentials: ScraperCredentials;
};

export default async function createExpenseReport(
  { expenseRepository, bankScraperClient }: Dependencies,
  { fromDate, credentials }: Props
): Promise<Report> {
  const allExpenses = await expenseRepository.getAllExpenses(
    { bankScraperClient },
    {
      fromDate,
      credentials,
    }
  );
  return aggregateExpenses(allExpenses);
}
