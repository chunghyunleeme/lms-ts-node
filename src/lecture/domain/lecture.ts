import { Category } from "./category";
import Enrollment from "./enrollment";
import { Instructor } from "./instructor";
import { Status } from "./status";
import { Student } from "./student";

export default class Lecture {
  private _id: string;
  private _instructor: Instructor;
  private _students: Enrollment[] = [];
  private _category: Category;
  private _title: string;
  private _desc: string;
  private _price: number;
  private _status: Status;
  private _numOfStudent: number;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor({
    instructor,
    title,
    desc,
    price,
    category,
  }: {
    instructor: Instructor;
    title: string;
    desc: string;
    price: number;
    category: Category;
  }) {
    this._instructor = instructor;
    this._title = title;
    this._desc = desc;
    this._price = price;
    this._category = category;
    this._numOfStudent = 0;
    this._status = Status.PRIVATE;
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  get instructor(): Instructor {
    return this._instructor;
  }

  get title(): string {
    return this._title;
  }

  get category(): Category {
    return this._category;
  }

  get numOfStudent(): number {
    return this._numOfStudent;
  }

  get students(): Enrollment[] {
    return this._students;
  }

  get status(): Status {
    return this._status;
  }

  public open(): void {
    this._status = Status.PUBLIC;
  }

  public enrollment(student: Student): Enrollment {
    if (this.status == Status.PRIVATE) {
      throw new Error("비공개된 강의는 수강 신청할 수 없습니다.");
    }
    const enrollment = new Enrollment({
      lecture: this,
      student,
    });
    this._students.push(enrollment);

    ++this._numOfStudent;

    return enrollment;
  }
}
