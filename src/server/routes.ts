import { FastifyRequest, FastifyReply } from "fastify";
import { MoneyTransaction, transactionCreate } from "../framework/transactions";
import { Application } from "../types";
import cors from "@fastify/cors";
import * as crud from "../framework/crud-db";

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
