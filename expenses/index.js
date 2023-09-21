import { createApp } from "https://mavue.mavo.io/mavue.js";

globalThis.app = createApp({
  data: {
    expenses: [], // Initialize the expenses array with your data
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

        if (expense.payer === "Joint" || expense.payee === "Joint") {
          balances.Joint += convertedAmount;
        }
      }

      return balances;
    },

    calculateOwes() {
      let neo_owes_trinity = 0;
      let trinity_owes_neo = 0;

      for (let expense of this.expenses) {
        let convertedAmount = this.currencyConvert(
          expense.currency,
          "BZD",
          expense.amount
        );

        if (expense.payer === "T" && expense.payee === "N") {
          neo_owes_trinity += convertedAmount;
        }

        if (expense.payer === "N" && expense.payee === "T") {
          trinity_owes_neo += convertedAmount;
        }
      }

      return {
        neo_owes_trinity: neo_owes_trinity.toFixed(2),
        trinity_owes_neo: trinity_owes_neo.toFixed(2)
      };
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

    neo_owes_trinity() {
      const owes = this.calculateOwes();
      return owes.neo_owes_trinity;
    },

    trinity_owes_neo() {
      const owes = this.calculateOwes();
      return owes.trinity_owes_neo;
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
        (expense) => expense.payer === "Joint" || expense.payee === "Joint"
      );
    }
  }
}, "#app");
