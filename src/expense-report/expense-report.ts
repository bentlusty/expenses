import path from "path";
import { aggregateExpensesByMonth } from "../aggregate-expenses/aggregate-expenses";
import BusinessRepository, {
  Businesses,
} from "../repositories/business-repository/business-repository";
import BankScraperClient from "../clients/bank-scraper-client";
import ExpenseRepository, {
  Expense,
} from "../repositories/expense-repository/expense-repository";
import { Option } from "../cli/cli";

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

const PATH_TO_BUSINESS_DB = path.join(
  __dirname,
  "../../src/db/businesses.json"
);

function normalize(expenses: Expense[], businesses: Businesses) {
  return expenses.map((expense) => ({
    businessName: businesses[expense.businessName]
      ? businesses[expense.businessName]
      : expense.businessName,
    amount: expense.amount,
    date: new Date(expense.date),
  }));
}

export default async function createExpenseReport(
  { expenseRepository, bankScraperClient, businessRepository }: Dependencies,
  options: Option[]
): Promise<Report> {
  const allExpenses = await expenseRepository.getAllExpenses(
    { bankScraperClient },
    options
  );

  const businesses = await businessRepository.getBusinesses(
    PATH_TO_BUSINESS_DB
  );
  const expenses = normalize(allExpenses, businesses);
  return aggregateExpensesByMonth(expenses);
}
