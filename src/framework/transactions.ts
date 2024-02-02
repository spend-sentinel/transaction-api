import { FastifyRequest } from "fastify";
import { MoneyTransaction } from "../types";

export const transactionCreate = (req: FastifyRequest): MoneyTransaction => {
  const body: any = req.body;
  return {
    TransNum: body["TransNum"],
    Status: body["Status"],
    Amount: body["Amount"],
    Currency: body["Currency"],
    TransactionDate: body["TransactionDate"],
    Description: body["Description"],
  };
};

export const getTransactionsInMonth = (transactions:MoneyTransaction[], month:number, year:number): MoneyTransaction[] => {
  const transactionsInMonth:MoneyTransaction[] = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.TransactionDate);
    const transactionMonth = transactionDate.getMonth() + 1;
    const transactionYear = transactionDate.getFullYear()
    return (transactionMonth == month && transactionYear == year)
  });
  return transactionsInMonth;
}