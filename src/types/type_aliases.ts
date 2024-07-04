/**
 * @copyright 2020-2024 integereleven. All rights reserved. MIT license.
 * @file Type aliases for the module. For interfaces, see ./interfaces.ts.
 */

import { ComparisonResult } from './enums.ts';
import type { TComparer, TConverter } from './interfaces.ts';

/**
 * Describes a value that can be used as a key in an object.
 *
 * @example
 * ```ts
 * import type { KeyPrimitive } from './type_aliases.ts';
 *
 * let key: KeyPrimitive = 'my-key';
 *
 * key = 25;
 * key = Symbol('my-key');
 * ```
 */
export type KeyPrimitive = string | number | symbol;

/**
 * Describes an object with a `KeyPrimitive` property key and unknown (indeterminate) value.
 *
 * @example
 * ```ts
 * import type { IndeterminateObject } from './type_aliases.ts';
 *
 * const reg: IndeterminateObject = {
 *   name: "Dakota Cortez",
 *   age: 15,
 *   username: "dc655"
 * };
 * ```
 */
export type IndeterminateObject = Record<KeyPrimitive, unknown>;

/**
 * Describes an object that has any property values keyed by `KeyPrimitive` values.
 *
 * @example
 * ```ts
 * import type { AnyObject } from './type_aliases.ts';
 *
 * const obj: AnyObject = {};
 * const stringKey = 'name';
 * const numberKey = 6497216;
 * const symbolKey = Symbol('sys.user.id');
 *
 * obj[stringKey] = 'Jasmine Mura';
 * obj[numberKey] = { requirements: ['stuff'] };
 * obj[symbolKey] = 'jmura716';
 * ```
 */
// deno-lint-ignore no-explicit-any
export type AnyObject = Record<KeyPrimitive, any>;

/**
 * Described the types of TypeScript decorator targets.
 *
 * @example
 * ```ts
 * import type { DecoratorTarget } from './type_aliases.ts';
 *
 * const classTarget: DecoratorTarget = 'class';
 * const methodTarget: DecoratorTarget = 'method';
 * const propertyTarget: DecoratorTarget = 'property';
 * const parameterTarget: DecoratorTarget = 'parameter';
 * const accessorTarget: DecoratorTarget = 'accessor';
 * ```
 *
 * @see {@link https://www.typescriptlang.org/docs/handbook/decorators.html#introduction|TypeScript decorators}
 */
export type DecoratorTarget =
  | 'class'
  | 'method'
  | 'property'
  | 'parameter'
  | 'accessor';

/**
 * Describes the types of codebases, according to integereleven.
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
 * Describes the supported operating systems.
 *
 * @example
 * ```ts
 * import type { SystemOS } from './type_aliases.ts';
 *
 * const os: SystemOS = 'darwin';
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
 * Describe the types of system architecture.
 *
 * @example
 * ```ts
 * import type { SystemArchitecture } from './type_aliases.ts';
 *
 * const arch: SystemArchitecture = 'x86_64';
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
 * import type { Scalar } from './type_aliases.ts';
 *
 * const scalar: Scalar = 42;
 * ```
 */
export type Scalar = boolean | bigint | KeyPrimitive;

/**
 * Describes a type that if defined, is of type `T`, otherwise is `never`.
 *
 * @template T The type of the value if defined.
 *
 * @example
 * ```ts
 * import type { Defined } from './type_aliases.ts';
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
 * import { assertEquals } from '@std/assert';
 * import type { ConverterFn } from './type_aliases.ts';
 *
 * function toNumberInternal(value: string): number {
 * 	 return parseInt(value);
 * }
 *
 * const toNumber: ConverterFn<string, number> = toNumberInternal;
 *
 * toNumber('42');
 * ```
 */
export type ConverterFn<F, T> = (value: F) => T;

/**
 * Describes a function or object that converts a value from one type to another.
 *
 * @template F The type to convert from.
 * @template T The type to convert to.
 *
 * See also:
 * - {@link ConverterFn}
 * - {@link TConverter}
 *
 * @example
 * ```ts
 * import { assertEquals } from '@std/assert';
 * import type { Converter } from './type_aliases.ts';
 *
 * function toNumberInternalFn(value: string): number {
 * 	 return parseInt(value);
 * }
 *
 * const toNumberFn: Converter<string, number> = toNumberInternalFn;
 * const toNumberObj: Converter<string, number> = {
 * 	 convert(value: string): number {
 * 		 return parseInt(value);
 * 	 }
 * };
 *
 * const fnValue = toNumberFn('42');
 * const objValue = toNumberObj.convert('42');
 *
 * assertEquals(fnValue, objValue);
 * ```
 */
