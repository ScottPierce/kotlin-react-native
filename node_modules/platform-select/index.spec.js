const testCommand = require("./test-utils/command");
const pick = require("./index");

describe("async macOS", () => {
  beforeAll(() => {
    Object.defineProperty(process, "platform", { value: "darwin" });
  });

  beforeEach(() => {
    testCommand.__shouldFail = [];
  });

  it("should fail because unexpected job, wrong key", () => {
    const badExample = a => a;
    const goodExample = a => () => a;

    expect(
      pick({
        wrong: badExample("a")
      })
    ).rejects.toThrow(/Task should be defined as object with keys/);
  });

  it("should fail because unexpected job, wrong value", () => {
    const badExample = a => a;
    const goodExample = a => () => a;

    expect(
      pick(
        {
          darwin: badExample("a")
        },
        {
          darwin: goodExample("b")
        },
        {
          darwin: testCommand.runAsync("c")
        }
      )
    ).rejects.toThrow(
      /Job has to be a function which returns value or Promise/
    );
  });

  it("should fail because unexpected job, wrong value, reorder", () => {
    testCommand.__shouldFail = ["a"];
    const badExample = a => a;

    expect(
      pick(
        {
          darwin: testCommand.runAsync("a")
        },
        {
          darwin: badExample("b")
        },
        {
          darwin: testCommand.runAsync("c")
        }
      )
    ).rejects.toThrow(
      /Job has to be a function which returns value or Promise/
    );
  });

  it("should follow the path", () => {
    testCommand.__shouldFail = ["a", "b"];

    expect(
      pick(
        {
          darwin: testCommand.runAsync("a")
        },
        {
          darwin: testCommand.runAsync("b")
        },
        {
          darwin: testCommand.runAsync("c")
        }
      )
    ).resolves.toBe("c");
  });

  it("should fail the path", () => {
    testCommand.__shouldFail = ["a", "b", "c"];

    expect(
      pick(
        {
          darwin: testCommand.runAsync("a")
        },
        {
          darwin: testCommand.runAsync("b")
        },
        {
          darwin: testCommand.runAsync("c")
        }
      )
    ).rejects.toThrow(/No suitable job for "darwin"/);
  });
});

describe("macOS", () => {
  beforeAll(() => {
    Object.defineProperty(process, "platform", { value: "darwin" });
  });

  beforeEach(() => {
    testCommand.__shouldFail = [];
  });

  it("should follow the path, pick 2nt", () => {
    testCommand.__shouldFail = ["google chrome"];

    expect(
      pick(
        {
          darwin: testCommand.run("google chrome"),
          _: testCommand.run("google-chrome"),
          win32: testCommand.run("chrome")
        },
        {
          darwin: testCommand.run("google chrome canary"),
          win32: testCommand.run("chrome canary"),
          _: testCommand.run("google-chrome-canary")
        }
      )
    ).resolves.toBe("google chrome canary");
  });

  it("should follow the path, pick 2nt from default value", () => {
    testCommand.__shouldFail = ["google chrome"];

    expect(
      pick(
        {
          darwin: testCommand.run("google chrome"),
          _: testCommand.run("google-chrome"),
          win32: testCommand.run("chrome")
        },
        {
          win32: testCommand.run("chrome canary"),
          _: testCommand.run("google-chrome-canary")
        }
      )
    ).resolves.toBe("google-chrome-canary");
  });

  it("should follow the path, pick 1st", () => {
    expect(
      pick(
        {
          darwin: testCommand.run("google chrome"),
          _: testCommand.run("google-chrome"),
          win32: testCommand.run("chrome")
        },
        {
          darwin: testCommand.run("google chrome canary"),
          _: testCommand.run("google-chrome-canary"),
          win32: testCommand.run("chrome canary")
        }
      )
    ).resolves.toBe("google chrome");
  });

  it("should follow the path, should throw error", () => {
    testCommand.__shouldFail = ["google chrome", "google chrome canary"];

    expect(
      pick(
        {
          darwin: testCommand.run("google chrome"),
          _: testCommand.run("google-chrome"),
          win32: testCommand.run("chrome")
        },
        {
          darwin: testCommand.run("google chrome canary"),
          _: testCommand.run("google-chrome-canary"),
          win32: testCommand.run("chrome canary")
        }
      )
    ).rejects.toThrow(/No suitable job for "darwin"/);
  });
});

