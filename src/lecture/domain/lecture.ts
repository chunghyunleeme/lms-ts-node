import Instructor from "../../instructor/domain/instructor";
import Student from "../../student/domain/student";
import { Category } from "./category";
import Enrollment from "./enrollment";

export default class Lecture {
  private lectureInstructor: Instructor;
  private enrollmentStudents: Enrollment[] = [];
  private lectureCategory: Category;
  private lectureId: string;
  private lectureTitle: string;
  private lectureDesc: string;
  private lecturePrice: number;
  private studentNum: number;
  private status: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor({
    instructor,
    id,
    title,
    desc,
    price,
    category,
  }: {
    instructor: Instructor;
    id: string;
    title: string;
    desc: string;
    price: number;
    category: Category;
  }) {
    this.lectureInstructor = instructor;
    this.lectureId = id;
    this.lectureTitle = title;
    this.lectureDesc = desc;
    this.lecturePrice = price;
    this.lectureCategory = category;
    this.studentNum = 0;
    this.status = "close";
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public instructor(): Instructor {
    return this.lectureInstructor;
  }

  public title(): string {
    return this.lectureTitle;
  }

  public category(): Category {
    return this.lectureCategory;
  }

  public numOfStudent(): number {
    return this.studentNum;
  }

  public students(): Enrollment[] {
    return this.enrollmentStudents;
  }

  public enrollStudent(student: Student): void {
    const enrollment = new Enrollment({
      lecture: this,
      student,
    });

    this.enrollmentStudents.push(enrollment);
  }
}
