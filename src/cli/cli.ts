import chalk from "chalk";
import yargs, { ArgumentsCamelCase } from "yargs";
import { hideBin } from "yargs/helpers";
import generateReportCommand from "./generate-report.command";
import normalizeCommand from "./normalize.command";
import inquirer from "inquirer";

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
    id: options.id || answers.id,
    card6Digits: options.digits || answers.digits,
    password: options.password || answers.password,
    fromDate: options.from || answers.from,
  };
}

export async function cli(args: string[]) {
  console.log(chalk.green.bold("Welcome to Expenses CLI"));

  yargs(hideBin(args))
    .usage("usage: $0 <command>")
    .command(
      "normalize-expenses",
      "Go over unverified expenses and normalize them",
      (yargs) => {
        return yargs
          .option("id", {
            describe: "The 'Teodat Zehut'",
            type: "number",
          })
          .option("digits", {
            describe: "Last six digits of the credit card",
            type: "number",
          })
          .option("password", {
            describe: "The password to connect to Isracard",
            type: "string",
          })
          .option("from", {
            describe: "The date that we should start gathering the data from",
            type: "string",
          });
      },
      async (argv) => {
        const options = await promptForMissingOptions(argv);
        await normalizeCommand(options);
      }
    )
    .command(
      "generate-report",
      "Generate a report with your Visa credit card company",
      (yargs) => {
        return yargs
          .option("id", {
            describe: "The 'Teodat Zehut'",
            type: "number",
          })
          .option("digits", {
            describe: "Last six digits of the credit card",
            type: "number",
          })
          .option("password", {
            describe: "The password to connect to Isracard",
            type: "string",
          })
          .option("from", {
            describe: "The date that we should start gathering the data from",
            type: "string",
          });
      },
      async (argv) => {
        const options = await promptForMissingOptions(argv);
        await generateReportCommand(options);
      }
    )
    .help()
    .demandCommand()
    .parse();
}
