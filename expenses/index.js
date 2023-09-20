import { createApp } from "https://mavue.mavo.io/mavue.js";

globalThis.app = createApp({
  data: {
    expenses: [],
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
      
      // Initialize balances for Trinity (T) and Neo (N) to 0
      balances.T = 0;
      balances.N = 0;
      
      for (let expense of this.expenses) {
        let convertedAmount = this.currencyConvert(
          expense.currency,
          "BZD",
          expense.amount
        );
        
        if (expense.payer === "T") {
          balances.T += convertedAmount;
        } else if (expense.payer === "N") {
          balances.N += convertedAmount;
        }
        
        if (expense.payee === "T") {
          balances.T -= convertedAmount;
        } else if (expense.payee === "N") {
          balances.N -= convertedAmount;
        }
      }
      
      return balances;
    }
  },

  computed: {
    total_balance() {
      const balances = this.calculateBalances();
      const trinityBalance = balances.T.toFixed(2);
      const neoBalance = balances.N.toFixed(2);
      return `Trinity's Balance: ${trinityBalance} BZD, Neo's Balance: ${neoBalance} BZD`;
    }
  }
}, "#app");
