import normalizeExpenses from "../normalize-expenses/normalize-expenses";
import chalk from "chalk";
import expenseRepository from "../repositories/expense-repository/expense-repository";
import bankScraperClient from "../clients/bank-scraper-client";
import businessRepository from "../repositories/business-repository/business-repository";
import { Option } from "./cli";

export default async function normalizeCommand(options: Option[]) {
  await normalizeExpenses(
    {
      expenseRepository,
      bankScraperClient,
      businessRepository,
    },
    options
  );
  console.log(chalk.green.italic("Finished Normalizing expenses"));
}
