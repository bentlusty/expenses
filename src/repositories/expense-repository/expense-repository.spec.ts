import { getAllExpenses } from "./expense-repository";
import {
  TransactionTypes,
  TransactionStatuses,
} from "israeli-bank-scrapers/lib/transactions";

describe("Expense Repository", () => {
  it("should return empty list if no expenses found", async () => {
    const result = await getAllExpenses(
      {
        bankScraperClient: { get: () => [] },
      },
      { fromDate: new Date() }
    );
    expect(result).toStrictEqual([]);
  });
  it("should return expenses list if found", async () => {
    const result = await getAllExpenses(
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
      { fromDate: new Date() }
    );
    expect(result).toStrictEqual([
      { businessName: "מי אביבים", amount: 100 },
      { businessName: "מי אביבים", amount: 100 },
    ]);
  });
});
