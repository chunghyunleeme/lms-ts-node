import { ConflictError } from "./http-error/conflict.error";

export default class PrivateLectureError extends ConflictError {
  name = "PrivateLectureError";
  constructor() {
    super("비공개된 강의는 수강 신청할 수 없습니다.");
  }
}
