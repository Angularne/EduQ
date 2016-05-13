import {ReversePipe} from "./reverse";


describe("ReversePipe", () => {
  let pipe: ReversePipe;

  beforeEach(() => {
    pipe = new ReversePipe();
  });

  it("reverse [1, 2, 3]", () => {
    expect(pipe.transform([1, 2, 3])).toEqual([3, 2, 1]);
  });
});
