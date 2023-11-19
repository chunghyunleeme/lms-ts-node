import Lecture from "./lecture";
import { Student } from "./student";

export default class Enrollment {
  private _id: number;
  readonly enrollmentDate: Date;
  readonly lecture: Lecture;
  readonly student: Student;

  constructor({
    lecture,
    student,
    enrollmentDate,
  }: {
    lecture: Lecture;
    student: Student;
    enrollmentDate: Date;
  }) {
    this.enrollmentDate = enrollmentDate;
    this.lecture = lecture;
    this.student = student;
  }

  static from({
    id,
    lecture,
    student,
    enrollmentDate,
  }: {
    id: number;
    lecture: Lecture;
    student: Student;
    enrollmentDate: Date;
  }) {
    const enrollment = new Enrollment({
      lecture,
      student,
      enrollmentDate,
    });
    enrollment._id = id;

    return enrollment;
  }

  get id() {
    return this._id;
  }
}
