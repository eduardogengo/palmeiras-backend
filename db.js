// db.js
const mysql = require("mysql2/promise");

// cria pool de conexões
const pool = mysql.createPool({
  host: "sql10.freesqldatabase.com",      // ou IP do servidor MySQL
  user: "sql10795590",           // seu usuário
  password: "pg7W1cUDuB",  // sua senha
  database: "sql10795590",  // nome do banco
});

module.exports = pool;
