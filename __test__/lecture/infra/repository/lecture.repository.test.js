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
const db_1 = __importDefault(require("../../../../src/db"));
const instructor_repository_1 = __importDefault(require("../../../../src/instructor/infra/repository/instructor.repository"));
const category_1 = require("../../../../src/lecture/domain/category");
const enrollment_1 = __importDefault(require("../../../../src/lecture/domain/enrollment"));
const lecture_1 = __importDefault(require("../../../../src/lecture/domain/lecture"));
const lecture_repository_1 = __importDefault(require("../../../../src/lecture/infra/repository/lecture.repository"));
const student_1 = __importDefault(require("../../../../src/student/domain/student"));
const student_repository_1 = __importDefault(require("../../../../src/student/infra/repository/student.repository"));
describe("lecture repository test", () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.default.query("DELETE FROM enrollment");
        yield db_1.default.query("DELETE FROM lecture");
        yield db_1.default.query("DELETE FROM student");
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.default.releaseConnection;
        yield db_1.default.end();
    }));
    const lectureRepository = new lecture_repository_1.default();
    const instructorRepository = new instructor_repository_1.default();
    const studentRepository = new student_repository_1.default();
    it("save test", () => __awaiter(void 0, void 0, void 0, function* () {
        // given
        const findInstructor = yield instructorRepository.findById("1");
        const instructor = {
            id: findInstructor.id,
            name: findInstructor.name,
        };
        const lecture = new lecture_1.default({
            instructor,
            title: "title",
            desc: "desc",
            price: 1000,
            category: category_1.Category.ALGORITHM,
        });
        // when
        const result = yield lectureRepository.save(lecture);
        // then
        expect(typeof result).toBe("number");
    }));
    it("findById test", () => __awaiter(void 0, void 0, void 0, function* () {
        // given
        const findInstructor = yield instructorRepository.findById("1");
        const instructor = {
            id: findInstructor.id,
            name: findInstructor.name,
        };
        const lecture = new lecture_1.default({
            instructor,
            title: "title",
            desc: "desc",
            price: 1000,
            category: category_1.Category.ALGORITHM,
        });
        const result = yield lectureRepository.save(lecture);
        // when
        const findLecture = yield lectureRepository.findById(result);
        // then
        expect(findLecture === null || findLecture === void 0 ? void 0 : findLecture.id).toBe(result);
    }));
    it("findByTitle test", () => __awaiter(void 0, void 0, void 0, function* () {
        // given
        const findInstructor = yield instructorRepository.findById("1");
        const instructor = {
            id: findInstructor.id,
            name: findInstructor.name,
        };
        const lectureTitle = "title";
        const lecture = new lecture_1.default({
            instructor,
            title: lectureTitle,
            desc: "desc",
            price: 1000,
            category: category_1.Category.ALGORITHM,
        });
        yield lectureRepository.save(lecture);
        // when
        const findLecture = yield lectureRepository.findByTitle(lectureTitle);
        // then
        expect(findLecture === null || findLecture === void 0 ? void 0 : findLecture.title).toBe(lectureTitle);
    }));
    it("update test", () => __awaiter(void 0, void 0, void 0, function* () {
        // given
        const findInstructor = yield instructorRepository.findById("1");
        const instructor = {
            id: findInstructor.id,
            name: findInstructor.name,
        };
        const lectureTitle = "title";
        const lectureDesc = "desc";
        const lecture = new lecture_1.default({
            instructor,
            title: lectureTitle,
            desc: lectureDesc,
            price: 1000,
            category: category_1.Category.ALGORITHM,
        });
        const saveId = yield lectureRepository.save(lecture);
        const findLecture = yield lectureRepository.findById(saveId);
        // when
        const updatedTitle = "updated-title";
        if (findLecture) {
            findLecture === null || findLecture === void 0 ? void 0 : findLecture.update({
                title: updatedTitle,
            });
            yield lectureRepository.update(findLecture);
        }
        const updateLecture = yield lectureRepository.findById(saveId);
        // then
        expect(updateLecture === null || updateLecture === void 0 ? void 0 : updateLecture.title).toBe(updatedTitle);
        expect(updateLecture === null || updateLecture === void 0 ? void 0 : updateLecture.desc).toBe(lectureDesc);
    }));
    it("saveEnrollment", () => __awaiter(void 0, void 0, void 0, function* () {
        // given
        const student = new student_1.default({
            email: "test@email.com",
            nickName: "test",
        });
        const studentSaveId = yield studentRepository.save(student);
        const findStudent = yield studentRepository.findById(studentSaveId);
        const findInstructor = yield instructorRepository.findById("1");
        const instructor = {
            id: findInstructor.id,
            name: findInstructor.name,
        };
        const lecture = new lecture_1.default({
            instructor,
            title: "title",
            desc: "desc",
            price: 1000,
            category: category_1.Category.ALGORITHM,
        });
        const lectureSaveId = yield lectureRepository.save(lecture);
        // when
        const findLecture = yield lectureRepository.findById(lectureSaveId);
        // when
        let enrollmentSaveId;
        if (findLecture && findStudent) {
            const enrollment = new enrollment_1.default({
                lecture: findLecture,
                student: {
                    id: findStudent === null || findStudent === void 0 ? void 0 : findStudent.id,
                    nickName: findStudent === null || findStudent === void 0 ? void 0 : findStudent.nickName,
                },
                enrollmentDate: new Date(),
            });
            enrollmentSaveId = yield lectureRepository.saveEnrollment(enrollment);
        }
        // then
        const [result] = yield db_1.default.query("SELECT * FROM enrollment WHERE id = ?", [enrollmentSaveId]);
        expect(result[0].id).toBe(enrollmentSaveId);
    }));
    it("findByIdWithEnrollments test", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        // given
        const student = new student_1.default({
            email: "test@email.com",
            nickName: "test",
        });
        const studentSaveId = yield studentRepository.save(student);
        const findStudent = yield studentRepository.findById(studentSaveId);
        const findInstructor = yield instructorRepository.findById("1");
        const instructor = {
            id: findInstructor.id,
            name: findInstructor.name,
        };
        const lecture = new lecture_1.default({
            instructor,
            title: "title",
            desc: "desc",
            price: 1000,
            category: category_1.Category.ALGORITHM,
        });
        const lectureSaveId = yield lectureRepository.save(lecture);
        const findLecture = yield lectureRepository.findById(lectureSaveId);
        let enrollmentSaveId;
        if (findLecture && findStudent) {
            const enrollment = new enrollment_1.default({
                lecture: findLecture,
                student: {
                    id: findStudent === null || findStudent === void 0 ? void 0 : findStudent.id,
                    nickName: findStudent === null || findStudent === void 0 ? void 0 : findStudent.nickName,
                },
                enrollmentDate: new Date(),
            });
            enrollmentSaveId = yield lectureRepository.saveEnrollment(enrollment);
        }
        // when
        const lectureWithEnrollment = yield lectureRepository.findByIdWithEnrollments(lectureSaveId);
        // then
        expect(lectureWithEnrollment === null || lectureWithEnrollment === void 0 ? void 0 : lectureWithEnrollment.enrollments).toHaveLength(1);
        expect((_a = lectureWithEnrollment === null || lectureWithEnrollment === void 0 ? void 0 : lectureWithEnrollment.enrollments) === null || _a === void 0 ? void 0 : _a.some((enrollment) => {
            if (enrollment.id == enrollmentSaveId) {
                return true;
            }
        })).toBeTruthy();
    }));
});
