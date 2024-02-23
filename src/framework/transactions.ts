import { FastifyRequest } from "fastify";
import { MoneyTransaction } from "../types";
import { formatDateInMMYYYY } from "../server/utils";

const parseMonth = (transactionDate:string): string => {
  const date = new Date(transactionDate)
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return formatDateInMMYYYY(month, year);
}

export const transactionCreate = (req: FastifyRequest): MoneyTransaction => {
  const body: any = req.body;
  return {
    TransNum: body["TransNum"],
    Status: body["Status"],
    Amount: body["Amount"],
    Currency: body["Currency"],
    TransactionDate: body["TransactionDate"],
    Description: body["Description"],
    TransactionMonth: parseMonth(body["TransactionDate"])
  };
};