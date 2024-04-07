import { MongoClient } from "mongodb";
import { mongoUri } from "./environment";

export const client = new MongoClient(mongoUri);

export const connectToDB = async () => {
  await client.connect();
};

export const disconnectDB = async () => {
  await client.close();
};
