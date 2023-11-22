import { NextFunction, Request, Response } from "express";
import LectureService from "../application/lecture.service";
import { Category } from "../domain/category";
import { singleton } from "tsyringe";
@singleton()
export default class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  async createLecture(req: Request, res: Response, next: NextFunction) {
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
      return res.status(201).json();
    } catch (e) {
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
    } catch (e) {
      next(e);
    }
    return res.status(200).json();
  }

  async openLecture(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = parseInt(req.params["id"]);
      await this.lectureService.open(id);
      return res.status(200).json();
    } catch (e) {
      next(e);
    }
  }

  async createEnrollments(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        studentId,
        lectureIds,
      }: { studentId: number; lectureIds: number[] } = req.body;
      await this.lectureService.enrollLectures({ lectureIds, studentId });
      return res.status(201).json();
    } catch (e) {
      next(e);
    }
  }

  async deleteLecture(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = parseInt(req.params["id"]);
      await this.lectureService.delete(id);
      return res.status(200).json();
    } catch (e) {
      next(e);
    }
  }
}
