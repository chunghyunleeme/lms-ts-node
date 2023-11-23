import { Category } from "../../domain/category";

export default class LectureSummary {
  id: number;
  category: Category;
  title: string;
  instructorName: string;
  price: number;
  numOfStudents: number;
  createdAt: Date;

  constructor({
    id,
    category,
    title,
    instructorName,
    price,
    numOfStudents,
    createdAt,
  }: {
    id: number;
    category: Category;
    title: string;
    instructorName: string;
    price: number;
    numOfStudents: number;
    createdAt: Date;
  }) {
    this.id = id;
    this.category = category;
    this.title = title;
    this.instructorName = instructorName;
    this.price = price;
    this.numOfStudents = numOfStudents;
    this.createdAt = createdAt;
  }
}
