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
const student_service_1 = require("../../../src/student/application/student.service");
const student_controller_1 = __importDefault(require("../../../src/student/interface/student.controller"));
const already_existing_email_error_1 = require("../../../src/error/already-existing-email.error");
describe("student controller test", () => {
    const studentService = (0, ts_mockito_1.mock)(student_service_1.StudentService);
    const studentController = new student_controller_1.default((0, ts_mockito_1.instance)(studentService));
    describe("createStudent test", () => {
        it("실패", () => __awaiter(void 0, void 0, void 0, function* () {
            // given
            const email = "test";
            const nickName = "test";
            (0, ts_mockito_1.when)(studentService.join(email, nickName)).thenReject(new already_existing_email_error_1.AlreadyExistingEmail());
            const mockRequest = {
                body: { email, nickName },
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            // when
            yield studentController.createStudent(mockRequest, mockResponse);
            // then;
            expect(mockResponse.status).toHaveBeenCalledWith(409);
        }));
        it("성공", () => __awaiter(void 0, void 0, void 0, function* () {
            // given
            const email = "test";
            const nickName = "test";
            (0, ts_mockito_1.when)(studentService.join(email, nickName)).thenResolve(1);
            const mockRequest = {
                body: { email, nickName },
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            // when
            yield studentController.createStudent(mockRequest, mockResponse);
            // then;
            expect(mockResponse.status).toHaveBeenCalledWith(201);
        }));
    });
});
