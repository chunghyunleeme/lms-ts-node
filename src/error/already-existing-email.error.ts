import { ConflictError } from "../http-error/conflict.error";

export class AlreadyExistingEmail extends ConflictError {
  name = "AlreadyExistingEmail";

  constructor() {
    super("이미 존재하는 이메일입니다.");
  }
}
