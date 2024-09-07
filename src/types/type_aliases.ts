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
 * key = 'another-key';
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
export type MaybeDefined<T> = T extends undefined ? never : T;

/**
 * Describes a type that if defined, is of type `T`, otherwise is `never`.
 *
 * **NOTE:** This type is deprecated to align with naming conventions. Use {@link MaybeDefined} instead.
 *
 * @deprecated Use {@link MaybeDefined} instead.
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
export type Defined<T> = MaybeDefined<T>;

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
 * import type { BitValue } from './type_aliases.ts';
 *
 * const bit: BitValue = 1;
 * ```
 */
export type BitValue = 0 | 1;

/**
 * Returns a boolean value whether a type `T` is `any`.
 *
 * @template T The type to check.
 *
 * @example
 * ```ts
 * import type { IsAny } from './type_aliases.ts';
 *
 * const isAny: IsAny<any> = true;
 * ```
 */
export type IsAny<T> = unknown extends T ? [keyof T] extends [never] ? false
  : true
  : false;

/**
 * Describes the keys of an `AnyObject`.
 *
 * This is similar to the `Scalar` type but is tolerant to the `keyofStringsOnly` rule.
 *
 * @example
 * ```ts
 * import type { KeyOfAny } from './type_aliases.ts';
 *
 * const key: KeyOfAny = 'name';
 * ```
 */
export type KeyOfAny = keyof AnyObject;

/**
 * Describes a `null` or `undefined` value.
 *
 * @example
 * ```ts
 * import type { Nil } from './type_aliases.ts';
 *
 * const nil: Nil = null;
 * ```
 */
export type Nil = null | undefined;

/**
 * A type representing a primitive value.
 *
 * @example
 * ```ts
 * import type { Primitive } from './type_aliases.ts';
 *
 * const primitive: Primitive = 42;
 * const nil: Primitive = null;
 * ```
 */
export type Primitive = Scalar | Nil;

/**
 * Describes native JavaScript types.
 *
 * @example
 * ```ts
 * import type { Native } from './type_aliases.ts';
 *
 * const native: Native = 42;
 * const date: Native = new Date();
 * ```
 */
// deno-lint-ignore ban-types
export type Native = Primitive | Function | Date | RegExp | Error;

/**
 * A utility type that flattens types improving readability.
 *
 * @template T The type to flatten.
 *
 * @example //TODO(ebntly): Add an example
 */
export type Clean<T> =
  & T
  & {
    [P in keyof T]: T[P];
  };

/**
 * Describes a record with required properties.
 *
 * @template T The value type of the record.
 * @template K The required keys.
 *
 * @example
 * ```ts
 * import type { StrictRecord } from './type_aliases.ts';
 *
 * const record: StrictRecord<string, 'name' | 'age'> = {
 *   name: 'Dakota Cortez',
 *   age: '25'
 * };
 * ```
 */
export type StrictRecord<T, K extends KeyOfAny = string> = { [key in K]: T };

/**
 * Describes a record with optional properties.
 *
 * @template T The value type of the record.
 * @template K The optional keys.
 *
 * @example
 * ```ts
 * import type { LooseRecord } from './type_aliases.ts';
 *
 * const record: LooseRecord<string, 'name' | 'age'> = {
 *   name: 'Dakota Cortez'
 * };
 * ```
 */
export type LooseRecord<T, K extends KeyOfAny = string> = { [key in K]?: T };

/**
 * Describes a value that may be a promise or a synchronous value.
 *
 * @template T The type of the value.
 *
 * @example
 * ```ts
 * import type { MaybeAsync } from './type_aliases.ts';
 *
 * const value: MaybeAsync<number> = 42;
 * const promise: MaybeAsync<number> = Promise.resolve(42);
 * ```
 */
export type MaybeAsync<T> = T | Promise<T>;

/**
 * An alias for `MaybeAsync`.
 */
export type MaybeSync<T> = MaybeAsync<T>;

