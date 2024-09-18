import { logger } from "./logger.js";
import { Application } from "../shared/types.js";
import { disconnectDB } from "./mongo.js";
import { createTerminus, TerminusOptions } from "@godaddy/terminus";
import { isDBHealthy } from "./crud-db.js";

export const gracefulShutdown = (app: Application) => {
  const terminusOptions: TerminusOptions = {
    onShutdown: async () => {
      logger.info("Server shutting down");
    },
    onSignal: async () => {
      logger.info(
        "Received closing signal. shutting down server and disconnecting the db.",
      );
      await app.close();
      await disconnectDB();
    },
    healthChecks: {
      "/healthcheck": async () => ({ dbHealthy: await isDBHealthy() }),
    },
    caseInsensitive: true,
  };
  createTerminus(app.server, terminusOptions);
};
