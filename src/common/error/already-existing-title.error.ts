import { ConflictError } from "./http-error/conflict.error";

export default class AlreadyExistingTitle extends ConflictError {
  name = "AlreadyExistingTitlt";
  constructor() {
    super("이미 존재하는 강의명입니다.");
  }
}
