import { MoneyTransaction } from "../types";
import { dBName, collectionName } from "./environment";
import { client } from "../framework/mongo";
import { WithId, Document } from "mongodb";

const getTransactionCollection = () => {
  return client.db(dBName).collection<MoneyTransaction>(collectionName);
};

export const getAllTransactions = () => {
  return getTransactionCollection().find().toArray();
};

export const getSpecificTransaction = async (
  transactionID: string,
): Promise<WithId<Document> | null> => {
  return getTransactionCollection().findOne({ TransNum: transactionID });
};

export const createNewEntry = async (
  transaction: MoneyTransaction,
): Promise<WithId<Document> | null> => {
  if (!transaction["TransNum"] || !transaction["Amount"]) {
    return null;
  }
  const filter = { TransNum: transaction["TransNum"] };
  return (
    await getTransactionCollection().findOneAndUpdate(filter, {
      $set: {
  
        TransNum: transaction["TransNum"],
        Status: (transaction["Status"] ? transaction["Status"] : 0),
        Description: (transaction["Description"] ? transaction["Description"] : "Unspecified"),
        Amount: transaction["Amount"],
        Currency: (transaction["Currency"] ? transaction["Currency"] : "NIS"),
        TransactionDate: (transaction["TransactionDate"] ? transaction["TransactionDate"] : new Date().toString()),
      },
    }, {
      upsert: true,
      returnDocument: "after",
    })
  ).value;
};

export const deleteTransaction = async (
  transactionID: string,
): Promise<WithId<Document> | null> => {
  return (await getTransactionCollection().findOneAndDelete({ TransNum: transactionID }))
    .value;
};
