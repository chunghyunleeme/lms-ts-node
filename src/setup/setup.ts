import { createConnection } from "../db";
import { CreateInstructorTable } from "../migration/create.instructor.tables";
import { CreateLectureTable } from "../migration/create.lecture.table";
import { CreateStudentTable } from "../migration/create.student.table";
import { seed } from "./seed";

async function setup() {
  try {
    const conn = createConnection();
    await CreateStudentTable.up(conn);
    await CreateInstructorTable.up(conn);
    await CreateLectureTable.up(conn);
    await seed(conn);
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
}

// 호출
setup();
