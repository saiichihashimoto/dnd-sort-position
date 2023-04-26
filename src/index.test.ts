import defaultValue, { getNPositions, positionBetween } from ".";

describe("default", () => {
  it("same as named export", () =>
    expect(defaultValue)
      // eslint-disable-next-line jest/prefer-strict-equal -- Specifically want equality by reference
      .toEqual(positionBetween));
});

describe("getPositionBetween", () => {
  it("returns a string between", () =>
    expect(positionBetween("b", "d")).toBe("c"));

  it("returns character directly between", () =>
    expect(positionBetween("b", "f")).toBe("d"));

  it("allows a number interpolationFactor", () =>
    expect(positionBetween("b", "f", 0.2)).toBe("c"));

  it("allows a function interpolationFactor", () =>
    expect(positionBetween("b", "f", () => 0.2)).toBe("c"));

  it("allows that function to be `Math.random`", () =>
    expect(positionBetween("b", "d", Math.random)).toBe("c"));

  it("allows returning leftmost character", () =>
    expect(positionBetween("b", "f", () => 0)).toBe("c"));

  it("allows returning rightmost character", () =>
    expect(positionBetween("b", "f", () => 1)).toBe("e"));

  it("allows returning character matching second param when it's still between", () =>
    expect(positionBetween("b", "fb", () => 1)).toBe("f"));

  it("returns rightmost character when factor is close to 1, otherwise Math.random doesn't work", () =>
    expect(positionBetween("b", "f", () => 0.9999)).toBe("e"));

  it("throws if first param is greater", () =>
    expect(() => positionBetween("d", "b")).toThrow("Invalid Arguments"));

  it("throws if strings are equal", () =>
    expect(() => positionBetween("b", "b")).toThrow("Invalid Arguments"));

  it("throws if first param has illegal character", () =>
    expect(() => positionBetween("A", "b")).toThrow("Invalid Arguments"));

  it("throws if second param has illegal character", () =>
    expect(() => positionBetween("b", "{")).toThrow("Invalid Arguments"));

  it("allows an undefined first param", () =>
    expect(positionBetween(undefined, "c")).toBe("b"));

  it("allows an undefined second param", () =>
    expect(positionBetween("y", undefined)).toBe("z"));

  it("allows both param undefined", () =>
    expect(positionBetween(undefined, undefined)).toBe("n"));

  it("returns a shorter string when possible", () =>
    expect(positionBetween("aab", "cab")).toBe("b"));

  it('won\'t return a string ending in "a"', () =>
    expect(positionBetween(undefined, "b")).toBe("an"));

  it("adds digits after z", () =>
    expect(positionBetween("z", undefined)).toBe("zn"));

  it("keeps equivalent digits", () =>
    expect(positionBetween("aab", "acb")).toBe("ab"));

  it("uses leading digits of first parameter", () =>
    expect(positionBetween("ab", "b")).toBe("an"));

  it("uses leading digits of second parameter if shorter", () =>
    expect(positionBetween("az", "bc")).toBe("b"));

  it("handles start being longer than end", () =>
    expect(positionBetween("zzzz")).toBe("zzzzn"));

  it("handles end being longer than start", () =>
    expect(positionBetween(undefined, "aaab")).toBe("aaaan"));

  it("avoids blocked as array", () =>
    expect(
      positionBetween("pottx", "pottz", undefined, { blocked: ["potty"] })
    ).toBe("pottxn"));

  it("avoids blocked as object", () =>
    expect(
      positionBetween("pottx", "pottz", undefined, { blocked: { potty: 1 } })
    ).toBe("pottxn"));

  it("avoids blocked as function", () =>
    expect(
      positionBetween("pottx", "pottz", undefined, {
        blocked: (value) => value === "potty",
      })
    ).toBe("pottxn"));

  it("avoids blocked as regexp", () =>
    expect(
      positionBetween("pottx", "pottz", undefined, { blocked: /potty/ })
    ).toBe("pottxn"));

  it("defaults blocked to `badwords`", () =>
    expect(positionBetween("asr", "ast")).toBe("asrn"));

  it("avoids blocked when called recursively", () =>
    expect(
      positionBetween("test", "tesu", undefined, { blocked: ["testn"] })
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
