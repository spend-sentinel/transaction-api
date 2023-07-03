const bodyParser = require('body-parser'); // bodyParser.json
const crud = require('./src/crud-db.js'); // CreateNew, Get(Specific/All), DeleteSpecific, UpdateSpecific

const handleInternalError = (res, err) => {
    res.statusCode = 500;
    res.end();
}

module.exports.configureHandlers = (serverApplication) => {
    serverApplication.use(bodyParser.json());
    serverApplication.post('/', postRequestHandler);
    serverApplication.put('/', putRequestHandler);
    serverApplication.get("/:transactionID?", getRequestHandler);
    serverApplication.delete("/:transactionID", deleteRequestHandler);
}

module.exports.disconnect = () => {
    crud.disconnectDB();
}

const postRequestHandler = (req, res) => { // Handles POST request for inserting a new transaction
    crud.createNewEntry(req.body)
        .then(result => {
            if (null == result) {
                res.statusCode = 409; // Conflict
                res.end("Transaction was already found in current data");
            } else {
                res.end("New transaction submitted");
            }
        })
        .catch(err => { handleInternalError(res, err) });
}

const putRequestHandler = (req, res) => { // Handles PUT request for updating an existing transaction
    crud.updateTransactionApproval(req.body['TransNum'], req.body['Status'])
        .then(updated => {
            if (0 == updated.matchedCount) {
                res.statusCode = 404;
                res.end("Transaction " + req.body['TransNum'] + " not found");
            } else {
                res.end("Transaction " + req.body['TransNum'] + "Updated to approval status:" + req.body['Status']);
            }
        })
        .catch(err => { handleInternalError(res, err); });
}


const getRequestHandler = (req, res) => { // Handles GET transactions 
    const transactionID = req.params.transactionID;
    if (!req.params.transactionID) { // transactionID unspecified, get all transactions
        crud.getAllTransactions()
            .then(arr => res.send(JSON.stringify(arr, null, 2)))
            .catch(err => { handleInternalError(res, err); });
        return;
    }

    crud.getSpecificTransaction(transactionID)
        .then(transaction => {
            if (null != transaction) {
                res.end(JSON.stringify(transaction, null, 2));
            } else {
                res.statusCode = 404;
                res.end("Transaction not found");
            }
        })
        .catch(err => { handleInternalError(res, err); });
}

const deleteRequestHandler = (req, res) => { // Handles DELETE with specific transacton
    const transactionID = req.params.transactionID;
    crud.deleteTransaction(transactionID)
        .then(deleted => {
            if (0 == deleted.deletedCount) {
                res.statusCode = 404;
                res.end("Transaction " + transactionID + " not found");
            } else {
                res.end("Removed transaction " + transactionID);
            }
        })
        .catch(err => { handleInternalError(res, err) });
}