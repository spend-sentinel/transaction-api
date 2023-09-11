import { MoneyTransaction } from "../src/types";

test("POST request", async () => {
    const data = {
        "TransNum": "POST_TEST",
        "Amount": 555,
        "Status": true,
        "TransactionDate": "2024-06-03T12:39:10.841Z"
    };
    const response = await fetch("http://127.0.0.1:8080/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const value = await response.json();
    expect(response.status).toBe(200);
    expect(value['TransNum']).toBe(data['TransNum']);
    expect(value['Status']).toBe(data['Status']);
    expect(value['Amount']).toBe(data['Amount']);
    expect(value['TransactionDate']).toBe(data['TransactionDate']);
});

test("PUT request (Initial value)", async () => {
    const data = {
        "TransNum": "PUT_TEST",
        "Amount": 555,
        "Status": true,
        "TransactionDate": "2024-06-03T12:39:10.841Z"
    };
    const response = await fetch("http://127.0.0.1:8080/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const value = await response.json();
    expect(response.status).toBe(200);
    expect(value['TransNum']).toBe(data['TransNum']);
    expect(value['Status']).toBe(data['Status']);
    expect(value['Amount']).toBe(data['Amount']);
    expect(value['TransactionDate']).toBe(data['TransactionDate']);
});

test("PUT request (Change value)", async () => {
    const data = {
        "TransNum": "PUT_TEST",
        "Amount": 888,
        "Status": false,
        "TransactionDate": "2021-03-03T12:23:10.841Z"
    };
    const response = await fetch("http://127.0.0.1:8080/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const value = await response.json();
    expect(response.status).toBe(200);
    expect(value['TransNum']).toBe(data['TransNum']);
    expect(value['Status']).toBe(data['Status']);
    expect(value['Amount']).toBe(data['Amount']);
    expect(value['TransactionDate']).toBe(data['TransactionDate']);
});

test("GET request for single item in db", async () => {
    const response = await fetch("http://127.0.0.1:8080/PUT_TEST");
    const data = await response.json();
    expect(data["TransNum"]).toBe("PUT_TEST");
    expect(data["Amount"]).toBe(888);
    expect(data["Status"]).toBe(false);
    expect(response.status).toBe(200);
});

test("GET request for entire db", async () => {
    const response = await fetch("http://127.0.0.1:8080/");
    const arr = await response.json();
    const data = arr.find((transaction:MoneyTransaction) => {
        return (transaction.TransNum === "PUT_TEST");
    });
    expect(data["TransNum"]).toBe("PUT_TEST");
    expect(data["Amount"]).toBe(888);
    expect(response.status).toBe(200);
});


test("GET request for single item NOT in db", async () => {
    const response = await fetch("http://127.0.0.1:8080/NOT_IN_DATABASE");
    expect(response.status).toBe(404);
});

test("Delete request (in database)", async () => {
    const data = {
        "TransNum": "DELETE_TEST",
        "Amount": 1234567890,
        "Status": false,
        "TransactionDate": "2024-06-03T12:39:10.841Z"
    };
    await fetch("http://127.0.0.1:8080/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const response = await fetch("http://127.0.0.1:8080/DELETE_TEST", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const value = await response.json();
    expect(response.status).toBe(200);
    expect(value['TransNum']).toBe(data['TransNum']);
    expect(value['Status']).toBe(data['Status']);
    expect(value['Amount']).toBe(data['Amount']);
    expect(value['TransactionDate']).toBe(data['TransactionDate']);
});


test("Delete request (NOT in database)", async () => {
    const data = {
        "TransNum": "DELETE_TEST",
        "Amount": 1234567890,
        "Status": false,
        "TransactionDate": "2024-06-03T12:39:10.841Z"
    };
    const response = await fetch("http://127.0.0.1:8080/DELETE_TEST", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    expect(response.status).toBe(404);
});

test("Clearing tests from db", async () => {
  const data = {
      "TransNum": "DELETE_TEST",
      "Amount": 1234567890,
      "Status": false,
      "TransactionDate": "2024-06-03T12:39:10.841Z"
  };
  const response = await fetch("http://127.0.0.1:8080/POST_TEST", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  expect(response.status).toBe(200);
});

test("Clearing tests from db", async () => {
  const data = {
      "TransNum": "PUT_TEST",
      "Amount": 1234567890,
      "Status": false,
      "TransactionDate": "2024-06-03T12:39:10.841Z"
  };
  const response = await fetch("http://127.0.0.1:8080/PUT_TEST", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  expect(response.status).toBe(200);
});