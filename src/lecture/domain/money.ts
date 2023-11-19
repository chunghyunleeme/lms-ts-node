export default class Money {
  private _money: number;

  constructor(money: number) {
    if (money < 0) {
      throw new Error("가격은 음수가 될 수 없습니다.");
    }
    this._money = money;
  }

  get money(): number {
    return this._money;
  }
}
