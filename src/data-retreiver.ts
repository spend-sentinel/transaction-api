import { CompanyTypes, ScraperScrapingResult, createScraper } from 'israeli-bank-scrapers';
import { Transaction } from 'israeli-bank-scrapers/lib/transactions';
import { MoneyTransaction } from './types';
import { url, getCompanyID, getCredentials, intervalMS } from './framework/data-retreiver-env';
import axios from 'axios';

const options = {
  companyId: getCompanyID(), 
  startDate: (new Date(Date.UTC(1900, 0, 1))),
  combineInstallments: false,
  showBrowser: false 
};

const credentials = getCredentials();

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
          Amount: bankTransaction.originalAmount,
          Currency: bankTransaction.originalCurrency,
          TransactionDate: bankTransaction.date,
          Description: bankTransaction.description
        };
         postToDataBase(data)
         .then((status:number) => {
          if (200 == status) {
            // DO SOMETHING TODO
          } else {
            // DO SOMETHING ELSE TODO
          }
          })
          .catch((error:any) => {
            // DO A THIRD THING TODO
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

setInterval(updateDataBase, intervalMS);
updateDataBase();
