import expenseRepository from "./expense-repository";
import {
  TransactionStatuses,
  TransactionTypes,
} from "israeli-bank-scrapers/lib/transactions";
import { CompanyTypes } from "israeli-bank-scrapers";

describe("Expense Repository", () => {
  it("should return empty list if no expenses found", async () => {
    const result = await expenseRepository.getAllExpenses(
      {
        bankScraperClient: { get: () => Promise.resolve([]) },
      },
      [
        {
          fromDate: new Date(),
          credentials: {},
          provider: CompanyTypes.isracard,
        },
      ]
    );
    expect(result).toStrictEqual([]);
  });
  it("should return expenses list if found", async () => {
    const result = await expenseRepository.getAllExpenses(
      {
        bankScraperClient: {
          get: () =>
            Promise.resolve([
              {
                type: TransactionTypes.Normal,
                date: "",
                processedDate: "",
                originalAmount: 100,
                originalCurrency: "",
                chargedAmount: 100,
                description: "מי אביבים",
                status: TransactionStatuses.Completed,
              },
              {
                type: TransactionTypes.Normal,
                date: "",
                processedDate: "",
                originalAmount: 100,
                originalCurrency: "",
                chargedAmount: 100,
                description: "מי אביבים",
                status: TransactionStatuses.Completed,
              },
            ]),
        },
      },
      [
        {
          fromDate: new Date(),
          credentials: {},
          provider: CompanyTypes.isracard,
        },
      ]
    );
    expect(result).toStrictEqual([
      { businessName: "מי אביבים", amount: 100, date: "" },
      { businessName: "מי אביבים", amount: 100, date: "" },
    ]);
  });
});
