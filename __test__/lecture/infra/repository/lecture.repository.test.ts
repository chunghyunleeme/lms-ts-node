import db from "../../../../src/db";
import InstructorRepository from "../../../../src/instructor/infra/repository/instructor.repository";
import { Category } from "../../../../src/lecture/domain/category";
import { Instructor } from "../../../../src/lecture/domain/instructor";
import Lecture from "../../../../src/lecture/domain/lecture";
import LectureRepository from "../../../../src/lecture/infra/repository/lecture.repository";

describe("lecture repository test", () => {
  beforeEach(async () => {
    await db.query("DELETE FROM lecture");
  });

  afterAll(async () => {
    await db.releaseConnection;
    await db.end();
  });

  const lectureRepository: LectureRepository = new LectureRepository();
  const instructorRepository: InstructorRepository = new InstructorRepository();

  it("save test", async () => {
    const findInstructor = await instructorRepository.findById("1");
    const instructor: Instructor = {
      id: findInstructor.id,
      name: findInstructor.name,
    };

    const lecture: Lecture = new Lecture({
      instructor,
      title: "title",
      desc: "desc",
      price: 1000,
      category: Category.ALGORITHM,
    });
    // when
    const result = await lectureRepository.save(lecture);

    // then
    expect(typeof result).toBe("number");
  });
});
