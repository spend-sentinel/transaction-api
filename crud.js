const fs = require('fs'); // appendFile, read, delete

const fileName = "data.json";

const WriteToFile = transactionsArray => {
    const content = JSON.stringify(transactionsArray, null, 2);
    fs.writeFileSync("data.json", content, 'utf8'); // Throws Error object
}

module.exports.GetAllTransactions = () => JSON.parse(fs.readFileSync(fileName));

module.exports.CreateNewEntry = transaction => {
    const transactionsArray = module.exports.GetAllTransactions();
    if (-1 != FindTransactionIndex(transaction['TransNum'], transactionsArray)) {
        return 1;
    }
    transactionsArray.push(transaction);
    WriteToFile(transactionsArray);
    return 0;
};

const FindTransactionIndex = (transactionID, transactionsArray) => {
    const end = transactionsArray.length;
    for (let i = 0; i != end; i++) {
        if (transactionID == transactionsArray[i]["TransNum"]){
            return i;
        }
    }
    return -1;
};

module.exports.GetSpecificTransaction = transactionID => {
    const transactionsArray = this.GetAllTransactions();
    const transactionIndex = FindTransactionIndex(transactionID, transactionsArray);
    if (-1 == transactionIndex) {
        return null;
    }
    return transactionsArray[transactionIndex];
};


module.exports.DeleteTransaction = transactionID => {
    const transactionsArray = module.exports.GetAllTransactions();
    const transactionIndex = FindTransactionIndex(transactionID, transactionsArray);
    if (-1 != transactionIndex) {
        transactionsArray.splice(transactionIndex, 1);
        WriteToFile(transactionsArray);
        return 0;
    }
    return 1; // Transition not found
};

module.exports.UpdateTransactionApproval = (transactionID, status) => {
    const transactionsArray = module.exports.GetAllTransactions();
    const transactionIndex = FindTransactionIndex(transactionID, transactionsArray);
    if (-1 != transactionIndex) {
        transactionsArray[transactionIndex]['Status'] = status;
        WriteToFile(transactionsArray);
        return 0;
    }
    return 1;
};