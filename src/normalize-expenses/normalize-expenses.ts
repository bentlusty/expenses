import { ScraperCredentials } from "israeli-bank-scrapers/lib/scrapers/base-scraper";
import BusinessRepository from "../repositories/business-repository/business-repository";
import path from "path";
import inquirer from "inquirer";
import ExpenseRepository from "../repositories/expense-repository/expense-repository";
import BankScraperClient from "../clients/bank-scraper-client";

type Props = {
  fromDate: Date;
  credentials: ScraperCredentials;
};

type Dependencies = {
  bankScraperClient: typeof BankScraperClient;
  expenseRepository: typeof ExpenseRepository;
  businessRepository: typeof BusinessRepository;
};

export default async function normalizeExpenses(
  { expenseRepository, bankScraperClient, businessRepository }: Dependencies,
  { fromDate, credentials }: Props
) {
  const allExpenses = await expenseRepository.getAllExpenses(
    { bankScraperClient },
    {
      fromDate,
      credentials,
    }
  );
  const pathToJson = path.join(__dirname, "../../src/db/businesses.json");
  const businesses = await businessRepository.getBusinesses(pathToJson);

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
  await businessRepository.setBusinesses(
    path.join(__dirname, "../../src/db/businesses.json"),
    businesses
  );
}
