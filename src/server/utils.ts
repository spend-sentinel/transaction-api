import {
  ApprovalStatus,
  MoneyTransactionQuery,
  MonthlyStatus,
} from "../shared/types.js";

export const queryContainsTime = (query: MoneyTransactionQuery) => {
  if (!query.time) return undefined;
  return +query.time;
};

export const getMonthAndYearFromQuery = (
  query: MoneyTransactionQuery,
): [number, number] | undefined => {
  if (!query.month || !query.year) return undefined;

  const month = +query.month;
  if (month < 1 || month > 12) return undefined;

  const year = +query.year;
  if (year < 1970 || year > new Date().getFullYear()) return undefined;

  return [month, year];
};

export const createMonthlyStatusesResponse = (
  statuses: Map<string, ApprovalStatus>,
): MonthlyStatus[] => {
  const monthlyStatuses: MonthlyStatus[] = [];
  statuses.forEach((status, date) => {
    const year = +date.substring(0, 4);
    const month = +date.substring(4);
    monthlyStatuses.push({ year: year, month: month, status: status });
  });

  return monthlyStatuses;
};

export const formatDateInMMYYYY = (month: number, year: number): string => {
  return (month > 9 ? String(month) : "0" + String(month)) + "/" + String(year);
};
