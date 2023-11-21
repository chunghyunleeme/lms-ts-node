"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const student_1 = __importDefault(require("../../../src/student/domain/student"));
describe("student test", () => {
    it("학생 생성 테스트", () => {
        const student = new student_1.default({
            email: "chunghyun.dev@gmail.com",
            nickName: "lee",
        });
        expect(student.email).toBe("chunghyun.dev@gmail.com");
    });
    it("학생 탈퇴 테스트", () => {
        // given
        const student = new student_1.default({
            email: "chunghyun.dev@gmail.com",
            nickName: "lee",
        });
        // when
        student.withdraw();
        // then
        expect(student.email).toContain("/");
    });
});
