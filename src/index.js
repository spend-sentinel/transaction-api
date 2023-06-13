const { app } = require('./server/index.js');
const gracefulShutdown = require('./framework/gracefulShutdown.js');
const mongo = require('./framework/mongo.js');

// Server Configuration
const portNum = 8080;

// End of server configuration
const main = async () => {
    await mongo.connectToDB();

    const server = app.listen(portNum, () => { // Start activity of server
        console.log(`Server is running at http://localhost:${portNum}`);
    });

    gracefulShutdown(server);
};

main()
    .catch(console.error);