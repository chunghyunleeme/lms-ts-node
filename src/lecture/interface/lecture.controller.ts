import { NextFunction, Request, Response } from "express";
import LectureService from "../application/lecture.service";
import { Category } from "../domain/category";
import { inject, singleton } from "tsyringe";
import ILectureRepository from "../domain/repository/ilecture.repository";
import { CanNotFindLecture } from "../../common/error/cannot-find-lecture.error";
import LectureSearchRequest from "../domain/repository/dto/lecture.search";
import LectureSummary from "../domain/repository/dto/lecture.summary";
import { Page } from "../../common/pagination/page";
import { BadRequestError } from "../../common/error/http-error/bad-request.error";
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

      /**
       * 요청 검증
       */
      const MAX_SAVE_COUNT = 10;
      if (MAX_SAVE_COUNT < lectures.length) {
        throw new BadRequestError("최대 등록 가능 갯수는 10개입니다.");
      }
      Promise.all(
        lectures.map((lecture) => {
          if (
            !lecture.instructorId ||
            !lecture.title ||
            !lecture.desc ||
            !lecture.price ||
            !lecture.category ||
            typeof lecture.price != "number"
          ) {
            throw new BadRequestError("입력값을 다시 확인해 주세요.");
          }
        })
      );

      await this.lectureService.saveLectures(lectures);
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
      const id = +req.params.id;
      const { title, desc, price } = req.body;

      /**
       * 요청 검증
       */
      if (typeof id != "number") {
        throw new BadRequestError("잘못된 URL입니다.");
      }
      if (price && typeof price != null) {
        throw new BadRequestError("입력값을 다시 확인해 주세요.");
      }

      await this.lectureService.update({
        lectureId: id,
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
      const id: number = +req.params.id;

      /**
       * 요청 검증
       */
      if (typeof id != "number") {
        throw new BadRequestError("잘못된 URL입니다.");
      }

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

      /**
       * 요청 검증
       */
      if (typeof studentId != "number") {
        throw new BadRequestError("입력값을 다시 확인해 주세요.");
      }
      if (
        lectureIds.some((lectureId) => {
          if (typeof lectureId != "number") {
            return true;
          }
        })
      ) {
        throw new BadRequestError("입력값을 다시 확인해 주세요.");
      }

      await this.lectureService.enrollLectures({ lectureIds, studentId });
      return res.status(201).json();
    } catch (e) {
      next(e);
    }
  }

  async deleteLecture(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = +req.params.id;

      /**
       * 요청 검증
       */
      if (typeof id != "number") {
        throw new BadRequestError("잘못된 URL입니다.");
      }

      await this.lectureService.delete(id);
      return res.status(200).json();
    } catch (e) {
      next(e);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = +req.params.id;

      /**
       * 요청 검증
       */
      if (typeof id != "number") {
        throw new BadRequestError("잘못된 URL입니다.");
      }

      const result = await this.lectureRepository.findByIdForDetail(id);
      if (!result) {
        throw new CanNotFindLecture();
      }
      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const params: any = req.query;
      const search = new LectureSearchRequest(params);
      const [result, totalCount] = await this.lectureRepository.findAll(search);
      return res
        .status(200)
        .json(new Page<LectureSummary>(totalCount, search.pageSize, result));
    } catch (e) {
      next(e);
    }
  }
}