/**
 * Extracts the type of a `MaybeAsync` value.
 *
 * @template T The `MaybeAsync` type.
 *
 * @example
 * ```ts
 * import type { MaybeAsync, MaybeAsyncType } from './type_aliases.ts';
 *
 * type MyValue = MaybeAsync<number>;
 *
 * const value: MaybeAsyncType<MyValue> = 42;
 * ```
 */
export type MaybeAsyncType<T> = T extends MaybeAsync<infer U> ? U : never;

/**
 * An alias for `MaybeAsyncType`.
 */
export type MaybeSyncType<T> = MaybeAsyncType<T>;

/**
 * Describes a value that can be any type of array..
 *
 * @template T The array's element type.
 *
 * @example
 * ```ts
 * import type { AnyArray } from './type_aliases.ts';
 *
 * const array: AnyArray<number> = [1, 2, 3];
 * ```
 */
export type AnyArray<T = unknown> = Array<T> | ReadonlyArray<T>;

/**
 * Describes a value that can be a single value or an array of values.
 *
 * @template T The value type.
 *
 * @example
 * ```ts
 * import type { OneOrMany } from './type_aliases.ts';
 *
 * const single: OneOrMany<number> = 42;
 * const many: OneOrMany<number> = [1, 2, 3];
 * ```
 */
export type OneOrMany<T> = T | AnyArray<T>;

/**
 * Extracts the paths of an object.
 *
 * @template T - The object type.
 * @template K - The key type.
 */
type ExtractPath<T extends AnyObject, K extends keyof T> = K extends string
  ? IsAny<Required<T>[K]> extends true ? K : Required<T>[K] extends AnyObject ?
      | `${K}.${
        & ExtractPath<
          Required<T>[K],
          Exclude<keyof Required<T>[K], keyof []>
        >
        & string}`
      | `${K}.${Exclude<keyof Required<T>[K], keyof []> & string}`
  : K
  : K;

/**
 * The internal string path type.
 *
 * @template T - The object type.
 */
type InternalStringPath<T extends AnyObject> =
  | ExtractPath<T, keyof T>
  | keyof T;

/**
 * Extracts the string paths of an object.
 *
 * @template T - The object type.
 *
 * @example
 * ```ts
 * import type { Paths } from './type_aliases.ts';
 *
 * type MyObject = {
 *   a: {
 *     b: {
 *       c: string;
 *       d: number;
 *       e: boolean;
 *       f?: {
 *         g: string;
 *       };
 *     };
 *   };
 * };
 *
 * const toC: Paths<MyObject> = 'a.b.c';
 * const toD: Paths<MyObject> = 'a.b.d';
 * const toE: Paths<MyObject> = 'a.b.e';
 * const toF: Paths<MyObject> = 'a.b.f';
 * const toG: Paths<MyObject> = 'a.b.f.g';
 * ```
 */

export type Paths<T extends AnyObject> = keyof T extends string
  ? InternalStringPath<T> extends infer P ? P extends string | keyof T ? P
    : keyof T
  : keyof T
  : never;
/**
 * The value at a specified object path.
 *
 * @template T - The object type.
 * @template P - The object path.
 *
 * @example
 * ```ts
 * import type { PathValue } from './type_aliases.ts';
 *
 * type MyObject = {
 *   a: {
 *     b: {
 *       c: string;
 *       d: number;
 *       e: boolean;
 *       f?: {
 *         g: string;
 *       };
 *     };
 *   };
 * };
 *
 * const valueAtD: PathValue<MyObject, 'a.b.d'> = 42;
 * ```
 */
export type PathValue<
  T extends AnyObject = AnyObject,
  P extends Paths<T> = Paths<T>,
> = P extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? R extends Paths<Required<T>[K]> ? PathValue<Required<T>[K], R>
    : never
  : never
  : P extends keyof Required<T> ? Required<T>[P]
  : never;

