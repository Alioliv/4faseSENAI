import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: process.env.DB_HOST ?? "localhost", // se por acaso o git não tiver a variável de ambiente, ele vai usar localhost
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "root",
  database: process.env.DB_NAME ?? "desi_20251",

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0 
});

export default db;
