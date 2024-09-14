import { fastify } from "fastify";
import { setUpServer } from "./server/index.js";
import * as mongo from "./framework/mongo.js";
import { logger } from "./framework/logger.js";

const application = fastify({
  logger,
});

const main = async () => {
  logger.info("Connectiong to db...");
  await mongo.connectToDB();
  setUpServer(application);
};

main().catch(console.error);
