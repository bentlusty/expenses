import BusinessRepository, {
  Businesses,
} from "../repositories/business-repository/business-repository";
import path from "path";
import inquirer from "inquirer";
import ExpenseRepository, {
  Expense,
} from "../repositories/expense-repository/expense-repository";
import BankScraperClient from "../clients/bank-scraper-client";
import { Option } from "../cli/cli";

type Dependencies = {
  bankScraperClient: typeof BankScraperClient;
  expenseRepository: typeof ExpenseRepository;
  businessRepository: typeof BusinessRepository;
};

const PATH_TO_BUSINESS_DB = path.join(
  __dirname,
  "../../src/db/businesses.json"
);

async function askForBusinessesNames(
  allExpenses: Expense[],
  businesses: Businesses
) {
  for (const expense of allExpenses) {
    if (!businesses[expense.businessName]) {
      console.log(expense);
      const answers = await inquirer.prompt([
        {
          type: "input",
          name: "normalizedBusinessName",
          message: "What should this expense be called?",
        },
      ]);
      if (answers.normalizedBusinessName) {
        businesses[expense.businessName] = answers.normalizedBusinessName;

        console.log("Saved!", answers.normalizedBusinessName);
      }
    }
  }
}

export default async function normalizeExpenses(
  { expenseRepository, bankScraperClient, businessRepository }: Dependencies,
  options: Option[]
) {
  const allExpenses = await expenseRepository.getAllExpenses(
    { bankScraperClient },
    options
  );
  const businesses = await businessRepository.getBusinesses(
    PATH_TO_BUSINESS_DB
  );

  await askForBusinessesNames(allExpenses, businesses);
  await businessRepository.setBusinesses(
    path.join(__dirname, "../../src/db/businesses.json"),
    businesses
  );
}
