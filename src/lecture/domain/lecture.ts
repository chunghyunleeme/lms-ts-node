import { BadRequestError } from "../../http-error/bad-request.error";
import { Category } from "./category";
import Enrollment from "./enrollment";
import { Instructor } from "./instructor";
import Money from "./money";
import { Status } from "./status";
import { Student } from "./student";

export default class Lecture {
  private _id: number;
  private _instructor: Instructor | null;
  private _enrollments: Enrollment[] | undefined;
  private _category: Category;
  private _title: string;
  private _desc: string;
  private _price: Money;
  private _status: Status;
  private _numOfStudent: number;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date | null;

  constructor({
    instructor,
    title,
    desc,
    price,
    category,
  }: {
    instructor: Instructor | null;
    title: string;
    desc: string;
    price: number;
    category: Category;
  }) {
    this._instructor = instructor;
    this._title = title;
    this._desc = desc;
    this._price = new Money(price);
    this._category = category;
    this._numOfStudent = 0;
    this._status = Status.PRIVATE;
    this._createdAt = new Date();
    this._updatedAt = new Date();
    this._deletedAt = null;
  }

  static from({
    id,
    title,
    desc,
    price,
    category,
    status,
    numberOfStudent,
    createdAt,
    updatedAt,
    instructor,
    enrollments,
  }: {
    id: number;
    title: string;
    desc: string;
    category: string;
    price: number;
    status: string;
    numberOfStudent: number;
    createdAt: Date;
    updatedAt: Date;
    instructor?: Instructor;
    enrollments?: Enrollment[];
  }): Lecture {
    const lecture = new Lecture({
      instructor: null,
      title,
      desc,
      price,
      category: category as Category,
    });
    lecture._id = id;
    lecture._status = status as Status;
    lecture._numOfStudent = numberOfStudent;
    lecture._createdAt = createdAt;
    lecture._updatedAt = updatedAt;
    if (instructor) {
      lecture._instructor = instructor;
    }
    if (enrollments) {
      lecture._enrollments = enrollments;
    }
    return lecture;
  }

  get id(): number {
    return this._id;
  }

  get instructor(): Instructor | null {
    return this._instructor;
  }

  get title(): string {
    return this._title;
  }

  get desc(): string {
    return this._desc;
  }

  get price(): Money {
    return this._price;
  }

  get category(): Category {
    return this._category;
  }

  get numOfStudent(): number {
    return this._numOfStudent;
  }

  get enrollments(): Enrollment[] | undefined {
    return this?._enrollments;
  }

  get status(): Status {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }

  open(): void {
    this._status = Status.PUBLIC;
  }

  update({
    title,
    desc,
    price,
  }: {
    title?: string;
    desc?: string;
    price?: number;
  }): void {
    if (title) {
      this._title = title;
    }

    if (desc) {
      this._desc = desc;
    }

    if (price) {
      this._price = new Money(price);
    }

    this._updatedAt = new Date();
  }

  delete(): void {
    if (this._enrollments == undefined) {
      throw new BadRequestError("잘못된 접근입니다.");
    }

    if (this._enrollments.length != 0) {
      throw new Error("이미 수강생이 존재하는 강의는 삭제 할 수 없습니다.");
    }
  }

  enrollment(student: Student): Enrollment {
    if (this._enrollments == undefined) {
      throw new Error("잘못된 접근입니다.");
    }

    if (this._status == Status.PRIVATE) {
      throw new Error("비공개된 강의는 수강 신청할 수 없습니다.");
    }

    const alreadyEnroll: boolean = this._enrollments.some((enrollment) => {
      return enrollment.student.id == student.id;
    });
    if (alreadyEnroll) {
      throw new Error("이미 수강 중인 강의는 신청할 수 없습니다.");
    }

    const enrollment = new Enrollment({
      lecture: this,
      student,
      enrollmentDate: new Date(),
    });
    this._enrollments?.push(enrollment);

    ++this._numOfStudent;

    return enrollment;
  }
}
