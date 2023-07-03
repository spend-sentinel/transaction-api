const fs = require('fs'); // appendFile, read, delete
const mongoClient = require("../framework/mongo.ts");
const dBName = "transactionsData";
const collectionName = "testCollection";
const URI = "mongodb://mongodb:27017";
const monClient = mongoClient.client;

const getCollection = () => {
    return monClient.db(dBName).collection(collectionName)
}

module.exports.connectToDB = async () => {
    await monClient.connect();
}

module.exports.disconnectDB = async () => {
    await monClient.close();
}

module.exports.getAllTransactions = async () => {
    return getCollection().find().toArray();
}

module.exports.getSpecificTransaction = async (transactionID: string) => {
    return getCollection().findOne({ TransNum: transactionID });
}

module.exports.createNewEntry = async transaction => {
    const found = await getCollection().findOne({ TransNum: transaction['TransNum'] });
    if (null == found) { // Transaction is not in database
        getCollection().insertOne(transaction);
        return transaction;
    }
    return null; // Conflict
};

module.exports.deleteTransaction = async (transactionID:string)=> {
    return ((await getCollection().findOneAndDelete({ TransNum: transactionID }))).value;
};

module.exports.updateTransactionApproval = async (transactionID: string, status:boolean) => {
    return ((await getCollection().findOneAndUpdate(
        { TransNum: transactionID },
        { $set: { Status: status } },
        { "returnDocument": 'after', "returnOriginal": false }
    )).value);
}