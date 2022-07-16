import normalizeExpenses from "../normalize-expenses/normalize-expenses";
import chalk from "chalk";
import expenseRepository from "../repositories/expense-repository/expense-repository";
import bankScraperClient from "../clients/bank-scraper-client";
import businessRepository from "../repositories/business-repository/business-repository";

type Options = {
  id: string;
  password: string;
  card6Digits: string;
  fromDate: string;
};

export default async function normalizeCommand({
  id,
  password,
  card6Digits,
  fromDate,
}: Options) {
  console.log(chalk.green.italic("About to start Normalizing expenses"));
  console.log(chalk.greenBright(`ID: ${id}`));
  console.log(chalk.greenBright(`Date: ${fromDate}`));
  console.log(chalk.greenBright("Password: ***********"));
  console.log(chalk.greenBright(`Digits: ${card6Digits}`));
  await normalizeExpenses(
    {
      expenseRepository,
      bankScraperClient,
      businessRepository,
    },
    {
      fromDate: new Date(fromDate),
      credentials: {
        id,
        card6Digits,
        password,
      },
    }
  );
  console.log(chalk.green.italic("Finished Normalizing expenses"));
}
