import axios from "axios";
import { MoneyTransaction } from "../src/shared/types";

const url: string = "http://127.0.0.1:8080/";

const cleanUpDataBase = async () => {
  const response = await axios.get(url);

  if (200 != response.status) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const transactionsInDataBase: MoneyTransaction[] = response.data;

  transactionsInDataBase.forEach((transaction) => {
    const transactionURL = url + transaction["TransNum"];
    axios.delete(transactionURL);
    console.log(transaction);
  });
};

cleanUpDataBase();
