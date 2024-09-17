import { logger } from "./logger.js";
import { Application } from "../shared/types.js";
import * as mongo from "./mongo.js";
import { createTerminus, TerminusOptions } from "@godaddy/terminus";
import { isDBHealthy } from "./crud-db.js";

const loggerWrapper = (msg: string, err: Error) => {
  if (err) {
    logger.error(err.message);
  } else {
    logger.info(msg);
  }
};

export const gracefulShutdown = (app: Application) => {
  const terminusOptions: TerminusOptions = {
    onShutdown: async () => {
      logger.info("Server shutting down");
    },
    onSignal: async () => {
      await Promise.all([app.close(), mongo.disconnectDB()]);
    },
    healthChecks: {
      "/healthcheck": async () => {
        const response = {
          dbHealthy: await isDBHealthy(),
        };
        return response;
      },
    },
    caseInsensitive: true,
    logger: loggerWrapper,
  };
  createTerminus(app.server, terminusOptions);
};
