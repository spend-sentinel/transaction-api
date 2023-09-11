import { FastifyBaseLogger, FastifyInstance, FastifyTypeProviderDefault } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

export type Application = FastifyInstance<Server<typeof IncomingMessage, typeof ServerResponse>, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, FastifyTypeProviderDefault>;

export type transaction = {
    TransNum:string,
    Amount: Number,
    Status: boolean,
    TransactionDate: string
}

export type MoneyTransaction = {
    TransNum: string,
    Status: boolean
    Amount: number,
    TransactionDate: String
};