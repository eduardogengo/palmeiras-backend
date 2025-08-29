const postgres = require('postgres');

const senha = 'edumarciopalmeiras';
const connectionString = `postgresql://postgres.viujexlrejrubtphywbi:${senha}@aws-1-sa-east-1.pooler.supabase.com:5432/postgres`;
const sql = postgres(connectionString);

module.exports = sql;
