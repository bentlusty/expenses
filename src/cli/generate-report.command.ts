import { ArgumentsCamelCase } from "yargs";
import Listr from "listr";
import createExpenseReport from "../expense-report/expense-report";
import expenseRepository from "../repositories/expense-repository/expense-repository";
import bankScraperClient from "../clients/bank-scraper-client";
import businessRepository from "../repositories/business-repository/business-repository";
import inquirer from "inquirer";
import chalk from "chalk";

async function promptForMissingOptions(options: ArgumentsCamelCase) {
  const questions = [];
  if (!options.id) {
    questions.push({
      type: "input",
      name: "id",
      message: "What is your ID (Teodat Zehut)?",
    });
  }
  if (!options.digits) {
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
  if (!options.from) {
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
export default async function generateReportCommand(args: ArgumentsCamelCase) {
  const { id, password, card6Digits, fromDate } = await promptForMissingOptions(
    args
  );
  console.log(chalk.green.underline("Creating Expense Report for:"));
  console.log(chalk.greenBright(`ID: ${id}`));
  console.log(chalk.greenBright(`Date: ${fromDate}`));
  console.log(chalk.greenBright("Password: ***********"));
  console.log(chalk.greenBright(`Digits: ${card6Digits}`));

  const tasks = new Listr([
    {
      title: "Creating Expense Report",
      task: async (ctx) => {
        ctx.aggregatedExpenses = await createExpenseReport(
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
      },
    },
  ]);

  const { aggregatedExpenses } = await tasks.run();
  console.table(aggregatedExpenses);

  console.log(chalk.green("Done"));
}
