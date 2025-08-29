const postgres = require('postgres');

const senha = 'edumarciopalmeiras';
// const connectionString = 'postgresql://postgres:edumarciopalmeiras@db.viujexlrejrubtphywbi.supabase.co:5432/postgres';
const connectionString = `postgresql://postgres.viujexlrejrubtphywbi:${senha}@aws-1-sa-east-1.pooler.supabase.com:5432/postgres`;
// const connectionString =  `postgres.viujexlrejrubtphywbi:${senha}@aws-1-sa-east-1.pooler.supabase.com:6543/postgres`
console.log('connectionString', connectionString);
const sql = postgres(connectionString);

module.exports = sql;
