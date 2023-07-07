
/*const express = require('express')
const router = express.Router();
const crud = require('../framework/crud-db.ts');

router.post('/', (req, res, next) => {
    crud.createNewEntry(req.body)
        .then(newTransaction => {
            if (!newTransaction) {
                res.statusCode = 409; // Conflict
                res.end("Transaction was already found in current data");
            } else {
                res.end(JSON.stringify(newTransaction, null, 2));
            }
        })
        .catch(next);
});

router.put('/', (req, res, next) => {
    crud.updateTransactionApproval(req.body['TransNum'], req.body['Status'])
        .then(updatedTransaction => {
            if (!updatedTransaction) {
                res.statusCode = 404;
                res.end("Transaction " + req.body['TransNum'] + " not found");
            } else {
                res.end(JSON.stringify(updatedTransaction, null, 2));
            }
        })
        .catch(next);
});

router.get("/:transactionID?", (req, res, next) => {
    const transactionID = req.params.transactionID;
    if (!req.params.transactionID) { // transactionID unspecified, get all transactions
        crud.getAllTransactions()
            .then(arr => res.send(JSON.stringify(arr, null, 2)))
            .catch(next);
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
        .catch(next);
});

router.delete("/:transactionID", (req, res, next) => {
    const transactionID = req.params.transactionID;
    crud.deleteTransaction(transactionID)
        .then(deletedTransaction => {
            if (!deletedTransaction) {
                res.statusCode = 404;
                res.end("Transaction " + transactionID + " not found");
            } else {
                res.end(JSON.stringify(deletedTransaction, null, 2));
            }
        })
        .catch(next);
});

module.exports = router;
*/