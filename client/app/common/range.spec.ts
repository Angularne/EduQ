import {RangePipe} from "./range";

describe("RangePipe", () => {
  let pipe: RangePipe;

  beforeEach(() => {
    pipe = new RangePipe();
  });

  it("create range 1...4", () => {
    expect(pipe.transform(4)).toEqual([1, 2, 3, 4]);
  });

  it("create range -2...2", () => {
    expect(pipe.transform([-2, 2])).toEqual([-2, -1, 0, 1, 2]);
  });


});
