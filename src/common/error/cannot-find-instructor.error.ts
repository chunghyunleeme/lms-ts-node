import { NotFoundError } from "./http-error/not-found.error";

export default class CanNotFindInstructor extends NotFoundError {
  name = "CanNotFindInstructor";
  constructor() {
    super("존재하지 않는 강사입니다.");
  }
}
