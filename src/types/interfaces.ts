/**
 * @copyright 2020-2024 integereleven. All rights reserved. MIT license.
 * @file Interfaces for the module. For type aliases, see ./type-aliases.ts.
 */

import type { Converter } from './type-aliases.ts';

/**
 * Describes an object that has a URL reference to a help resource.
 *
 * @example
 * ```ts
 * import { assertEquals } from '@std/assert';
 * import type { IHelpful } from './interfaces.ts';
 *
 * const help: IHelpful = {
 *  helpUrl: 'https://example.com/help'
 * };
 *
 * assertEquals(help.helpUrl, 'https://example.com/help');
 * ```
 */
export interface IHelpful {
  /**
   * The URL to the help resource.
   */
  helpUrl: string;
}

/**
 * Describes an object that has a hash value.
 *
 * @example
 * ```ts
 * import { assertEquals } from '@std/assert';
 * import type { IHashable } from './interfaces.ts';
 *
 * const hashable: IHashable = {
 *  hash: '0x1234567890abcdef'
 * };
 *
 * assertEquals(hashable.hash, '0x1234567890abcdef');
 * ```
 */
export interface IHashable {
  /**
   * The hash value.
   */
  hash: string;
}

/**
 * Describes an object that can be cloned.
 *
 * @template T The type of the object to clone.
 *
 * @example
 * ```ts
 * import { assertInstanceOf } from '@std/assert';
 * import type { TCloneable } from './interfaces.ts';
 *
 * class Foo implements TCloneable<Foo> {
 *   clone(): Foo {
 *     return new Foo();
 *   }
 * }
 *
 * const foo = new Foo();
 *
 * assertInstanceOf(foo.clone(), Foo);
 * ```
 */
export interface TCloneable<T> {
  /**
   * Clones the object.
   */
  clone(): T;
}

/**
 * Describes an object that can be converted to any primitive type.
 *
 * @example
 * ```ts
 * import { assertEquals } from '@std/assert';
 * import type { IPrimitiveConvertible } from './interfaces.ts';
 *
 * const PRIM_SYMBOL = Symbol.for('primitiveObject');
 *
 * const obj: IPrimitiveConvertible = {
 *   toBoolean(): boolean {
 *     return true;
 *   },
 *   toNumber(): number {
 *     return 1;
 *   },
 *   valueOf(): number {
 *     return 1;
 *   },
 *   toBigInt(): bigint {
 *     return BigInt(1);
 *   },
 *   toSymbol(): symbol {
 *     return PRIM_SYMBOL;
 *   },
 *   toString(): string {
 *     return 'string';
 *   }
 * };
 *
 * assertEquals(obj.toBoolean(), true);
 * assertEquals(obj.toNumber(), 1);
 * assertEquals(obj.valueOf(), 1);
 * assertEquals(obj.toBigInt(), BigInt(1));
 * assertEquals(obj.toSymbol(), PRIM_SYMBOL);
 * assertEquals(obj.toString(), 'string');
 * ```
 */
export interface IPrimitiveConvertible {
  /**
   * Converts the object to a boolean.
   */
  toBoolean(): boolean;

  /**
   * Converts the object to a number.
   */
  toNumber(): number;

  /**
   * Converts the object to a number.
   */
  valueOf(): number;

  /**
   * Converts the object to a bigint.
   */
  toBigInt(): bigint;

  /**
   * Converts the object to a symbol.
   */
  toSymbol(): symbol;

  /**
   * Converts the object to a string.
   */
  toString(): string;
}

/**
 * Provides a mechanism to convert a value from one type to another.
 *
 * @template F The type to convert from.
 * @template T The type to convert to.
 *
 * @example
 * ```ts
 * import { assertEquals } from '@std/assert';
 * import type { TConverter } from './interfaces.ts';
 *
 * const converter: TConverter<number, string> = {
 *   convert(value: number): string {
 *     return value.toString();
 *   }
 * };
 *
 * assertEquals(converter.convert(1), '1');
 * ```
 */
export interface TConverter<F, T> {
  /**
   * Converts a value from one type to another.
   *
   * @param value The value to convert.
   * @returns The converted value.
   */
  convert(value: F): T;
}

/**
 * Describes an {@link IPrimitiveConvertible} object with enhanced conversion capabilities.
 *
 * @template T The map of string keys to their conversion types.
 *
 * @example
 * ```
 * import { assertEquals } from '@std/assert';
 * import type { TConvertible } from './interfaces.ts';
 * import type { Converter } from './type-aliases.ts';
 *
 * interface Cat {
 *   name: string;
 *   greet(): 'meow';
 * }
 *
 * interface Dog {
 *   name: string;
 *   greet(): 'woof';
 * }
 *
 * interface Animals {
 *   cat: Cat;
 *   dog: Dog;
 * }
 *
 * const ANIMAL_OBJ = Symbol.for('animalObject');
 *
 * const obj: TConvertible<Animals> = {
 *   toBoolean(): boolean {
 *     return true;
 *   },
 *   toNumber(): number {
 *     return 1;
 *   },
 *   valueOf(): number {
 *     return 1;
 *   },
 *   toBigInt(): bigint {
 *     return BigInt(1);
 *   },
 *   toSymbol(): symbol {
 *     return ANIMAL_OBJ;
 *   },
 *   toString(): string {
 *     return 'string';
 *   },
 *   convertTo<S extends keyof Animals>(type: S): Animals[S] {
 *     switch (type) {
 *       case 'cat':
 *         return {
 *           name: 'Whiskers',
 *           greet(): 'meow' {
 *             return 'meow';
 *           },
 *         } as Animals[S];
 *       default:
 *         return {
 *           name: 'Fido',
 *           greet(): 'woof' {
 *             return 'woof';
 *           },
 *         } as Animals[S];
 *     }
 *   },
 *   convert<T>(converter: Converter<ThisType<typeof obj>, T>): T {
 *     if (typeof converter === 'function') {
 *       return converter(this);
 *     }
 *
 *     return converter.convert(this);
 *   }
 * };
 * ```
 */
// deno-lint-ignore no-explicit-any
export interface TConvertible<T extends Record<string, any>>
  extends IPrimitiveConvertible {
  /**
   * Converts the object to the specified mapped type.
   *
   * @param type The mapped type to convert to.
   */
  convertTo<S extends keyof T>(type: S): T[S];

  /**
   * Converts the object to the specified type using a {@link Converter}.
   *
   * @param converter The Converter to use for the conversion.
   */
  convert<T>(converter: Converter<ThisType<this>, T>): T;
}
