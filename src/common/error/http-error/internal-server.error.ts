import { HttpError } from "./http.error";

export class InternalServerError extends HttpError {
  name = "InternalServerError";

  constructor(message: string) {
    super(500);
    Object.setPrototypeOf(this, InternalServerError.prototype);

    if (message) this.message = message;
  }
}
