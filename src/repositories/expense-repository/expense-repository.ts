import BankScraperClient from "../../clients/bank-scraper-client";
import { Option } from "../../cli/cli";

export type Expense = {
  businessName: string;
  amount: number;
  date: string;
};

async function getExpenses(
  {
    bankScraperClient,
  }: {
    bankScraperClient: typeof BankScraperClient;
  },
  { fromDate, credentials, provider }: Option
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

async function getAllExpenses(
  {
    bankScraperClient,
  }: {
    bankScraperClient: typeof BankScraperClient;
  },
  options: Option[]
): Promise<Expense[]> {
  const allExpenses = [];
  for (const option of options) {
    allExpenses.push(await getExpenses({ bankScraperClient }, option));
  }
  return allExpenses.flat();
}

const expenseRepository = {
  getAllExpenses,
};

export default expenseRepository;
