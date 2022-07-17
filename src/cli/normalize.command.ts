import normalizeExpenses from "../normalize-expenses/normalize-expenses";
import chalk from "chalk";
import expenseRepository from "../repositories/expense-repository/expense-repository";
import bankScraperClient from "../clients/bank-scraper-client";
import businessRepository from "../repositories/business-repository/business-repository";
import { Options } from "./cli";

export default async function normalizeCommand({
  provider,
  fromDate,
  credentials,
}: Options) {
  console.log(
    chalk.green.underline(
      `Normalizing Expenses for: ${chalk.bold(
        provider
      )} from date: ${chalk.bold(fromDate)}`
    )
  );
  await normalizeExpenses(
    {
      expenseRepository,
      bankScraperClient,
      businessRepository,
    },
    {
      fromDate: new Date(fromDate),
      credentials,
      provider,
    }
  );
  console.log(chalk.green.italic("Finished Normalizing expenses"));
}
