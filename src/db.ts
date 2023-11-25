import { Pool, createPool } from "mysql2/promise";

export let pool: Pool;

export function createConnection(): Pool {
  pool = createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "lms",
    connectionLimit: 30,
  });
  return pool;
}
