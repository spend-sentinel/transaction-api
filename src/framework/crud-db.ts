import { MoneyTransaction } from '../framework/transactions';
import { dBName, collectionName } from './environment';
import { client } from "../framework/mongo";
import { WithId, Document,  } from 'mongodb';

const getCollection = () => {
    return client.db(dBName).collection(collectionName!)
}

export const getAllTransactions = async (): Promise<WithId<Document>[] | null[]> => {
    return getCollection().find().toArray();
}

export const getSpecificTransaction = async (transactionID:string): Promise<WithId<Document> | null> => {
    return getCollection().findOne({ TransNum: transactionID });
};

export const createNewEntry = async (transaction:MoneyTransaction): Promise<WithId<Document> | null> => {
    const filter = { 'TransNum': transaction['TransNum'] };
    const update = { "$set": {
                        'TransNum': transaction['TransNum'],
                        'Amount': transaction['Amount'],
                        'TransactionDate': transaction['TransactionDate'],
                        'Status': transaction['Status'] }};
    return (await getCollection().findOneAndUpdate(filter, update, {
        upsert: true,
        returnDocument: "after"
    })).value;
};

export const deleteTransaction = async (transactionID:string): Promise<WithId<Document> | null> => {
    return ((await getCollection().findOneAndDelete({ TransNum: transactionID }))).value;
};

// export const updateTransactionApproval = async (transactionID:string, status:boolean): Promise<WithId<Document> | null> => {
//     return ((await getCollection().findOneAndUpdate(
//         { TransNum: transactionID },
//         { $set: { Status: status } },
//         { "returnDocument": 'after'/*, "returnOriginal": false*/ }
//     )).value);


// export const updateTransaction = async (transaction: MoneyTransaction) => {
//     return ((await getCollection().findOneAndUpdate(
//         { TransNum: transactionID },
//         { $set: { Status: status } },
//         { "returnDocument": 'after'/*, "returnOriginal": false*/ }
//     )).value);
// }