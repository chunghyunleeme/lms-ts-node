import { Request, Response, response } from "express";
import LectureService from "../application/lecture.service";
import { Category } from "../domain/category";
import { HttpError } from "../../http-error/http.error";
import { injectable, singleton } from "tsyringe";
@singleton()
export default class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  async createLecture(req: Request, response: Response): Promise<Response> {
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
    } catch (e: any) {
      console.log("e", e);
      if (!(e instanceof HttpError)) {
        return response.status(500).send({
          message: e.message,
        });
      }
      return response.status(e.httpCode).send({
        message: e.message,
      });
    }
    return response.status(201).send();
  }

  async updateLecture(req: Request, res: Response): Promise<Response> {
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
      if (!(e instanceof HttpError)) {
        return res.status(500).send({
          message: e.message,
        });
      }
      return res.status(e.httpCode).send({
        message: e.message,
      });
    }
    return res.status(200).send();
  }

  async openLecture(req: Request, res: Response): Promise<Response> {
    try {
      const id: number = parseInt(req.params["id"]);
      await this.lectureService.open(id);
    } catch (e: any) {
      if (!(e instanceof HttpError)) {
        return res.status(500).send({
          message: e.message,
        });
      }
      return res.status(e.httpCode).send({
        message: e.message,
      });
    }
    return res.status(200).send();
  }

  async createEnrollment(req: Request, res: Response): Promise<Response> {
    let result: number;
    try {
      const lectureId: number = parseInt(req.params["id"]);
      const { studentId }: { studentId: number } = req.body;
      result = await this.lectureService.enroll({ lectureId, studentId });
    } catch (e: any) {
      if (!(e instanceof HttpError)) {
        return res.status(500).send({
          message: e.message,
        });
      }
      return res.status(e.httpCode).send({
        message: e.message,
      });
    }
    return response.status(201).send({
      id: result,
    });
  }

  async deleteLecture(req: Request, res: Response): Promise<Response> {
    try {
      const id: number = parseInt(req.params["id"]);
      await this.lectureService.delete(id);
    } catch (e: any) {
      if (!(e instanceof HttpError)) {
        return res.status(500).send({
          message: e.message,
        });
      }
      return res.status(e.httpCode).send({
        message: e.message,
      });
    }
    return res.status(200).send();
  }
}
