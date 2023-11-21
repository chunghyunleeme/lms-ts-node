import { NotFoundError } from "../http-error/not-found.error";

export class CanNotFindStudent extends NotFoundError {
  name = "CanNotFindStudent";

  constructor() {
    super("존재하지 않는 학생입니다.");
  }
}
