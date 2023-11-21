import { Router } from "express";
import LectureController from "../interface/lecture.controller";
import configDI from "../../app.config";

const lectureRouter = Router();

const container = configDI();

const lectureController: LectureController =
  container.resolve(LectureController);

lectureRouter.post("/", (req, res) => {
  lectureController.createLecture(req, res);
});

lectureRouter.post("/enrollments", (req, res) => {
  lectureController.createEnrollment(req, res);
});

lectureRouter.patch("/open/:id", (req, res) => {
  lectureController.openLecture(req, res);
});

lectureRouter.patch("/:id", (req, res) => {
  lectureController.updateLecture(req, res);
});

lectureRouter.delete("/:id", (req, res) => {
  lectureController.deleteLecture;
});

export default lectureRouter;
