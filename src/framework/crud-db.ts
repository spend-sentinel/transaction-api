import { MoneyTransaction } from "../framework/transactions";
import { dBName, collectionName } from "./environment";
import { client } from "../framework/mongo";
import { WithId, Document } from "mongodb";

const getCollection = () => {
  return client.db(dBName).collection(collectionName!);
};

export const getAllTransactions = async (): Promise<
  WithId<Document>[] | null[]
> => {
  return getCollection().find().toArray();
};

export const getSpecificTransaction = async (
  transactionID: string,
): Promise<WithId<Document> | null> => {
  return getCollection().findOne({ TransNum: transactionID });
};

export const createNewEntry = async (
  transaction: MoneyTransaction,
): Promise<WithId<Document> | null> => {
  if (!transaction["TransNum"] || !transaction["Amount"]) {
    return null;
  }
  const filter = { TransNum: transaction["TransNum"] };
  const update = {
    $set: {
      TransNum: transaction["TransNum"],
      Status: (transaction["Status"] ? transaction["Status"] : 0),
      Description: (transaction["Description"] ? transaction["Description"] : "Unspecified"),
      Amount: transaction["Amount"],
      Currency: (transaction["Currency"] ? transaction["Currency"] : "NIS"),
      TransactionDate: (transaction["TransactionDate"] ? transaction["TransactionDate"] : new Date()),
    },
  };
  return (
    await getCollection().findOneAndUpdate(filter, update, {
      upsert: true,
      returnDocument: "after",
    })
  ).value;
};

export const deleteTransaction = async (
  transactionID: string,
): Promise<WithId<Document> | null> => {
  return (await getCollection().findOneAndDelete({ TransNum: transactionID }))
    .value;
};
