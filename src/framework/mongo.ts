const {MongoClient} = require("mongodb");
const dbName = "transactionsData";
const collName = "testCollection";
const uri = "mongodb://mongodb:27017";
const client = new MongoClient(uri);
module.exports.client = client;

module.exports.connectToDB = async () => {
    await client.connect();
}

module.exports.disconnectDB = async () => {
    await client.close();
}