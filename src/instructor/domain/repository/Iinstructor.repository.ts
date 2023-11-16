import Instructor from "../instructor";

export default interface IInstructorRepository {
  save(name: string): Promise<void>;
  findById(id: string): Promise<Instructor>;
}
