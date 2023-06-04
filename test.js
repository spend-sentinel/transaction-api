const getTransac = require('./simple_server'); //GetTransactions

const transactions = getTransac.GetTransactions(null, null);
CreateNewEntry(transactions[0]);
CreateNewEntry(transactions[1]);
CreateNewEntry(transactions[2]);
DeleteTransaction(1);
UpdateTransaction(2, true);
