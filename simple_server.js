
// "Main"
var http = require('http');
const portNum = 8080;
http.createServer(ConnectionHandler).listen(portNum);
// END "Main"


//  Functions
function ConnectionHandler(req, res){
    console.log("Received connection request from IP:"); 
    fetch('https://api.ipify.org?format=json').then(response => response.json()).then(data => console.log(data.ip));
    res.writeHead(200, {'Content-Type': 'application/json'});
    var transactions = GetTransactions(req, res);
    res.end(JSON.stringify(transactions, null, 2));
}

function GetTransactions(req, res) {
// placeholder until implemented the actual GetTransactions
    const date = new Date
    let transactions = [
    {
        "TransNum": 1,
        "Amount:": 10,
        "Status:": true,
        "TransactionDate": date
    },
    {
        "TransNum": 2,
        "Amount:": 40,
        "Status:": false,
        "TransactionDate": date
    },
    {
        "TransNum": 3,
        "Amount:": 15,
        "Status:": false,
        "TransactionDate": date
    },
];
    return transactions;
}
