const express = require('express'); // express()
const serverApplication = express(); // use, post, delete, get, delete, listen
const connectHandler = require('./connectionHandlers.js'); // CreateNew, Get(Specific/All), DeleteSpecific, UpdateSpecific
// Server Configuration
const portNum = 8080;
connectHandler.ConfigureHandlers(serverApplication);
// End of server configuration
serverApplication.listen(portNum, () => { // Start activity of server
    console.log(`Server is running at http://localhost:${portNum}`);
});