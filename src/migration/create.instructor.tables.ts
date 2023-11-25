import { Pool } from "mysql2/promise";

export class CreateInstructorTable {
  public static async up(conn: Pool): Promise<void> {
    await conn.query(
      `CREATE TABLE IF NOT EXISTS instructor (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
          created_at DATETIME not null default now(),
          updated_at DATETIME not null default now() on update now(),
          deleted_at DATETIME
      )`
    );
  }

  public async down(conn: Pool): Promise<void> {
    await conn.query(`DROP TABLE \`instructor\``);
  }
}
