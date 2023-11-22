import { NextFunction, Request, Response, response } from "express";
import LectureService from "../application/lecture.service";
import { Category } from "../domain/category";
import { HttpError } from "../../http-error/http.error";
import { injectable, singleton } from "tsyringe";
@singleton()
export default class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  async createLecture(req: Request, response: Response, next: NextFunction) {
    try {
      const {
        instructorId,
        title,
        desc,
        price,
        category,
      }: {
        instructorId: string;
        title: string;
        desc: string;
        price: number;
        category: Category;
      } = req.body;

      await this.lectureService.save({
        instructorId,
        title,
        desc,
        price,
        category,
      });
      return response.status(201).send();
    } catch (e: any) {
      next(e);
    }
  }

  async updateLecture(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const id = req.params["id"];
      const { title, desc, price } = req.body;
      await this.lectureService.update({
        lectureId: parseInt(id),
        title,
        desc,
        price,
      });
    } catch (e: any) {
      next(e);
    }
    return res.status(200).send();
  }

  async openLecture(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = parseInt(req.params["id"]);
      await this.lectureService.open(id);
      return res.status(200).send();
    } catch (e: any) {
      next(e);
    }
  }

  async createEnrollment(req: Request, res: Response, next: NextFunction) {
    try {
      const lectureId: number = parseInt(req.params["id"]);
      const { studentId }: { studentId: number } = req.body;
      const result = await this.lectureService.enroll({ lectureId, studentId });
      return response.status(201).send({
        id: result,
      });
    } catch (e: any) {
      next(e);
    }
  }

  async deleteLecture(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = parseInt(req.params["id"]);
      await this.lectureService.delete(id);
      return res.status(200).send();
    } catch (e: any) {
      next(e);
    }
  }
}
