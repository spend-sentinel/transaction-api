const fs = require('fs'); // appendFile, read, delete

const fileName = "data.json";

module.exports.GetAllTransactions = () => JSON.parse(fs.readFileSync(fileName));

module.exports.CreateNewEntry = transaction => {
    const transactionsArray = module.exports.GetAllTransactions();
    if (-1 != FindTransactionIndex(transaction['TransNum'], transactionsArray)) {
        return 1;
    }
    transactionsArray.push(transaction);
    const content = JSON.stringify(transactionsArray, null, 2);
    fs.writeFileSync("data.json", content, 'utf8', function(err) {
        if (err) {
            return -1;
        }
    })
    return 0;
};

const FindTransactionIndex = (transactionNumber, transactionsArray) => {
    const end = transactionsArray.length;
    for (let i = 0; i != end; i++) {
        if (transactionNumber == transactionsArray[i]["TransNum"]){
            return i;
        }
    }
    return -1;
};

module.exports.GetSpecificTransaction = transactionNumber => {
    const transactionsArray = this.GetAllTransactions();
    const transactionIndex = FindTransactionIndex(transactionNumber, transactionsArray);
    if (-1 == transactionIndex) {
        return null;
    }
    return transactionsArray[transactionIndex];
};


module.exports.DeleteTransaction = transactionNumber => {
    const transactionsArray = module.exports.GetAllTransactions();
    const transactionIndex = FindTransactionIndex(transactionNumber, transactionsArray);
    if (-1 != transactionIndex) {
        transactionsArray.splice(transactionIndex, 1);
        fs.writeFileSync("data.json", JSON.stringify(transactionsArray, null, 2), 'utf8', function(err) {
            if (err) {
                return -1;
            }
        })
        return 0;
    }
    return 1; // Transition not found
};

module.exports.UpdateTransactionApproval = (transactionNumber, status) => {
    const transactionsArray = module.exports.GetAllTransactions();
    const transactionIndex = FindTransactionIndex(transactionNumber, transactionsArray);
    if (-1 != transactionIndex) {
        transactionsArray[transactionIndex]['Status'] = status;
        fs.writeFileSync("data.json", JSON.stringify(transactionsArray, null, 2), 'utf8', function(err) {
            if (err) {
                console.log("An error has occured!");
                return -1;
            }
        })
        return 0;
    }
    return 1;
};

