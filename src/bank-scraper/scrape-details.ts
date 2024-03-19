import { CompanyTypes } from "israeli-bank-scrapers";
import fs from 'fs'

export const filePath = "./lastTransactionDate.txt";

export const getLastTransactionDate = ():Date => {
  const data = fs.readFileSync(filePath);
  if (!data) {
    throw "No data"
  }
  return new Date(+data);
}

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

export const url = "http://localhost:8080/"
