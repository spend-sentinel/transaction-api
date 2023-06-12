const fs = require('fs'); // appendFile, read, delete
const {MongoClient} = require("mongodb");
const dbName = "transactionsData";
const collName = "testCollection";
const uri =
    "mongodb+srv://bennoachmaor:bgr5znTj@spend-sentinel.u0j3alq.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri);

module.exports.getAllTransactions = async () => {
    return (await client.connect()).db(dbName).collection(collName).find().toArray();
}

module.exports.getSpecificTransaction = async transactionID => {
    return (await client.connect()).db(dbName).collection(collName).findOne({TransNum: transactionID});
}

module.exports.createNewEntry = async transaction => {
    await client.connect();
    const collection = client.db(dbName).collection(collName);
    const found = await collection.findOne({TransNum: transaction['TransNum']});
    if (null == found) { // Transaction is not in database
        const result = collection.insertOne(transaction);
        return result;
    }
    return null; // Conflict
};

module.exports.deleteTransaction = async transactionID => {
    await client.connect();
    const collection = client.db(dbName).collection(collName);
    return await collection.deleteOne({TransNum: transactionID});
};

module.exports.updateTransactionApproval = async (transactionID, status) => {
    await client.connect();
    const collection = client.db(dbName).collection(collName);
    return collection.updateOne(
        { TransNum: transactionID},
        { $set: {Status: status}});
}