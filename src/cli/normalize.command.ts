import { askForBusinessesNames } from "../normalize-expenses/normalize-expenses";
import expenseRepository, {
  Expense,
} from "../repositories/expense-repository/expense-repository";
import bankScraperClient from "../clients/bank-scraper-client";
import businessRepository from "../repositories/business-repository/business-repository";
import { Option } from "./cli";
import ora from "ora";
import path from "path";
import { wait } from "./generate-report.command";

const PATH_TO_BUSINESS_DB = path.join(
  __dirname,
  "../../src/db/businesses.json"
);

export default async function normalizeCommand({
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
    spinner.succeed(
      `Got expenses from ${option.provider} (${expenses.length})`
    );
  }

  spinner.succeed(`Got expenses from: ${Object.keys(allExpenses)}`);

  spinner.start("Getting normalized businesses names");
  const businesses = await businessRepository.getBusinesses(
    PATH_TO_BUSINESS_DB
  );
  await wait(1000);
  spinner.succeed("Got normalized businesses");

  await askForBusinessesNames(allExpenses, businesses);

  spinner.start("Saving businesses to JSON");
  await businessRepository.setBusinesses(
    path.join(__dirname, "../../src/db/businesses.json"),
    businesses
  );
  await wait(1000);
  spinner.succeed("Saved complete!");
}
