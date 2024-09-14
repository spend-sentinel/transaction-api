import { FastifyRequest } from "fastify";
import { MoneyTransaction } from "../shared/types.js";
import { formatDateInMMYYYY } from "../server/utils.js";

const parseMonth = (transactionDate: string): string => {
  const date = new Date(transactionDate);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return formatDateInMMYYYY(month, year);
};

export const transactionCreate = (req: FastifyRequest): MoneyTransaction => {
  const body = req.body as MoneyTransaction;
  const newTransaction: MoneyTransaction = {
    TransNum: body["TransNum"],
    Status: body["Status"],
    Amount: body["Amount"],
    Currency: body["Currency"],
    TransactionDate: body["TransactionDate"],
    Description: body["Description"],
    TransactionMonth: parseMonth(body["TransactionDate"]),
    CardNumber: body["CardNumber"],
    ReportedToBot: !!body["ReportedToBot"],
  };
  return newTransaction;
};
