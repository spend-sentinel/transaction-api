import { CompanyTypes, ScraperScrapingResult, createScraper } from 'israeli-bank-scrapers';
import { Transaction } from 'israeli-bank-scrapers/lib/transactions';
import { MoneyTransaction } from './types';
import axios from 'axios';

const url:string = 'http://127.0.0.1:8080/';

const options = {
  companyId: CompanyTypes.isracard, 
  startDate: (new Date(Date.UTC(1994, 5, 20))),
  combineInstallments: false,
  showBrowser: true 
}; // TODO - Get from env

const credentials = {
  id: 'XXX',
  card6Digits: 'XXX',
  password: 'XXX'
}; // TODO - Get from env

const postToDataBase = async (data:MoneyTransaction): Promise<number> => {
  const requestHeaders = {
    'Content-Type': 'application/json',
  }  
   return (await axios.post(url,
                            JSON.stringify(data, null, 2),
                            {headers: requestHeaders})).status;
};

const updateTransactionsInDataBase = async (txns:Transaction[]) => {
  const response = await axios.get(url);

  if (200 != response.status) {
    return; // Nothing to do if could not get database items
  }

  const transactionsInDataBase = await response.data;
  
  txns.forEach(bankTransaction => {
    const identifier = bankTransaction.identifier?.toString();
    if (undefined !== identifier) {
      if (undefined == transactionsInDataBase.find((transaction:MoneyTransaction) => transaction.TransNum == identifier)) {
        // If the transaction is not already in database
        const data:MoneyTransaction = {
          TransNum: identifier,
          Status: false,
          Amount: bankTransaction.chargedAmount,
          TransactionDate: bankTransaction.date
        };
         postToDataBase(data)
         .then((status:number) => {
          if (200 == status) {
            // DO SOMETHING
          } else {
            // DO SOMETHING ELSE
          }
          })
          .catch((error:any) => {
            // DO A THIRD THING
          });
        }
    }
  });

};

const updateDataBase = async () => {
  try {
    const scraper = createScraper(options);
    const scrapeResult:ScraperScrapingResult = await scraper.scrape(credentials);
    
    if (!scrapeResult.success) {
      throw new Error(scrapeResult.errorType);
    }

    const accounts = scrapeResult.accounts;
    if (!accounts){
      throw new Error("No account found");
    }

    accounts.forEach(account => {
      updateTransactionsInDataBase(account.txns);
    });

  } catch(e:any) {
    console.error(`scraping failed for the following reason: ${e.message}`);
  }
};

const intervalMinutes = 10; // TODO from environment (?)
const intervalMS = intervalMinutes * 60 * 1000 // Unit transfer: 1000ms/s, 60 s/m 
setInterval(updateDataBase, intervalMS);
updateDataBase();