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
const student_service_1 = require("../../../src/student/application/student.service");
const ts_mockito_1 = require("ts-mockito");
const student_1 = __importDefault(require("../../../src/student/domain/student"));
const already_existing_email_error_1 = require("../../../src/error/already-existing-email.error");
const cannot_find_student_error_1 = require("../../../src/error/cannot-find-student.error");
describe("student service test", () => {
    const studentRepository = (0, ts_mockito_1.mock)();
    const studentService = new student_service_1.StudentService((0, ts_mockito_1.instance)(studentRepository));
    describe("회원가입 테스트", () => {
        it("실패: 이미 존재하는 이메일인 경우", () => __awaiter(void 0, void 0, void 0, function* () {
            // given
            const email = "test@test.com";
            (0, ts_mockito_1.when)(studentRepository.findByEmail(email)).thenResolve(new student_1.default({
                email,
                nickName: "test",
            }));
            // when, then
            expect(() => __awaiter(void 0, void 0, void 0, function* () { return yield studentService.join(email, "test"); })).rejects.toThrow(new already_existing_email_error_1.AlreadyExistingEmail());
        }));
    });
    describe("회원탈퇴 테스트", () => {
        it("실패: 존재하지 않는 학생인 경우", () => {
            // given
            const studentId = 1;
            (0, ts_mockito_1.when)(studentRepository.findById(studentId)).thenResolve(null);
            // when, then
            expect(() => __awaiter(void 0, void 0, void 0, function* () { return yield studentService.withdraw(studentId); })).rejects.toThrow(new cannot_find_student_error_1.CanNotFindStudent());
        });
    });
});
