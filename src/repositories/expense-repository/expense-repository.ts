import { CompanyTypes } from "israeli-bank-scrapers";
import BankScraperClient from "../../clients/bank-scraper-client";
import { ScraperCredentials } from "israeli-bank-scrapers/lib/scrapers/base-scraper";

export type Expense = {
  businessName: string;
  amount: number;
  date: string;
};

export type Dependencies = {
  bankScraperClient: typeof BankScraperClient;
};

export type Props = {
  fromDate: Date;
  credentials: ScraperCredentials;
  provider: CompanyTypes;
};

export async function getAllExpenses(
  { bankScraperClient }: Dependencies,
  { fromDate, credentials, provider }: Props
): Promise<Expense[]> {
  const expenses = await bankScraperClient.get({
    fromDate,
    credentials,
    company: provider,
  });
  return expenses.map((expense) => ({
    businessName: expense.description,
    amount: expense.chargedAmount,
    date: expense.date,
  }));
}

const expenseRepository = {
  getAllExpenses,
};

export default expenseRepository;
