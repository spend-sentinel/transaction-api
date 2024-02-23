import { CompanyTypes } from "israeli-bank-scrapers";

export const url: string = "http://127.0.0.1:8080/";

const intervalMinutes = 60;
export const intervalMS = intervalMinutes * 1000 * 60;

const getCompanyIdAsType = (companyIdString: keyof typeof CompanyTypes) => {
  return CompanyTypes[companyIdString];
};

export const getCompanyID = (): any => {
  const companyID: any = process.env["companyID"];
  if (undefined == companyID) {
    throw "No company ID in envrionmental variables";
  }
  return CompanyTypes[getCompanyIdAsType(companyID)];
};

export const getCredentials = () => {
  const id: string | undefined = process.env["IsraelID"];
  const card6Digits: string | undefined = process.env["card6Digits"];
  const password: string | undefined = process.env["isracardPassword"];

  if (undefined == id || undefined == card6Digits || password == undefined) {
    throw "Credentials are not in envrionmental variables";
  }
  return {
    id: id,
    card6Digits: card6Digits,
    password: password,
  };
};
