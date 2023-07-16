import { FastifyRequest } from "fastify"

export type MoneyTransaction = {
    TransNum: string,
    Status: boolean
    Amount: number,
    TransactionDate: String
};

export const transactionCreate = (req:FastifyRequest): MoneyTransaction => {
    const body:any = req.body;
    return { TransNum: body['TransNum'],
            Status: body['Status'],
            Amount: body['Amount'],
            TransactionDate: body['TransactionDate'] }
};