export type Converter<F, T> = TConverter<F, T> | ConverterFn<F, T>;

/**
 * Describes a class constructor function.
 *
 * @template T The type of class the constructor creates.
 *
 * @example
 * ```ts
 * import { assertEquals } from '@std/assert';
 * import type { Constructor } from './type_aliases.ts';
 *
 * class Model {
 * 	 constructor(name: string) {}
 * }
 *
 * class User extends Model {
 * 	 constructor() {
 * 		 super('user');
 * 	 }
 * }
 *
 * const models = new Set<Constructor<Model>>();
 *
 * function registerModel(model: Constructor<Model>) {
 * 	 models.add(model);
 * }
 *
 * registerModel(User);
 * ```
 */
// deno-lint-ignore no-explicit-any
export type Constructor<T> = new (...args: any[]) => T;

/**
 * Describes a function comparing two values and returning a ComparisonResult.
 *
 * @template T - The types of values this comparer can operate on.
 *
 * @example
 * ```ts
 * import { assertEquals } from '@std/assert';
 * import { ComparisonResult } from './enums.ts';
 * import type { ComparerFn } from './type_aliases.ts';
 *
 * function compare(a: number, b: number, reverse = false) {
 * 	 const result = a > b
 * 	 	 ? (reverse ? ComparisonResult.Lesser : ComparisonResult.Greater)
 * 	 	 : a < b
 * 	 	 	 ? (reverse ? ComparisonResult.Greater : ComparisonResult.Lesser)
 * 	 	 	 : ComparisonResult.Equal;
 *
 * 	 return result;
 * }
 *
 * const c1 = compare(1, 3);
 * const c2 = compare(1, 3, true);
 * const c3 = compare(1, 1);
 *
 * assertEquals(c1, ComparisonResult.Lesser);
 * assertEquals(c2, ComparisonResult.Greater);
 * assertEquals(c3, ComparisonResult.Equal);
 * ```
 */
export type ComparerFn<T> = (a: T, b: T, reverse: boolean) => ComparisonResult;

/**
 * Describes a function or object compare two values.
 *
 * @template T - The types of values this comparer can compare.
 *
 * @see {@link TComparer}
 * @see {@link ComparerFn}
 *
 * @example
 * ```ts
 * import { ComparisonResult } from './enums.ts';
 * import type { Comparer } from './type_aliases.ts';
 *
 * const comparerFn: Comparer<string> = (a, b, reverse = false) => {
 * 	 const result = a > b
 * 	 	 ? (reverse ? ComparisonResult.Lesser : ComparisonResult.Greater)
 * 	 	 : a < b
 * 	 	 	 ? (reverse ? ComparisonResult.Greater : ComparisonResult.Lesser)
 * 	 	 	 : ComparisonResult.Equal;
 *
 * 	 return result;
 * };
 *
 * const comparerObj: Comparer<string> = {
 * 	 compare(a: string, b: string, reverse = false): ComparisonResult {
 * 	 	 const result = a > b
 * 	 	 	 ? (reverse ? ComparisonResult.Lesser : ComparisonResult.Greater)
 * 	 	 	 : a < b
 * 	 	 	 	 ? (reverse ? ComparisonResult.Greater : ComparisonResult.Lesser)
 * 	 	 	 	 : ComparisonResult.Equal;
 *
 * 	 	 return result;
 * 	 }
 * };
 * ```
 */
export type Comparer<T> = TComparer<T> | ComparerFn<T>;

/**
 * Describes an empty tuple.
 */
type Nonary = [];

/**
 * Describes a tuple with one element.
 *
 * @template T1 The type of the first element.
 */
type Unary<T> = [T];

/**
 * Describes a tuple with two elements.
 *
 * @template T1 The type of the first element.
 * @template T2 The type of the second element.
 */
type Binary<T1, T2> = [T1, T2];

/**
 * Describes a tuple with three elements.
 *
 * @template T1 The type of the first element.
 * @template T2 The type of the second element.
 * @template T3 The type of the third element.
 */
type Ternary<T1, T2, T3> = [T1, T2, T3];

