import { ApprovalStatus, MoneyTransaction } from "../types";
import { dBName, collectionName } from "./environment";
import { client } from "../framework/mongo";
import { WithId, Document } from "mongodb";
import { formatDateInMMYYYY } from "../server/utils";

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


export const getTransactionsInMonth = async (month:number, year:number) => {
  const formattedDate = formatDateInMMYYYY(month, year);
  const filter = { TransactionMonth: formattedDate }
  return getTransactionCollection().find(filter).toArray();
}

export const getStatusOfMonth = async (month:number, year:number):Promise<ApprovalStatus> => {
  const transactionsInMonth = await getTransactionsInMonth(month, year);
  let monthStatus = ApprovalStatus.approved;
  transactionsInMonth.forEach((transaction:MoneyTransaction) => {
    monthStatus = Math.min(monthStatus, transaction.Status);
  });
  return monthStatus
}

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
        Status: (undefined !== transaction["Status"] ? transaction["Status"] : 1),
        Description: (transaction["Description"] ? transaction["Description"] : "Unspecified"),
        Amount: transaction["Amount"],
        Currency: (transaction["Currency"] ? transaction["Currency"] : "NIS"),
        TransactionDate: (transaction["TransactionDate"] ? transaction["TransactionDate"] : new Date().toString()),
        TransactionMonth: (transaction["TransactionMonth"]),
        CardNumber: (transaction["CardNumber"]),
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
