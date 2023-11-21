"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const category_1 = require("../../../src/lecture/domain/category");
const enrollment_1 = __importDefault(require("../../../src/lecture/domain/enrollment"));
const lecture_1 = __importDefault(require("../../../src/lecture/domain/lecture"));
const status_1 = require("../../../src/lecture/domain/status");
describe("lecture test", () => {
    beforeEach(() => { });
    it("강의 생성 테스트", () => {
        const instructor = {
            id: "1",
            name: "테스트",
        };
        const lecture = new lecture_1.default({
            instructor,
            title: "테스트 강의",
            desc: "테스트 설명",
            price: 1000,
            category: category_1.Category.APP,
        });
        expect(lecture.title).toBe("테스트 강의");
        expect(lecture.numOfStudent).toBe(0);
        expect(lecture.category).toBe(category_1.Category.APP);
        expect(lecture.instructor).toBe(instructor);
        expect(lecture.status).toBe(status_1.Status.PRIVATE);
    });
    describe("강의 수정 테스트", () => {
        it("실패: 가격은 음수일 수 없습니다.", () => {
            const instructor = {
                id: "1",
                name: "테스트",
            };
            const lecture = new lecture_1.default({
                instructor,
                title: "테스트 강의",
                desc: "테스트 설명",
                price: 1000,
                category: category_1.Category.APP,
            });
            expect(() => lecture.update({
                title: "update-title",
                desc: "update-desc",
                price: -1,
            })).toThrow(Error);
        });
        it("성공", () => {
            // given
            const instructor = {
                id: "1",
                name: "테스트",
            };
            const lecture = new lecture_1.default({
                instructor,
                title: "테스트 강의",
                desc: "테스트 설명",
                price: 1000,
                category: category_1.Category.APP,
            });
            // when
            lecture.update({
                title: "update-title",
                desc: "update-desc",
                price: 2000,
            });
            // then
            expect(lecture.price.money).toBe(2000);
        });
    });
    describe("강의 삭제 테스트", () => {
        it("실패: 이미 수강생이 있는 경우", () => {
            // given
            const student = {
                id: 1,
                nickName: "test",
            };
            const lecture = lecture_1.default.from({
                id: 1,
                title: "title",
                desc: "desc",
                category: category_1.Category.ALGORITHM,
                price: 1000,
                status: status_1.Status.PUBLIC,
                numberOfStudent: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                enrollments: [
                    new enrollment_1.default({
                        lecture: lecture_1.default.from({
                            id: 1,
                            title: "title",
                            desc: "desc",
                            category: category_1.Category.ALGORITHM,
                            price: 1000,
                            status: status_1.Status.PUBLIC,
                            numberOfStudent: 0,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        }),
                        student: student,
                        enrollmentDate: new Date(),
                    }),
                ],
            });
            // when, then
            expect(() => lecture.delete()).toThrow(new Error("이미 수강생이 존재하는 강의는 삭제 할 수 없습니다."));
        });
        it("성공", () => {
            // given
            const lecture = lecture_1.default.from({
                id: 1,
                title: "title",
                desc: "desc",
                category: category_1.Category.ALGORITHM,
                price: 1000,
                status: status_1.Status.PRIVATE,
                numberOfStudent: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                enrollments: [],
            });
            // when
            lecture.delete();
            // then
            // 에러 없음
        });
    });
    it("강의 공개 테스트", () => {
        const instructor = {
            id: "1",
            name: "테스트",
        };
        const lecture = new lecture_1.default({
            instructor,
            title: "테스트 강의",
            desc: "테스트 설명",
            price: 1000,
            category: category_1.Category.APP,
        });
        lecture.open();
        expect(lecture.status).toBe(status_1.Status.PUBLIC);
    });
    describe("수강 신청 테스트", () => {
        it("실패: 비공개된 강의인 경우", () => {
            // given
            const instructor = {
                id: "1",
                name: "테스트 교사",
            };
            const lecture = new lecture_1.default({
                instructor,
                title: "테스트 강의",
                desc: "테스트 설명",
                price: 1000,
                category: category_1.Category.APP,
            });
            const student = {
                id: 1,
                nickName: "test",
            };
            // when, then
            expect(() => lecture.enrollment(student)).toThrow(Error);
        });
        it("실패: 이미 수강 중인 경우", () => {
            // given
            const student = {
                id: 1,
                nickName: "test",
            };
            const lecture = lecture_1.default.from({
                id: 1,
                title: "title",
                desc: "desc",
                category: category_1.Category.ALGORITHM,
                price: 1000,
                status: status_1.Status.PUBLIC,
                numberOfStudent: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                enrollments: [
                    new enrollment_1.default({
                        lecture: lecture_1.default.from({
                            id: 1,
                            title: "title",
                            desc: "desc",
                            category: category_1.Category.ALGORITHM,
                            price: 1000,
                            status: status_1.Status.PUBLIC,
                            numberOfStudent: 0,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        }),
                        student: student,
                        enrollmentDate: new Date(),
                    }),
                ],
            });
            // when, then
            expect(() => lecture.enrollment(student)).toThrow(new Error("이미 수강 중인 강의는 신청할 수 없습니다."));
        });
        it("실패: 수강 목록을 함께 조회하지 않은 경우", () => {
            // given
            const student = {
                id: 1,
                nickName: "test",
            };
            const lecture = lecture_1.default.from({
                id: 1,
                title: "title",
                desc: "desc",
                category: category_1.Category.ALGORITHM,
                price: 1000,
                status: status_1.Status.PUBLIC,
                numberOfStudent: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            // when, then
            expect(() => lecture.enrollment(student)).toThrow(new Error("잘못된 접근입니다."));
        });
        it("성공", () => {
            // given
            const instructor = {
                id: "1",
                name: "테스트 교사",
            };
            const lecture = lecture_1.default.from({
                id: 1,
                title: "title",
                desc: "desc",
                category: category_1.Category.ALGORITHM,
                price: 1000,
                status: status_1.Status.PRIVATE,
                numberOfStudent: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                enrollments: [],
            });
            lecture.open();
            const student = {
                id: 1,
                nickName: "test",
            };
            // when
            const enrollment = lecture.enrollment(student);
            // then
            expect(enrollment.student).toBe(student);
            expect(enrollment.lecture).toBe(lecture);
            expect(lecture.numOfStudent).toBe(1);
        });
    });
});
