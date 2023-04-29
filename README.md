# dnd-sort-position

[![NPM Downloads](https://img.shields.io/npm/dw/dnd-sort-position?style=flat&logo=npm)](https://www.npmjs.com/package/dnd-sort-position)
![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/saiichihashimoto/dnd-sort-position/main?style=flat&logo=github)
[![GitHub Repo stars](https://img.shields.io/github/stars/saiichihashimoto/dnd-sort-position?style=flat&logo=github)](https://github.com/saiichihashimoto/dnd-sort-position/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/saiichihashimoto/dnd-sort-position?style=flat&logo=github)](https://github.com/saiichihashimoto/dnd-sort-position/graphs/contributors)
[![Minified Size](https://img.shields.io/bundlephobia/min/dnd-sort-position?style=flat)](https://www.npmjs.com/package/dnd-sort-position?activeTab=code)
[![License](https://img.shields.io/github/license/saiichihashimoto/dnd-sort-position?style=flat)](https://github.com/saiichihashimoto/dnd-sort-position/blob/main/LICENSE)

Get and maintain sort positions for manually sorted lists.

## Install

```bash
npm install dnd-sort-position
```

## Usage

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

### What about concurrent updates that collide?

For example, if two different elements were put between elements A & B simultaneously, wouldn't that produce the same position? Yes, but that's not an issue with this library but with concurrent updates in general. None of the solutions address this problem directly. You'd likely want a tie breaker, ie sort on `position, id`.

## API

The [unit tests](https://github.com/saiichihashimoto/dnd-sort-position/blob/main/src/index.test.ts) are the best example of how this should be used.

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
