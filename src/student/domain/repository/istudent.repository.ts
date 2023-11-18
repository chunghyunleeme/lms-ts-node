import Student from "../student";

export default interface IStudentRepository {
  save: ({
    email,
    nickName,
  }: {
    email: string;
    nickName: string;
  }) => Promise<void>;

  findById: (id: string) => Promise<Student | null>;

  findByEmail: (email: string) => Promise<Student | null>;
}
