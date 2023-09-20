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
      const convertedAmount = this.currencyConvert(
        this.newExpense.currency,
        "BZD",
        parseFloat(this.newExpense.amount)
      );

      this.expenses.push({
        title: this.newExpense.title,
        amount: this.newExpense.amount,
        payer: this.newExpense.payer,
        payee: this.newExpense.payee,
        date: this.newExpense.date,
        currency: this.newExpense.currency,
        convertedAmount: convertedAmount.toFixed(2) + " BZD"
      });

      this.newExpense = {
        title: "",
        amount: 0,
        payer: "",
        payee: "",
        date: "",
        currency: "BZD"
      };
    }
  },

  computed: {
    total_balance() {
      let totalBalance = 0;

      for (let expense of this.expenses) {
        if (expense.currency === "BZD") {
          totalBalance += parseFloat(expense.amount);
        } else {
          totalBalance += parseFloat(expense.convertedAmount);
        }
      }

      return `Total Balance in BZD: ${totalBalance.toFixed(2)} BZD`;
    }
  }
}, "#app");
