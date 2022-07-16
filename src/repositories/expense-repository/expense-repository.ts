import { CompanyTypes } from "israeli-bank-scrapers";
import { isracardCredentials } from "../../config";
import { Dependencies, Expense, Props } from "./types";
import path from "path";

export async function getAllExpenses(
  { bankScraperClient, businessRepository }: Dependencies,
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
  return Promise.all(
    expenses.map(async (expense) => {
      let businessName = await businessRepository.getNormalizedBusinessName({
        originalBusinessName: expense.description,
        path: path.join(__dirname, "../../../src/db/businesses.json"),
      });
      return {
        businessName,
        amount: expense.chargedAmount,
      };
    })
  );
}

const expenseRepository = {
  getAllExpenses,
};

export default expenseRepository;
