import arg from "arg";
import createExpenseReport from "./expense-report/expense-report";
import bankScraperClient from "./clients/bank-scraper-client";
import expenseRepository from "./expense-repository";

function parseArgumentsIntoOptions(rawArgs: string[]) {
  const args = arg(
    {
      "--id": String,
      "--digits": String,
      "--password": String,
      "--from": String,
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    id: args["--id"],
    card6Digits: args["--digits"],
    password: args["--password"],
    fromDate: args["--from"],
  };
}

export async function cli(args: string[]) {
  const { id, password, card6Digits, fromDate } =
    parseArgumentsIntoOptions(args);

  if (id && password && card6Digits && fromDate) {
    const aggregatedExpenses = await createExpenseReport(
      {
        expenseRepository,
        bankScraperClient,
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
    console.log(aggregatedExpenses);
  }
}
