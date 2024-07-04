/**
 * @copyright 2020-2024 integereleven. All rights reserved. MIT license.
 * @file Interfaces for the module. For type aliases, see ./type_aliases.ts.
 */

import { ComparisonResult } from './enums.ts';

import type { Comparer, Converter } from './type_aliases.ts';

/**
 * Provides a consistent property providing a URL to help resources.
 *
 * @example
 * ```ts
 * import { assertEquals } from '@std/assert';
 * import type { IHelpful } from './interfaces.ts';
 *
 * const helpfulObject: IHelpful = {
 * 	 helpUrl: 'https://example.integereleven.com',
 * };
 *
 * const expected = 'http://example.integereleven.com';
 *
 * assertEquals(helpfulObject.helpUrl, expected);
 * ```
 */
export interface IHelpful {
  /**
   * The URL to the help resource.
   */
  helpUrl: string;
}

/**
 * Provides a method returning instance data hashed into a number.
 *
 * This interface is not meant to provide cryptographically secure hashing, but instead for
 * providing a unique value representing the data of an object.
 *
 * @example
 * ```ts
 * import { assertEquals } from '@std/assert';
 * import type { IHashable } from './interfaces.ts';
 *
 * class MyClass implements IHashable {
 *   constructor(
 *     protected name: string,
 *     protected age: number,
 *   ) {}
 *
 *   protected hashData(): number {
 *     const { name, age } = this;
 *     const object = { name, age };
 *     const json = JSON.stringify(object);
 *     const chars = [...json];
 *
 *     const hash = chars.reduce((acc, char) => {
 *       const code = char.charCodeAt(0);
 *       return ((acc << 5) - acc) + code;
 *     }, 0);
 *
 *     return hash;
 *   }
 *
 *   public getHash(): number {
 *     return this.hashData();
 *   }
 * }
 *
 * const instance = new MyClass('Alice', 30);
 *
 * assertEquals(instance.getHash(), 89027321);
 * ```
 */
export interface IHashable {
  /**
   * Return the hash of the object’s current value.
   */
  getHash(): number;
}

/**
 * Provides a mechanism for an instance to clone itself.
 *
 * @template T - The type of object to clone. This is for utility and should always be the same as the implementing class.
 *
 * @example
 * ```ts
 * import { assertEquals } from '@std/assert';
 * import type { TCloneable } from './interfaces.ts';
 *
 * class User implements TCloneable<User> {
 *   constructor(public name: string, public age: number) {}
 *
 *   public clone(): User {
 *     return new User(this.name, this.age);
 *   }
 * }
 *
 * const instance = new User('Alice', 30);
 * const clone = instance.clone();
 *
 * assertEquals(clone.name, instance.name);
 * assertEquals(clone.age, instance.age);
 * ```
 */
export interface TCloneable<T> {
  /**
   * Returns a cloned version of the instance.
   */
  clone(): T;
}

/**
 * Describes a base kz object.
 *
 * @template T - The type of the object's value.
 *
 * @example
 * ```ts
 * import type { TBase } from './interfaces.ts';
 *
 * const obj: TBase<number> = {
 * 	 [Symbol.toPrimitive](hint: string): string | number {
 * 	 	 if (hint === 'number') {
 * 	 	 	 return this.valueOf();
 * 	 	 }
 *
 * 	 	 return this.toString();
 * 	 },
 * 	 toString() {
 * 	 	 return `${this.valueOf()}`;
 * 	 },
 * 	 valueOf() {
 * 	 	 return 42;
 * 	 },
 * };
 *
 * const numValue = +obj;
 * const strValue = `${obj}`;
 * const tValue = obj.valueOf();
 * ```
 */
export interface TBase<T> {
  /**
   * Returns a primitive value representing the object’s value, either a `string` or `number`, depending on the hint.
   *
   * @param hint The type of primitive value to return.
   * @returns A `string` if hint is `'string'` or `'default'`, otherwise a `number`.
   */
  [Symbol.toPrimitive](hint: string): string | number;

  /**
   * Returns the string representation of the object.
   */
  toString(): string;

  /**
   * Returns the T value representation of the object.
   */
  valueOf(): T;
}

