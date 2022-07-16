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

function calculateTotalExpenses(expenses: Expense[]) {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
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
  const map = Object.entries(aggregatedExpensesByMonth).map(
    ([month, expenses]) => {
      const textualMonth = months[parseInt(month)];
      return {
        [textualMonth]: {
          data: aggregateExpenses(expenses),
          total: calculateTotalExpenses(expenses),
        },
      };
    }
  );
  return Object.assign({}, ...map);
}
