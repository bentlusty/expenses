import createExpenseReport from "./expense-report";
import {
  TransactionStatuses,
  TransactionTypes,
} from "israeli-bank-scrapers/lib/transactions";
import expenseRepository from "../repositories/expense-repository/expense-repository";

function buildExpense(overrides?: Record<string, unknown>) {
  return {
    type: TransactionTypes.Normal,
    date: "2022-06-18T21:00:00.000Z",
    processedDate: "",
    originalAmount: 100,
    originalCurrency: "",
    chargedAmount: 100,
    description: "Water Bill",
    status: TransactionStatuses.Completed,
    ...overrides,
  };
}

describe("Expense Report", () => {
  it("should display expense report flow", async () => {
    const bankScraperClient = {
      get: () =>
        Promise.resolve([
          buildExpense({
            description: "Water Bill",
            chargedAmount: 100,
            date: "2022-01-01T21:00:00.000Z",
          }),
          buildExpense({
            description: "Water Bill",
            chargedAmount: 200,
            date: "2022-01-01T21:00:00.000Z",
          }),
          buildExpense({
            description: "Electricity Bill",
            chargedAmount: 50,
            date: "2022-01-01T21:00:00.000Z",
          }),
          buildExpense({
            description: "Water Bill",
            chargedAmount: 200,
            date: "2022-03-01T21:00:00.000Z",
          }),
        ]),
    };
    const businessRepository = {
      getBusinesses: () => Promise.resolve({}),
      setBusinesses: () => Promise.resolve(),
    };
    const result = await createExpenseReport(
      {
        expenseRepository,
        bankScraperClient,
        businessRepository,
      },
      { fromDate: new Date(), credentials: {} }
    );

    expect(result).toStrictEqual({
      January: {
        data: {
          "Water Bill": { count: 2, total: 300 },
          "Electricity Bill": { count: 1, total: 50 },
        },
        total: 350,
      },
      March: { data: { "Water Bill": { count: 1, total: 200 } }, total: 200 },
    });
  });
});
