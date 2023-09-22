import { createApp } from "https://mavue.mavo.io/mavue.js";

globalThis.app = createApp({
  data: {
    expenses: [], // Initialize the expenses array as empty
    newExpense: {
      title: "",
      amount: 0,
      payer: "",
      payee: "",
      date: "",
      currency: "BZD",
    },
  },

  methods: {
    currencyConvert(from, to, amount) {
      const rates = {
        BZD: 1,
        MXN: 8.73,
        GTQ: 3.91,
      };

      return (amount * rates[to]) / rates[from];
    },

    addExpense() {
      // Add the new expense to the expenses array
      this.expenses.push({
        title: this.newExpense.title,
        amount: parseFloat(this.newExpense.amount),
        payer: this.newExpense.payer,
        payee: this.newExpense.payee,
        date: this.newExpense.date,
        currency: this.newExpense.currency,
      });

      // Clear the newExpense object for the next entry
      this.newExpense = {
        title: "",
        amount: 0,
        payer: "",
        payee: "",
        date: "",
        currency: "BZD",
      };
    },

    // New method to apply table styles
    applyTableStyles(tableId) {
      const table = document.getElementById(tableId);

      if (table) {
        table.classList.add("expense-table"); // Apply table class
        table.addEventListener("mouseover", function () {
          this.classList.add("table-hover");
        });
        table.addEventListener("mouseout", function () {
          this.classList.remove("table-hover");
        });
      }
    },

    // New method to fetch expenses data from the JSON file
    async fetchExpensesData() {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/UB-CMPS3141/cmps3141-as3-css-app-23s1-ftun123/main/expenses/data.json"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data.");
        }

        const jsonData = await response.json();
        this.expenses = jsonData; // Update the expenses array with fetched data

        // Apply table styles after fetching data
        this.applyTableStyles("trinity-table");
        this.applyTableStyles("neo-table");
        this.applyTableStyles("joint-table");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    calculateBalances() {
      let balances = {
        T: 0,
        N: 0,
        Joint: 0,
      };

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
      let joint_owes_trinity = 0;
      let joint_owes_neo = 0;
      let neo_pays_for_joint = 0;
      let trinity_pays_for_joint = 0;

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

        if (expense.payer === "Joint" && expense.payee === "T") {
          joint_owes_trinity += convertedAmount;
        }

        if (expense.payer === "Joint" && expense.payee === "N") {
          joint_owes_neo += convertedAmount;
        }

        if (expense.payer === "N" && expense.payee === "Joint") {
          neo_pays_for_joint += convertedAmount;
        }

        if (expense.payer === "T" && expense.payee === "Joint") {
          trinity_pays_for_joint += convertedAmount;
        }
      }

      return {
        neo_owes_trinity: neo_owes_trinity.toFixed(2),
        trinity_owes_neo: trinity_owes_neo.toFixed(2),
        joint_owes_trinity: joint_owes_trinity.toFixed(2),
        joint_owes_neo: joint_owes_neo.toFixed(2),
        neo_pays_for_joint: neo_pays_for_joint.toFixed(2),
        trinity_pays_for_joint: trinity_pays_for_joint.toFixed(2),
      };
    },
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

    joint_owes_trinity() {
      const owes = this.calculateOwes();
      return owes.joint_owes_trinity;
    },

    joint_owes_neo() {
      const owes = this.calculateOwes();
      return owes.joint_owes_neo;
    },

    neo_pays_for_joint() {
      const owes = this.calculateOwes();
      return owes.neo_pays_for_joint;
    },

    trinity_pays_for_joint() {
      const owes = this.calculateOwes();
      return owes.trinity_pays_for_joint;
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
    },
  },

  mounted() {
    // Fetch expenses data when the app is mounted
    this.fetchExpensesData();
  },
}, "#app");
