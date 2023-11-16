import InstructorService from "../../../src/instructor/application/instructor.service";
import IInstructorRepository from "../../../src/instructor/domain/repository/iinstructor.repository";
import DBInstructorRepository from "../../../src/instructor/infra/repository/instructor.repository";
describe("instructor service test", () => {
  let instructorRepository: IInstructorRepository;
  let instructorService: InstructorService;

  beforeEach(() => {
    instructorRepository = new DBInstructorRepository();
    instructorService = new InstructorService(instructorRepository);
  });

  test("create test", async () => {
    await instructorService.create("테스트 교사");

    const instructor = await instructorService.findById("1");

    console.log("instructor = ", instructor);
    console.log("instructor.name() = ", instructor.name());
    expect(instructor.name()).toBe("테스트 교사");
  });
});
