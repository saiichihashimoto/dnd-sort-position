import defaultValue, { getNPositions, getPositionBetween } from ".";

describe("default", () => {
  it("same as named export", () =>
    expect(defaultValue)
      // eslint-disable-next-line jest/prefer-strict-equal -- Specifically want equality by reference
      .toEqual(getPositionBetween));
});

describe("getPositionBetween", () => {
  it("returns a string between", () =>
    expect(getPositionBetween("b", "d")).toBe("c"));

  it("returns character directly between", () =>
    expect(getPositionBetween("b", "f")).toBe("d"));

  it("allows a number interpolationFactor", () =>
    expect(getPositionBetween("b", "f", 0.2)).toBe("c"));

  it("allows a function interpolationFactor", () =>
    expect(getPositionBetween("b", "f", () => 0.2)).toBe("c"));

  it("allows that function to be `Math.random`", () =>
    expect(getPositionBetween("b", "d", Math.random)).toBe("c"));

  it("allows returning leftmost character", () =>
    expect(getPositionBetween("b", "f", () => 0)).toBe("c"));

  it("allows returning rightmost character", () =>
    expect(getPositionBetween("b", "f", () => 1)).toBe("e"));

  it("allows returning character matching second param when it's still between", () =>
    expect(getPositionBetween("b", "fb", () => 1)).toBe("f"));

  it("returns rightmost character when factor is close to 1, otherwise Math.random doesn't work", () =>
    expect(getPositionBetween("b", "f", () => 0.9999)).toBe("e"));

  it("throws if first param is greater", () =>
    expect(() => getPositionBetween("d", "b")).toThrow("Invalid Arguments"));

  it("throws if strings are equal", () =>
    expect(() => getPositionBetween("b", "b")).toThrow("Invalid Arguments"));

  it("throws if first param has illegal character", () =>
    expect(() => getPositionBetween("A", "b")).toThrow("Invalid Arguments"));

  it("throws if second param has illegal character", () =>
    expect(() => getPositionBetween("b", "{")).toThrow("Invalid Arguments"));

  it("allows an undefined first param", () =>
    expect(getPositionBetween(undefined, "c")).toBe("b"));

  it("allows an undefined second param", () =>
    expect(getPositionBetween("y", undefined)).toBe("z"));

  it("allows both param undefined", () =>
    expect(getPositionBetween(undefined, undefined)).toBe("n"));

  it("returns a shorter string when possible", () =>
    expect(getPositionBetween("aab", "cab")).toBe("b"));

  it('won\'t return a string ending in "a"', () =>
    expect(getPositionBetween(undefined, "b")).toBe("an"));

  it("adds digits after z", () =>
    expect(getPositionBetween("z", undefined)).toBe("zn"));

  it("keeps equivalent digits", () =>
    expect(getPositionBetween("aab", "acb")).toBe("ab"));

  it("uses leading digits of first parameter", () =>
    expect(getPositionBetween("ab", "b")).toBe("an"));

  it("uses leading digits of second parameter if shorter", () =>
    expect(getPositionBetween("az", "bc")).toBe("b"));

  it("handles start being longer than end", () =>
    expect(getPositionBetween("zzzz")).toBe("zzzzn"));

  it("handles end being longer than start", () =>
    expect(getPositionBetween(undefined, "aaab")).toBe("aaaan"));

  it("avoids blocked as array", () =>
    expect(
      getPositionBetween("pottx", "pottz", undefined, { blocked: ["potty"] })
    ).toBe("pottxn"));

  it("avoids blocked as object", () =>
    expect(
      getPositionBetween("pottx", "pottz", undefined, { blocked: { potty: 1 } })
    ).toBe("pottxn"));

  it("avoids blocked as function", () =>
    expect(
      getPositionBetween("pottx", "pottz", undefined, {
        blocked: (value) => value === "potty",
      })
    ).toBe("pottxn"));

  it("avoids blocked as regexp", () =>
    expect(
      getPositionBetween("pottx", "pottz", undefined, { blocked: /potty/ })
    ).toBe("pottxn"));

  it("defaults blocked to `badwords`", () =>
    expect(getPositionBetween("asr", "ast")).toBe("asrn"));

  it("avoids blocked when called recursively", () =>
    expect(
      getPositionBetween("test", "tesu", undefined, { blocked: ["testn"] })
    ).toBe("testm"));
});

describe("getNPositions", () => {
  it("returns a similar result to getPositionBetween", () =>
    expect(getNPositions(1)).toStrictEqual(["n"]));

  it("returns evenly distributed positions", () =>
    expect(getNPositions(2)).toStrictEqual(["j", "r"]));

  it("fills the available space", () =>
    expect(getNPositions(25)).toStrictEqual([
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ]));

  it('distributes to the next digit starting at "a"', () =>
    expect(getNPositions(25 + 2)).toStrictEqual([
      "an",
      "b",
      "bn",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ]));

  it("distributes to each digit", () =>
    expect(getNPositions(25 + 26)).toStrictEqual([
      "an",
      "b",
      "bn",
      "c",
      "cn",
      "d",
      "dn",
      "e",
      "en",
      "f",
      "fn",
      "g",
      "gn",
      "h",
      "hn",
      "i",
      "in",
      "j",
      "jn",
      "k",
      "kn",
      "l",
      "ln",
      "m",
      "mn",
      "n",
      "nn",
      "o",
      "on",
      "p",
      "pn",
      "q",
      "qn",
      "r",
      "rn",
      "s",
      "sn",
      "t",
      "tn",
      "u",
      "un",
      "v",
      "vn",
      "w",
      "wn",
      "x",
      "xn",
      "y",
      "yn",
      "z",
      "zn",
    ]));

  it("evenly distribute positions to the next digit", () =>
    expect(getNPositions(25 + 26 + 2)).toStrictEqual([
      "aj",
      "ar",
      "b",
      "bj",
      "br",
      "c",
      "cn",
      "d",
      "dn",
      "e",
      "en",
      "f",
      "fn",
      "g",
      "gn",
      "h",
      "hn",
      "i",
      "in",
      "j",
      "jn",
      "k",
      "kn",
      "l",
      "ln",
      "m",
      "mn",
      "n",
      "nn",
      "o",
      "on",
      "p",
      "pn",
      "q",
      "qn",
      "r",
      "rn",
      "s",
      "sn",
      "t",
      "tn",
      "u",
      "un",
      "v",
      "vn",
      "w",
      "wn",
      "x",
      "xn",
      "y",
      "yn",
      "z",
      "zn",
    ]));
});
