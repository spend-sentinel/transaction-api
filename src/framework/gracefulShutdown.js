module.exports = (server) => {
    const atExitHandler = () => {
        server.close();
        connectHandler.disconnect();
    };
    
    process.once('SIGINT', atExitHandler);
    process.once('SIGTERM', atExitHandler);
};
