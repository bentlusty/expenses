import chalk from "chalk";
import yargs, { Arguments } from "yargs";
import { hideBin } from "yargs/helpers";
import generateReportCommand from "./generate-report.command";
import normalizeCommand from "./normalize.command";
import inquirer from "inquirer";
import { CompanyTypes } from "israeli-bank-scrapers/lib/definitions";
import { SCRAPERS } from "israeli-bank-scrapers";

export type Arg = {
  provider?: CompanyTypes;
  from?: string;
};
export type Options = {
  provider: CompanyTypes;
  fromDate: string;
  credentials: any;
};

function askForProvider() {
  return {
    type: "list",
    name: "provider",
    message: "What is your Provider?",
    choices: () =>
      Object.entries(CompanyTypes).map(([key, value]) => ({
        name: key,
        value,
      })),
    validate: (value: string) => !!value || "Required Field!",
  };
}
function askForFromDate() {
  return {
    type: "input",
    name: "from",
    message: "From which date should I calculate? Format: YYYY-MM-DD",
    validate: (value: string) => {
      if (!Date.parse(value)) {
        return "Not Valid date";
      }
      return !!value;
    },
  };
}
function askForCredentialsField(field: string) {
  return {
    type: field === "password" ? "password" : "input",
    name: field,
    message: field,
    validate: (value: string) => !!value || "Required Field!",
  };
}

async function promptForMissingOptions(options: Arguments<Arg>) {
  const questions = [];
  if (!options.from) {
    questions.push(askForFromDate());
  }

  if (!options.provider) {
    questions.push(askForProvider());
  }
  const answers = await inquirer.prompt(questions);
  const provider = options.provider || answers.provider;
  let scraperProvider = SCRAPERS[provider as CompanyTypes];
  console.log(
    chalk.bgBlueBright.black(
      `Please provide additional credentials for: ${scraperProvider.name}`
    )
  );
  const credentialsQuestions = scraperProvider.loginFields.map(
    askForCredentialsField
  );

  const credentials = await inquirer.prompt(credentialsQuestions);

  return {
    provider,
    credentials,
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
          .option("provider", {
            choices: Object.values(CompanyTypes),
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
          .option("provider", {
            choices: Object.values(CompanyTypes),
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
    .parse();
}
