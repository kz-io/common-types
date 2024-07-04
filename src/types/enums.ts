/**
 * @copyright 2020-2024 integereleven. All rights reserved. MIT license.
 * @file Enums for the module.
 */

/**
 * Specifies the comparison result of two values.
 *
 * @example
 * ```ts
 * import { assertEquals } from '@std/assert';
 * import { ComparisonResult } from './mod.ts';
 *
 * const a = 1;
 * const b = 2;
 *
 * const result = a < b
 *   ? ComparisonResult.Lesser
 *   : a > b
 *     ? ComparisonResult.Greater
 *     : ComparisonResult.Equal;
 *
 * assertEquals(result, ComparisonResult.Lesser);
 * ```
 */
export enum ComparisonResult {
  /**
   * The first value is less than the second value.
   */
  Lesser = -1,

  /**
   * The two values are equal.
   */
  Equal = 0,

  /**
   * The first value is greater than the second value.
   */
  Greater = 1,
}

/**
 * Specifies the position of an item in a list.
 *
 * @example
 * ```ts
 * import { assertEquals } from '@std/assert';
 * import { ListPosition } from './mod.ts';
 *
 * const items = [1, 2, 3];
 *
 * function getItemPosition(item: number): ListPosition {
 *   if (item === items[0]) {
 *     return ListPosition.First;
 *   } else if (item === items[items.length - 1]) {
 *     return ListPosition.Last;
 *   }
 *
 *   return ListPosition.Middle;
 * }
 *
 * assertEquals(getItemPosition(1), ListPosition.First);
 * assertEquals(getItemPosition(2), ListPosition.Middle);
 * assertEquals(getItemPosition(3), ListPosition.Last);
 * ```
 */
export enum ListPosition {
  /**
   * The first position in a list.
   */
  First = 0,

  /**
   * Any item in a list that is not the first or last.
   */
  Middle = 1,

  /**
   * The last position in a list.
   */
  Last = -1,
}

/**
 * Specifies the parity of a value.
 *
 * @example
 * ```ts
 * import { assertEquals } from '@std/assert';
 * import { Parity } from './mod.ts';
 *
 * const number = 3;
 *
 * const parity = number % 2 === 0
 *   ? Parity.Even
 *   : Parity.Odd;
 *
 * assertEquals(parity, Parity.Odd);
 * ```
 */
export enum Parity {
  /**
   * Value is even.
   */
  Even = 0,

  /**
   * Value is odd.
   */
  Odd = 1,
}