/**
 * Describe a predicate function that takes a value, key, and object.
 *
 * @template T - The object type.
 * @template K - The key/index type.
 * @template V - The value/element type.
 *
 * @example
 * ```ts
 * import type { PredicateAction } from './type_aliases.ts';
 *
 * const obj = {
 *   name: 'Sarai',
 *   age: 25,
 * };
 *
 * const action: PredicateAction<typeof obj> = (value, key, obj) => {
 *   console.log(`The value of ${key} is ${value}`);
 * };
 *
 * Object.entries(obj).forEach(([key, value]) => action(value, key as keyof typeof obj, obj));
 * // Output:
 * // The value of name is Sarai
 * // The value of age is 25
 * ```
 */
export type PredicateAction<
  T extends AnyObject | AnyArray<unknown>,
  K extends keyof T = keyof T,
  V extends T[K] = T[K],
> = (element: V, key: K, obj: T) => void;

/**
 * Describe a predicate function that takes a value, key, and object and returns a result.
 *
 * @template R - The result type.
 * @template T - The object type.
 * @template K - The key/index type.
 * @template V - The value/element type.
 *
 * @example
 * ```ts
 * import type { PredicateFunc } from './type_aliases.ts';
 *
 * const obj = {
 *   name: 'Sarai',
 *   age: 25,
 * };
 *
 * const func: PredicateFunc<string, typeof obj> = (value, key, obj) => {
 *   return `The value of ${key} is ${value}`;
 * };
 *
 * const results = Object.entries(obj).map(([key, value]) => func(value, key as keyof typeof obj, obj));
 *
 * console.log(results);
 * // Output:
 * // ['The value of name is Sarai', 'The value of age is 25']
 * ```
 */
export type PredicateFunc<
  R,
  T extends AnyObject | AnyArray<unknown>,
  K extends keyof T = keyof T,
  V extends T[K] = T[K],
> = (element: V, key: K, obj: T) => R;

/**
 * Describe a reducer function that takes a value, a key, and an object.
 *
 * @template T - The object type.
 * @template K - The key/index type.
 * @template V - The value/element type.
 *
 * @example
 * ```ts
 * import type { ReducerAction } from './type_aliases.ts';
 *
 * const obj = {
 *   name: 'Sarai',
 *   age: 25,
 * };
 *
 * const action: ReducerAction<typeof obj> = (accumulator, value, key, obj) => {
 *
 * };
 *
 * const total = Object.entries(obj).reduce((acc, [key, value]) => action(acc, value, key, obj), 0);
 *
 * console.log(total);
 * // Output: 25
 */
export type UpdatingReducerAction<
  T extends AnyObject | AnyArray<unknown>,
  K extends keyof T = keyof T,
  V extends T[K] = T[K],
> = (accumulator: T, element: V, key: K, obj: T) => T;

/**
 * Describe a reducer function that takes an accumulator, a value, a key, and an object.
 *
 * @template T - The object type.
 * @template K - The key/index type.
 * @template V - The value/element type.
 */
export type AccumulatingReducerAction<
  A,
  T extends AnyObject | AnyArray<unknown>,
  K extends keyof T = keyof T,
  V extends T[K] = T[K],
> = (accumulator: A, element: V, key: K, obj: T) => A;

/**
 * An alias for `UpdatingReducerAction` or `AccumulatingReducerAction`.
 *
 * @template T - The object type.
 * @template A - The accumulator type.
 *
 * @example
 * ```ts
 * import type { ReducerAction } from './type_aliases.ts';
 *
 * const obj = {
 *   name: 'Sarai',
 *   age: 25,
 * };
 *
 * const action: ReducerAction<typeof obj, string[]> = (acc, value, key, obj) => {
 *   acc.push(`${key}=${value}`);
 *
 *   return acc;
 * };
 *
 * const total = Object.entries(obj).reduce((acc, [key, value]) => action(acc, value, key as keyof typeof obj, obj), [] as string[]);
 *
 * console.log(total.join(','));
 * // Output: 'name=Sarai,age=25'
 * ```
 */
export type ReducerAction<T extends AnyObject | AnyArray<unknown>, A = T> =
  A extends T ? UpdatingReducerAction<T> : AccumulatingReducerAction<A, T>;
