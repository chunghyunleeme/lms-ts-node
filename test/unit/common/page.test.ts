import { Page } from "../../../src/common/pagination/page";

describe("Page", () => {
  it.each([
    [0, 10, 0],
    [10, 10, 1],
    [11, 10, 2],
  ])(
    "totalCount=%i, pageSize=%i 이면 totalPage=%i",
    (totalCount, pageSize, expected) => {
      expect(new Page(totalCount, pageSize, []).totalPage).toBe(expected);
    }
  );
});
