import { FastifyRequest, FastifyReply, fastify } from 'fastify';
import { MoneyTransaction, isRealTransaction, TransactionCreate } from './framework/transactions';
//const serverIndex = require('./server/index.ts');
const mongo = require('./framework/mongo.ts');
const gracefulShutdown = require('./framework/gracefulShutdown.js'); // TODO: gracefulShutdown to typescript
const application = fastify();
const crud = require('./framework/crud-db.ts');
const { ADDRESS = '0.0.0.0', PORT = '8080' } = process.env;
// Server Configuration

const main = async () => {
    console.log("Connectiong to db...");
    await mongo.connectToDB();
    
    const server = application.listen({ host: ADDRESS, port: parseInt(PORT, 10) }, () => { // Start activity of server
        console.log(`Server is running at http://localhost:${PORT}`);
    });
    
    gracefulShutdown(server);
};

application.post('/', async (req:FastifyRequest, res:FastifyReply) => {
    const newTransaction:MoneyTransaction = TransactionCreate(req);
    await crud.createNewEntry(newTransaction)
    .then((newTransactionEntry:MoneyTransaction) => {
        if (!(isRealTransaction(newTransactionEntry))) {
            res.statusCode = 409; // Conflict
            res.send("Transaction was already found in current data");
        } else {
            res.send(JSON.stringify(newTransaction, null, 2));
        }
    })
//    .catch(next);
    return res;
});

application.put('/', async (req:FastifyRequest, res:FastifyReply) => {
    const body:any = req.body;
    const transactionID:string = body['TransNum'];
    const status:boolean = body['Status'];
    await crud.updateTransactionApproval(transactionID, status)
        .then((updatedTransaction:MoneyTransaction) => {
            if (null == updatedTransaction) {
                res.statusCode = 404;
                res.send("Transaction " + transactionID + " not found");
            } else {
                res.send(JSON.stringify(updatedTransaction, null, 2));
            }
        })
    //    .catch(next);
    return res;
});


const getTransactionID = (req:FastifyRequest) => {
    const params:any = req.params;
    return params['transactionID'];
}

application.get('/:transactionID', async (req:FastifyRequest, res:FastifyReply) => {
    const transactionID:string = getTransactionID(req);
    if ("" === transactionID) { // transactionID unspecified, get all transactions
        await crud.getAllTransactions()
            .then((arr:MoneyTransaction) => res.send(JSON.stringify(arr, null, 2)))
            //.catch();
    }

    await crud.getSpecificTransaction(transactionID)
        .then((transaction:MoneyTransaction) => {
            if (null != transaction) {
                res.send(JSON.stringify(transaction, null, 2));
            } else {
                res.statusCode = 404;
                res.send("Transaction not found");
            }
        })
        //.catch();
    return res;
});

application.delete('/:transactionID', async (req:FastifyRequest, res:FastifyReply) => {
    const transactionID:string = getTransactionID(req);
    await crud.deleteTransaction(transactionID)
        .then((deletedTransaction:MoneyTransaction) => {
            if (!deletedTransaction) {
                res.statusCode = 404;
                res.send("Transaction " + transactionID + " not found");
            } else {
                res.send(JSON.stringify(deletedTransaction, null, 2));
            }
        })
        //.catch();
    return res;
});


main()
    .catch(console.error);