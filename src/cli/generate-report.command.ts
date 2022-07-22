import {
  combineExpenses,
  MonthlyReport,
  normalize,
  Report,
  validateCreditCards,
} from "../expense-report/expense-report";
import expenseRepository from "../repositories/expense-repository/expense-repository";
import bankScraperClient from "../clients/bank-scraper-client";
import chalk from "chalk";
import businessRepository from "../repositories/business-repository/business-repository";
import { Option } from "./cli";
import path from "path";
import { aggregateExpensesByMonth } from "../aggregate-expenses/aggregate-expenses";
import ora from "ora";

function prettifyReport(month: string, report: MonthlyReport) {
  console.log(chalk.bgGreen.bold(`Month: ${month}`));
  console.table(Object.entries(report.data));
  console.log(chalk.blueBright.italic(report.total));
}

const PATH_TO_BUSINESS_DB = path.join(
  __dirname,
  "../../src/db/businesses.json"
);

function createReport(aggregatedExpenses: Report) {
  Object.entries(aggregatedExpenses as Record<string, MonthlyReport>).forEach(
    ([month, report]) => {
      prettifyReport(month, report);
    }
  );
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function generateReportCommand(options: Option[]) {
  const spinner = ora();
  spinner.start("Getting all expenses and incomes");
  const allExpenses = await expenseRepository.getAllExpenses(
    { bankScraperClient },
    options
  );
  spinner.succeed(`Got expenses from: ${Object.keys(allExpenses)}`);

  spinner.start("Getting normalized businesses names");
  const businesses = await businessRepository.getBusinesses(
    PATH_TO_BUSINESS_DB
  );
  await wait(1000);
  spinner.succeed("Got normalized businesses");

  spinner.start("Normalizing Businesses");
  const expenses = normalize(allExpenses, businesses);
  await wait(1000);
  spinner.succeed("Finished normalize businesses");

  spinner.start("Validate credit card expenses against bank");
  const isValid = validateCreditCards(expenses);
  await wait(1000);
  if (!isValid) {
    spinner.fail("Credit cards are not validated!");
  } else {
    spinner.succeed("Credit cards validated!");
  }

  spinner.start("Combining expenses");
  const combinedExpenses = combineExpenses(expenses);
  spinner.succeed("Expenses combined successfully");

  spinner.start("Aggregating expenses and income");
  const aggregatedExpenses = await aggregateExpensesByMonth(combinedExpenses);
  await wait(1000);
  spinner.succeed("Aggregated expenses");

  spinner.start("Creating Expense Report");
  createReport(aggregatedExpenses);
  await wait(1000);
  spinner.succeed("Done");
}
