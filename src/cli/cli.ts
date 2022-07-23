import chalk from "chalk";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import generateReportCommand from "./generate-report.command";
import normalizeCommand from "./normalize.command";
import inquirer from "inquirer";
import { CompanyTypes } from "israeli-bank-scrapers/lib/definitions";
import { SCRAPERS } from "israeli-bank-scrapers";

export type Option = {
  provider: CompanyTypes;
  credentials: Record<string, string>;
};

async function askForFromDate(fromOption?: string) {
  if (fromOption) return { fromDate: fromOption };
  const questions = [
    {
      type: "input",
      name: "fromDate",
      message: "From which date should I calculate? Format: YYYY-MM-DD",
      validate: (value: string) => {
        if (!Date.parse(value)) {
          return "Not Valid date";
        }
        return !!value;
      },
    },
  ];

  return inquirer.prompt(questions);
}

async function askForMoreProviders() {
  const questions = [
    {
      type: "list",
      choices: [
        { name: "Yes", value: true },
        { name: "No", value: false },
      ],
      name: "shouldPromptForMoreProvider",
      message: "Do you want to add another Business Provider?",
    },
  ];

  return inquirer.prompt(questions);
}

function askForCredentialsField(field: string) {
  return {
    type: field === "password" ? "password" : "input",
    name: field,
    message: field,
    validate: (value: string) => !!value || "Required Field!",
  };
}

async function promptForMissingOptions() {
  const currentSupportedProviders = [
    CompanyTypes.isracard,
    CompanyTypes.hapoalim,
  ];
  const questions = [
    {
      type: "list",
      name: "provider",
      message: "What is your Provider?",
      choices: () =>
        currentSupportedProviders.map((provider) => ({
          name: provider,
          provider,
        })),
      validate: (value: string) => !!value || "Required Field!",
    },
  ];
  const { provider } = await inquirer.prompt(questions);
  const scraperProvider = SCRAPERS[provider as CompanyTypes];
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
  };
}

async function getOptions(argv: { from?: string }) {
  const { fromDate } = await askForFromDate(argv.from);
  const option = await promptForMissingOptions();
  const options = [option];

  let { shouldPromptForMoreProvider } = await askForMoreProviders();
  while (shouldPromptForMoreProvider) {
    options.push(await promptForMissingOptions());
    const result = await askForMoreProviders();
    shouldPromptForMoreProvider = result.shouldPromptForMoreProvider;
  }
  return { options, fromDate: new Date(fromDate) };
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
        const { options, fromDate } = await getOptions(argv);
        await normalizeCommand({ options, fromDate });
      }
    )
    .command(
      "generate-report",
      "Generate a report with your Visa credit card company",
      (yargs) => {
        return yargs.option("from", {
          describe: "The date that we should start gathering the data from",
          type: "string",
        });
      },
      async (argv) => {
        const { options, fromDate } = await getOptions(argv);
        await generateReportCommand({ options, fromDate });
      }
    )
    .help()
    .parse();
}
