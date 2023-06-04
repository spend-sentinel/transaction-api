const crud = require('./crud.js'); // CreateNew, Get(Specific/All), DeleteSpecific, UpdateSpecific
const express = require('express'); // express()
const bodyParser = require('body-parser'); // bodyParser.json

const serverApplication = express(); // use, post, delete, get, delete, listen
const jsonParser = bodyParser.json();

// transactions/1

//  Functions
const ExtractTransactionNumber = route => {
    return parseInt(route.slice(1));
}

const GetRoute = req => {
    return (req.params['0']);
}


// Server Configuration
const portNum = 8080;
serverApplication.use(bodyParser.json());

serverApplication.post('/', (req, res) => { // Handles POST request for inserting a new transaction
    const status = crud.CreateNewEntry(req.body)
    if (!status) {
        res.end("New transaction submitted")
    } else if (1 == status) { 
        res.end("Transaction was already found in current data");
    } else {
        res.end("An error has occured while submitting the new transaction")
    }
})

serverApplication.put('/', (req, res) => { // Handles PUT request for updating an existing transaction
    const status = crud.UpdateTransactionserverApplicationroval(req.body['TransNum'], req.body['Status']);
    if (!status) {
        res.end("serverApplicationroval of transaction updated")
    } else if (-1 == status) {
        res.end("An error has occured while updating the tranaction")
    } else {
        res.end("Transaction not found in attempt to update");
    }
})

serverApplication.get("*", (req, res)=>{ // Handles GET transactions
    const route = GetRoute(req);
    if (1 == route.length){ // No text after '/'
        res.end(JSON.stringify(crud.GetAllTransactions(), null, 2));
    } else {
        const transaction = crud.GetSpecificTransaction(ExtractTransactionNumber(route));
        if (null != transaction) {
            res.end(JSON.stringify(transaction, null, 2));
        } else {
            res.end("Transaction not found");
        }
    }
})

serverApplication.delete("*", (req, res)=>{ // Handles DELETE with specific transacton
    const route = GetRoute(req);
    if (1 == route.length){ // No text after '/'
        res.end("Transaction number unspecified");
    } else {
        const transactionNumber = ExtractTransactionNumber(route);
        if (crud.DeleteTransaction(transactionNumber)) {
            res.end("Transaction #" + transactionNumber + " not found");
        } else {
            res.end("Removed transaction #" + transactionNumber);
        }
    }
})
// End of server configuration

serverApplication.listen(portNum, () => {
    console.log(`Server is running at http://localhost:${portNum}`);
});