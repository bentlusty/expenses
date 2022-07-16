import { BankScraperClient } from "./clients/bank-scraper-client";
import { CompanyTypes } from "israeli-bank-scrapers";
import { isracardCredentials } from "./config";
import { ScraperCredentials } from "israeli-bank-scrapers/lib/scrapers/base-scraper";

type Expense = {
  businessName: string;
  amount: number;
};

type Dependencies = {
  bankScraperClient: BankScraperClient;
};

type Props = {
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
