import axios from "axios";
import { MoneyTransaction } from "../src/shared/types.js";

const url: string = "http://127.0.0.1:8080/";

const approveDataBase = async () => {
  const response = await axios.get(url);

  if (200 != response.status) {
    console.log("bad response");
  }

  const transactionsInDataBase: MoneyTransaction[] = response.data;

  transactionsInDataBase.forEach((transaction) => {
    transaction.Status = 2;
    try {
      axios.post(url, transaction);
      console.log("Approved", transaction["TransNum"]);
    } catch (e) {
      console.log("couldnt approve", transaction.TransNum, "ERROR", e);
      return;
    }
  });
};

approveDataBase();
