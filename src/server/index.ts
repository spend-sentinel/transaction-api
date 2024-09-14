import { setRoutes } from "./routes.js";
import { gracefulShutdown } from "../framework/gracefulShutdown.js";
import { port, address } from "../framework/environment.js";
import { logger } from "../framework/logger.js";
import { ServerParams } from "../shared/types.js";

const serverParams:ServerParams = {
  host: address,
  port: port
}

export const setUpServer = (application: any) => {
  setRoutes(application);
  const server = application.listen(serverParams, () => {
    // Start activity of server
    logger.info(`Server is running at http://${address}:${port}`);
  });
  gracefulShutdown(server);
};
