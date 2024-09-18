import { setRoutes } from "./routes.js";
import { gracefulShutdown } from "../framework/gracefulShutdown.js";
import { port, address } from "../framework/environment.js";
import { logger } from "../framework/logger.js";
import { Application, ServerParams } from "../shared/types.js";

const serverParams: ServerParams = {
  host: address,
  port: port,
};

export const setUpServer = (application: Application) => {
  setRoutes(application);
  application.listen(serverParams, () => {
    // Start activity of server
    logger.info({ address, port }, `server has started running`);
  });
  gracefulShutdown(application);
};
