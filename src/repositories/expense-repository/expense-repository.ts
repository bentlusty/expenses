import BankScraperClient from "../../clients/bank-scraper-client";
import { Option } from "../../cli/cli";

export type Expense = {
  businessName: string;
  amount: number;
  date: Date;
};

async function getExpenses(
  {
    bankScraperClient,
  }: {
    bankScraperClient: typeof BankScraperClient;
  },
  { credentials, provider }: Option,
  fromDate: Date
): Promise<Expense[]> {
  const expenses = await bankScraperClient.get({
    fromDate,
    credentials,
    company: provider,
  });
  return expenses.map((expense) => ({
    businessName: expense.description,
    amount: expense.chargedAmount,
    date: new Date(expense.date),
  }));
}

const expenseRepository = {
  getExpenses,
};

export default expenseRepository;
