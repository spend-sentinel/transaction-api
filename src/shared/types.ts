import { FastifyInstance, FastifyTypeProviderDefault } from "fastify";

import { pino } from "pino";

import { Server, IncomingMessage, ServerResponse } from "http";

export type Application = FastifyInstance<
  Server<typeof IncomingMessage, typeof ServerResponse>,
  IncomingMessage,
  ServerResponse<IncomingMessage>,
  pino.Logger,
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
  TransactionMonth: string;
  CardNumber: string;
  ReportedToBot: boolean;
};

export type MonthlyStatus = {
  year: number;
  month: number;
  status: number;
};

export enum ApprovalStatus {
  denied = 0,
  unspecified = 1,
  approved = 2,
}

export type ServerParams = {
  host: string;
  port: number;
};

export type MoneyTransactionQuery = {
  time?: string;
  month?: string;
  year?: string;
  transactionID?: string;
};
