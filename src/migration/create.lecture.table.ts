import { Pool } from "mysql2/promise";

export class CreateLectureTable {
  public static async up(conn: Pool): Promise<void> {
    await conn.query(
      `CREATE TABLE IF NOT EXISTS lecture (
        id INT PRIMARY KEY AUTO_INCREMENT,
        instructor_id INT,
        title VARCHAR(255), 
        description TEXT, 
        price DECIMAL(10, 2), 
        category VARCHAR(50), 
        status VARCHAR(20), 
        num_of_students INT, 
        createdAt DATETIME not null default now(),
        updatedAt DATETIME not null default now() on update now(),
        deletedAt DATETIME, 
        FOREIGN KEY (instructor_id) REFERENCES instructor(id) )`
    );

    await conn.query(`
    CREATE TABLE IF NOT EXISTS enrollment (
        id INT PRIMARY KEY AUTO_INCREMENT,
      student_id INT,
      lecture_id INT,
      enrollment_date DATE NOT NULL,
        createdAt DATETIME not null default now(),
        updatedAt DATETIME not null default now() on update now(),
        deletedAt DATETIME, 
      FOREIGN KEY (student_id) REFERENCES student(id),
      FOREIGN KEY (lecture_id) REFERENCES lecture(id)
    )`);
  }

  public async down(conn: Pool): Promise<void> {
    await conn.query(`DROP TABLE \`lecture\``);
    await conn.query(`DROP TABLE \`enrollment\``);
  }
}
