import { NextFunction, Request, Response } from "express";

/**
 * 컨트롤러를 감싸는 래핑 메서드
 * 함수 내부에서 Promise.reject 반환되면 클라이언트로 응답을 보낸다.
 * */
const asyncWrapper =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };

export default asyncWrapper;
