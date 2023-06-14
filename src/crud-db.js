const fs = require('fs'); // appendFile, read, delete
const { MongoClient } = require("mongodb");
const dbName = "transactionsData";
const collName = "testCollection";
const uri = "mongodb://mongodb:27017";
const client = new MongoClient(uri);

const getCollection = () => {
    return client.db(dbName).collection(collName)
}

module.exports.connectToDB = async () => {
    await client.connect();
}

module.exports.disconnectDB = async () => {
    await client.close();
}

module.exports.getAllTransactions = async () => {
    return getCollection().find().toArray();
}

module.exports.getSpecificTransaction = async transactionID => {
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

module.exports.deleteTransaction = async transactionID => {
    return ((await getCollection().findOneAndDelete({ TransNum: transactionID }))).value;
};

module.exports.updateTransactionApproval = async (transactionID, status) => {
    return ((await getCollection().findOneAndUpdate(
        { TransNum: transactionID },
        { $set: { Status: status } },
        { "returnDocument": 'after', "returnOriginal": false }
    )).value);
}