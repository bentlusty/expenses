import { Businesses } from "../repositories/business-repository/business-repository";
import inquirer from "inquirer";
import { Expense } from "../repositories/expense-repository/expense-repository";

export async function askForBusinessesNames(
  allExpenses: Record<string, Expense[]>,
  businesses: Businesses
) {
  for (const expenses of Object.values(allExpenses)) {
    for (const expense of expenses) {
      if (!businesses[expense.businessName]) {
        console.log(expense);
        const answers = await inquirer.prompt([
          {
            type: "input",
            name: "normalizedBusinessName",
            message: "What should this expense be called?",
          },
        ]);
        if (answers.normalizedBusinessName) {
          businesses[expense.businessName] = answers.normalizedBusinessName;

          console.log("Saved!", answers.normalizedBusinessName);
        }
      }
    }
  }
}
