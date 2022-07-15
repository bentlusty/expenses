type Expense = {
  businessName: string;
  amount: number;
};

export function aggregateExpenses(expenses: Expense[]) {
  return expenses.reduce((aggregatedSumByName: any, expense: Expense) => {
    if (!aggregatedSumByName[expense.businessName]) {
      aggregatedSumByName[expense.businessName] = expense.amount;
    } else {
      aggregatedSumByName[expense.businessName] += expense.amount;
    }
    return aggregatedSumByName;
  }, {});
}
