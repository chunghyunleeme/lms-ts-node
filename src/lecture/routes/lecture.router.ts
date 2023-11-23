import { Router } from "express";
import LectureController from "../interface/lecture.controller";
import AppConfig from "../../app.config";
import { container } from "tsyringe";

const lectureRouter = Router();

lectureRouter.post("/", (req, res, next) => {
  container.resolve(LectureController).createLectures(req, res, next);
});

lectureRouter.post("/enrollments", (req, res, next) => {
  container.resolve(LectureController).createEnrollments(req, res, next);
});

lectureRouter.get("/:id", (req, res, next) => {
  container.resolve(LectureController).findById(req, res, next);
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
