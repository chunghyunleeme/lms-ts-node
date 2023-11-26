import AlreadyEnrollLecture from "../../common/error/already-enroll-lecture.error";
import ExistingStudentLecture from "../../common/error/existing-student-lecture.error";
import { BadRequestError } from "../../common/error/http-error/bad-request.error";
import PrivateLectureError from "../../common/error/private-lecture.error";
import { Category } from "./category";
import Enrollment from "./enrollment";
import Instructor from "./instructor";
import Money from "./money";
import { Status } from "./status";
import Student from "./student";

export default class Lecture {
  private _id: number;
  private _instructor: Instructor | null;
  private _enrollments: Enrollment[] | undefined;
  private _category: Category;
  private _title: string;
  private _desc: string;
  private _price: Money;
  private _status: Status;
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
  }

  delete(): void {
    if (this._enrollments == undefined) {
      throw new BadRequestError("잘못된 접근입니다.");
    }

    if (this._enrollments.length != 0) {
      throw new ExistingStudentLecture();
    }
  }

  enrollment(student: Student): Enrollment {
    if (this._enrollments == undefined) {
      throw new Error("잘못된 접근입니다.");
    }

    if (this._status == Status.PRIVATE) {
      throw new PrivateLectureError();
    }

    const alreadyEnroll: boolean = this._enrollments.some((enrollment) => {
      return enrollment.student.id == student.id;
    });
    if (alreadyEnroll) {
      throw new AlreadyEnrollLecture();
    }

    const enrollment = new Enrollment({
      lecture: this,
      student,
      enrollmentDate: new Date(),
    });
    this._enrollments?.push(enrollment);

    return enrollment;
  }
}
