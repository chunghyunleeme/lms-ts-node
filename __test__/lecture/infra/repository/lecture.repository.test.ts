import db from "../../../../src/db";
import InstructorRepository from "../../../../src/instructor/infra/repository/instructor.repository";
import { Category } from "../../../../src/lecture/domain/category";
import Enrollment from "../../../../src/lecture/domain/enrollment";
import { Instructor } from "../../../../src/lecture/domain/instructor";
import Lecture from "../../../../src/lecture/domain/lecture";
import LectureRepository from "../../../../src/lecture/infra/repository/lecture.repository";
import Student from "../../../../src/student/domain/student";
import StudentRepository from "../../../../src/student/infra/repository/student.repository";

describe("lecture repository test", () => {
  beforeEach(async () => {
    await db.query("DELETE FROM enrollment");
    await db.query("DELETE FROM lecture");
    await db.query("DELETE FROM student");
  });
  afterAll(async () => {
    await db.releaseConnection;
    await db.end();
  });

  const lectureRepository: LectureRepository = new LectureRepository();
  const instructorRepository: InstructorRepository = new InstructorRepository();
  const studentRepository: StudentRepository = new StudentRepository();

  it("save test", async () => {
    // given
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

  it("findById test", async () => {
    // given
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
    const result = await lectureRepository.save(lecture);

    // when
    const findLecture: Lecture | null = await lectureRepository.findById(
      result
    );

    // then
    expect(findLecture?.id).toBe(result);
  });

  it("findByTitle test", async () => {
    // given
    const findInstructor = await instructorRepository.findById("1");
    const instructor: Instructor = {
      id: findInstructor.id,
      name: findInstructor.name,
    };

    const lectureTitle = "title";
    const lecture: Lecture = new Lecture({
      instructor,
      title: lectureTitle,
      desc: "desc",
      price: 1000,
      category: Category.ALGORITHM,
    });
    await lectureRepository.save(lecture);

    // when
    const findLecture: Lecture | null = await lectureRepository.findByTitle(
      lectureTitle
    );

    // then
    expect(findLecture?.title).toBe(lectureTitle);
  });

  it("update test", async () => {
    // given
    const findInstructor = await instructorRepository.findById("1");
    const instructor: Instructor = {
      id: findInstructor.id,
      name: findInstructor.name,
    };

    const lectureTitle = "title";
    const lectureDesc = "desc";
    const lecture: Lecture = new Lecture({
      instructor,
      title: lectureTitle,
      desc: lectureDesc,
      price: 1000,
      category: Category.ALGORITHM,
    });
    const saveId: number = await lectureRepository.save(lecture);
    const findLecture: Lecture | null = await lectureRepository.findById(
      saveId
    );

    // when
    const updatedTitle = "updated-title";
    if (findLecture) {
      findLecture?.update({
        title: updatedTitle,
      });
      await lectureRepository.update(findLecture);
    }

    const updateLecture: Lecture | null = await lectureRepository.findById(
      saveId
    );

    // then
    expect(updateLecture?.title).toBe(updatedTitle);
    expect(updateLecture?.desc).toBe(lectureDesc);
  });

  it("saveEnrollment", async () => {
    // given
    const student = new Student({
      email: "test@email.com",
      nickName: "test",
    });

    const studentSaveId = await studentRepository.save(student);
    const findStudent: Student | null = await studentRepository.findById(
      studentSaveId
    );

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
    const lectureSaveId = await lectureRepository.save(lecture);

    // when
    const findLecture: Lecture | null = await lectureRepository.findById(
      lectureSaveId
    );

    // when
    let enrollmentSaveId;
    if (findLecture && findStudent) {
      const enrollment: Enrollment = new Enrollment({
        lecture: findLecture,
        student: {
          id: findStudent?.id,
          nickName: findStudent?.nickName,
        },
        enrollmentDate: new Date(),
      });
      enrollmentSaveId = await lectureRepository.saveEnrollment(enrollment);
    }
    // then
    const [result]: [any, any] = await db.query(
      "SELECT * FROM enrollment WHERE id = ?",
      [enrollmentSaveId]
    );

    expect(result[0].id).toBe(enrollmentSaveId);
  });

  it("findByIdWithEnrollments test", async () => {
    // given
    const student = new Student({
      email: "test@email.com",
      nickName: "test",
    });

    const studentSaveId = await studentRepository.save(student);
    const findStudent: Student | null = await studentRepository.findById(
      studentSaveId
    );

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
    const lectureSaveId = await lectureRepository.save(lecture);

    const findLecture: Lecture | null = await lectureRepository.findById(
      lectureSaveId
    );

    let enrollmentSaveId: number;
    if (findLecture && findStudent) {
      const enrollment: Enrollment = new Enrollment({
        lecture: findLecture,
        student: {
          id: findStudent?.id,
          nickName: findStudent?.nickName,
        },
        enrollmentDate: new Date(),
      });
      enrollmentSaveId = await lectureRepository.saveEnrollment(enrollment);
    }

    // when
    const lectureWithEnrollment: Lecture | null =
      await lectureRepository.findByIdWithEnrollments(lectureSaveId);

    // then
    expect(lectureWithEnrollment?.enrollments).toHaveLength(1);
    expect(
      lectureWithEnrollment?.enrollments?.some((enrollment) => {
        if (enrollment.id == enrollmentSaveId) {
          return true;
        }
      })
    ).toBeTruthy();
  });
});
