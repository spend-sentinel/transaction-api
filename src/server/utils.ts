import { FastifyRequest } from "fastify";
import { ApprovalStatus, MonthlyStatuses } from "../types";

export const isValidRequest = (req:FastifyRequest): boolean => {
    const query = JSON.parse(JSON.stringify(req.query));
    if (!(('month') in query)) {
      return false;
    }
  
    const month = +query['month'];
    if (month < 1 || month > 12) {
      return false;
    }
  
    if (!(('year') in query)) {
      return false;
    }
    
    return true;
  }

export const createMonthlyStatusesResponse = (statuses: Map<string, ApprovalStatus>): MonthlyStatuses[] => {
  const monthlyStatuses:MonthlyStatuses[] = [];
  statuses.forEach((status, date) => {
    const year = +date.substring(0, 4);
    const month = +date.substring(4);
    monthlyStatuses.push({year: year, month: month, status: status});
  });

  return monthlyStatuses;
}