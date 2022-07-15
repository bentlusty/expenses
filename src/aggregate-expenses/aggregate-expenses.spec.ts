import { aggregateExpenses } from "./aggregate-expenses";

describe("Aggregate Expenses", () => {
  it("should aggregate the sum of Electricity and Water", () => {
    const expenses = [
      {
        businessName: "Electricity",
        amount: 100,
      },
      {
        businessName: "Electricity",
        amount: 120,
      },
      {
        businessName: "Water",
        amount: 10,
      },
      {
        businessName: "Water",
        amount: 20,
      },
      {
        businessName: "Water",
        amount: 30,
      },
    ];

    const result = aggregateExpenses(expenses);

    expect(result).toStrictEqual({
      Water: 60,
      Electricity: 220,
    });
  });
  it("should return an empty object if no expenses provided", () => {
    const result = aggregateExpenses([]);

    expect(result).toStrictEqual({});
  });
});
