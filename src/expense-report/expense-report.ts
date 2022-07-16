import { aggregateExpensesByMonth } from "../aggregate-expenses/aggregate-expenses";
import { ScraperCredentials } from "israeli-bank-scrapers/lib/scrapers/base-scraper";
import path from "path";
import BusinessRepository from "../repositories/business-repository/business-repository";
import BankScraperClient from "../clients/bank-scraper-client";
import ExpenseRepository from "../repositories/expense-repository/expense-repository";

export type Report = {
  [key: string]: { total: number; count: number };
};

type Dependencies = {
  bankScraperClient: typeof BankScraperClient;
  expenseRepository: typeof ExpenseRepository;
  businessRepository: typeof BusinessRepository;
};

type Props = {
  fromDate: Date;
  credentials: ScraperCredentials;
};

export default async function createExpenseReport(
  { expenseRepository, bankScraperClient, businessRepository }: Dependencies,
  { fromDate, credentials }: Props
): Promise<{ [key: string]: Report }[]> {
  const allExpenses = await expenseRepository.getAllExpenses(
    { bankScraperClient },
    {
      fromDate,
      credentials,
    }
  );
  const pathToJson = path.join(__dirname, "../../src/db/businesses.json");

  const businesses = await businessRepository.getBusinesses(pathToJson);
  const expenses = allExpenses.map((expense) =>
    businesses[expense.businessName]
      ? {
          businessName: businesses[expense.businessName],
          amount: expense.amount,
          date: new Date(expense.date),
        }
      : {
          businessName: expense.businessName,
          amount: expense.amount,
          date: new Date(expense.date),
        }
  );
  return aggregateExpensesByMonth(expenses);
}
