// db.js
const { Pool } = require("pg");

// cria pool de conexões
const pool = new Pool({
  host: "db.viujexlrejrubtphywbi.supabase.co",       // ex: db.xxxxx.supabase.co
  port: 5432,             // padrão do Postgres
  user: "postgres",    // ex: postgres
  password: "Js$KTYKJMgv#7.%",  // senha definida no serviço
  database: "postgres",
  ssl: { require: true, rejectUnauthorized: false }, // geralmente necessário em bancos gratuitos na nuvem
});

module.exports = pool;
