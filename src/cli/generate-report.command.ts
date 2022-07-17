import Listr from "listr";
import createExpenseReport, {
  MonthlyReport,
} from "../expense-report/expense-report";
import expenseRepository from "../repositories/expense-repository/expense-repository";
import bankScraperClient from "../clients/bank-scraper-client";
import chalk from "chalk";
import businessRepository from "../repositories/business-repository/business-repository";
import { Option } from "./cli";

function prettifyReport(month: string, report: MonthlyReport) {
  console.log(chalk.bgGreen.bold(`Month: ${month}`));
  console.table(Object.entries(report.data));
  console.log(chalk.blueBright.italic(report.total));
}

export default async function generateReportCommand(options: Option[]) {
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
          options
        );
      },
    },
  ]);

  const { aggregatedExpenses } = await tasks.run();
  Object.entries(aggregatedExpenses as Record<string, MonthlyReport>).forEach(
    ([month, report]) => {
      prettifyReport(month, report);
    }
  );

  console.log(chalk.green("Done"));
}
