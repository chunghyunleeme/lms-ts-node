import { Category } from "../../domain/category";

export class LectureDetail {
  id: number;
  title: string;
  category: Category;
  price: number;
  numOfStudents: number;
  createdAt: Date;
  updatedAt: Date;
  students: EnrolledStudent[] | null;

  constructor({
    id,
    title,
    category,
    price,
    createdAt,
    updatedAt,
    students,
  }: {
    id: number;
    title: string;
    category: Category;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    students: EnrolledStudent[] | null;
  }) {
    this.id = id;
    this.title = title;
    this.category = category;
    this.price = price;
    this.numOfStudents = students ? students.length : 0;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.students = students ? students : [];
  }
}

export class EnrolledStudent {
  id: number;
  nickName: string;
  enrollmentDate: Date;
  constructor({
    id,
    nickName,
    enrollmentDate,
  }: {
    id: number;
    nickName: string;
    enrollmentDate: Date;
  }) {
    this.id = id;
    this.nickName = nickName;
    this.enrollmentDate = enrollmentDate;
  }
}
