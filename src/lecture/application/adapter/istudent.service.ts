export interface IStudentService {
  findById(id: String): Promise<any>;
}