/**
 * Provides a method to convert a value from one type to another.
 *
 * @template F - The type to convert from.
 * @template T - The type to convert to.
 *
 * @example
 * ```ts
 * import { assertEquals, assertInstanceOf } from '@std/assert';
 * import type { TConverter } from './interfaces.ts';
 *
 * const converter: TConverter<string, number> = {
 * 	 convert(value: string): number {
 * 	 	 return parseInt(value);
 * 	 },
 * };
 *
 * const result = converter.convert('42');
 *
 * assertEquals(result, 42);
 * ```
 */
export interface TConverter<F, T> {
  /**
   * Converts a value from one type to another.
   *
   * @param value - The value to convert.
   */
  convert(value: F): T;
}

/**
 * Provides a method to convert a value from one type to another using a named conversion or a {@link Converter}.
 *
 * @template T - The type of the object's value, for {@link TBase}.
 * @template F - The map of named conversion keys to the types they convert to.
 *
 * @example
 * ```ts
 * import { assertEquals } from '@std/assert';
 * import type { TConvertible } from './interfaces.ts';
 * import type { Converter } from './type_aliases.ts';
 *
 * interface ConvertibleMap {
 * 	'symbol': symbol,
 * 	'other': { id: string },
 * }
 *
 * const obj: TConvertible<number, ConvertibleMap> = {
 * 	 [Symbol.toPrimitive](hint: string): string | number {
 * 	 	 if (hint === 'number') {
 * 	 	 	 return this.valueOf();
 * 	 	 }
 *
 * 	 	 return this.toString();
 * 	 },
 * 	 toString() {
 * 	 	 return `${this.valueOf()}`;
 * 	 },
 * 	 valueOf() {
 * 	 	 return 42;
 * 	 },
 * 	 convertTo<K extends keyof ConvertibleMap>(t: K): ConvertibleMap[K] {
 * 	 	 const value = this.valueOf();
 * 	 	 const id = `${value}`;
 *
 * 	 	 if (t === 'symbol') {
 * 	 	 	 return Symbol(id) as ConvertibleMap[K];
 * 	 	 }
 *
 * 	 	 return {id} as ConvertibleMap[K];
 * 	 },
 * 	 convert<T>(converter: Converter<number, T>): T {
 * 	 	 const value = this.valueOf();
 *
 * 	 	 if (typeof converter === 'function') {
 * 	 	 	 return converter(value);
 * 	 	 }
 *
 * 	 	 return converter.convert(value);
 * 	 }
 * };
 *
 * const symValue = obj.convertTo('symbol');
 * const otherValue = obj.convertTo('other');
 * const result = obj.convert(val => val.toString());
 * ```
 */
// deno-lint-ignore no-explicit-any
export interface TConvertible<T, M extends Record<string, any>>
  extends TBase<T> {
  /**
   * Converts the instance value to a named conversion type.
   *
   * @template K - The named conversion types.
   *
   * @param toType The named conversion to use.
   */
  convertTo<K extends keyof M>(toType: K): M[K];

  /**
   * Converts the instance value to type `T` type using a {@link Converter}.
   *
   * @template C - The type to convert the instance value to.
   *
   * @param converter The converter to use to convert the instance value to `T`.
   */
  convert<C>(converter: Converter<T, C>): C;
}

/**
 * Provides a mechanism to compare the current class instance to another instance.
 *
 * @template T - The value type being compared. Usually the class type itself.
 *
 * @example
 * ```ts
 * import { assertEquals } from '@std/assert';
 * import { ComparisonResult } from './enums.ts';
 * import type { TComparable } from './interfaces.ts';
 *
 * class Example implements TComparable<Example> {
 * 	 constructor(protected name: string){ }
 *
 * 	 compareTo(other: Example, reverse = false): ComparisonResult {
 * 	 	 const result = this.name > other.name
 * 	 	 	 ? (reverse ? ComparisonResult.Lesser : ComparisonResult.Greater)
 * 	 	 	 : this.name < other.name
 * 	 	 	 	 ? (reverse ? ComparisonResult.Greater : ComparisonResult.Lesser)
 * 	 	 	 	 : ComparisonResult.Equal;
 *
 * 	 	 return result
 * 	 }
 * }
 *
 * const exA = new Example('apple');
 * const exB = new Example('banana');
 *
 * assertEquals(exA.compareTo(exB), ComparisonResult.Lesser);
 * ```
 */
