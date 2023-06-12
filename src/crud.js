const fs = require('fs'); // appendFile, read, delete

const fileName = "../data.json";

const writeToFile = transactionsArray => {
    const content = JSON.stringify(transactionsArray, null, 2);
    fs.writeFileSync(fileName, content, 'utf8'); // Throws Error object
}

module.exports.getAllTransactions = () => JSON.parse(fs.readFileSync(fileName));

module.exports.createNewEntry = transaction => {
    const transactionsArray = module.exports.getAllTransactions();
    if (-1 != findTransactionIndex(transaction['TransNum'], transactionsArray)) {
        return 1;
    }
    transactionsArray.push(transaction);
    writeToFile(transactionsArray);
    return 0;
};

const findTransactionIndex = (transactionID, transactionsArray) => {
    const end = transactionsArray.length;
    for (let i = 0; i != end; i++) {
        if (transactionID == transactionsArray[i]["TransNum"]){
            return i;
        }
    }
    return -1;
};

module.exports.getSpecificTransaction = transactionID => {
    const transactionsArray = this.getAllTransactions();
    const transactionIndex = findTransactionIndex(transactionID, transactionsArray);
    if (-1 == transactionIndex) {
        return null;
    }
    return transactionsArray[transactionIndex];
};


module.exports.deleteTransaction = transactionID => {
    const transactionsArray = module.exports.getAllTransactions();
    const transactionIndex = findTransactionIndex(transactionID, transactionsArray);
    if (-1 != transactionIndex) {
        transactionsArray.splice(transactionIndex, 1);
        writeToFile(transactionsArray);
        return 0;
    }
    return 1; // Transition not found
};

module.exports.updateTransactionApproval = (transactionID, status) => {
    const transactionsArray = module.exports.getAllTransactions();
    const transactionIndex = findTransactionIndex(transactionID, transactionsArray);
    if (-1 != transactionIndex) {
        transactionsArray[transactionIndex]['Status'] = status;
        writeToFile(transactionsArray);
        return 0;
    }
    return 1;
};