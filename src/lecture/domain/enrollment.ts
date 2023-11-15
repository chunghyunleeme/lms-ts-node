import Student from "../../student/domain/student";
import Lecture from "./lecture";

export default class Enrollment {
  readonly enrollmentDate: Date;
  readonly lecture: Lecture;
  readonly student: Student;

  constructor({ lecture, student }: { lecture: Lecture; student: Student }) {
    this.enrollmentDate = new Date();
    this.lecture = lecture;
    this.student = student;
  }
}
