type Expense = {
  businessName: string;
  amount: number;
  date: Date;
};

type AggregatedExpense = {
  [key: string]: { total: number; count: number };
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function aggregateExpenses(expenses: Expense[]): AggregatedExpense {
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

export function aggregateExpensesByMonth(expenses: Expense[]) {
  const aggregatedExpensesByMonth = expenses.reduce(
    (expensesByMonth: { [key: string]: Expense[] }, expense: Expense) => {
      const month = expense.date.getMonth();
      if (!expensesByMonth[month]) {
        expensesByMonth[month] = [expense];
      } else {
        expensesByMonth[month].push(expense);
      }
      return expensesByMonth;
    },
    {}
  );
  const map = Object.entries(aggregatedExpensesByMonth).map(([key, value]) => {
    const textualMonth = months[parseInt(key)];
    return { [textualMonth]: aggregateExpenses(value) };
  });
  return Object.assign({}, ...map);
}
