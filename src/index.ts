import badwords from "badwords/object";

const afterZ = String.fromCodePoint("z".codePointAt(0)! + 1);

export const getPositionBetween = (
  startRaw = "",
  endRaw = "",
  interpolationFactor: number | (() => number) = 0.5,
  {
    blocked = badwords,
    inclusiveOfOne = typeof interpolationFactor === "number",
    prefix = "",
  }: {
    blocked?:
      | RegExp
      | string[]
      | ((value: string) => boolean)
      | { [key: string]: unknown };
    inclusiveOfOne?: boolean;
    prefix?: string;
  } = {}
): string => {
  const end = endRaw || afterZ;
  const start = startRaw.padEnd(end.length, "a");

  if (!/^[a-z]*$/.test(startRaw) || !/^[a-z]*$/.test(endRaw) || start >= end) {
    throw new Error("Invalid Arguments");
  }

  const indexOfDiff = [...start].findIndex(
    (value, index) => value !== end.charAt(index)
  );

  const startCharCodePoint = start.codePointAt(indexOfDiff)!;
  const endCharCodePoint = end.codePointAt(indexOfDiff)!;
  const isBlocked =
    typeof blocked === "function"
      ? blocked
      : blocked instanceof RegExp
      ? (value: string) => blocked.test(value)
      : Array.isArray(blocked)
      ? (() => {
          const blockedObj = Object.fromEntries(
            blocked.map((value) => [value, true] as const)
          );

          return (value: string) => Boolean(blockedObj[value]);
        })()
      : (value: string) => Boolean(blocked[value]);

  const possibleSimpleValues = Array.from(
    {
      length:
        endCharCodePoint -
        startCharCodePoint -
        1 +
        (end.length === indexOfDiff + 1 ? 0 : 1),
    },
    (value, index) =>
      prefix +
      start.slice(0, indexOfDiff) +
      String.fromCodePoint(startCharCodePoint + index + 1)
  ).filter((value) => !isBlocked(value));

  const possibleValues =
    possibleSimpleValues.length > 0
      ? possibleSimpleValues
      : [
          getPositionBetween(
            start.slice(indexOfDiff + 1),
            undefined,
            interpolationFactor,
            {
              blocked,
              inclusiveOfOne,
              prefix: prefix + start.slice(0, indexOfDiff + 1),
            }
          ),
          ...(end.length === indexOfDiff + 1
            ? []
            : [
                getPositionBetween(
                  undefined,
                  end.slice(indexOfDiff + 1),
                  interpolationFactor,
                  {
                    blocked,
                    inclusiveOfOne,
                    prefix: prefix + end.slice(0, indexOfDiff + 1),
                  }
                ),
              ]),
        ]
          .filter((value) => !value.includes(afterZ))
          .reduce<string[]>(
            (possibleValues, value) =>
              possibleValues.length === 0 ||
              possibleValues[0]!.length > value.length
                ? [value]
                : possibleValues,
            []
          );

  return possibleValues.length === 1
    ? possibleValues[0]!
    : possibleValues[
        Math.max(
          0,
          Math.min(
            possibleValues.length - 1,
            Math.floor(
              (possibleValues.length - (inclusiveOfOne ? 1 : 0)) *
                (typeof interpolationFactor === "number"
                  ? interpolationFactor
                  : interpolationFactor())
            )
          )
        )
      ]!;
};

export default getPositionBetween;

export const getNPositions = (count: number, start = "", end = ""): string[] =>
  Array.from<string>({ length: Math.min(26, count) }).reduce<string[]>(
    (arr, value, index) => {
      const prev = arr.at(-1) ?? start;

      const next =
        index < 25
          ? getPositionBetween(prev, end, 1 / (Math.min(25, count) - index + 1))
          : undefined;

      return [
        ...arr,
        ...(count < 26
          ? []
          : getNPositions(
              Math.floor((count - 25) / 26) +
                (index < (count - 25) % 26 ? 1 : 0),
              prev,
              next
            )),
        ...(next === undefined ? [] : [next]),
      ];
    },
    []
  );
