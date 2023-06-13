const express = require('express')
const router = express.Router();
const crud = require('../crud-db');

router.post('/', (req, res) => {
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
});

router.put('/', (req, res) => {
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
});

router.get("/:transactionID?", (req, res) => {
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
});

router.delete("/:transactionID", (req, res) => {
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
});

module.exports = router;