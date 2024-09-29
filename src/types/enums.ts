/**
 * @copyright 2020-2024 integereleven. All rights reserved. MIT license.
 * @file Enums for the module.
 */

/**
 * A `ComparisonResult` is the result of comparing two values.
 *
 * The `ComparisonResult` enum narrows the results typically available for
 * comparing and sorting. Its purpose is to be explicit when implementing
 * comparison and sorting methods. It does not imply anything as to how values
 * are compared or sorted, but to the desired result of the comparison.
 * If `7 > q > {the color blue}` in the eyes of the implementer, so be it.
 *
 * @example Example usage of the `ComparisonResult` enum.
 * ```ts
 * import { ComparisonResult } from './mod.ts';

 * type User = {
 *   name: string;
 *   age: number;
 * };
 *
 * const comparer = (a: User, b: User, reverse = false): ComparisonResult => {
 *   if (reverse) [a, b] = [b, a];
 *
 *   if(a.name === b.name) {
 *     if (a.age === b.age) return ComparisonResult.Equal;
 *
 *     return a.age > b.age ? ComparisonResult.Greater : ComparisonResult.Lesser;
 *   }
 *
 *   return a.name > b.name ? ComparisonResult.Greater : ComparisonResult.Lesser;
 * };
 *
 * const users = [
 *   {name: 'Tiffany', age: 46},
 *   {name: 'Florian', age: 56},
 *   {name: 'Edgar', age: 25},
 *   {name: 'Florian', age: 46},
 * ];
 *
 * const sorted = [...users].sort((a, b) => comparer(a, b));
 * const sortedList = sorted.map((u) => `${u.name}:${u.age}`).join(' ');
 * const reversed = [...users].sort((a, b) => comparer(a, b, true));
 * const reversedList = reversed.map((u) => `${u.name}:${u.age}`).join(' ');
 *
 * console.assert(sortedList === 'Edgar:25 Florian:46 Florian:56 Tiffany:46');   // ✔
 * console.assert(reversedList === 'Tiffany:46 Florian:56 Florian:46 Edgar:25'); // ✔
 * ```
 */
export enum ComparisonResult {
  /**
   * The resultant comparison of `a` to `b` is that
   * `a` is lesser than `b`.
   */
  Lesser = -1,

  /**
   * The resultant comparison of `a` to `b` is that
   * `a` is equal to `b`.
   */
  Equal = 0,

  /**
   * The resultant comparison of `a` to `b` is that
   * `a` is greater than `b`.
   */
  Greater = 1,
}

/**
 * A `ListPosition` is a description of an element's position in an array.
 *
 * The `ListPosition` enum is used where an element's position in an array is
 * required. This is in simpler terms of first, middle, and last, or whether it
 * is the only element in the array or has an index outside the array, which is
 * generally more useful information than the element's index in the array.
 *
 * > Implementers may attempt to utilize the bit-wise nature to combine values,
 * > such as `ListPosition.First | ListPosition.Middle`. There is no need, as an
 * > element that is last-and-middle, first-and-middle, or first-and-last is the
 * > only element in the array. The {@link ListPosition.Only} is already
 * > descriptive of that scenario. An element cannot be both outside and within
 * > the array.
 *
 * @example Example usage of the `ListPosition` enum.
 * ```ts
 * import { ListPosition } from './mod.ts';
 *
 * function getItemPosition(index: number, length: number): ListPosition {
 *   if (length === 0) return ListPosition.Outside;
 *   if (index === 0 && length === 1) return ListPosition.Only;
 *   if (index === length - 1) return ListPosition.Last;
 *   if (index === 0) return ListPosition.First;
 *
 *   return ListPosition.Middle;
 * }
 *
 * console.assert(getItemPosition(0, 1) === ListPosition.Only);   // ✔
 * console.assert(getItemPosition(0, 2) === ListPosition.First);  // ✔
 * console.assert(getItemPosition(1, 2) === ListPosition.Last);   // ✔
 * console.assert(getItemPosition(1, 3) === ListPosition.Middle); // ✔
 * ```
 */
export enum ListPosition {
  /**
   * The element is the first element in the array (index is `0`).
   */
  First = 1,

  /**
   * The element is in the middle of the array (index is not `0` or
   * `length -1`, but is between `0` and `length - 1`).
   */
  Middle = 2,

  /**
   * The element is the last element in the array (index is `length - 1`).
   */
  Last = 4,

  /**
   * The element is the only element in the array, so technically first,
   * middle, and last (index is `0` and `length - 1`).
   */
  Only = 7,

  /**
   * The element is not part of the array (index is not between `0` and
   * `length - 1`.
   */
  Outside = 0,
}

/**
 * A `Parity` is a description of a value being even or odd.
 *
 * The `Parity` enum is used where only whether a value is even or odd is necessary.
 *
 * @example Example usage of the `Parity` enum.
 * ```ts
 * import { Parity } from './mod.ts';
 *
 * function getItemParity(index: number): Parity {
 *   return index % 2 === 0 ? Parity.Even : Parity.Odd;
 * }
 *
 * console.assert(getItemParity(0) === Parity.Even); // ✔
 * console.assert(getItemParity(1) === Parity.Odd);  // ✔
 * console.assert(getItemParity(2) === Parity.Even); // ✔
 * console.assert(getItemParity(3) === Parity.Odd);  // ✔
 * ```
 */
export enum Parity {
  /**
   * The value is even.
   */
  Even = 0,

  /**
   * The value is odd.
   */
  Odd = 1,
}
