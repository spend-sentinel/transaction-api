import { setRoutes } from "./routes.js";
import { gracefulShutdown } from "../framework/gracefulShutdown.js";
import { port, address } from "../framework/environment.js";
import { logger } from "../framework/logger.js";

export const setUpServer = (application: any) => {
  setRoutes(application);
  const server = application.listen({ host: address, port: port }, () => {
    // Start activity of server
    logger.info(`Server is running at http://${address}:${port}`);
  });
  gracefulShutdown(server);
};
