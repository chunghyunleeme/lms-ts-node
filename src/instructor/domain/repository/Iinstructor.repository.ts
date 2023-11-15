import Instructor from "../instructor";

export default interface IinstructorRepository {
  findById: (id: string) => Promise<Instructor>;

  save: (id: string, name: string) => Promise<void>;
}
