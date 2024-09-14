import { Application } from "../shared/types.js";
import * as mongo from "./mongo.js";

export const gracefulShutdown = (server: Application) => {
  const atExitHandler = () => {
    server.close();
    mongo.disconnectDB();
  };

  process.once("SIGINT", atExitHandler);
  process.once("SIGTERM", atExitHandler);
};
