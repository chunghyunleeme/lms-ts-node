import Student from "../student";

export default interface IStudentRepository {
  findById: (id: string) => Promise<Student>;

  save: ({
    id,
    email,
    nickName,
  }: {
    id: string;
    email: string;
    nickName: string;
  }) => Promise<void>;
}
