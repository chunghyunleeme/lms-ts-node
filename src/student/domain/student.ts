export default class Student {
  private _id: number;
  private _email: string | null;
  private _nickName: string;
  private _deletedAt: Date;

  constructor({ email, nickName }: { email: string; nickName: string }) {
    this._email = email;
    this._nickName = nickName;
  }

  static from({
    id,
    email,
    nickName,
    deletedAt,
  }: {
    id: number;
    email: string;
    nickName: string;
    deletedAt: Date;
  }) {
    const student = new Student({ email, nickName });
    student._id = id;
    student._deletedAt = deletedAt;
    return student;
  }

  get id(): number {
    return this._id;
  }

  get email(): string | null {
    return this._email;
  }

  get nickName(): string {
    return this._nickName;
  }

  get deletedAt(): Date {
    return this._deletedAt;
  }

  withdraw(): void {
    const deleteDate = new Date();
    this._email += `/${deleteDate.toISOString()}`;
    this._deletedAt = deleteDate;
  }
}
