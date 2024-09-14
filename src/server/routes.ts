import { FastifyRequest, FastifyReply } from "fastify";
import { transactionCreate } from "../framework/transactions.js";
import {
  MoneyTransaction,
  Application,
  MonthlyStatus,
  ApprovalStatus,
  MoneyTransactionQuery,
} from "../shared/types.js";
import cors from "@fastify/cors";
import * as crud from "../framework/crud-db.js";
import {
  createMonthlyStatusesResponse,
  getMonthAndYearFromQuery as getMonthAndYearFromQuery,
  queryContainsTime,
} from "./utils.js";
import {
  monthsStatusesSuffix,
  statusOfMonthSuffix,
  transactionsInMonthSuffix,
  transactionsSinceSuffix,
} from "../shared/routeNames.js";

const getTransactionID = (req: FastifyRequest) => {
  const params = req.params as MoneyTransactionQuery;
  return params.transactionID;
};

export const setRoutes = (application: Application) => {
  application.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
  });
  application.post("/", async (req: FastifyRequest, res: FastifyReply) => {
    const transactionToCreate: MoneyTransaction = transactionCreate(req);
    if (transactionToCreate.TransactionMonth.includes("NaN")) {
      res.statusCode = 400;
      return;
    }
    return await crud.createNewEntry(transactionToCreate);
  });

  application.put("/", async (req: FastifyRequest, res: FastifyReply) => {
    const transactionToCreate: MoneyTransaction = transactionCreate(req);
    if (transactionToCreate.TransactionMonth.includes("NaN")) {
      res.statusCode = 400;
      return;
    }
    return await crud.createNewEntry(transactionToCreate);
  });

  application.get(
    "/:transactionID",
    async (req: FastifyRequest, res: FastifyReply) => {
      const transactionID = getTransactionID(req);
      if (!transactionID) {
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

  application.get(monthsStatusesSuffix, async () => {
    const transactions = await crud.getAllTransactions();
    const statuses = getMonthsStatuses(transactions);
    const response: MonthlyStatus[] = createMonthlyStatusesResponse(statuses);
    return response;
  });

  application.get("/notReportedToBot", async () => {
    return await crud.getNoneReportedTransactions();
  });

  application.get(
    statusOfMonthSuffix,
    async (req: FastifyRequest, res: FastifyReply) => {
      const query: MoneyTransactionQuery = req.query as MoneyTransactionQuery;
      const monthAndYear = getMonthAndYearFromQuery(query);
      if (!monthAndYear) {
        res.statusCode = 400;
        return;
      }
      return crud.getStatusOfMonth(monthAndYear[0], monthAndYear[1]);
    },
  );

  application.get(
    transactionsSinceSuffix,
    async (req: FastifyRequest, res: FastifyReply) => {
      const time = queryContainsTime(req.query as MoneyTransactionQuery);
      if (time === undefined) {
        res.statusCode = 400;
        return;
      }
      return crud.getLatestTransactions(time);
    },
  );

  application.get(
    transactionsInMonthSuffix,
    async (req: FastifyRequest, res: FastifyReply) => {
      const monthAndYear = getMonthAndYearFromQuery(
        req.query as MoneyTransactionQuery,
      );
      if (!monthAndYear) {
        res.statusCode = 400;
        return;
      }
      return crud.getTransactionsInMonth(monthAndYear[0], monthAndYear[1]);
    },
  );

  application.delete(
    "/:transactionID",
    async (req: FastifyRequest, res: FastifyReply) => {
      const transactionID = getTransactionID(req);
      if (!transactionID) {
        res.statusCode = 400;
        return "No transactionID given";
      }
      const deletedTransaction = await crud.deleteTransaction(transactionID);
      if (null === deletedTransaction) {
        res.statusCode = 404;
        return "Transaction " + transactionID + " not found";
      }
      return deletedTransaction;
    },
  );
};

const getMonthsStatuses = (
  transactions: MoneyTransaction[],
): Map<string, ApprovalStatus> => {
  return new Map<string, ApprovalStatus>(
    Object.entries(
      transactions.reduce<Record<string, ApprovalStatus>>(
        (acc, transaction) => {
          const transactionDate = new Date(transaction.TransactionDate);
          const trxnMonthlyDate: string =
            transactionDate.getFullYear().toString() +
            (transactionDate.getMonth() + 1).toString();
          const prev = acc[trxnMonthlyDate];
          return {
            ...acc,
            [trxnMonthlyDate]:
              undefined !== prev
                ? Math.min(prev, transaction.Status)
                : transaction.Status,
          };
        },
        {},
      ),
    ),
  );
};
