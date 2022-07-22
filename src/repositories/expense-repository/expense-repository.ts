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
    date: new Date(expense.date),
  }));
}

async function getAllExpenses(
  {
    bankScraperClient,
  }: {
    bankScraperClient: typeof BankScraperClient;
  },
  options: Option[]
): Promise<Record<string, Expense[]>> {
  const allExpenses: Record<string, Expense[]> = {};
  for (const option of options) {
    if (allExpenses[option.provider]) {
      allExpenses[option.provider] = [
        ...allExpenses[option.provider],
        ...(await getExpenses({ bankScraperClient }, option)),
      ];
    }
    allExpenses[option.provider] = await getExpenses(
      { bankScraperClient },
      option
    );
  }
  return allExpenses;
}

const expenseRepository = {
  getAllExpenses,
};

export default expenseRepository;
