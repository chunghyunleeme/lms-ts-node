"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mockito_1 = require("ts-mockito");
const lecture_service_1 = __importDefault(require("../../../src/lecture/application/lecture.service"));
const lecture_1 = __importDefault(require("../../../src/lecture/domain/lecture"));
const category_1 = require("../../../src/lecture/domain/category");
const status_1 = require("../../../src/lecture/domain/status");
const bad_request_error_1 = require("../../../src/http-error/bad-request.error");
const cannot_find_lecture_error_1 = require("../../../src/error/cannot-find-lecture.error");
describe("lecture service test", () => {
    const studentService = (0, ts_mockito_1.mock)();
    const instructorService = (0, ts_mockito_1.mock)();
    const lectureRepository = (0, ts_mockito_1.mock)();
    const lectureService = new lecture_service_1.default((0, ts_mockito_1.instance)(lectureRepository), (0, ts_mockito_1.instance)(instructorService), (0, ts_mockito_1.instance)(studentService));
    describe("강의 등록 테스트", () => {
        it("동일한 강의명 중복 불가하다.", () => __awaiter(void 0, void 0, void 0, function* () {
            // given
            const title = "title";
            (0, ts_mockito_1.when)(instructorService.findById("1")).thenResolve({
                id: "id",
                name: "name",
            });
            (0, ts_mockito_1.when)(lectureRepository.findByTitle(title)).thenResolve(lecture_1.default.from({
                id: 1,
                title,
                desc: "desc",
                price: 1000,
                category: category_1.Category.ALGORITHM,
                status: status_1.Status.PUBLIC,
                numberOfStudent: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));
            // when, then
            yield expect(lectureService.save({
                instructorId: "1",
                title,
                desc: "desc",
                price: 1000,
                category: category_1.Category.ALGORITHM,
            })).rejects.toThrow(new Error("이미 존재하는 강의명입니다."));
        }));
    });
    describe("강의 수정 테스트", () => {
        it("실패: 존재하지 않는 강의인 경우 수정할 수 없다.", () => __awaiter(void 0, void 0, void 0, function* () {
            // given
            (0, ts_mockito_1.when)(lectureRepository.findById(1)).thenResolve(null);
            // when, then
            yield expect(lectureService.update({
                lectureId: 1,
                title: "title",
                desc: "desc",
                price: 1000,
            })).rejects.toThrow(new cannot_find_lecture_error_1.CanNotFindLecture());
        }));
    });
    describe("수강 신청 테스트", () => {
        it("실패: 가입하지 않은 수강생은 수강신청을 할 수 없다.", () => __awaiter(void 0, void 0, void 0, function* () {
            // given
            (0, ts_mockito_1.when)(lectureRepository.findByIdWithEnrollments(1)).thenResolve(lecture_1.default.from({
                id: 1,
                title: "title",
                desc: "desc",
                price: 1000,
                category: category_1.Category.ALGORITHM,
                status: status_1.Status.PUBLIC,
                numberOfStudent: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));
            (0, ts_mockito_1.when)(studentService.findById(1)).thenResolve(null);
            // when, then
            yield expect(lectureService.enroll({ lectureId: 1, studentId: 1 })).rejects.toThrow(new Error("존재하지 않는 학생입니다."));
        }));
        it("실패: 삭제된 강의는 수강신청을 할 수 없다.", () => __awaiter(void 0, void 0, void 0, function* () {
            // given
            (0, ts_mockito_1.when)(studentService.findById(1)).thenResolve({
                id: "1",
                name: "name",
                email: "email@email.com",
            });
            (0, ts_mockito_1.when)(lectureRepository.findByIdWithEnrollments(1)).thenResolve(null);
            // when, then
            yield expect(lectureService.enroll({ lectureId: 1, studentId: 1 })).rejects.toThrow(new cannot_find_lecture_error_1.CanNotFindLecture());
        }));
    });
    describe("강의 오픈 테스트", () => {
        it("성공", () => __awaiter(void 0, void 0, void 0, function* () {
            // given
            const lecture = lecture_1.default.from({
                id: 1,
                title: "title",
                desc: "desc",
                price: 1000,
                category: category_1.Category.ALGORITHM,
                status: status_1.Status.PRIVATE,
                numberOfStudent: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            (0, ts_mockito_1.when)(lectureRepository.findById(lecture.id)).thenResolve(lecture);
            // when
            yield lectureService.open(lecture.id);
            // then
            (0, ts_mockito_1.verify)(lectureRepository.updateForOpen((0, ts_mockito_1.deepEqual)(Object.assign(Object.assign({}, lecture), { status: status_1.Status.PUBLIC })))).never();
        }));
        it("실패: 강의가 존재하지 않는 경우", () => __awaiter(void 0, void 0, void 0, function* () {
            // given
            const lectureId = 1;
            (0, ts_mockito_1.when)(lectureRepository.findById(lectureId)).thenResolve(null);
            // when, then
            yield expect(lectureService.open(lectureId)).rejects.toThrow(new cannot_find_lecture_error_1.CanNotFindLecture());
        }));
        it("실패: 이미 공개한 강의인 경우", () => __awaiter(void 0, void 0, void 0, function* () {
            // given
            const lecture = lecture_1.default.from({
                id: 1,
                title: "title",
                desc: "desc",
                price: 1000,
                category: category_1.Category.ALGORITHM,
                status: status_1.Status.PUBLIC,
                numberOfStudent: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            (0, ts_mockito_1.when)(lectureRepository.findById(lecture.id)).thenResolve(lecture);
            // when, then
            yield expect(lectureService.open(lecture.id)).rejects.toThrow(new bad_request_error_1.BadRequestError("이미 공개된 강의 입니다."));
            (0, ts_mockito_1.verify)(lectureRepository.updateForOpen((0, ts_mockito_1.deepEqual)(Object.assign(Object.assign({}, lecture), { status: status_1.Status.PUBLIC })))).never();
        }));
    });
});
