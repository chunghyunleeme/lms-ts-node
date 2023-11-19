import Student from "../student";

export default interface IStudentRepository {
  save: (student: Student) => Promise<number>;

  findById: (id: number) => Promise<Student | null>;

  findByEmail: (email: string) => Promise<Student | null>;
}
