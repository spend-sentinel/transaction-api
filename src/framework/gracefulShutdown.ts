import { logger } from "./logger.js";
import { disconnectDB } from "./mongo.js";
import { createTerminus, TerminusOptions } from "@godaddy/terminus";
import { isDBHealthy } from "./crud-db.js";
import { application } from "../server/routes.js";

export const gracefulShutdown = () => {
  const terminusOptions: TerminusOptions = {
    onShutdown: async () => {
      logger.info("Server shutting down");
    },
    onSignal: async () => {
      logger.info(
        "Received closing signal. shutting down server and disconnecting the db.",
      );
      await application.close();
      await disconnectDB();
    },
    healthChecks: {
      "/healthcheck": async () => ({ dbHealthy: await isDBHealthy() }),
    },
    caseInsensitive: true,
  };
  createTerminus(application.server, terminusOptions);
};