/**
 * Describes a tuple with four elements.
 *
 * @template T1 The type of the first element.
 * @template T2 The type of the second element.
 * @template T3 The type of the third element.
 * @template T4 The type of the fourth element.
 */
type Quaternary<T1, T2, T3, T4> = [T1, T2, T3, T4];

/**
 * Describes an action that takes no arguments.
 */
type NullaryAction = () => void;

/**
 * Describes an action that takes one argument.
 *
 * @template T1 The type of the first argument.
 */
type UnaryAction1<T1> = (arg1: T1) => void;

/**
 * Describes an action that takes two arguments.
 *
 * @template T1 The type of the first argument.
 * @template T2 The type of the second argument.
 */
type BinaryAction2<T1, T2> = (arg1: T1, arg2: T2) => void;

/**
 * Describes an action that takes options.
 *
 * @template O The type of the options.
 */
type OptionAction<O extends AnyObject> = (opts: O) => void;

/**
 * Describes an action that takes one argument and options.
 *
 * @template T1 The type of the first argument.
 * @template O The type of the options.
 */
type UnaryOptionAction<T1, O extends AnyObject> = (arg1: T1, opts: O) => void;

/**
 * Describes an action that takes two arguments and options.
 *
 * @template T1 The type of the first argument.
 * @template T2 The type of the second argument.
 * @template O The type of the options.
 */
type BinaryOptionAction<T1, T2, O extends AnyObject> = (
  arg1: T1,
  arg2: T2,
  opts: O,
) => void;

/**
 * Describes a function that takes no arguments and returns a value.
 *
 * @template R The type of the return value.
 */
type NullaryFunc<R> = () => R;

/**
 * Describes a function that takes one argument and returns a value.
 *
 * @template T1 The type of the first argument.
 * @template R The type of the return value.
 */
type UnaryFunc1<T1, R> = (arg1: T1) => R;

/**
 * Describes a function that takes two arguments and returns a value.
 *
 * @template T1 The type of the first argument.
 * @template T2 The type of the second argument.
 * @template R The type of the return value.
 */
type BinaryFunc2<T1, T2, R> = (arg1: T1, arg2: T2) => R;

/**
 * Describes a function that takes options and returns a value.
 *
 * @template O The type of the options.
 * @template R The type of the return value.
 */
type OptionFunc<O extends AnyObject, R> = (opts: O) => R;

/**
 * Describes a function that takes one argument and options and returns a value.
 *
 * @template T1 The type of the first argument.
 * @template O The type of the options.
 * @template R The type of the return value.
 */
type UnaryOptionFunc<T1, O extends AnyObject, R> = (arg1: T1, opts: O) => R;

/**
 * Describes a function that takes two arguments and options and returns a value.
 *
 * @template T1 The type of the first argument.
 * @template T2 The type of the second argument.
 * @template O The type of the options.
 * @template R The type of the return value.
 */
type BinaryOptionFunc<T1, T2, O extends AnyObject, R> = (
  arg1: T1,
  arg2: T2,
  opts: O,
) => R;

/**
 * Describes an empty tuple.
 *
 * This type is typically only used with the {@link Action} or {@link Func} types.
 *
 * @example
 * ```ts
 * import type { Action, Empty } from './type_aliases.ts';
 *
 * const handlers = new Set<Action<Empty>>();
 *
 * function addAction(action: Action<Empty>): void {
 * 	 handlers.add(action);
 * }
 *
 * addAction(() => {
 * 	 console.log('Action triggered');
 * });
 * ```
 */
export type Empty = Nonary;

/**
 * Describes a tuple with one element.
 *
 * @template T The type of the first element in the tuple.
 *
 * @example
 * ```ts
 * import type { Single } from './type_aliases.ts';
 *
 * const arrayOfSingle: Single<string>[] = [];
 *
 * arrayOfSingle.push(['hello']);
 * ```
 */
export type Single<T> = Unary<T>;

/**
 * Describes a tuple with two elements.
 *
 * @template T1 The type of the first element in the tuple.
 * @template T2 The type of the second element in the tuple.
 *
 * @example
 * ```ts
 * import type { Couple } from './type_aliases.ts';
 *
 * const arrayOfCouples: Couple<string, number>[] = [];
 *
 * arrayOfCouples.push(['hello', 42]);
 * ```
 */
export type Couple<T1, T2 = T1> = Binary<T1, T2>;

