import { FastifyRequest } from "fastify"
import { MoneyTransaction } from "../types";

export const transactionCreate = (req:FastifyRequest): MoneyTransaction => {
    const body:any = req.body;
    return {
            TransNum: body['TransNum'],
            Status: body['Status'],
            Amount: body['Amount'],
            Currency: body['Currency'],
            TransactionDate: body['TransactionDate'],
            Description: body['Description'] }
};

export { MoneyTransaction };
