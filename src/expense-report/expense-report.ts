import { Businesses } from "../repositories/business-repository/business-repository";
import { Expense } from "../repositories/expense-repository/expense-repository";
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

export function combineExpenses(
  expenses: Record<string, Expense[]>
): Expense[] {
  return Object.values(expenses).flat();
}

export function normalize(
  expenses: Record<string, Expense[]>,
  businesses: Businesses
) {
  const normalizedExpenses: Record<string, Expense[]> = {};

  Object.entries(expenses).forEach(([provider, expenses]) => {
    normalizedExpenses[provider] = expenses.map((expense) => ({
      businessName: businesses[expense.businessName]
        ? businesses[expense.businessName]
        : expense.businessName,
      amount: expense.amount,
      date: expense.date,
    }));
  });
  return normalizedExpenses;
}

export function validateCreditCards(expenses: Record<string, Expense[]>) {
  const totalCreditCardAmount = expenses[CompanyTypes.isracard].reduce(
    (aggregatedExpense, expense) => aggregatedExpense + expense.amount,
    0
  );
  const totalCreditCardAmountFromBank = expenses[CompanyTypes.hapoalim].reduce(
    (aggregatedExpense, expense) => {
      if (expense.businessName === "Isracard") {
        return aggregatedExpense + expense.amount;
      }
      return aggregatedExpense;
    },
    0
  );
  if (totalCreditCardAmount === 0) {
    throw new Error("Isracard expenses should not be zero");
  }
  if (totalCreditCardAmountFromBank === 0) {
    throw new Error("Isracard expense from bank should not be zero");
  }

  return totalCreditCardAmount === totalCreditCardAmountFromBank;
}
