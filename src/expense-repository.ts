import { BankScraperClient } from "./clients/bank-scraper-client";
import { CompanyTypes } from "israeli-bank-scrapers";
import { isracardCredentials } from "./config";

type Expense = {
  businessName: string;
  amount: number;
};

type Dependencies = {
  bankScraperClient: BankScraperClient;
};

type Props = {
  fromDate: Date;
};

export async function getAllExpenses(
  { bankScraperClient }: Dependencies,
  { fromDate }: Props
): Promise<Expense[]> {
  const expenses = await bankScraperClient.get({
    fromDate,
    credentials: {
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
