import { BankScraperClient } from "../../clients/bank-scraper-client";
import { ScraperCredentials } from "israeli-bank-scrapers/lib/scrapers/base-scraper";
import { BusinessRepository } from "../business-repository/business-repository";

export type Expense = {
  businessName: string;
  amount: number;
};

export type Dependencies = {
  bankScraperClient: BankScraperClient;
  businessRepository: BusinessRepository;
};

export type Props = {
  fromDate: Date;
  credentials?: ScraperCredentials;
};

export type ExpenseRepository = {
  getAllExpenses(dependencies: Dependencies, props: Props): Promise<Expense[]>;
};
