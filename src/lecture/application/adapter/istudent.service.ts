import Student from "../../domain/student";

export interface IStudentService {
  findById(id: number): Promise<Student | null>;
}
