import { ConflictError } from "./http-error/conflict.error";

export default class AlreadyEnrollLecture extends ConflictError {
  name = "AlreadyEnrollLecture";
  constructor() {
    super("이미 수강 중인 강의는 신청할 수 없습니다.");
  }
}
