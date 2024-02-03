import { FastifyRequest, FastifyReply } from "fastify";
import { getTransactionsInMonth, transactionCreate } from "../framework/transactions";
import { MoneyTransaction, Application, MonthlyStatus, ApprovalStatus } from "../types";
import cors from "@fastify/cors";
import * as crud from "../framework/crud-db";
import { createMonthlyStatusesResponse, isValidRequest } from "./utils";

const getTransactionID = (req: FastifyRequest) => {
  const params: any = req.params;
  return params["transactionID"];
};

export const setRoutes = (application: Application) => {
  application.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
  });
  application.post("/", async (req: FastifyRequest, res: FastifyReply) => {
    const transactionToCreate: MoneyTransaction = transactionCreate(req);
    return await crud.createNewEntry(transactionToCreate);
  });

  application.put("/", async (req: FastifyRequest, res: FastifyReply) => {
    const transactionToCreate: MoneyTransaction = transactionCreate(req);
    return await crud.createNewEntry(transactionToCreate);
  });

  application.get(
    "/:transactionID",
    async (req: FastifyRequest, res: FastifyReply) => {
      const transactionID: string = getTransactionID(req);
      if ("" === transactionID) {
        // transactionID unspecified, get all transactions
        return await crud.getAllTransactions();
      }

      const transaction = await crud.getSpecificTransaction(transactionID);
      if (!transaction) {
        res.statusCode = 404;
        return "Transaction not found";
      }

      return transaction;
    },
  );

  application.get("/monthsStatuses",
  async (req: FastifyRequest, res: FastifyReply) => {
    const transactions = (await crud.getAllTransactions());
    const statuses = getMonthsStatuses(transactions);
    const response:MonthlyStatus[] = createMonthlyStatusesResponse(statuses);
    return (response);
  },
);


application.get("/transactionsInMonth",
  async (req: FastifyRequest, res: FastifyReply) => {
    const transactions:MoneyTransaction[] = JSON.parse(JSON.stringify((await crud.getAllTransactions())));
    const query = JSON.parse(JSON.stringify(req.query));
    if (!isValidRequest(req)) {
      res.statusCode = 400;
      return;
    }
    return getTransactionsInMonth(transactions, +query['month'], +query['year'])
  },
);

  application.delete(
    "/:transactionID",
    async (req: FastifyRequest, res: FastifyReply) => {
      const transactionID: string = getTransactionID(req);
      const deletedTransaction = await crud.deleteTransaction(transactionID);
      if (null == deletedTransaction) {
        res.statusCode = 404;
        return "Transaction " + transactionID + " not found";
      }
      return deletedTransaction;
    },
  );
};


export const getMonthsStatuses = (transactions: MoneyTransaction[]): Map<string, ApprovalStatus> => {

  return new Map<string, ApprovalStatus>(Object.entries(transactions.reduce<Record<string, ApprovalStatus>>((acc, transaction) => {
    const transactionDate = new Date(transaction.TransactionDate);
    const trxnMonthlyDate:string = (transactionDate.getFullYear().toString()) + (transactionDate.getMonth() + 1).toString();
    const prev = acc[trxnMonthlyDate];
    
    return {
      ...acc,
      [trxnMonthlyDate]: (prev ? Math.min(prev, transaction.Status):  transaction.Status)
    }
  }, {})));
}
