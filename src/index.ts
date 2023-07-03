const { application } = require('./server/index.ts');
const mongo = require('./framework/mongo.ts');
const gracefulShutdown = require('./framework/gracefulShutdown.js'); // TODO: gracefulShutdown to typescript

// Server Configuration
const portNum = 8080;

// End of server configuration
const main = async () => {
    await mongo.connectToDB();

    const server = application.listen(portNum, () => { // Start activity of server
        console.log(`Server is running at http://localhost:${portNum}`);
    });

    gracefulShutdown(server);
};

main()
    .catch(console.error);