import { Businesses } from "../repositories/business-repository/business-repository";
import { Expense } from "../repositories/expense-repository/expense-repository";
import { CompanyTypes } from "israeli-bank-scrapers/lib/definitions";
import { AggregatedExpense } from "../aggregate-expenses/aggregate-expenses";

export type Report = {
  month: number;
  data: AggregatedExpense;
  total: number;
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
  let totalCreditCardAmount = 0;
  let totalCreditCardAmountFromBank = 0;
  if (expenses[CompanyTypes.isracard]) {
    totalCreditCardAmount = expenses[CompanyTypes.isracard].reduce(
      (aggregatedExpense, expense) => aggregatedExpense + expense.amount,
      0
    );
    if (totalCreditCardAmount === 0) {
      throw new Error("Isracard expenses should not be zero");
    }
  }

  if (expenses[CompanyTypes.hapoalim]) {
    totalCreditCardAmountFromBank = expenses[CompanyTypes.hapoalim].reduce(
      (aggregatedExpense, expense) => {
        if (expense.businessName === "Isracard") {
          return aggregatedExpense + expense.amount;
        }
        return aggregatedExpense;
      },
      0
    );
    if (totalCreditCardAmountFromBank === 0) {
      throw new Error("Isracard expense from bank should not be zero");
    }
  }

  return totalCreditCardAmount === totalCreditCardAmountFromBank;
}

export function createReport(expenses: AggregatedExpense): Report {
  return {
    month: 5, // TODO CHANGE THIS
    data: expenses,
    total: Object.values(expenses).reduce(
      (sum, expense) => sum + expense.total,
      0
    ),
  };
}
