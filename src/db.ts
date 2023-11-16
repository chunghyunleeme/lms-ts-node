import { createPool, Pool } from "mysql2";

const pool: Pool = createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "lms",
  connectionLimit: 10,
});

export default pool.promise();
