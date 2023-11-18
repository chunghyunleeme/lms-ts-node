import Student from "../student";

export default interface IStudentRepository {
  save: (student: Student) => Promise<void>;

  findById: (id: string) => Promise<Student | null>;

  findByEmail: (email: string) => Promise<Student | null>;
}
