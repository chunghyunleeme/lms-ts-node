export default class Student {
  private studentId: string;
  private studentEmail: string;
  private studentNickName: string;

  constructor({
    id,
    email,
    nickName,
  }: {
    id: string;
    email: string;
    nickName: string;
  }) {
    this.studentId = id;
    this.studentEmail = email;
    this.studentNickName = nickName;
  }

  public id(): string {
    return this.studentId;
  }

  public email(): string {
    return this.studentEmail;
  }

  public nickName(): string {
    return this.studentNickName;
  }
}
