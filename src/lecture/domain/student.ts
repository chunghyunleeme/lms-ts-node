export default class Student {
  private _id: number;
  private _nickName: string;

  constructor(id: number, nickName: string) {
    this._id = id;
    this._nickName = nickName;
  }

  get id() {
    return this._id;
  }
}
