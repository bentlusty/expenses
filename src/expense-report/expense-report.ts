import { aggregateExpensesByMonth } from "../aggregate-expenses/aggregate-expenses";
import { ScraperCredentials } from "israeli-bank-scrapers/lib/scrapers/base-scraper";
import path from "path";
import BusinessRepository from "../repositories/business-repository/business-repository";
import BankScraperClient from "../clients/bank-scraper-client";
import ExpenseRepository from "../repositories/expense-repository/expense-repository";
import { CompanyTypes } from "israeli-bank-scrapers/lib/definitions";

export type AggregatedExpense = {
  total: number;
  count: number;
};

export type MonthlyReport = {
  data: AggregatedExpense[];
  total: number;
};

export type Report = {
  [key: string]: MonthlyReport;
};

type Dependencies = {
  bankScraperClient: typeof BankScraperClient;
  expenseRepository: typeof ExpenseRepository;
  businessRepository: typeof BusinessRepository;
};

type Props = {
  fromDate: Date;
  credentials: ScraperCredentials;
  provider: CompanyTypes;
};

export default async function createExpenseReport(
  { expenseRepository, bankScraperClient, businessRepository }: Dependencies,
  { fromDate, credentials, provider }: Props
): Promise<Report> {
  const allExpenses = await expenseRepository.getAllExpenses(
    { bankScraperClient },
    {
      fromDate,
      credentials,
      provider,
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
