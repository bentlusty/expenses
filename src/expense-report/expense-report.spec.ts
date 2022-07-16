import createExpenseReport from "./expense-report";
import {
  TransactionStatuses,
  TransactionTypes,
} from "israeli-bank-scrapers/lib/transactions";
import expenseRepository from "../expense-repository";

describe("Expense Report", () => {
  it("should display expense report flow", async () => {
    let bankScraperClient = {
      get: () =>
        Promise.resolve([
          {
            type: TransactionTypes.Normal,
            date: "",
            processedDate: "",
            originalAmount: 100,
            originalCurrency: "",
            chargedAmount: 100,
            description: "Water Bill",
            status: TransactionStatuses.Completed,
          },
          {
            type: TransactionTypes.Normal,
            date: "",
            processedDate: "",
            originalAmount: 100,
            originalCurrency: "",
            chargedAmount: 100,
            description: "Water Bill",
            status: TransactionStatuses.Completed,
          },
        ]),
    };
    const result = await createExpenseReport(
      {
        expenseRepository,
        bankScraperClient,
      },
      { fromDate: new Date(), credentials: {} }
    );

    expect(result).toStrictEqual({ "Water Bill": { count: 2, total: 200 } });
  });
});
