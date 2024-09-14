import axios from "axios";
import { MoneyTransaction } from "../src/shared/types.js";

const url: string = "http://127.0.0.1:8080/";

const cleanUpDataBase = async () => {
  const response = await axios.get(url);

  if (200 != response.status) {
    console.log("bad response");
  }

  const transactionsInDataBase: MoneyTransaction[] = response.data;

  transactionsInDataBase.forEach((transaction) => {
    const transactionURL = url + transaction["TransNum"];
    try{
      axios.delete(transactionURL);
      console.log("Deleted", transaction["TransNum"]);
    } catch{
      console.log ("couldnt delete", transaction.TransNum);
    }
  });
};

cleanUpDataBase();
