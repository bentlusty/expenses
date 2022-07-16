import { BankScraperClient } from "../clients/bank-scraper-client";
import { aggregateExpenses } from "../aggregate-expenses/aggregate-expenses";
import { ScraperCredentials } from "israeli-bank-scrapers/lib/scrapers/base-scraper";
import { ExpenseRepository } from "../repositories/expense-repository/types";
import { BusinessRepository } from "../repositories/business-repository/business-repository";

type Report = {
  [key: string]: { total: number; count: number };
};

type Dependencies = {
  bankScraperClient: BankScraperClient;
  expenseRepository: ExpenseRepository;
  businessRepository: BusinessRepository;
};

type Props = {
  fromDate: Date;
  credentials: ScraperCredentials;
};

export default async function createExpenseReport(
  { expenseRepository, bankScraperClient, businessRepository }: Dependencies,
  { fromDate, credentials }: Props
): Promise<Report> {
  const allExpenses = await expenseRepository.getAllExpenses(
    { bankScraperClient, businessRepository },
    {
      fromDate,
      credentials,
    }
  );
  return aggregateExpenses(allExpenses);
}
