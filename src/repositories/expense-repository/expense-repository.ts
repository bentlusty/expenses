import { CompanyTypes } from "israeli-bank-scrapers";
import { isracardCredentials } from "../../config";
import BankScraperClient from "../../clients/bank-scraper-client";
import { ScraperCredentials } from "israeli-bank-scrapers/lib/scrapers/base-scraper";

export type Expense = {
  businessName: string;
  amount: number;
};

export type Dependencies = {
  bankScraperClient: typeof BankScraperClient;
};

export type Props = {
  fromDate: Date;
  credentials?: ScraperCredentials;
};

export async function getAllExpenses(
  { bankScraperClient }: Dependencies,
  { fromDate, credentials }: Props
): Promise<Expense[]> {
  const expenses = await bankScraperClient.get({
    fromDate,
    credentials: credentials || {
      id: isracardCredentials.ID,
      card6Digits: isracardCredentials.SIX_DIGITS,
      password: isracardCredentials.PASSWORD,
    },
    company: CompanyTypes.isracard,
  });
  return expenses.map((expense) => ({
    businessName: expense.description,
    amount: expense.chargedAmount,
  }));
}

const expenseRepository = {
  getAllExpenses,
};

export default expenseRepository;
