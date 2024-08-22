import { FastifyRequest } from "fastify";
import { MoneyTransaction } from "../shared/types";
import { formatDateInMMYYYY } from "../server/utils";

const parseMonth = (transactionDate:string): string => {
  const date = new Date(transactionDate)
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return formatDateInMMYYYY(month, year);
}

export const transactionCreate = (req: FastifyRequest): MoneyTransaction => {
  const body: any = req.body;
  console.log(body);
  console.log(body["ReportedToBot"]);
  const newTransaction:MoneyTransaction = {
    TransNum: body["TransNum"],
    Status: body["Status"],
    Amount: body["Amount"],
    Currency: body["Currency"],
    TransactionDate: body["TransactionDate"],
    Description: body["Description"],
    TransactionMonth: parseMonth(body["TransactionDate"]),
    CardNumber: body["CardNumber"],
    ReportedToBot: !!body["ReportedToBot"]
  };
  console.log(newTransaction);
  return newTransaction;
    
};