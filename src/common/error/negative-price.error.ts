import { BadRequestError } from "./http-error/bad-request.error";

export class NegativePrice extends BadRequestError {
  name = "NegativePrice";

  constructor() {
    super("가격은 음수가 될 수 없습니다.");
  }
}
