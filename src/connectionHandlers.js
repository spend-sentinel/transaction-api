const bodyParser = require('body-parser'); // bodyParser.json
const crud = require('./crud-db.js'); // CreateNew, Get(Specific/All), DeleteSpecific, UpdateSpecific

module.exports.configureHandlers = (serverApplication) => {
    serverApplication.use(bodyParser.json());

    serverApplication.post('/', postFunc);
    serverApplication.put('/', putFunc);
    serverApplication.get("/:transactionID?", getFunc);
    serverApplication.delete("/:transactionID", deleteFunc);
    console.log("Inserted funcs")
}

const postFunc = (req, res) => { // Handles POST request for inserting a new transaction
    try {
        crud.createNewEntry(req.body).then(result => {
            if (null == result) {
                res.statusCode = 409; // Conflict
                res.end("Transaction was already found in current data");
            } else {
                res.end("New transaction submitted");
            }
        });
    }
    catch (err) {
        res.statusCode = 500; // Service unavaiable
        res.end();
    }
}

const putFunc = (req, res) => { // Handles PUT request for updating an existing transaction
    try {
        crud.updateTransactionApproval(req.body['TransNum'], req.body['Status']).then(updated=> {
            if (0 == updated.matchedCount) {
                res.statusCode = 404;
                res.end("Transaction " + req.body['TransNum'] + " not found");
            } else {
                res.end("Transaction " + req.body['TransNum'] + "Updated to approval status:" + req.body['Status']);
            }
        });
    }
    catch (err) {
        res.statusCode = 500;
        res.end();
    }
}


const getFunc = (req, res) => { // Handles GET transactions 
    const transactionID = req.params.transactionID;
    try {
        if (!req.params.transactionID) { // transactionID unspecified, get all transactions
            crud.getAllTransactions().then(arr => res.send(JSON.stringify(arr, null, 2)));
            return;
        }

        crud.getSpecificTransaction(transactionID).then(transaction => {
            if (null != transaction) {
                res.end(JSON.stringify(transaction, null, 2));
            } else {
                res.statusCode = 404;
                res.end("Transaction not found");
            }
        });
    }
    catch (err) {
        console.log(err);
        res.statusCode = 500;
        res.end();
    }
}

const deleteFunc = (req, res) => { // Handles DELETE with specific transacton
    const transactionID = req.params.transactionID;
    try {
        crud.deleteTransaction(transactionID).then(deleted => {
            if (0 == deleted.deletedCount) {
                res.statusCode = 404;
                res.end("Transaction " + transactionID + " not found");
            } else {
                res.end("Removed transaction " + transactionID);
            }
        });
    }
    catch (err) {
        res.statusCode = 500;
        res.end();
    }
}