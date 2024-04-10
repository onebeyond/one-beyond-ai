import { concurrentRunner } from "./concurrent-runner";

const spy = jest.fn();
const wrapFn = (i: number) => async () => spy(i);

describe("Concurrent Runner", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should resolve all tasks", async () => {
    spy.mockImplementation((i: number) => Promise.resolve(i));
    const tasks = [];
    for (let i = 0; i < 10; i++) {
      tasks.push(wrapFn(i));
    }
    const results = await concurrentRunner(tasks, 5);
    expect(spy).toHaveBeenCalledTimes(10);
    expect(results).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("should throw an error and skip remaining tasks", async () => {
    spy.mockRejectedValueOnce(new Error("error"));
    spy.mockImplementation((i: number) => Promise.resolve(i));

    const tasks = [];
    for (let i = 0; i < 10; i++) {
      tasks.push(wrapFn(i));
    }
    try {
      await concurrentRunner(tasks, 5);
    } catch (e: any) {
      expect(e?.message).toBe("error");
    }
    expect(spy).toHaveBeenCalledTimes(5);
  });
});
