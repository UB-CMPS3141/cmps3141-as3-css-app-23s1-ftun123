/* User-friendly table styles */
body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

h1 {
  text-align: center;
  color: #333;
}

h2 {
  color: #333;
}

.expense-input {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.expense-input label {
  flex: 1;
  margin-right: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  border: 1px solid #ddd;
}

table th, table td {
  padding: 12px;
  text-align: center;
  border: 1px solid #ddd;
}

table th {
  background-color: #007BFF;
  color: #fff;
  font-weight: bold;
}

table tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

table tbody tr:hover {
  background-color: #e0e0e0;
  transform: scale(1.01);
  transition: background-color 0.2s, transform 0.2s;
}

/* Add more styles as needed for your specific design */
