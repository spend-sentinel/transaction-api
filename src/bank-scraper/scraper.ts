import { createScraper } from 'israeli-bank-scrapers';
import axios from 'axios'
import { Transaction, TransactionsAccount } from 'israeli-bank-scrapers/lib/transactions';
import { filePath, getLastTransactionDate, getTimeInMS, options, updateLatestTransactionDate, } from './scrape-details';
import { serverUrl } from '../server/routeNames';
import fs from 'fs'
import { credentials } from './credentials';

const postTransactionToServer = async (transaction:Transaction, cardNumber:string) => {
  const data =
    {
      "TransNum": transaction.identifier,
      "Amount": transaction.originalAmount / (transaction.installments ? transaction.installments.total : 1),
      "Currency": transaction.chargedCurrency,
      "Description": transaction.description,
      "TransactionDate": transaction.date,
      "CardNumber": cardNumber,
    }
  
  const response = await axios.post(serverUrl, data);
  if (200 !== response.status) {
    console.log("Failed to post transaction " + transaction.identifier);
  } else {
    console.log("Inserted transaction " + transaction.identifier + " to database");
  }
};

const scrape = async () => {
  try {
    options.startDate = getLastTransactionDate();
    const scraper = createScraper(options);
    const scrapeResult = await scraper.scrape(credentials);
    if (!scrapeResult.success) {
      throw new Error(scrapeResult.errorType);
    }

    if (!scrapeResult.accounts) {
      console.log("No accounts were found for given credentials");
      return;
    }

    let latestTransactionDate = new Date(0);
    scrapeResult.accounts.forEach((account:TransactionsAccount) => {
      const transactions = account.txns
      transactions.forEach((transaction:Transaction) => {
        postTransactionToServer(transaction, account.accountNumber);
        const transactionDate = new Date(transaction.date)
        latestTransactionDate = transactionDate > latestTransactionDate ? transactionDate : latestTransactionDate
      });
    });
    if (latestTransactionDate.getTime() !== (new Date(0)).getTime()) {
      updateLatestTransactionDate(latestTransactionDate);
    }
    console.log("Done");
  } catch(e:any) {
    console.error(`scraping failed for the following reason: ${e.message}`);
  }
};

setInterval(scrape, getTimeInMS(5));
scrape();
