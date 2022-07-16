import chalk from "chalk";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import generateReportCommand from "./generate-report.command";

export async function cli(args: string[]) {
  console.log(chalk.green.bold("Welcome to Expenses CLI"));

  yargs(hideBin(args))
    .usage("usage: $0 <command>")
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
        await generateReportCommand(argv);
      }
    )
    .help()
    .demandCommand()
    .parse();
}
