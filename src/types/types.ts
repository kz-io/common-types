/**
 * This file contains package type aliases.
 *
 * @copyright 2024 integereleven. All rights reserved. MIT license.
 */

/**
 * An alias of any object with any indexable property key and unknown (indeterminate) value.
 *
 * @example
 * ```ts
 * const reg: IndeterminateObject = {
 *   name: "Dakota Cortez",
 *   age: 15,
 *   username: "dc655"
 * };
 *
 * function readReg<K extends keyof IndeterminateObject>(key: K) {
 *   return reg[key];
 * }
 *
 * console.log(readReg("na"));
 * //  undefined
 * console.log(readReg("name"));
 * //  Dakota Cortez
 * ```
 */
export type IndeterminateObject = Record<number | string | symbol, unknown>;

/**
 * The types of TypeScript decorator targets.
 */
export type DecoratorTarget =
  /** A class decorator. */
  | 'class'
  /** A class method decorator. */
  | 'method'
  /** A class property decorator. */
  | 'property'
  /** A class method parameter decorator. */
  | 'parameter'
  /** A class accessor decorator. */
  | 'accessor';

/**
 * The types of codebases, according to integereleven.
 *
 * > NOTE: Any codebase name. Not yet constrained.
 */
export type Codebase = string;

/**
 * The types of software operations, according to integereleven.
 *
 * > NOTE: Any software operation. Not yet constrained.
 */
export type SoftwareOperation = string;
