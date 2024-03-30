import { CompanyTypes } from "israeli-bank-scrapers";
import { getLastTransactionDate } from "./lastTransactionState";

export const filePath = "./lastTransactionDate.txt";


export const options = {
  companyId: CompanyTypes.visaCal, 
  startDate: getLastTransactionDate(),
  combineInstallments: false,
  showBrowser: false 
};

export const getTimeInMS = (numMinutes: number) => {
  const secondsInMin = 60;
  const millisecondsInSec = 1000;
  return (numMinutes * secondsInMin * millisecondsInSec);
}
