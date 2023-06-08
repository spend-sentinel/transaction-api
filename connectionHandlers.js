const bodyParser = require('body-parser'); // bodyParser.json
const crud = require('./crud.js'); // CreateNew, Get(Specific/All), DeleteSpecific, UpdateSpecific

module.exports.CreateConnectionHandlers = (serverApplication) => {
    serverApplication.use(bodyParser.json());

    serverApplication.post('/', postFunc);
    serverApplication.put('/', putFunc);
    serverApplication.get("/:transactionID?", getFunc);
    serverApplication.delete("/:transactionID", deleteFunc);
    console.log("Inserted funcs")
}

const postFunc = (req, res) => { // Handles POST request for inserting a new transaction
    try {
        const errors = crud.CreateNewEntry(req.body);
        if (errors) {
            res.statusCode = 409; // Conflict
            res.end("Transaction was already found in current data");
        } else {
            res.end("New transaction submitted")
        }
    }
    catch (err) {
        res.statusCode = 503; // Service unavaiable
        res.end();
    }
}

const putFunc = (req, res) => { // Handles PUT request for updating an existing transaction
    try {
        const errors = crud.UpdateTransactionApproval(req.body['TransNum'], req.body['Status']);
        if (!errors) {
            res.end("Approval of transaction updated")
        } else {
            res.statusCode(409);
            res.end("Transaction not found in attempt to update");
        }
    }
    catch (err) {
        res.statusCode = 503;
        res.end();
    }
}


const getFunc = (req, res) => { // Handles GET transactions 
    const transactionID = req.params.transactionID;
    try {
        if (!req.params.transactionID) { // transactionID unspecified, get all transactions
            res.end(JSON.stringify(crud.GetAllTransactions(), null, 2));
            return;
        }
        const transaction = crud.GetSpecificTransaction(transactionID);
        if (null != transaction) {
            res.end(JSON.stringify(transaction, null, 2));
        } else {
            res.statusCode = 404;
            res.end("Transaction not found");
        }
    }
    catch (err) {
        res.statusCode = 503;
        res.end();
    }
}

const deleteFunc = (req, res) => { // Handles DELETE with specific transacton
    const transactionID = req.params.transactionID;
    try {
        if (crud.DeleteTransaction(transactionID)) {
            res.statusCode = 404;
            res.end("Transaction " + transactionID + " not found");
        } else {
            res.end("Removed transaction " + transactionID);
        }
    }
    catch (err) {
        res.statusCode = 503;
        res.end();
    }
}

