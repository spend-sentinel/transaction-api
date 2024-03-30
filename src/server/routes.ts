import { FastifyRequest, FastifyReply } from "fastify";
import { transactionCreate } from "../framework/transactions";
import { MoneyTransaction, Application, MonthlyStatus, ApprovalStatus } from "../shared/types";
import cors from "@fastify/cors";
import * as crud from "../framework/crud-db";
import { createMonthlyStatusesResponse, isValidMonthYearQuery, queryContainsTime } from "./utils";
import { monthsStatusesSuffix, statusOfMonthSuffix, transactionsInMonthSuffix, transactionsSinceSuffix } from "../shared/routeNames";

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
    if (transactionToCreate.TransactionMonth.includes("NaN")) {
      res.statusCode = 400
      return;
    }
    return await crud.createNewEntry(transactionToCreate);
  });

  application.put("/", async (req: FastifyRequest, res: FastifyReply) => {
    const transactionToCreate: MoneyTransaction = transactionCreate(req);
    if (transactionToCreate.TransactionMonth.includes("NaN")) {
      res.statusCode = 400
      return;
    }
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

  application.get(monthsStatusesSuffix,
    async (req: FastifyRequest, res: FastifyReply) => {
      const transactions = (await crud.getAllTransactions());
      const statuses = getMonthsStatuses(transactions);
      const response:MonthlyStatus[] = createMonthlyStatusesResponse(statuses);
      return (response);
    },
  );

  application.get(statusOfMonthSuffix,
    async (req: FastifyRequest, res: FastifyReply) => {
      const query:any = req.query
      if (!isValidMonthYearQuery(query)) {
        res.statusCode = 400;
        return;
      }
      return crud.getStatusOfMonth(+query['month'], +query['year'])
    },
  );

  application.get(transactionsSinceSuffix,
    async (req: FastifyRequest, res: FastifyReply) => {
      const query:any = req.query
      if (!queryContainsTime(query)) {
        res.statusCode = 400;
        return;
      }
      return crud.getLatestTransactions(+query['time']);
    },
  );

  application.get(transactionsInMonthSuffix,
    async (req: FastifyRequest, res: FastifyReply) => {
      const query:any = req.query;
      if (!isValidMonthYearQuery(query)) {
        res.statusCode = 400;
        return;
      }
      return crud.getTransactionsInMonth(+query['month'], +query['year'])
    },
  );

  application.delete(
    "/:transactionID",
    async (req: FastifyRequest, res: FastifyReply) => {
      const transactionID: string = getTransactionID(req);
      const deletedTransaction = await crud.deleteTransaction(transactionID);
      if (null === deletedTransaction) {
        res.statusCode = 404;
        return "Transaction " + transactionID + " not found";
      }
      return deletedTransaction;
    },
  );
};


const getMonthsStatuses = (transactions: MoneyTransaction[]): Map<string, ApprovalStatus> => {
  return new Map<string, ApprovalStatus>(Object.entries(transactions.reduce<Record<string, ApprovalStatus>>((acc, transaction) => {
    const transactionDate = new Date(transaction.TransactionDate);
    const trxnMonthlyDate:string = (transactionDate.getFullYear().toString()) + (transactionDate.getMonth() + 1).toString();
    const prev = acc[trxnMonthlyDate];
    return {
      ...acc,
      [trxnMonthlyDate]: (undefined !== prev ? Math.min(prev, transaction.Status):  transaction.Status)
    }
  }, {})));
};
