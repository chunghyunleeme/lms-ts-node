import { Router } from "express";
import LectureController from "../interface/lecture.controller";
import AppConfig from "../../app.config";

const lectureRouter = Router();

const container = AppConfig.container();

const lectureController: LectureController =
  container.resolve(LectureController);

lectureRouter.post("/", (req, res, next) => {
  lectureController.createLecture(req, res, next);
});

lectureRouter.post("/:id/enrollments", (req, res, next) => {
  lectureController.createEnrollment(req, res, next);
});

lectureRouter.patch("/:id/open", (req, res, next) => {
  lectureController.openLecture(req, res, next);
});

lectureRouter.patch("/:id", (req, res, next) => {
  lectureController.updateLecture(req, res, next);
});

lectureRouter.delete("/:id", (req, res, next) => {
  lectureController.deleteLecture(req, res, next);
});

export default lectureRouter;