describe("win32", () => {
  beforeAll(() => {
    Object.defineProperty(process, "platform", { value: "win32" });
  });

  beforeEach(() => {
    testCommand.__shouldFail = [];
  });

  it("should follow the path, pick 2nt", () => {
    testCommand.__shouldFail = ["chrome"];

    expect(
      pick(
        {
          darwin: testCommand.run("google chrome"),
          _: testCommand.run("google-chrome"),
          win32: testCommand.run("chrome")
        },
        {
          darwin: testCommand.run("google chrome canary"),
          win32: testCommand.run("chrome canary"),
          _: testCommand.run("google-chrome-canary")
        }
      )
    ).resolves.toBe("chrome canary");
  });

  it("should follow the path, pick 1st", () => {
    expect(
      pick(
        {
          darwin: testCommand.run("google chrome"),
          _: testCommand.run("google-chrome"),
          win32: testCommand.run("chrome")
        },
        {
          darwin: testCommand.run("google chrome canary"),
          _: testCommand.run("google-chrome-canary"),
          win32: testCommand.run("chrome canary")
        }
      )
    ).resolves.toBe("chrome");
  });

  it("should follow the path, should throw error", () => {
    testCommand.__shouldFail = ["chrome", "chrome canary"];

    expect(
      pick(
        {
          darwin: testCommand.run("google chrome"),
          _: testCommand.run("google-chrome"),
          win32: testCommand.run("chrome")
        },
        {
          darwin: testCommand.run("google chrome canary"),
          _: testCommand.run("google-chrome-canary"),
          win32: testCommand.run("chrome canary")
        }
      )
    ).rejects.toThrow(/No suitable job for "win32"/);
  });
});

describe("linux", () => {
  beforeAll(() => {
    Object.defineProperty(process, "platform", { value: "linux" });
  });

  beforeEach(() => {
    testCommand.__shouldFail = [];
  });

  it("should follow the path, pick 2nt", () => {
    testCommand.__shouldFail = ["google-linux"];

    expect(
      pick(
        {
          darwin: testCommand.run("google chrome"),
          _: testCommand.run("google-chrome"),
          linux: testCommand.run("google-linux"),
          win32: testCommand.run("chrome")
        },
        {
          darwin: testCommand.run("google chrome canary"),
          win32: testCommand.run("chrome canary"),
          linux: testCommand.run("google-linux-canary"),
          _: testCommand.run("google-chrome-canary")
        }
      )
    ).resolves.toBe("google-linux-canary");
  });

  it("should follow the path, pick 1st", () => {
    expect(
      pick(
        {
          darwin: testCommand.run("google chrome"),
          _: testCommand.run("google-chrome"),
          win32: testCommand.run("chrome")
        },
        {
          darwin: testCommand.run("google chrome canary"),
          _: testCommand.run("google-chrome-canary"),
          win32: testCommand.run("chrome canary")
        }
      )
    ).resolves.toBe("google-chrome");
  });

  it("should follow the path, should throw error", () => {
    testCommand.__shouldFail = ["google-chrome"];

    expect(
      pick(
        {
          darwin: testCommand.run("google chrome"),
          _: testCommand.run("google-chrome"),
          win32: testCommand.run("chrome")
        },
        {
          darwin: testCommand.run("google chrome canary"),
          win32: testCommand.run("chrome canary")
        }
      )
    ).rejects.toThrow(
      'Function for current platform ("linux") is not defined!'
    );
  });

  it("should follow the path, pick 2th", () => {
    testCommand.__shouldFail = ["google-chrome"];

    expect(
      pick(
        {
          darwin: testCommand.run("google chrome"),
          linux: testCommand.run("google-chrome"),
          win32: testCommand.run("chrome")
        },
        {
          darwin: testCommand.run("google chrome canary"),
          _: testCommand.run("google-chrome-canary"),
          win32: testCommand.run("chrome canary")
        }
      )
    ).resolves.toBe("google-chrome-canary");
  });
});
