const MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017").then((client) => {
    console.log("Connected");
})
.catch(err => {
    console.error(err);
});