/**
 * Describes a tuple with three elements.
 *
 * @template T1 The type of the first element in the tuple.
 * @template T2 The type of the second element in the tuple.
 * @template T3 The type of the third element in the tuple.
 *
 * @example
 * ```ts
 * import type { Triple } from './type_aliases.ts';
 *
 * const arrayOfTriple: Triple<string, number, boolean>[] = [];
 *
 * arrayOfTriple.push(['hello', 42, false]);
 * ```
 */
export type Triple<T1, T2 = T1, T3 = T2> = Ternary<T1, T2, T3>;

/**
 * Describes a tuple with four elements.
 *
 * @template T1 The type of the first element in the tuple.
 * @template T2 The type of the second element in the tuple.
 * @template T3 The type of the third element in the tuple.
 * @template T4 The type of the fourth element in the tuple.
 *
 * @example
 * ```ts
 * import type { Quadruple } from './type_aliases.ts';
 *
 * const arrayOfQuad: Quadruple<string, number, boolean, number>[] = [];
 *
 * arrayOfQuad.push(['hello', 42, false, 10]);
 * ```
 */
export type Quadruple<T1, T2 = T1, T3 = T2, T4 = T3> = Quaternary<
  T1,
  T2,
  T3,
  T4
>;

/**
 * Describes a function that accepts a set of arguments and, if provided, options, returning `void`.
 *
 * This type is used to restrict callbacks or handlers to integereleven guidelines for functions.
 * It is used with the {@link Empty}, {@link Single}, and {@link Couple} types to define the arguments.
 *
 * @template T The arguments list..
 * @template O The options object. If not provided, no options object is used.
 *
 * @example
 * ```ts
 * import type { Action, Single } from './type_aliases.ts';
 *
 * type HandlerType = Action<Single<string>>;
 *
 * const handlers = new Set<HandlerType>();
 *
 * function addHandler(action: HandlerType): void {
 * 	 handlers.add(action);
 * }
 *
 * addHandler((value) => console.log(value));
 *
 * handlers.forEach((handler) => {
 * 	 handler('Hello');
 * });
 * ```
 */
export type Action<
  T extends unknown[],
  O extends AnyObject = Record<string | number | symbol, never>,
> = O extends Record<string | number | symbol, never>
  ? T extends Nonary ? NullaryAction
  : T extends Unary<infer T1> ? UnaryAction1<T1>
  : T extends Binary<infer T1, infer T2> ? BinaryAction2<T1, T2>
  : never
  : T extends Nonary ? OptionAction<O>
  : T extends Unary<infer T1> ? UnaryOptionAction<T1, O>
  : T extends Binary<infer T1, infer T2> ? BinaryOptionAction<T1, T2, O>
  : never;

/**
 * Describes a function that accepts a set of arguments and, if provided, options, returning the specified type.
 *
 * This type is used to restrict callbacks or handlers to integereleven guidelines for functions.
 * It is used with the {@link Empty}, {@link Single}, and {@link Couple} types to define the arguments.
 *
 * @template T The arguments list.
 * @template R The type of the return value.
 * @template O The options object. If not provided, no options object is used.
 *
 * @example
 * ```ts
 * import type { Func, Single } from './type_aliases.ts';
 *
 * type HandlerType = Func<Single<string>, string>;
 *
 * const handlers = new Set<HandlerType>();
 * const results = new Set<string>();
 *
 * function addHandler(action: HandlerType): void {
 * 	 handlers.add(action);
 * }
 *
 * addHandler((value: string) => value.toUpperCase());
 *
 * handlers.forEach((handler) => {
 * 	 const result = handler('Hello');
 *
 * 	 results.add(result);
 * });
 * ```
 */
export type Func<
  T extends unknown[],
  R,
  O extends AnyObject = Record<string | number | symbol, never>,
> = O extends Record<string | number | symbol, never>
  ? T extends Nonary ? NullaryFunc<R>
  : T extends Unary<infer T1> ? UnaryFunc1<T1, R>
  : T extends Binary<infer T1, infer T2> ? BinaryFunc2<T1, T2, R>
  : never
  : T extends Nonary ? OptionFunc<O, R>
  : T extends Unary<infer T1> ? UnaryOptionFunc<T1, O, R>
  : T extends Binary<infer T1, infer T2> ? BinaryOptionFunc<T1, T2, O, R>
  : never;

/**
 * Describes a bit value.
 *
 * @example
 * ```ts
 * import type { Bit } from './type_aliases.ts';
 *
 * const bit: Bit = 1;
 * ```
 */
export type Bit = 0 | 1;
