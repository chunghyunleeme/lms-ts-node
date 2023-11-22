import { NextFunction, Request, Response } from "express";
import { HttpError } from "../http-error/http.error";

const ErrorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!(err instanceof HttpError)) {
    return res.status(500).send({
      message: err.message,
    });
  }
  return res.status(err.httpCode).send({
    message: err.message,
  });
};

export default ErrorHandlerMiddleware;
