import { ConflictError } from "./http-error/conflict.error";

export default class ExistingStudentLecture extends ConflictError {
  name = "ExistingStudentLecture";
  constructor() {
    super("이미 수강생이 존재하는 강의는 삭제 할 수 없습니다.");
  }
}
