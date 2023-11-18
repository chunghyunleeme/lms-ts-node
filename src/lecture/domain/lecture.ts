import Student from "../../student/domain/student";
import { Category } from "./category";
import Enrollment from "./enrollment";
import { Instructor } from "./instructor";
import { Status } from "./status";

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

  public instructor(): Instructor {
    return this._instructor;
  }

  public title(): string {
    return this._title;
  }

  public category(): Category {
    return this._category;
  }

  public numOfStudent(): number {
    return this._numOfStudent;
  }

  public students(): Enrollment[] {
    return this._students;
  }

  public status(): Status {
    return this._status;
  }

  public enrollment(student: Student): Enrollment {
    const enrollment = new Enrollment({
      lecture: this,
      student,
    });

    this._students.push(enrollment);

    return enrollment;
  }
}
