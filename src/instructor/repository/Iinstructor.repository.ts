export default interface IinstructorRepository {
  save: (id: string, name: string) => Promise<void>;
}
