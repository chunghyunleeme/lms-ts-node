import { NegativePrice } from "../../common/error/negative-price.error";

export default class Money {
  private _money: number;

  constructor(money: number) {
    if (money < 0) {
      throw new NegativePrice();
    }
    this._money = money;
  }

  get money(): number {
    return this._money;
  }
}
