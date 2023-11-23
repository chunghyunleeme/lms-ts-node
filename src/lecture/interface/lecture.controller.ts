import { NextFunction, Request, Response } from "express";
import LectureService from "../application/lecture.service";
import { Category } from "../domain/category";
import { inject, singleton } from "tsyringe";
import ILectureRepository from "../domain/repository/ilecture.repository";
import { CanNotFindLecture } from "../../error/cannot-find-lecture.error";
@singleton()
export default class LectureController {
  constructor(
    @inject("LectureRepository")
    private readonly lectureRepository: ILectureRepository,
    private readonly lectureService: LectureService
  ) {}
  async createLectures(req: Request, res: Response, next: NextFunction) {
    try {
      const lectures: Array<{
        instructorId: string;
        title: string;
        desc: string;
        price: number;
        category: Category;
      }> = req.body;
      const MAX_SAVE_COUNT = 10;
      if (MAX_SAVE_COUNT < lectures.length) {
        throw new Error("최대 등록 가능 갯수는 10개입니다.");
      }
      await this.lectureService.saveLectures(lectures);
      return res.status(201).json();
    } catch (e) {
      next(e);
    }
  }
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

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = parseInt(req.params.id);
      const result = await this.lectureRepository.findByIdForDetail(id);
      if (!result) {
        throw new CanNotFindLecture();
      }
      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
}
