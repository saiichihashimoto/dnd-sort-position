# dnd-sort-position

[![npm](https://img.shields.io/npm/dw/dnd-sort-position)](https://www.npmjs.com/package/dnd-sort-position)

Get and maintain sort positions for manually sorted lists

```typescript
import { positionBetween } from "dnd-sort-position";

const list = [
  { position: "d", title: "Dr. Gregory House" },
  { position: "b", title: "Rick Sanchez" },
  { position: "e", title: "Light Yagami" },
  { position: "c", title: "Bojack Horseman" },
  { position: "f", title: "Eren Jaeger" },
];

list.sort((a, b) => (a.position <= b.position ? -1 : 1));

console.log(list);
/*
 * [
 *   { position: "b", title: "Rick Sanchez" },
 *   { position: "c", title: "Bojack Horseman" },
 *   { position: "d", title: "Dr. Gregory House" },
 *   { position: "e", title: "Light Yagami" },
 *   { position: "f", title: "Eren Jaeger" },
 * ]
 */

// Move Rick between Bojack and House
list[0].position = positionBetween(list[1].position, list[2].position);

list.sort((a, b) => (a.position <= b.position ? -1 : 1));

console.log(list);
/*
 * [
 *   { position: "c", title: "Bojack Horseman" },
 *   { position: "cn", title: "Rick Sanchez" },
 *   { position: "d", title: "Dr. Gregory House" },
 *   { position: "e", title: "Light Yagami" },
 *   { position: "f", title: "Eren Jaeger" },
 * ]
 */
```

## Why?

There are a few potential solutions to the problem of how to store the sort order for a manually sorted list in a database, each with its own advantages and disadvantages:

One option is to save the list's sort order along with the list itself. This could be accomplished by including a list of element IDs in the list object, indicating their order (`{ id: "list", elementIDs: ["id-of-first-item", "id-of-second-item", ...] }`). However, this approach may not scale well and can lead to merge conflicts if multiple updates are made, particularly in shared playlists.

Another option is to save the sort position as an integer with each element, such as `{ id: "first-item", position: 0 }` for the first element and `{ id: "second-item", position: 1 }` for the second. However, this approach may not be efficient since updating one element's position could require updating `O(n)` elements, leading to the same merge conflict issues.

One potential solution is to save the sort position as doubles instead, which can avoid these problems. However, this approach may be susceptible to rounding issues that could result in unpredictable discrepancies.

Alternatively, you could save the sort position as strings, which would allow you to save a position for each element and update only one element per update, thus avoiding conflicts. You'd want the strings to produce the shortest strings possible and works with most default `sort` algorithms, which is the purpose of this library.

## API

### `positionBetween()`

Get a string position between two other positions.

```typescript
function positionBetween(
  start: string | undefined,
  end: string | undefined,
  interpolationFactor?: number | (() => number) = 0.5,
  options?: {
    blocked?:
      | RegExp
      | string[]
      | ((value: string) => boolean)
      | { [key: string]: unknown } = require("badwords/object"),
    inclusiveOfOne?: boolean = typeof interpolationFactor === "number",
  }
) => string;
```

### `getNPositions()`

Get N string position between two other positions. Useful for adding positions to lists that don't have them yet.

```typescript
function getNPositions(
  count: number,
  start?: string,
  end?: string
) => string[];
```
