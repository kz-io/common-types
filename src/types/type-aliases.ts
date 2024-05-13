/**
 * @copyright 2020-2024 integereleven. All rights reserved. MIT license.
 * @file Type aliases for the module. For interfaces, see ./interfaces.ts.
 */

import type { TConverter } from './interfaces.ts';

/**
 * Describes an object of indeterminate property value, keyed by a number, string, or symbol.
 *
 * @example
 * ```ts
 * import { assertEquals } from '@std/assert';
 * import type { IndeterminateObject } from './type-aliases.ts';
 * const two = Symbol('two');
 *
 * const obj: IndeterminateObject = {
 *   0: 'zero',
 *   'one': 1,
 *   [two]: 2
 * };
 *
 * assertEquals(obj[0], 'zero');
 * assertEquals(obj['one'], 1);
 * assertEquals(obj[two], 2);
 * ```
 */
export type IndeterminateObject = Record<number | string | symbol, unknown>;

/**
 * Describes a decorator target.
 *
 * @example
 * ```ts
 * import { assertEquals } from '@std/assert';
 * import type { DecoratorTarget } from './type-aliases.ts';
 *
 * const target: DecoratorTarget = 'class';
 *
 * assertEquals(target, 'class');
 * ```
 */
export type DecoratorTarget =
  | 'class'
  | 'method'
  | 'property'
  | 'parameter'
  | 'accessor';

/**
 * Describes the types of codebases.
 *
 * @ignore WIP
 */
export type Codebase = string;

/**
 * Describes the types of software operations.
 *
 * @ignore WIP
 */
export type SoftwareOperation = string;

/**
 * Describes a system operating system.
 *
 * @example
 * ```ts
 * import type { SystemOS } from './type-aliases.ts';
 *
 * const os = Deno.build.os as SystemOS;
 * ```
 */
export type SystemOS =
  | 'darwin'
  | 'linux'
  | 'android'
  | 'windows'
  | 'freebsd'
  | 'netbsd'
  | 'aix'
  | 'solaris'
  | 'illumos';

/**
 * Describes a system architecture.
 *
 * @example
 * ```ts
 * import type { SystemArchitecture } from './type-aliases.ts';
 *
 * const arch = Deno.build.arch as SystemArchitecture;
 * ```
 */
export type SystemArchitecture =
  | 'x86_64'
  | 'aarch64';

/**
 * Describes the scalar types, which are value types which can be represented by a single value.
 *
 * @example
 * ```ts
 * import type { Scalar } from './type-aliases.ts';
 *
 * const scalar: Scalar = 42;
 * ```
 */
export type Scalar = boolean | bigint | number | string | symbol;

/**
 * Type alias for a class constructor.
 *
 * @template T - The type of the class.
 *
 * @example
 * ```ts
 * import { assertEquals } from '@std/assert';
 * import type { Constructor } from './type-aliases.ts';
 *
 * class MyClass {
 *   constructor(public name: string) {}
 * }
 *
 * const MyClassConstructor: Constructor<MyClass> = MyClass;
 *
 * const myClassInstance = new MyClassConstructor('My Class');
 *
 * assertEquals(myClassInstance.name, 'My Class');
 * ```
 */
// deno-lint-ignore no-explicit-any
export type Constructor<T> = new (...args: any) => T;

/**
 * Describes a type that if defined, is of type T, otherwise is `never`.
 *
 * @template T The type of the value if defined.
 *
 * @example
 * ```ts
 * import type { Defined } from './type-aliases.ts';
 *
 * let value: Defined<number>;
 *
 * value = 42;
 * ```
 */
export type Defined<T> = T extends undefined ? never : T;

/**
 * Describes a function that converts a value from one type to another.
 *
 * @template F The type to convert from.
 * @template T The type to convert to.
 *
 * @example
 * ```ts
 * import type { ConverterFn } from './type-aliases.ts';
 *
 * const toNumber: ConverterFn<string, number> = (value) => parseInt(value);
 *
 * const numberValue = toNumber('42');
 * ```
 */
export type ConverterFn<F, T> = (value: F) => T;

/**
 * Describes a function or object that converts a value from one type to another.
 *
 * @template F The type to convert from.
 * @template T The type to convert to.
 *
 * @see {@link ConverterFn}
 * @see {@link TConverter}
 */
export type Converter<F, T> = TConverter<F, T> | ConverterFn<F, T>;
