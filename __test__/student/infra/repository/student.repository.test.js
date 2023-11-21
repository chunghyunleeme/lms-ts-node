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
const student_1 = __importDefault(require("../../../../src/student/domain/student"));
const student_repository_1 = __importDefault(require("../../../../src/student/infra/repository/student.repository"));
describe("student repository test", () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.default.query("DELETE FROM enrollment");
        yield db_1.default.query("DELETE FROM student");
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.default.releaseConnection;
        yield db_1.default.end();
    }));
    const studentRepository = new student_repository_1.default();
    it("save test", () => __awaiter(void 0, void 0, void 0, function* () {
        // given
        const student = new student_1.default({
            email: "test@email.com",
            nickName: "test",
        });
        // when
        const result = yield studentRepository.save(student);
        // then
        expect(typeof result).toBe("number");
    }));
    it("updateForWithdrawal test", () => __awaiter(void 0, void 0, void 0, function* () {
        // given
        const student = new student_1.default({
            email: "test@email.com",
            nickName: "test",
        });
        const result = yield studentRepository.save(student);
        const findStudent = yield studentRepository.findById(result);
        findStudent === null || findStudent === void 0 ? void 0 : findStudent.withdraw();
        // when
        if (findStudent)
            yield studentRepository.updateForWithdrawal(findStudent);
        // then
        const findStudentWithdrawal = yield studentRepository.findById(result);
        expect(findStudentWithdrawal === null || findStudentWithdrawal === void 0 ? void 0 : findStudentWithdrawal.email).toContain("/");
        expect(findStudentWithdrawal === null || findStudentWithdrawal === void 0 ? void 0 : findStudentWithdrawal.deletedAt).not.toBeNull();
    }));
    it("findById test", () => __awaiter(void 0, void 0, void 0, function* () {
        // given
        const student = new student_1.default({
            email: "test@email.com",
            nickName: "test",
        });
        const result = yield studentRepository.save(student);
        // when
        const findStudent = yield studentRepository.findById(result);
        // then
        expect(findStudent).not.toBeNull();
        expect(findStudent === null || findStudent === void 0 ? void 0 : findStudent.id).toBe(result);
    }));
    it("findByEmail test", () => __awaiter(void 0, void 0, void 0, function* () {
        // given
        const student = new student_1.default({
            email: "test@email.com",
            nickName: "test",
        });
        const result = yield studentRepository.save(student);
        // when
        const findStudent = yield studentRepository.findById(result);
        // then
        expect(findStudent).not.toBeNull();
        expect(findStudent === null || findStudent === void 0 ? void 0 : findStudent.email).toBe("test@email.com");
    }));
});
