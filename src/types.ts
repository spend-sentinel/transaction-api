import { FastifyBaseLogger, FastifyInstance, FastifyTypeProviderDefault } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

export type Application = FastifyInstance<Server<typeof IncomingMessage, typeof ServerResponse>, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, FastifyTypeProviderDefault>;

export type MoneyTransaction = {
    TransNum: string,
    Status: boolean
    Amount: number,
    Currency: string,
    TransactionDate: string
    Description: string
};