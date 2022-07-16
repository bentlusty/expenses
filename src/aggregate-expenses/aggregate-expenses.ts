type Expense = {
  businessName: string;
  amount: number;
};

type AggregatedExpense = {
  [key: string]: { total: number; count: number };
};

export function aggregateExpenses(expenses: Expense[]): AggregatedExpense {
  return expenses.reduce(
    (aggregatedSumByName: AggregatedExpense, expense: Expense) => {
      if (!aggregatedSumByName[expense.businessName]) {
        aggregatedSumByName[expense.businessName] = {
          total: expense.amount,
          count: 1,
        };
      } else {
        aggregatedSumByName[expense.businessName].total += expense.amount;
        aggregatedSumByName[expense.businessName].count += 1;
      }
      return aggregatedSumByName;
    },
    {}
  );
}
