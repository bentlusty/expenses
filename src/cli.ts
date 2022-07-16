import arg from "arg";
import inquirer from "inquirer";

import createExpenseReport from "./expense-report/expense-report";
import bankScraperClient from "./clients/bank-scraper-client";
import expenseRepository from "./expense-repository";
import chalk from "chalk";

type Options = {
  id?: string;
  card6Digits?: string;
  password?: string;
  fromDate?: string;
};

function parseArgumentsIntoOptions(rawArgs: string[]): Options {
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

async function promptForMissingOptions(options: Options) {
  const questions = [];
  if (!options.id) {
    questions.push({
      type: "input",
      name: "id",
      message: "What is your ID (Teodat Zehut)?",
    });
  }
  if (!options.card6Digits) {
    questions.push({
      type: "input",
      name: "card6Digits",
      message: "What is your 6 Card Digits?",
    });
  }
  if (!options.password) {
    questions.push({
      type: "password",
      name: "password",
      message: "What is your password?",
    });
  }
  if (!options.fromDate) {
    questions.push({
      type: "input",
      name: "fromDate",
      message: "From which date should I calculate?",
    });
  }

  const answers = await inquirer.prompt(questions);

  return {
    ...options,
    id: options.id || answers.id,
    card6Digits: options.card6Digits || answers.card6Digits,
    password: options.password || answers.password,
    fromDate: options.fromDate || answers.fromDate,
  };
}

export async function cli(args: string[]) {
  console.log(chalk.green("Welcome to Expenses CLI"));
  const options = parseArgumentsIntoOptions(args);

  const { id, password, card6Digits, fromDate } = await promptForMissingOptions(
    options
  );
  console.log(
    chalk.green(
      `Creating Expense Report for: ID: ${id}, \n
      Date: ${fromDate} \n
      Password: "***********" \n
      Digits: ${card6Digits}`
    )
  );

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
  console.table(aggregatedExpenses);
  console.log(chalk.green("Done"));
}
