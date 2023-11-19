import Lecture from "./lecture";
import { Student } from "./student";

export default class Enrollment {
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
}
