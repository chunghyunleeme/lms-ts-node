import { injectable } from "tsyringe";
import { Category } from "../domain/category";
import Enrollment from "../domain/enrollment";
import { Instructor } from "../domain/instructor";
import Lecture from "../domain/lecture";
import ILectureRepository from "../domain/repository/ilecture.repository";
import { Status } from "../domain/status";
import { IInstructorService } from "./adapter/iinstructor.service";
import { IStudentService } from "./adapter/istudent.service";

@injectable()
export default class LectureService {
  constructor(
    private readonly lectureRepository: ILectureRepository,
    private readonly instructorService: IInstructorService,
    private readonly studentService: IStudentService
  ) {}

  async save({
    instructorId,
    title,
    desc,
    price,
    category,
  }: {
    instructorId: string;
    title: string;
    desc: string;
    price: number;
    category: Category;
  }): Promise<void> {
    const instructor: Instructor | null = await this.instructorService.findById(
      instructorId
    );
    if (!instructor) {
      throw new Error("존재하지 않는 강사입니다.");
    }

    const lecture = await this.lectureRepository.findByTitle(title);
    if (lecture) {
      throw new Error("이미 존재하는 강의명입니다.");
    }

    await this.lectureRepository.save(
      new Lecture({
        instructor,
        title,
        desc,
        price,
        category,
      })
    );
  }

  async update({
    lectureId,
    title,
    desc,
    price,
  }: {
    lectureId: number;
    title?: string;
    desc?: string;
    price?: number;
  }): Promise<void> {
    const lecture = await this.lectureRepository.findById(lectureId);
    if (!lecture) {
      throw new Error("존재하지 않는 강의 입니다.");
    }

    lecture.update({
      title,
      desc,
      price,
    });

    await this.lectureRepository.update(lecture);
  }

  async enroll({
    lectureId,
    studentId,
  }: {
    lectureId: number;
    studentId: number;
  }) {
    const lecture = await this.lectureRepository.findByIdWithEnrollments(
      lectureId
    );
    if (!lecture) {
      throw new Error("존재하지 않는 강의입니다.");
    }

    const student = await this.studentService.findById(studentId);
    if (!student) {
      throw new Error("존재하지 않는 학생입니다.");
    }

    return await this.lectureRepository.saveEnrollment(
      lecture.enrollment(student)
    );
  }
}
