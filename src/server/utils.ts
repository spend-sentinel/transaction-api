import { FastifyRequest } from "fastify";
import { ApprovalStatus, MonthlyStatus } from "../types";

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

export const createMonthlyStatusesResponse = (statuses: Map<string, ApprovalStatus>): MonthlyStatus[] => {
  const monthlyStatuses:MonthlyStatus[] = [];
  statuses.forEach((status, date) => {
    const year = +date.substring(0, 4);
    const month = +date.substring(4);
    monthlyStatuses.push({year: year, month: month, status: status});
  });

  return monthlyStatuses;
}

export const formatDateInMMYYYY = (month:number, year:number):string => {
  return (month > 9 ? String(month) : "0" + String(month)) + "/" + String(year);
}