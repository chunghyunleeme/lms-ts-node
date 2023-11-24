import { NotFoundError } from "./http-error/not-found.error";

export class CanNotFindLecture extends NotFoundError {
  name = "CanNotFindLecture";

  constructor() {
    super("존재하지 않는 강의입니다.");
  }
}
