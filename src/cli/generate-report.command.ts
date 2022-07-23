import {
  combineExpenses,
  createReport,
  normalize,
  Report,
  validateCreditCards,
} from "../expense-report/expense-report";
import expenseRepository, {
  Expense,
} from "../repositories/expense-repository/expense-repository";
import bankScraperClient from "../clients/bank-scraper-client";
import businessRepository from "../repositories/business-repository/business-repository";
import { Option } from "./cli";
import path from "path";
import {
  AggregatedExpense,
  aggregateExpenses,
  MONTHS,
  removeDuplicateExpenses,
} from "../aggregate-expenses/aggregate-expenses";
import ora from "ora";
import chalk from "chalk";

const PATH_TO_BUSINESS_DB = path.join(
  __dirname,
  "../../src/db/businesses.json"
);

function getTotal(total: number) {
  if (total < 0) {
    return `(${total})₪`;
  }
  return `${total}₪`;
}

function displayReport(report: Report) {
  console.log(chalk.bold.underline(`\n${MONTHS[report.month]} Monthly Report`));
  const ordered = Object.keys(report.data)
    .sort()
    .map((tx) => tx)
    .reduce((obj: AggregatedExpense, key) => {
      obj[key] = report.data[key];
      return obj;
    }, {});
  const table = Object.entries(ordered).map(([expense, data]) => {
    return {
      expense,
      total: getTotal(data.total),
      count: data.count,
    };
  });
  console.table(table);
  let endMessage = `Profit/Lost: ${getTotal(report.total)}`;
  console.log(chalk.bold.underline(" ".repeat(endMessage.length)));
  console.log(chalk.bold.underline(endMessage));
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function generateReportCommand({
  options,
  fromDate,
}: {
  options: Option[];
  fromDate: Date;
}) {
  const spinner = ora();
  spinner.start("Getting all expenses and incomes");
  const allExpenses: Record<string, Expense[]> = {};
  for (const option of options) {
    spinner.start(`Getting expenses from ${option.provider}`);
    const expenses = await expenseRepository.getExpenses(
      { bankScraperClient },
      option,
      fromDate
    );
    spinner.succeed(
      `Got expenses from ${option.provider} (${expenses.length})`
    );
    if (
      allExpenses[option.provider] &&
      allExpenses[option.provider].length > 0
    ) {
      allExpenses[option.provider] = [
        ...allExpenses[option.provider],
        ...expenses,
      ];
    } else {
      allExpenses[option.provider] = expenses;
    }
  }
  spinner.succeed(
    `Finished Getting all expenses (${Object.entries(allExpenses).map(
      ([provider, expenses]) => `${provider}: totalExpenses: ${expenses.length}`
    )}`
  );

  spinner.start("Getting normalized businesses names");
  const businesses = await businessRepository.getBusinesses(
    PATH_TO_BUSINESS_DB
  );
  await wait(1000);
  spinner.succeed(
    `Got normalized businesses (${Object.keys(businesses).length})`
  );

  spinner.start("Normalizing Businesses");
  const expenses = normalize(allExpenses, businesses);
  await wait(1000);
  spinner.succeed(
    `Finished normalize businesses (${Object.entries(expenses).map(
      ([provider, expenses]) => `${provider}: totalExpenses: ${expenses.length}`
    )}`
  );

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
  await wait(1000);
  spinner.succeed(
    `Expenses combined successfully (${combinedExpenses.length})`
  );

  spinner.start("Aggregating expenses and income");
  const aggregatedExpenses = aggregateExpenses(combinedExpenses);
  await wait(1000);
  spinner.succeed(
    `Aggregated expenses (${Object.keys(aggregatedExpenses).length})`
  );

  spinner.start("Removing duplicate expenses");
  const aggregatedExpensesWithoutDuplicates =
    removeDuplicateExpenses(aggregatedExpenses);
  await wait(1000);
  spinner.succeed(
    `Aggregated expenses (${Object.keys(aggregatedExpenses).length} -> ${
      Object.keys(aggregatedExpensesWithoutDuplicates).length
    })`
  );

  spinner.start("Creating Expense Report");
  const report = createReport(aggregatedExpensesWithoutDuplicates);
  await wait(1000);
  spinner.succeed("Done");

  spinner.start("Displaying Expense Report");
  await wait(1000);
  displayReport(report);
  spinner.succeed("Done");
}
