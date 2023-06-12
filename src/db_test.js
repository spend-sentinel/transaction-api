const { MongoClient } = require("mongodb");
const uri =
    "mongodb+srv://bennoachmaor:bgr5znTj@spend-sentinel.u0j3alq.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri);
async function run() {
  try {
    await client.connect();
    // database and collection code goes here
    const db = client.db("sample_guides");
    const coll = db.collection("planets");
    // find code goes here
    const cursor = coll.find();
    // iterate code goes here
    await cursor.forEach(console.log);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);