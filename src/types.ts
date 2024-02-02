import {
  FastifyBaseLogger,
  FastifyInstance,
  FastifyTypeProviderDefault,
} from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";

export type Application = FastifyInstance<
  Server<typeof IncomingMessage, typeof ServerResponse>,
  IncomingMessage,
  ServerResponse<IncomingMessage>,
  FastifyBaseLogger,
  FastifyTypeProviderDefault
>;

export type MoneyTransaction = {
  _id?: string;
  TransNum: string;
  Status: number;
  Amount: number;
  Currency: string;
  TransactionDate: string;
  Description: string;
};

export type MonthlyStatuses = {
  year:number;
  month:number;
  status:number;
};

export enum ApprovalStatus {
  unspecified = 0,
  approved = 1,
  denied = 2,
};