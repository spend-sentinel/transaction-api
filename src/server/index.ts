import { setRoutes } from './routes'
import { gracefulShutdown } from '../framework/gracefulShutdown';
import { Application } from '../types';
import { port, address } from '../framework/environment';


export const setUpServer = (application: Application) => {
    setRoutes(application);
    const server = application.listen({ host: address, port: port }, () => { // Start activity of server
        console.log(`Server is running at http://localhost:${port}`);
    });
    
    gracefulShutdown(server);
}