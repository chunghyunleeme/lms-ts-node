import Instructor from "../instructor";

export default interface IInstructorRepository {
  findById: (id: string) => Promise<Instructor>;

  save: (id: string, name: string) => Promise<void>;

  delete: (id: string) => Promise<void>;
}