export interface TComparable<T> {
  /**
   * Compare the current instance to another instance, optionally specifying the direction of the equality check.
   *
   * @param other - The other instance to check the current instance against.
   * @param reverse - Whether to reverse the comparison.
   *
   * @returns The comparison result.
   */
  compareTo(other: T, reverse: boolean): ComparisonResult;
}

/**
 * Provides a mechanism to compare two values of the same type.
 *
 * @template T - The types of values this comparer can operate on.
 *
 * @example
 * ```ts
 * import { assertEquals } from '@std/assert';
 * import { ComparisonResult } from './enums.ts';
 * import type { TComparer } from './interfaces.ts';
 *
 *  const comparer: TComparer<number> = {
 * 	 compare(a: number, b: number, reverse = false) {
 * 	 	 const result = a > b
 * 	 	 	 ? (reverse ? ComparisonResult.Lesser : ComparisonResult.Greater)
 * 	 	 	 : a < b
 * 	 	 	 	 ? (reverse ? ComparisonResult.Greater : ComparisonResult.Lesser)
 * 	 	 	 	 : ComparisonResult.Equal;
 *
 * 	 	 return result;
 * 	 }
 * };
 *
 * assertEquals(comparer.compare(1, 3), ComparisonResult.Lesser);
 * assertEquals(comparer.compare(1, 3, true), ComparisonResult.Greater);
 * assertEquals(comparer.compare(1, 1), ComparisonResult.Equal);
 * ```
 */
export interface TComparer<T> {
  /**
   * Compare two values for equality, optionally reversing the comparison.
   *
   * @param a The first value of the comparison.
   * @param b The second value of the comparison.
   * @param reverse Whether to reverse the comparison.
   */
  compare(a: T, b: T, reverse?: boolean): ComparisonResult;
}

/**
 * Provides a mechanism to sort instance properties or indices.
 *
 * @template T - The value type being sorted.
 *
 * @example
 * ```ts
 * import { assertEquals } from '@std/assert';
 * import { ComparisonResult } from './enums.ts';
 * import type { TSortable } from './interfaces.ts';
 * import type { Comparer } from './type_aliases.ts';
 *
 * class SortableArray<T> implements TSortable<T> {
 *   constructor(public readonly array: T[]) {}
 *
 *   sort(comparer: Comparer<T>, reverse = false): void {
 *     this.array.sort((a, b) => {
 *       return (typeof comparer === 'function')
 *         ? comparer(a, b, reverse)
 *         : comparer.compare(a, b, reverse);
 *     });
 *   }
 *
 *   [Symbol.iterator](): Iterator<T> {
 *     return this.array[Symbol.iterator]();
 *   }
 * }
 *
 * const array = new SortableArray([3, 2, 1]);
 *
 * const comparer: Comparer<number> = {
 *   compare(a: number, b: number, reverse = false): ComparisonResult {
 *     const [x, y] = reverse ? [b, a] : [a, b];
 *
 *     return x < y
 *       ? ComparisonResult.Lesser
 *       : x > y
 *       ? ComparisonResult.Greater
 *       : ComparisonResult.Equal;
 *   },
 * };
 * array.sort(comparer);
 *
 * assertEquals([...array], [1, 2, 3]);
 *
 * array.sort(comparer, true);
 *
 * assertEquals([...array], [3, 2, 1]);
 * ```
 */
export interface TSortable<T> extends Iterable<T> {
  /**
   * Sort instance properties or indices using a {@link Comparer}.
   *
   * @param comparer - The comparer used to sort the instance properties or indices.
   * @param reverse - Whether to reverse sort the instance properties or indices.
   */
  sort(comparer: Comparer<T>, reverse: boolean): void;
}

/**
 * Describes a semantic versioning version.
 *
 * @example
 * ```ts
 * import type { IVersionDescriptor } from './interfaces.ts';
 *
 * const currentBuild: IVersionDescriptor = {
 * 	 major: 1,
 * 	 minor: 2,
 * 	 patch: 55,
 * 	 build: 'pancake-9458',
 * };
 * ```
 *
 * @see {@link https://semver.org|Semantic Versioning}
 */
export interface IVersionDescriptor {
  /**
   * The major version of the version.
   */
  major: number;

  /**
   * The minor version of the version.
   */
  minor: number;

  /**
   * The patch version of the version.
   */
  patch: number;

  /**
   * The pre-release of the version.
   */
  preRelease?: string;

  /**
   * The build of the version.
   */
  build?: string;
}
