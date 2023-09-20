import { createApp } from "https://mavue.mavo.io/mavue.js";

globalThis.app = createApp({
  data: {
    expenses: [], // Initialize the expenses array
    newExpense: {
      title: "",
      amount: 0,
      payer: "",
      payee: "",
      date: "",
      currency: "BZD"
    }
  },

  methods: {
    currencyConvert(from, to, amount) {
      const rates = {
        BZD: 1,
        MXN: 8.73,
        GTQ: 3.91
      };

      return amount * rates[to] / rates[from];
    },

    addExpense() {
      // Add the new expense to the expenses array
      this.expenses.push({
        title: this.newExpense.title,
        amount: parseFloat(this.newExpense.amount),
        payer: this.newExpense.payer,
        payee: this.newExpense.payee,
        date: this.newExpense.date,
        currency: this.newExpense.currency
      });

      // Clear the newExpense object for the next entry
      this.newExpense = {
        title: "",
        amount: 0,
        payer: "",
        payee: "",
        date: "",
        currency: "BZD"
      };
    },

    calculateBalances() {
      let balances = {};

      // Initialize balances for Trinity (T), Neo (N), and Joint to 0
      balances.T = 0;
      balances.N = 0;
      balances.Joint = 0;

      for (let expense of this.expenses) {
        let convertedAmount = this.currencyConvert(
          expense.currency,
          "BZD",
          expense.amount
        );

        if (expense.payer === "T" || expense.payee === "T") {
          balances.T += convertedAmount;
        }

        if (expense.payer === "N" || expense.payee === "N") {
          balances.N += convertedAmount;
        }

        if (expense.payer !== "T" && expense.payee !== "T" && expense.payer !== "N" && expense.payee !== "N") {
          balances.Joint += convertedAmount;
        }
      }

      return balances;
    }
  },

  computed: {
    // Separate total balance calculations
    trinity_balance() {
      const balances = this.calculateBalances();
      return balances.T.toFixed(2);
    },

    neo_balance() {
      const balances = this.calculateBalances();
      return balances.N.toFixed(2);
    },

    joint_balance() {
      const balances = this.calculateBalances();
      return balances.Joint.toFixed(2);
    },

    // Filter expenses into Trinity's, Neo's, and Joint expenses
    trinityExpenses() {
      return this.expenses.filter(
        (expense) => expense.payer === "T" || expense.payee === "T"
      );
    },

    neoExpenses() {
      return this.expenses.filter(
        (expense) => expense.payer === "N" || expense.payee === "N"
      );
    },

    jointExpenses() {
      return this.expenses.filter(
        (expense) =>
          expense.payer !== "T" &&
          expense.payee !== "T" &&
          expense.payer !== "N" &&
          expense.payee !== "N"
      );
    }
  },

  created() {
    // Load data from your JSON file here and populate the expenses array
    fetch("https://raw.githubusercontent.com/UB-CMPS3141/cmps3141-as3-css-app-23s1-ftun123/main/expenses/data.json")
      .then((response) => response.json())
      .then((data) => {
        // Assuming your JSON data is an array of objects with properties like "title," "trinity_paid," and "neo_paid"
        // Convert your JSON data to match the desired structure
        const convertedData = data.map((item) => ({
          title: item.title,
          amount:
            (item.trinity_paid && item.neo_paid) ||
            (item.neo_paid_for_trinity && item.neo_paid) ||
            0, // Adjust the logic based on your data structure
          payer: item.trinity_paid
            ? "T"
            : item.neo_paid_for_trinity
            ? "N"
            : "N", // Adjust the logic based on your data structure
          payee: item.neo_paid ? "N" : "T", // Adjust the logic based on your data structure
          date: "", // Add the appropriate date property if available in your data
          currency: "BZD" // Adjust the currency if needed
        }));

        this.expenses = convertedData;
      })
      .catch((error) => console.error("Error loading JSON data:", error));
  }
}, "#app");
