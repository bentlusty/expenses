import expenseRepository from "./expense-repository";
import bankScraperClient from "./clients/bank-scraper-client";
import arg from "arg";
import { aggregateExpenses } from "./aggregate-expenses/aggregate-expenses";

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
    const allExpenses = await expenseRepository.getAllExpenses(
      { bankScraperClient },
      {
        fromDate: new Date(fromDate),
        credentials: {
          id,
          card6Digits,
          password,
        },
      }
    );
    let aggregatedExpenses = aggregateExpenses(allExpenses);
    console.log(aggregatedExpenses);
  }
}
