import { BadRequestError } from "../../../../http-error/bad-request.error";
import { Category } from "../../category";

export default class LectureSearchRequest {
  private _instructorName: string;
  private _lectureTitle: string;
  private _studentId: number;
  private _category: Category;
  private _sortBy: SortBy;
  private _page: number;
  private _pageSize: number;

  constructor({
    instructorName,
    lectureTitle,
    studentId,
    category,
    sortBy,
    page,
    pageSize,
  }: {
    instructorName: string;
    lectureTitle: string;
    studentId: number;
    category: Category;
    sortBy: SortBy;
    page: number;
    pageSize: number;
  }) {
    if (page < 1) {
      throw new BadRequestError("페이지는 1보다 작을 수 없습니다.");
    }
    if (pageSize < 0) {
      throw new BadRequestError("페이지크기는 0보다 작을 수 없습니다.");
    }
    this._instructorName = instructorName;
    this._lectureTitle = lectureTitle;
    this._studentId = studentId;
    this._category = category;
    this._sortBy = sortBy;
    this._page = page;
    this._pageSize = pageSize;
  }

  get instructorName() {
    return this._instructorName;
  }

  get lectureTitle() {
    return this._lectureTitle;
  }

  get studentId() {
    return this._studentId;
  }

  get category() {
    return this._category;
  }

  get sortBy() {
    return this._sortBy;
  }

  get page() {
    return this._page;
  }

  get pageSize() {
    return this._pageSize;
  }
}

type SortBy =
  | "created_at"
  | "num_of_students"
  | "-created_at"
  | "-num_of_students";
