export interface IStudentService {
  findById(id: number): Promise<any>;
}
