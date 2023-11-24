import Money from "../../../../src/lecture/domain/money";
import { NegativePrice } from "../../../../src/common/error/negative-price.error";
describe("Money", () => {
  describe("생성", () => {
    it("실패: 음수 값", () => {
      // given
      const negativeNumber: number = -1000;

      // when, then
      expect(() => new Money(negativeNumber)).toThrow(new NegativePrice());
    });
    it("성공", () => {
      // given
      const positiveNumber: number = 1000;

      // when
      const money = new Money(positiveNumber);

      //   then
      expect(money.money).toBe(positiveNumber);
    });
  });
});
