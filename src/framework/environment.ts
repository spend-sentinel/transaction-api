import env from "env-var";

export const port = env.get("PORT").required().asIntPositive();
export const address = env.get("ADDRESS").required().asString();
export const collectionName = env.get("COLL_NAME").required().asString();
export const dBName = env.get("DB_NAME").required().asString();
export const mongoUri = env.get("MONGO_URI").required().asString();
