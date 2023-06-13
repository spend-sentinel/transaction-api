const fs = require('fs'); // appendFile, read, delete
const {MongoClient} = require("mongodb");
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
    return client.db(dbName).collection(collName).findOne({TransNum: transactionID});
}

module.exports.createNewEntry = async transaction => {
    const collection = client.db(dbName).collection(collName);
    const found = await collection.findOne({TransNum: transaction['TransNum']});
    if (null == found) { // Transaction is not in database
        const result = collection.insertOne(transaction);
        return result;
    }
    return null; // Conflict
};

module.exports.deleteTransaction = async transactionID => {
    const collection = client.db(dbName).collection(collName);
    return await collection.deleteOne({TransNum: transactionID});
};

module.exports.updateTransactionApproval = async (transactionID, status) => {
    const collection = client.db(dbName).collection(collName);
    return collection.updateOne(
        { TransNum: transactionID},
        { $set: {Status: status}});
}