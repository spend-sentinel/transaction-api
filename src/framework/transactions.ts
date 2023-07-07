import { FastifyRequest } from "fastify"

export type MoneyTransaction = {
    _id?: string,
    TransNum: string,
    Status: boolean
    Amount: number,
    TransactionDate: String
};

export const dummyTransaction:MoneyTransaction = {
    '_id': "0",
    'TransNum': "0",
    'Status': false,
    'Amount': 0,
    TransactionDate: Date()
};

export const isRealTransaction = (transaction:MoneyTransaction):boolean => {
    return (transaction['_id'] != dummyTransaction['_id']);
}
export const TransactionCreate = (req:FastifyRequest): MoneyTransaction => {
    const transaction:MoneyTransaction = dummyTransaction;
    const body:any = req.body;
    transaction['TransNum'] = body['TransNum'];
    transaction['Status'] = body['Status'];
    transaction['Amount'] = body['Amount'];
    transaction['TransactionDate'] = body['TransactionDate'];
    return transaction;
}