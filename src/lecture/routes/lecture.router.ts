import { Router } from "express";
import LectureController from "../interface/lecture.controller";
import AppConfig from "../../app.config";
import { container } from "tsyringe";

const lectureRouter = Router();

// const container = AppConfig.container();

// const lectureController: LectureController =
//   container.resolve(LectureController);

lectureRouter.post("/", (req, res, next) => {
  container.resolve(LectureController).createLecture(req, res, next);
});

lectureRouter.post("/:id/enrollments", (req, res, next) => {
  container.resolve(LectureController).createEnrollment(req, res, next);
});

lectureRouter.patch("/:id/open", (req, res, next) => {
  container.resolve(LectureController).openLecture(req, res, next);
});

lectureRouter.patch("/:id", (req, res, next) => {
  container.resolve(LectureController).updateLecture(req, res, next);
});

lectureRouter.delete("/:id", (req, res, next) => {
  container.resolve(LectureController).deleteLecture(req, res, next);
});

export default lectureRouter;
