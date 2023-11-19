import { Category } from "./category";
import Enrollment from "./enrollment";
import { Instructor } from "./instructor";
import { Status } from "./status";
import { Student } from "./student";

export default class Lecture {
  private _id: string;
  private _instructor: Instructor | null;
  private _enrollments: Enrollment[] | undefined;
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
    instructor: Instructor | null;
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
    id: string;
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

  get id(): string {
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

  get price(): number {
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

  public open(): void {
    this._status = Status.PUBLIC;
  }

  public enrollment(student: Student): Enrollment {
    if (this.enrollments == undefined) {
      throw new Error("잘못된 접근입니다.");
    }

    if (
      this.enrollments.some((enrollment) => enrollment.student.id == student.id)
    ) {
      throw new Error("이미 수강 중인 강의는 신청할 수 없습니다.");
    }

    if (this.status == Status.PRIVATE) {
      throw new Error("비공개된 강의는 수강 신청할 수 없습니다.");
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
