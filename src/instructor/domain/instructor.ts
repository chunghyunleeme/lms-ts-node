export default class Instructor {
  private instructorId: string;
  private instructorName: string;

  constructor(id: string, name: string) {
    this.instructorId = id;
    this.instructorName = name;
  }

  public id() {
    return this.instructorId;
  }

  public name() {
    return this.instructorName;
  }
}
