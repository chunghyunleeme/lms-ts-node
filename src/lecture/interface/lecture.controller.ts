import { Request, Response } from "express";
import LectureService from "../application/lecture.service";
import { Category } from "../domain/category";
import { HttpError } from "../../http-error/http.error";

export default class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  async createLecture(req: Request, res: Response): Promise<Response> {
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

      return res.status(201).send();
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
  }

  //   async updateLecture(req: Request, res: Response): Promise<Response> {
  //     try {
  //       const id = req.params["id"];
  //       const { title, desc, price } = req.body;
  //     } catch (e: any) {
  //       if (!(e instanceof HttpError)) {
  //         return res.status(500).send({
  //           message: e.message,
  //         });
  //       }
  //       return res.status(e.httpCode).send({
  //         message: e.message,
  //       });
  //     }
  //   }
  //   openLecture(req: Request, res: Response): Promise<Response> {}
  //   deleteLecture(req: Request, res: Response): Promise<Response> {}

  //   createEnrollment(req: Request, res: Response): Promise<Response> {}
}
