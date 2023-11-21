"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const instructor_1 = __importDefault(require("../../../src/instructor/domain/instructor"));
describe("instructor test", () => {
    test("교사 생성 테스트", () => {
        const instructor = new instructor_1.default("1", "인프랩");
        expect(instructor.name).toBe("인프랩");
    });
});
