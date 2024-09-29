/**
 * @copyright 2020-2024 integereleven. All rights reserved. MIT license.
 * @file Type aliases for the module. For interfaces, see ./interfaces.ts.
 */

import { ComparisonResult } from './enums.ts';

import type { TComparer, TConverter } from './interfaces.ts';

/**
 * An `Action` is a function or method that accepts a maximum of two named
 * arguments, and an optional `options` object argument, always returning
 * `void`.
 *
 * The `Action` type is used to constrain non-native callbacks to fit within
 * integereleven's function design principles. Native callbacks are those that
 * exist in the native JavaScript APIs, such as `forEach`, `map`, `reduce`,
 * etc…
 *
 * > Design principles are followed to be more thoughtful about how the
 * > codebase is produced and the resulting public API. The design principle
 * > referenced defines that a maximum of three named arguments are permitted
 * > for functions and methods. If more arguments are required, then a maximum of
 * > two named arguments are allowed with the remaining named arguments
 * > relocated to a third options argument.
 *
 * The tuple definition of the action argument's types is generally completed
 * using the adicity types, {@link Niladic}, {@link Monadic}, and
 * {@link Dyadic}, giving us a naming convention of actions such as a dyadic
 * action (accepts two named arguments) and, if options are supported, a dyadic
 * options action (supports two named arguments and an options object).
 *
 * @template T The tuple describing the parameters that this Action consumes.
 * @template O The type describing the options object. If not provided, no options object is available.
 *
 * @example Example usage of the `Action` type with only named arguments.
 * ```ts
 * import type { Action, Dyadic, Couple } from './type_aliases.ts';
 *
 * type Info = Couple<number, number>;
 * type Callback = Action<Dyadic<number, Info>>;
 *
 * function process(items: number[], callback: Callback): Info {
 *   const info: Info = [0, 0];
 *
 *   for (const item of items) {
 *     callback(item, info);
 *   }
 *
 *   return info
 * }
 *
 * const sumAndCount: Callback = (num, info) => {
 *   info[0] += num;
 *   info[1] += 1;
 * };
 *
 * const [sum, count] = process([1, 2, 3, 4, 5], sumAndCount);
 *
 * console.assert(sum === 15);  // ✔
 * console.assert(count === 5); // ✔
 * ```
 *
 * @example Example usage of the `Action` type with options.
 * ```ts
 * import type { Action, Dyadic, Couple } from './type_aliases.ts';
 *
 * type Info = Couple<number, number>;
 * type Options = {step: number};
 * type Callback = Action<Dyadic<number, Info>, Options>;
 *
 * function process(items: number[], callback: Callback): Info {
 *   const info: Info = [0, 0];
 *
 *   for (const item of items) {
 *     callback(item, info, {step: 2});
 *   }
 *
 *   return info
 * }
 *
 * const sumAndCount: Callback = (num, info, options) => {
 *   info[0] += num;
 *   info[1] += 1 * (options?.step || 1);
 * };
 *
 * const [sum, count] = process([1, 2, 3, 4, 5], sumAndCount);
 *
 * console.assert(sum === 15);   // ✔
 * console.assert(count === 10); // ✔
 * ```
 */
export type Action<
  T extends unknown[],
  O extends AnyObject = Record<string | number | symbol, never>,
> = O extends Record<string | number | symbol, never>
  ? T extends Niladic ? NiladicAction
  : T extends Monadic<infer T1> ? MonadicAction1<T1>
  : T extends Dyadic<infer T1, infer T2> ? DyadicAction2<T1, T2>
  : never
  : T extends Niladic ? NiladicOptionAction<O>
  : T extends Monadic<infer T1> ? MonadicOptionAction<T1, O>
  : T extends Dyadic<infer T1, infer T2> ? DyadicOptionAction<T1, T2, O>
  : never;

/**
 * An `AnyArray` is simply an alias for a value that is either an `Array` or
 * `ReadonlyArray`.
 *
 * The `AnyArray` type is used where an array is only expected to have its
 * elements of type `T` read, and there is no intent to modify the array.
 *
 * @template T The type of the elements of the array.
 *
 * @example Example usage of the `AnyArray` type.
 * ```ts
 * import type { AnyArray } from './type_aliases.ts';
 *
 * function sum(items: AnyArray<number>): number {
 *   return items.reduce((acc, item) => acc + item, 0);
 * }
 *
 * const readonlyItems: ReadonlyArray<number> = [1, 2, 3, 4, 5];
 *
 * const total = sum([1, 2, 3, 4, 5]);
 * const readonlyTotal = sum(readonlyItems);
 *
 * console.assert(total === 15);         // ✔
 * console.assert(readonlyTotal === 15); // ✔
 * ```
 */
export type AnyArray<T> = Array<T> | ReadonlyArray<T>;

/**
 * An `AnyObject` is any object with {@link PrimitiveKey} keys and values of
 * any type.
 *
 * Similar to the {@link IndeterminateObject}, the `AnyObject` type is used
 * where objects with unimportant key/values are expected, but `AnyObject`
 * values do not need to be cast in order to be used as a value.
 *
 * @example Example usage of the `AnyObject` type.
 * ```ts
 * import type { AnyObject } from './type_aliases.ts';
 *
 * function objectToString(obj: AnyObject): string {
 *   return JSON.stringify(obj);
 * }
 *
 * const obj1: AnyObject = {name: 'John', age: 25};
 * const obj2: AnyObject = {group: 'Admin', role: 'Manager'};
 *
 * const str1 = objectToString(obj1);
 * const str2 = objectToString(obj2);
 *
 * console.assert(str1 === '{"name":"John","age":25}');           // ✔
 * console.assert(str2 === '{"group":"Admin","role":"Manager"}'); // ✔
 * ```
 */
// deno-lint-ignore no-explicit-any
export type AnyObject = Record<PrimitiveKey, any>;

/**
 * A `Binary` is a tuple with two elements.
 *
 * The `Binary` type describes a 2-tuple, or a two element tuple.
 *
 * @template T1 The type of the tuple's first element.
 * @template T2 The type of the tuple's second element.
 *
 * @example Example usage of the `Binary` type.
 * ```ts
 * import type { Binary } from './type_aliases.ts';
 *
 * function createId(pair: Binary<string, number>): string {
 *   const [name, id] = pair;
 *
 *   return `${name}-${id}`;
 * }
 *
 * const id1 = createId(['Michel', 3838449417]);
 * const id2 = createId(['Wen', 2786402361]);
 *
 * console.assert(id1 === 'Michel-3838449417'); // ✔
 * console.assert(id2 === 'Wen-2786402361');    // ✔
 * ```
 *
 * @see {@link OrderedPair}
 * @see {@link Couple}
 * @see {@link Dyadic}
 * @see {@link Nullary}
 * @see {@link Unary}
 * @see {@link Ternary}
 * @see {@link Quaternary}
 * @see {@link Quinary}
 * @see {@link Senary}
 * @see {@link Septenary}
 * @see {@link Octonary}
 */
export type Binary<T1, T2 = T1> = [T1, T2];

/**
 * A `BitValue` is a numeric representative of a bit.
 *
 * @example Example usage of the `BitValue` type.
 * ```ts
 * import type { BitValue, Octuple } from './type_aliases.ts';
 *
 * function bitsToNumber(value: Octuple<BitValue>): number {
 *   return value.reduce((acc, bit) => (acc << 1) | bit, 0 as number);
 * }
 *
 * const num1 = bitsToNumber([1, 0, 0, 1, 1, 0, 1, 1]);
 * const num2 = bitsToNumber([1, 1, 0, 0, 1, 1, 0, 1]);
 *
 * console.assert(num1 === 155); // ✔
 * console.assert(num2 === 205); // ✔
 * ```
 */
export type BitValue = 0 | 1;

/**
 * A `Clean` is a complex type flattened to improve IDE readability.
 *
 * The `Clean` type is used to improving the development experience by
 * simplifying type `T`. When working with complex types, it helps to know the
 * structure of the type, rather than the types that make up the type.
 *
 * @template T The complex type to flatten.
 */
export type Clean<T> = T & { [K in keyof T]: T[K] };

/**
 * A `Comparer` describes a value that is either a {@link TComparer} or a
 * {@link ComparerFn}, which can be used to compare two values.
 *
 * The `Comparer` type is an alias for {@link TComparer} or {@link ComparerFn}.
 *
 * > It is suggested that wherever you support a {@link TComparer}, you could
 * easily support a {@link ComparerFn}, and vice-versa. So it makes sense that
 * you simply support `Comparer` and add the small bit of logical supporting
 * it.
 *
 * @template T The type of values to compare.
 *
 * @example Example usage of the `Comparer` type.
 * ```ts
 * import { ComparisonResult } from './enums.ts';
 * import type { Comparer } from './type_aliases.ts';
 *
 * type User = {
 *   name: string;
 *   age: number;
 * };
 *
 * const compareByName: Comparer<User> = (a, b) =>
 *   a.name.localeCompare(b.name);
 * const compareByAge: Comparer<User> = {
 *   compare: (a, b) => {
 *     return a.age - b.age;
 *   },
 * };
 *
 * const people: User[] = [
 *   { name: 'Jin', age: 25 },
 *   { name: 'Luwam', age: 30 },
 *   { name: 'Jörg', age: 20 },
 * ];
 *
 * const byName = [...people].sort(compareByName);
 * const byAge = [...people].sort(compareByAge.compare);
 * const byNameList = byName.map((a) => a.name).join(' ');
 * const byAgeList = byAge.map((a) => a.name).join(' ');
 *
 * console.assert(byNameList === 'Jin Jörg Luwam'); // ✔
 * console.assert(byAgeList === '20 25 30');         // ✔
 * ```
 */
export type Comparer<T> = TComparer<T> | ComparerFn<T>;

/**
 * A `ComparerFn` is a function that compares two values of the same type,
 * optionally reversing the comparison.
 *
 * Specifying `true` in the reverse argument should result in the comparison
 * values switching sides, so while we are still comparing `a = 5` and `b = 6`,
 * we are now comparing `b` to `a`, such that `b > a` results in a
 * {@link ComparisonResult} of {@link ComparisonResult.Greater}.
 *
 * @template T The type of values to compare.
 *
 * @param a The first value to compare.
 * @param b The second value to compare.
 * @param reverse Whether to reverse the comparison. Defaults to `false`.
 * @returns A {@link ComparisonResult} indicating the result of the comparison.
 *
 * @example Example usage of the `ComparerFn` type.
 * ```ts
 * import { ComparisonResult } from './enums.ts';
 * import type { ComparerFn } from './type_aliases.ts';
 *
 * type User = {
 *   name: string;
 *   age: number;
 * };
 *
 * const userCompare: ComparerFn<User> = (
 *   a,
 *   b,
 *   reverse = false,
 * ): ComparisonResult => {
 *   [a, b] = reverse ? [b, a] : [a, b];
 *
 *   if (a.name === b.name) {
 *     return a.age === b.age
 *       ? ComparisonResult.Equal
 *       : a.age > b.age
 *       ? ComparisonResult.Greater
 *       : ComparisonResult.Lesser;
 *   }
 *
 *   return a.name === b.name
 *     ? ComparisonResult.Equal
 *     : a.name > b.name
 *     ? ComparisonResult.Greater
 *     : ComparisonResult.Lesser;
 * };
 *
 * const users: User[] = [
 *   { name: 'Raquildis', age: 25 },
 *   { name: 'Eric', age: 30 },
 *   { name: 'Melissa', age: 20 },
 * ];
 *
 * const sortAsc = [...users].sort(userCompare);
 * const sortDesc = [...users].sort((a, b) => userCompare(a, b, true));
 * const ascList = sortAsc.map((a) => a.name).join(' ');
 * const descList = sortDesc.map((a) => a.name).join(' ');
 *
 * console.assert(ascList === 'Eric Melissa Raquildis'); // ✔
 * console.assert(descList === '25 20 30');              // ✔
 * ```
 */
export type ComparerFn<T> = (a: T, b: T, reverse?: boolean) => ComparisonResult;

/**
 * A `Constructor` is a function that is used to create and initialize an
 * object.
 *
 * @template T The type of object instance created by the constructor.
 *
 * @example Example usage of the `Constructor` type.
 * ```ts
 * import type { Constructor } from './type_aliases.ts';
 *
 * class User {
 *   protected role: string = 'user';
 *
 *   constructor(protected name: string) { }
 *
 *   toString(): string {
 *     return `[${this.role}]${this.name}`;
 *   }
 * }
 *
 * class ComplianceAdmin extends User {
 *   protected role: string = 'compliance-admin';
 * }
 *
 * class Admin extends User {
 *   protected role: string = 'admin';
 * }
 *
 * function createUser(name: string, role: Constructor<User>): User {
 *   return new role(name);
 * }
 *
 * const user = createUser('Cara', User);
 * const complianceAdmin = createUser('Gustavo', ComplianceAdmin);
 * const admin = createUser('Sayoka', Admin);
 *
 * console.assert(user.toString() === '[user]Cara');                           // ✔
 * console.assert(complianceAdmin.toString() === '[compliance-admin]Gustavo'); // ✔
 * console.assert(admin.toString() === '[admin]Sayoka');                       // ✔
 * ```
 */
// deno-lint-ignore no-explicit-any
export type Constructor<T> = new (...args: any[]) => T;

/**
 * A `Converter` describes a value that is either a {@link TConverter} or a
 * {@link ConverterFn}, which can be used to convert a value of one type to
 * another type.
 *
 * The `Converter` type is an alias for {@link TConverter} or
 * {@link ConverterFn}.
 *
 * It is suggested that wherever you support a {@link TConverter}, you could
 * easily support a {@link ConverterFn}, and vice-versa. So it makes sense that
 * you simply support `Converter` and add the small bit of logical supporting
 * it.
 *
 * @template F The type of value that is to be converted.
 * @template T The type the input value is to be converted to.
 *
 * @example Example usage of the `Converter` type.
 * ```ts
 * import type { Converter } from './type_aliases.ts';
 *
 * type User = {
 *   name: string;
 *   age: number;
 * };
 *
 * const toNumber: Converter<User, number> = (value) => value.age;
 * const toString: Converter<User, string> = {
 *   convert: (value) => `${value.name}:${value.age}`,
 * };
 *
 * const user: User = { name: 'Takahito', age: 25 };
 * const num = toNumber(user);
 * const str = toString.convert(user);
 *
 * console.assert(num === 25);            // ✔
 * console.assert(str === 'Takahito:25'); // ✔
 * ```
 */
export type Converter<F, T> = TConverter<F, T> | ConverterFn<F, T>;

/**
 * A `ConverterFn` is a function that converts a value from one type to another
 * type.
 *
 * @template F The type of value that is to be converted.
 * @template T The type the input value is to be converted to.
 *
 * @param from The value that is to be converted.
 * @returns The value converted to the new type.
 *
 * @example Example usage of the `ConverterFn` type.
 * ```ts
 * import type { ConverterFn } from './type_aliases.ts';
 *
 * type User = {
 *   name: string;
 *   age: number;
 * };
 *
 * const toString: ConverterFn<User, string> = (value) => `${value.name}:${value.age}`;
 * const user: User = { name: 'Macarena', age: 25 };
 * const str = toString(user);
 *
 * console.assert(str === 'Macarena:25'); // ✔
 * ```
 */
export type ConverterFn<F, T> = (from: F) => T;

/**
 * A `Couple` is a tuple with two elements.
 *
 * The `Couple` type is an alias for a {@link Binary} tuple.
 *
 * @template T1 The type of the tuple's first element.
 * @template T2 The type of the tuple's second element.
 *
 * @example Example usage of the `Couple` type.
 * ```ts
 * import type { Couple } from './type_aliases.ts';
 *
 * function createId(pair: Couple<string, number>): string {
 *   const [name, id] = pair;
 *
 *   return `${name}-${id}`;
 * }
 *
 * const id1 = createId(['Jarmila', 7227111290]);
 * const id2 = createId(['Štefan', 1242868855]);
 *
 * console.assert(id1 === 'Jarmila-7227111290'); // ✔
 * console.assert(id2 === 'Štefan-1242868855');  // ✔
 * ```
 *
 * @see {@link Binary}
 * @see {@link Dyadic}
 * @see {@link Empty}
 * @see {@link Single}
 * @see {@link Singleton}
 * @see {@link OrderedPair}
 * @see {@link Triple}
 * @see {@link Quadruple}
 * @see {@link Quintuple}
 * @see {@link Sextuple}
 * @see {@link Septuple}
 * @see {@link Octuple}
 */
export type Couple<T1, T2 = T1> = Binary<T1, T2>;

/**
 * A `DecoratorTarget` is a string representation of declarations that
 * TypeScript decorators can attach to.
 *
 * **Target descriptions:**
 *
 * - `'class'` -	A decorator for class declarations.
 * - `'method'` -	A decorator for class method declarations.
 * - `'property'` -	A decorator for class property declarations.
 * - `'parameter'` -	A decorator for class method parameter declarations.
 * - `'accessor'` -	A decorator for class property accessor method declarations.
 */
export type DecoratorTarget =
  | 'class'
  | 'method'
  | 'property'
  | 'parameter'
  | 'accessor';

/**
 * A `Dyadic` is a tuple with two elements.
 *
 * The `Dyadic` type is an alias for a {@link Binary} tuple.
 *
 * @template T1 The type of the tuple's first element.
 * @template T2 The type of the tuple's second element.
 *
 * @example Example usage of the `Dyadic` type.
 * ```ts
 * import type { Dyadic } from './type_aliases.ts';
 *
 * function createId(pair: Dyadic<string, number>): string {
 *   const [name, id] = pair;
 *
 *   return `${name}-${id}`;
 * }
 *
 * const id1 = createId(['Miluše', 5395605338]);
 * const id2 = createId(['Hamish', 3599968758]);
 *
 * console.assert(id1 === 'Miluše-5395605338'); // ✔
 * console.assert(id2 === 'Hamish-3599968758'); // ✔
 * ```
 *
 * @see {@link Binary}
 * @see {@link Couple}
 * @see {@link OrderedPair}
 * @see {@link Niladic}
 * @see {@link Monadic}
 * @see {@link Triadic}
 * @see {@link Tetradic}
 */
export type Dyadic<T1, T2 = T1> = Binary<T1, T2>;

/**
 * An `Empty` is a tuple with no elements.
 *
 * The `Empty` type is an alias for a {@link Nullary} tuple.
 *
 * @example
 * ```ts
 * import type { Empty, Single, Triple } from './type_aliases.ts';
 *
 * type Actions =
 * 	 | 'add'
 * 	 | 'sub'
 * 	 | 'div'
 * 	 | 'mx'
 * 	 | 'pow'
 * 	 | 'mod';
 *
 * type ItemTypes =
 * 	 | Empty
 * 	 | Single<number>
 * 	 | Triple<number, number, Actions>;
 *
 * function doMath(items: ItemTypes): number {
 * 	 if (!items.length) return 0;
 * 	 if (items.length === 1) return items[0];
 * 
 * 	 const [op1, op2, op] = items;
 * 
 * 	 if (op === 'add') return op1 + op2;
 * 	 if (op === 'sub') return op1 - op2;
 * 	 if (op === 'div') return op1 / op2;
 * 	 if (op === 'mx') return op1 * op2;
 * 	 if (op === 'pow') return Math.pow(op1, op2);
 * 
 * 	 return op1 % op2;
 * }
 *
 * console.assert(doMath([]) === 0);
 * console.assert(doMath([25]) === 25);
 * console.assert(doMath([2, 4, 'pow']) === 16);
 * console.assert(doMath([10, 5, 'div']) === 2);
 * ```
 *
 * @see {@link Nullary}
 * @see {@link Niladic}
 * @see {@link Single}
 * @see {@link Singleton}
 * @see {@link Couple}
 * @see {@link OrderedPair}
 * @see {@link Triple}
 * @see {@link Quadruple}
 * @see {@link Quintuple}
 * @see {@link Sextuple}
 * @see {@link Septuple}
 * @see {@link Octuple}
 */
export type Empty = Nullary;

/**
 * A `Func` is a function or method that accepts a maximum of two named
 * arguments, and an optional `options` object argument, returning a value.
 *
 * The `Func` type is used to constrain non-native callbacks to fit within
 * integereleven's function design principles. Native callbacks are those that
 * exist in the native JavaScript APIs, such as `forEach`, `map`, `reduce`,
 * etc…
 *
 * > Design principles are followed to be more thoughtful about how the
 * > codebase is produced and the resulting public API. The design principle
 * > referenced defines that a maximum of three named arguments are permitted
 * > for functions and methods. If more arguments are required, then a maximum
 * > of two named arguments are allowed with the remaining named arguments
 * > relocated to a third options argument.
 *
 * The tuple definition of the func argument's types is generally completed
 * using the adicity types, {@link Niladic}, {@link Monadic}, and
 * {@link Dyadic}, giving us a naming convention of actions such as a dyadic
 * func (accepts two named arguments) and, if options are supported, a dyadic
 * options func (supports two named arguments and an options object).
 *
 * @template T The tuple describing the parameters that this function consumes.
 * @template R The return type of the `Func`.
 * @template O The type describing the options object. If not provided, no options object is available.
 *
 * @example Example usage of the `Func` type with only named arguments.
 * ```ts
 * import type { Func, Dyadic, Couple } from './type_aliases.ts';
 *
 * type Info = Couple<number, number>;
 * type Callback = Func<Dyadic<number, Info>, number>;
 *
 * function process(items: number[], callback: Callback): [Info, number[]] {
 *   const info: Info = [0, 0];
 *   const results: number[] = [];
 *
 *   for (const item of items) {
 *     results.push(callback(item, info));
 *   }
 *
 *   return [info, results];
 * }
 *
 * const sumAndCount: Callback = (num, info) => {
 *   info[0] += num;
 *   info[1] += 1;
 *   return num * info[1];
 * };
 *
 * const [info, result] = process([1, 2, 3, 4, 5], sumAndCount);
 * const [sum, count] = info;
 * const resultingSum = result.reduce((acc, item) => acc + item, 0)
 *
 * console.assert(sum === 15);          // ✔
 * console.assert(count === 10);        // ✔
 * console.assert(resultingSum === 55); // ✔
 * ```
 *
 * @example Example usage of the `Func` type with options.
 * ```ts
 * import type { Func, Dyadic, Couple } from './type_aliases.ts';
 *
 * type Info = Couple<number, number>;
 * type Options = { step: number };
 * type Callback = Func<Dyadic<number, Info>, number, Options>;
 *
 * function process(items: number[], callback: Callback): [Info, number[]] {
 *   const info: Info = [0, 0];
 *   const results: number[] = [];
 *
 *   for (const item of items) {
 *     results.push(callback(item, info, { step: 2 }));
 *   }
 *
 *   return [info, results];
 * }
 *
 * const sumAndCount: Callback = (num, info, options) => {
 *   info[0] += num;
 *   info[1] += 1 * (options?.step || 1);
 *
 *   return num * info[1];
 * };
 *
 * const [info, result] = process([1, 2, 3, 4, 5], sumAndCount);
 * const [sum, count] = info;
 * const resultingSum = result.reduce((acc, item) => acc + item, 0)
 *
 * console.assert(sum === 15);           // ✔
 * console.assert(count === 10);         // ✔
 * console.assert(resultingSum === 110); // ✔
 * ```
 */
export type Func<
  T extends unknown[],
  R,
  O extends AnyObject = Record<string | number | symbol, never>,
> = O extends Record<string | number | symbol, never>
  ? T extends Niladic ? NiladicFunc<R>
  : T extends Monadic<infer T1> ? MonadicFunc1<T1, R>
  : T extends Dyadic<infer T1, infer T2> ? DyadicFunc2<T1, T2, R>
  : never
  : T extends Niladic ? NiladicOptionFunc<O, R>
  : T extends Monadic<infer T1> ? MonadicOptionFunc<T1, O, R>
  : T extends Dyadic<infer T1, infer T2> ? DyadicOptionFunc<T1, T2, O, R>
  : never;

/**
 * A `HexValue` is a numeric and textual representation of a hexadecimal value.
 *
 * @example Example usage of the `HexValue` type.
 * ```ts
 * import type { HexValue, Quadruple } from './type_aliases.ts';
 *
 * function hexToNumber(hex: Quadruple<HexValue>): number {
 *   return parseInt(hex.join(''), 16);
 * }
 *
 * const num1 = hexToNumber([9, 6, 7, 'B']);
 * const num2 = hexToNumber(['A', 'C', 3, 'D']);
 *
 * console.assert(num1 === 38523); // ✔
 * console.assert(num2 === 44093); // ✔
 * ```
 */
export type HexValue =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f';

/**
 * An `IndeterminateObject` is any object with {@link PrimitiveKey} keys and
 * values of `unknown` type.
 *
 * Similar to the {@link AnyObject} ,the `IndeterminateObject` type is used
 * where objects with unimportant key/values are expected, but
 * `IndeterminateObject` values must be cast in order to be used as a value.
 *
 * @example Example usage of the `IndeterminateObject` type.
 * ```ts
 * import type { IndeterminateObject } from './type_aliases.ts';
 *
 * function objectToString(obj: IndeterminateObject): string {
 *   return JSON.stringify(obj);
 * }
 *
 * const obj1: IndeterminateObject = { name: 'John', age: 25 };
 * const obj2: IndeterminateObject = { group: 'Admin', role: 'Manager' };
 *
 * const str1 = objectToString(obj1);
 * const str2 = objectToString(obj2);
 *
 * console.assert(str1 === '{"name":"John","age":25}');           // ✔
 * console.assert(str2 === '{"group":"Admin","role":"Manager"}'); // ✔
 * ```
 */
export type IndeterminateObject = Record<PrimitiveKey, unknown>;

/**
 * An `IsAny` is a utility to check if a type is `any`.
 *
 * @template T The type to check if is `any`.
 *
 * @example Example usage of the `IsAny` type.
 * ```ts
 * import type { IsAny } from './type_aliases.ts';
 *
 * const anyValue: IsAny<any> = true;
 * const value: IsAny<number> = false;
 *
 * console.assert(anyValue); // ✔
 * console.assert(!value);   // ✔
 * ```
 */
export type IsAny<T> = 0 extends 1 & T ? true : false;

/**
 * An `IsNever` is a utility to check if a type is `never`.
 *
 * @template T The type to check if is `never`.
 *
 * @example Example usage of the `IsNever` type.
 * ```ts
 * import type { IsNever } from './type_aliases.ts';
 *
 * const neverValue: IsNever<never> = true;
 * const value: IsNever<number> = false;
 *
 * console.assert(neverValue); // ✔
 * console.assert(!value);     // ✔
 * ```
 */
export type IsNever<T> = [T] extends [never] ? true : false;

/**
 * An `IsUnknown` is a utility to check if a type is `unknown`.
 *
 * @template T The type to check if is `unknown`.
 *
 * @example Example usage of the `IsUnknown` type.
 * ```ts
 * import type { IsUnknown } from './type_aliases.ts';
 *
 * const unknownValue: IsUnknown<unknown> = true;
 * const value: IsUnknown<number> = false;
 *
 * console.assert(unknownValue); // ✔
 * console.assert(!value);       // ✔
 * ```
 */
export type IsUnknown<T> = IsAny<T> extends true ? false
  : unknown extends T ? true
  : false;

/**
 * A `KeyOfAny` is a key of the {@link AnyObject} type.
 *
 * The `KeyOfAny` type is similar to the {@link PrimitiveKey} type but it
 * tolerant to `keysOfStringsOnly` rule, which is its primary purpose.
 */
export type KeyOfAny = keyof AnyObject;

/**
 * A `MaybeArray` is either a value, or an array with elements, of a specific
 * type.
 *
 * The `MaybeArray` type is useful for where you expect a value, but can accept
 * an array of elements, of type `T`.
 *
 * @template T The value type of the single value or array elements.
 *
 * @example Example usage of the `MaybeArray` type.
 * ```ts
 * import type { MaybeArray } from './type_aliases.ts';
 *
 * type User = {
 *   name: string;
 *   age: number;
 * };
 *
 * function getNames(users: MaybeArray<User>): string[] {
 *   return Array.isArray(users) ? users.map((u) => u.name) : [users.name];
 * }
 *
 * const admin = { name: 'Benoît', age: 54 };
 *
 * const users = [
 *   { name: 'Danielle', age: 25 },
 *   { name: 'Pacífico', age: 30 },
 *   { name: 'Li', age: 20 },
 * ];
 *
 * const adminNames = getNames(admin);
 * const userNames = getNames(users);
 * const adminList = adminNames.join(' ');
 * const userList = userNames.join(' ');
 *
 * console.assert(adminList === 'Benoît');              // ✔
 * console.assert(userList === 'Danielle Pacífico Li'); // ✔
 * ```
 */
export type MaybeArray<T> = T | Array<T>;

/**
 * A `MaybeCalculated` is either a value, or a function that returns a value,
 * of a specific type.
 *
 * A `MaybeCalculated` is used where you expect, but can accept a function
 * returning, a value of type `T`. The `MaybeCalculated` is similar to a
 * {@link MaybeThunk}, but can accept input.
 *
 * @template T The type of the explicitly set value and return value of the function.
 * @template A The arguments that would be supplied to the function.
 *
 * @example Example usage of the `MaybeCalculated` type.
 * ```ts
 * import type { MaybeCalculated, Monadic } from './type_aliases.ts';
 *
 * type Config = {
 *   heartbeat: number;
 *   timeout: number;
 *   maxAttempts: number;
 *   iterations: number;
 * };
 *
 * type UserConfig = {
 *   [K in keyof Config]: MaybeCalculated<Config[K], Monadic<Config>>;
 * };
 *
 * const baseConfig: Config = {
 *   heartbeat: 1000,
 *   timeout: 5000,
 *   maxAttempts: 3,
 *   iterations: 6,
 * };
 *
 * function createConfig(cfg: UserConfig): Config {
 *   const config: Partial<Config> = {};
 *
 *   for (const key in cfg) {
 *     const k = key as keyof Config;
 *
 *     if (typeof cfg[k] === 'function') {
 *       config[k] = cfg[k](baseConfig);
 *     } else {
 *       config[k] = cfg[k];
 *     }
 *   }
 *
 *   return config as Config;
 * }
 *
 * const userConfig: UserConfig = {
 *   heartbeat: 1000,
 *   timeout: 5000,
 *   maxAttempts: 3,
 *   iterations: (cfg) => cfg.maxAttempts * 2,
 * };
 *
 * const config = createConfig(userConfig);
 *
 * console.assert(config.heartbeat === 1000); // ✔
 * console.assert(config.timeout === 5000);   // ✔
 * console.assert(config.maxAttempts === 3);  // ✔
 * console.assert(config.iterations === 6);   // ✔
 * ```
 */
export type MaybeCalculated<T, A extends unknown[]> = T | Func<A, T>;

/**
 * A `MaybePromise` is either a value, or a promise that resolves to a value,
 * of a specific type.
 *
 * @template T The type of the explicitly defined value or promised value.
 *
 * @example Example usage of the `MaybePromise` type.
 * ```ts
 * import type { MaybePromise } from './type_aliases.ts';
 *
 * type User = {
 *   name: string;
 *   age: number;
 * };
 *
 * async function getNames(user: MaybePromise<User>): Promise<string> {
 *   const userObject = await Promise.resolve(user);
 *
 *   return userObject.name;
 * }
 * const users = [
 *   { name: 'Guang', age: 25 },
 *   Promise.resolve({ name: 'Edo', age: 30 }),
 *   { name: 'Martin', age: 20 },
 * ];
 *
 * const userNames = await Promise.all(users.map(getNames));
 * const userList = userNames.join(' ');
 *
 * console.assert(userList === 'Guang Edo Martin'); // ✔
 * ```
 */
export type MaybePromise<T> = T | Promise<T>;

/**
 * A `Monadic` is a tuple with one element.
 *
 * The `Monadic` type is an alias for a {@link Unary} tuple.
 *
 * @template T The type of the tuple's first, and only, element.
 *
 * @example
 * ```ts
 * import type { Niladic, Monadic, Triadic } from './type_aliases.ts';
 *
 * type Actions =
 * 	 | 'add'
 * 	 | 'sub'
 * 	 | 'div'
 * 	 | 'mx'
 * 	 | 'pow'
 * 	 | 'mod';
 *
 * type ItemTypes =
 * 	 | Niladic
 * 	 | Monadic<number>
 * 	 | Triadic<number, number, Actions>;
 *
 * function doMath(items: ItemTypes): number {
 * 	 if (!items.length) return 0;
 * 	 if (items.length === 1) return items[0];
 * 
 * 	 const [op1, op2, op] = items;
 * 
 * 	 if (op === 'add') return op1 + op2;
 * 	 if (op === 'sub') return op1 - op2;
 * 	 if (op === 'div') return op1 / op2;
 * 	 if (op === 'mx') return op1 * op2;
 * 	 if (op === 'pow') return Math.pow(op1, op2);
 * 
 * 	 return op1 % op2;
 * }
 *
 * console.assert(doMath([]) === 0);
 * console.assert(doMath([25]) === 25);
 * console.assert(doMath([2, 4, 'pow']) === 16);
 * console.assert(doMath([10, 5, 'div']) === 2);
 * ```
 *
 * @see {@link Unary}
 * @see {@link Single}
 * @see {@link Singleton}
 * @see {@link Niladic}
 * @see {@link Dyadic}
 * @see {@link Triadic}
 * @see {@link Tetradic}
 */
export type Monadic<T> = Unary<T>;

/**
 * A `Native` is any value that is a native JavaScript feature.
 */
// deno-lint-ignore ban-types
export type Native = Primitive | Function | Date | RegExp | Error;

/**
 * A `Nil` is a value that is either `undefined` or `null`.
 *
 * @example Example usage of the `Nil` type.
 * ```ts
 * import type { Nil } from './type_aliases.ts';
 *
 * const nilValue: Nil = null;
 * const undefinedValue: Nil = undefined;
 *
 * console.assert(nilValue === null);            // ✔
 * console.assert(undefinedValue === undefined); // ✔
 * ```
 */
export type Nil = undefined | null;

/**
 * A `Nilable` is a either a value of a specific type, or a {@link Nil}.
 *
 * The `Nilable` type used where a value of type `T` is expected, but a
 * {@link Nil} is acceptable.
 *
 * @template T The type of the value that is expected, if not a {@link Nil}.
 *
 * @example Example usage of the `Nilable` type.
 * ```ts
 * import type { Nilable } from './type_aliases.ts';
 *
 * type User = {
 *   name: string;
 *   age: number;
 * };
 *
 * function getUserImage(user: Nilable<User>): string {
 *   if (!user) return 'default.png';
 *
 *   return `${user.name}.png`;
 * }
 *
 * const user: Nilable<User> = { name: 'Malik', age: 77 };
 * const image1 = getUserImage(undefined);
 * const image2 = getUserImage(user);
 *
 * console.assert(image1 === 'default.png'); // ✔
 * console.assert(image2 === 'Malik.png');   // ✔
 * ```
 */
export type Nilable<T> = T | Nil;

/**
 * An `Niladic` is a tuple with no elements.
 *
 * The `Niladic` type is an alias for a {@link Nullary} tuple.
 *
 * @example
 * ```ts
 * import type { Niladic, Monadic, Triadic } from './type_aliases.ts';
 *
 * type Actions =
 * 	 | 'add'
 * 	 | 'sub'
 * 	 | 'div'
 * 	 | 'mx'
 * 	 | 'pow'
 * 	 | 'mod';
 *
 * type ItemTypes =
 * 	 | Niladic
 * 	 | Monadic<number>
 * 	 | Triadic<number, number, Actions>;
 *
 * function doMath(items: ItemTypes): number {
 * 	 if (!items.length) return 0;
 * 	 if (items.length === 1) return items[0];
 * 
 * 	 const [op1, op2, op] = items;
 * 
 * 	 if (op === 'add') return op1 + op2;
 * 	 if (op === 'sub') return op1 - op2;
 * 	 if (op === 'div') return op1 / op2;
 * 	 if (op === 'mx') return op1 * op2;
 * 	 if (op === 'pow') return Math.pow(op1, op2);
 * 
 * 	 return op1 % op2;
 * }
 *
 * console.assert(doMath([]) === 0);
 * console.assert(doMath([25]) === 25);
 * console.assert(doMath([2, 4, 'pow']) === 16);
 * console.assert(doMath([10, 5, 'div']) === 2);
 * ```
 *
 * @see {@link Nullary}
 * @see {@link Niladic}
 * @see {@link Empty}
 * @see {@link Monadic}
 * @see {@link Dyadic}
 * @see {@link Triadic}
 * @see {@link Tetradic}
 */
export type Niladic = Nullary;

/**
 * A `Nullable` is either a value of a specific type, or `null`.
 *
 * A `Nullable` is used where you expect a value of type `T`, but `null` is
 * acceptable.
 *
 * @template T The type of the value that is expected, if not `null`.
 *
 * @example Example usage of the `Nullable` type.
 * ```ts
 * import type { Nullable } from './type_aliases.ts';
 *
 * type User = {
 *   name: string;
 *   age: number;
 * };
 *
 * function getUserImage(user: Nullable<User>): string {
 *   if (!user) return 'default.png';
 *
 *   return `${user.name}.png`;
 * }
 *
 * const user: User = { name: 'Malik', age: 77 };
 * const image1 = getUserImage(null);
 * const image2 = getUserImage(user);
 *
 * console.assert(image1 === 'default.png'); // ✔
 * console.assert(image2 === 'Malik.png');   // ✔
 * ```
 */
export type Nullable<T> = T | null;

/**
 * A `Nullary` is a tuple with no elements.
 *
 * The `Nullary` type describes a 0-tuple, or an empty tuple.
 *
 * @example
 * ```ts
 * import type { Nullary, Unary, Ternary } from './type_aliases.ts';
 *
 * type Actions =
 * 	 | 'add'
 * 	 | 'sub'
 * 	 | 'div'
 * 	 | 'mx'
 * 	 | 'pow'
 * 	 | 'mod';
 *
 * type ItemTypes =
 * 	 | Nullary
 * 	 | Unary<number>
 * 	 | Ternary<number, number, Actions>;
 *
 * function doMath(items: ItemTypes): number {
 * 	 if (!items.length) return 0;
 * 	 if (items.length === 1) return items[0];
 * 
 * 	 const [op1, op2, op] = items;
 * 
 * 	 if (op === 'add') return op1 + op2;
 * 	 if (op === 'sub') return op1 - op2;
 * 	 if (op === 'div') return op1 / op2;
 * 	 if (op === 'mx') return op1 * op2;
 * 	 if (op === 'pow') return Math.pow(op1, op2);
 * 
 * 	 return op1 % op2;
 * }
 *
 * console.assert(doMath([]) === 0);
 * console.assert(doMath([25]) === 25);
 * console.assert(doMath([2, 4, 'pow']) === 16);
 * console.assert(doMath([10, 5, 'div']) === 2);
 * ```
 *
 * @see {@link Empty}
 * @see {@link Niladic}
 * @see {@link Unary}
 * @see {@link Binary}
 * @see {@link Ternary}
 * @see {@link Quaternary}
 * @see {@link Quinary}
 * @see {@link Senary}
 * @see {@link Septenary}
 * @see {@link Octonary}
 */
export type Nullary = [];

/**
 * An `Octonary` is a tuple with eight elements.
 *
 * The `Octonary` type describes an 8-tuple, or an eight element tuple.
 *
 * @template T1 The type of the tuple's first element.
 * @template T2 The type of the tuple's second element.
 * @template T3 The type of the tuple's third element.
 * @template T4 The type of the tuple's fourth element.
 * @template T5 The type of the tuple's fifth element.
 * @template T6 The type of the tuple's sixth element.
 * @template T7 The type of the tuple's seventh element.
 * @template T8 The type of the tuple's eighth element.
 *
 * @example Example usage of the `Octonary` type.
 * ```ts
 * import type { Octonary, BitValue } from './type_aliases.ts';
 *
 * type Byte = Octonary<BitValue>;
 *
 * function byteToNumber(byte: Byte): number {
 *   return byte.reduce((acc, bit) => (acc << 1) | bit, 0 as number);
 * }
 *
 * const num1 = byteToNumber([1, 0, 0, 1, 1, 0, 1, 1]);
 * const num2 = byteToNumber([1, 1, 0, 0, 1, 1, 0, 1]);
 *
 * console.assert(num1 === 155); // ✔
 * console.assert(num2 === 205); // ✔
 * ```
 *
 * @see {@link Octuple}
 * @see {@link Nullary}
 * @see {@link Unary}
 * @see {@link Binary}
 * @see {@link Ternary}
 * @see {@link Quaternary}
 * @see {@link Quinary}
 * @see {@link Senary}
 * @see {@link Septenary}
 */
export type Octonary<
  T1,
  T2 = T1,
  T3 = T2,
  T4 = T3,
  T5 = T4,
  T6 = T5,
  T7 = T6,
  T8 = T7,
> = [T1, T2, T3, T4, T5, T6, T7, T8];

/**
 * An `Octuple` is a tuple with eight elements.
 *
 * The `Octuple` type is an alias for a {@link Octonary} tuple.
 *
 * @template T1 The type of the tuple's first element.
 * @template T2 The type of the tuple's second element.
 * @template T3 The type of the tuple's third element.
 * @template T4 The type of the tuple's fourth element.
 * @template T5 The type of the tuple's fifth element.
 * @template T6 The type of the tuple's sixth element.
 * @template T7 The type of the tuple's seventh element.
 * @template T8 The type of the tuple's eighth element.
 *
 * @example Example usage of the `Octuple` type.
 * ```ts
 * import type { Octuple, BitValue } from './type_aliases.ts';
 *
 * type Byte = Octuple<BitValue>;
 *
 * function byteToNumber(byte: Byte): number {
 *   return byte.reduce((acc, bit) => (acc << 1) | bit, 0 as number);
 * }
 *
 * const num1 = byteToNumber([1, 0, 0, 1, 1, 0, 1, 1]);
 * const num2 = byteToNumber([1, 1, 0, 0, 1, 1, 0, 1]);
 *
 * console.assert(num1 === 155); // ✔
 * console.assert(num2 === 205); // ✔
 * ```
 *
 * @see {@link Octonary}
 * @see {@link Empty}
 * @see {@link Single}
 * @see {@link Singleton}
 * @see {@link Couple}
 * @see {@link OrderedPair}
 * @see {@link Triple}
 * @see {@link Quadruple}
 * @see {@link Quintuple}
 * @see {@link Sextuple}
 * @see {@link Septuple}
 */
export type Octuple<
  T1,
  T2 = T1,
  T3 = T2,
  T4 = T3,
  T5 = T4,
  T6 = T5,
  T7 = T6,
  T8 = T7,
> = Octonary<T1, T2, T3, T4, T5, T6, T7, T8>;

/**
 * A `OrderedPair` is a tuple with two elements.
 *
 * The `OrderedPair` type is an alias for a {@link Binary} tuple.
 *
 * @template T1 The type of the tuple's first element.
 * @template T2 The type of the tuple's second element.
 *
 * @example Example usage of the `OrderedPair` type.
 * ```ts
 * import type { OrderedPair } from './type_aliases.ts';
 *
 * function createId(pair: OrderedPair<string, number>): string {
 *   const [name, id] = pair;
 *
 *   return `${name}-${id}`;
 * }
 *
 * const id1 = createId(['Garðar', 9913853218]);
 * const id2 = createId(['Amadi', 5135789123]);
 *
 * console.assert(id1 === 'Garðar-9913853218'); // ✔
 * console.assert(id2 === 'Amadi-5135789123');  // ✔
 * ```
 *
 * @see {@link Binary}
 * @see {@link Dyadic}
 * @see {@link Empty}
 * @see {@link Single}
 * @see {@link Singleton}
 * @see {@link Couple}
 * @see {@link Triple}
 * @see {@link Quadruple}
 * @see {@link Quintuple}
 * @see {@link Sextuple}
 * @see {@link Septuple}
 * @see {@link Octuple}
 */
export type OrderedPair<T1, T2 = T1> = Binary<T1, T2>;

/**
 * A `Paths` is a list of dot-notation paths of an object.
 *
 * The `Paths` type is used where the dot-notation paths are needed for the
 * purpose of deeply accessing an object's properties.
 *
 * @template T The object type to extract the dot-notation paths from.
 *
 * @example Example usage of the `Paths` type.
 * ```ts
 * import type { Paths } from './type_aliases.ts';
 *
 * type User = {
 *   name: string;
 *   address: {
 *     city: string;
 *     country: string;
 *   };
 * };
 *
 * type UserPaths = Paths<User>;
 *
 * const city: UserPaths = 'address.city';
 * const country: UserPaths = 'address.country';
 *
 * console.assert(city === 'address.city');       // ✔
 * console.assert(country === 'address.country'); // ✔
 * ```
 */
export type Paths<T extends AnyObject> = keyof T extends string
  ? InternalStringPath<T> extends infer P ? P extends string | keyof T ? P
    : keyof T
  : keyof T
  : never;

/**
 * A `PathValue` is the type of value of a property at a specific path of an
 * object.
 *
 * The `PathValue` type is used to extract the type that is associated with a
 * dot-notated property of an object.
 *
 * @template T The type of object to get the dot-notated path property value type of.
 * @template P The dot-notated path of the property to get the value type of.
 *
 * @example Example usage of the `PathValue` type.
 * ```ts
 * import type { PathValue } from './type_aliases.ts';
 *
 * type User = {
 *   name: string;
 *   address: {
 *     city: string;
 *     country: string;
 *     zip: number;
 *   };
 * };
 *
 * const user: User = {
 *   name: 'Ifesinachi',
 *   address: {
 *     city: 'Pontiac',
 *     country: 'US',
 *     zip: 48342,
 *   },
 * };
 *
 * const city: PathValue<User, 'address.city'> = user.address.city;
 * const country: PathValue<User, 'address.country'> = user.address.country;
 * const zip: PathValue<User, 'address.zip'> = user.address.zip;
 *
 * console.assert(city === 'Pontiac'); // ✔
 * console.assert(country === 'US');   // ✔
 * console.assert(zip === 48342);      // ✔
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
 * A `PredicateAction` is a void function that accepts the value of an included
 * key/index on an included object/array for use in iterable features.
 *
 * The `PredicateAction` type is a callback where the indices/elements of an
 * array, or the keys/properties of an object, are able to be iterated upon,
 * without regard for the result of the action.
 *
 * @template T The type of array or object of which the indices/element, orkeys/values, are being iterated.
 * @template K The index/key that is currently being iterated over.
 * @template V The value type of the element/value that is currently being iterated over.
 *
 * @example Example usage of the `PredicateAction` type for arrays.
 * ```ts
 * import type { PredicateAction } from './type_aliases.ts';
 *
 * type User = {
 *   name: string;
 *   age: number;
 *   role: string;
 * };
 *
 * const admins: User[] = [];
 * const users: User[] = [
 *   { name: 'Amarachi', age: 58, role: 'user' },
 *   { name: 'Chinwe', age: 60, role: 'admin' },
 *   { name: 'Ngozi', age: 62, role: 'user' },
 * ];
 *
 * const storeAdmin: PredicateAction<User[]> = (user) => {
 *   if (user.role === 'admin') {
 *     admins.push(user);
 *   }
 * };
 *
 * users.forEach(storeAdmin);
 *
 * console.assert(admins.length === 1); // ✔
 * ```
 *
 * @example Example usage of the `PredicateAction` type for objects.
 * ```ts
 * import type { PredicateAction } from './type_aliases.ts';
 *
 * const records: Record<string, number> = {
 *   Chidimma: 45,
 *   Ifeatu: 29,
 *   Nkiruka: 33,
 *   Obiageli: 67,
 *   Ibekwe: 77,
 * };
 *
 * const retirees: string[] = [];
 *
 * const storeRetirementAge: PredicateAction<Record<string, number>> = (
 *   age,
 *   name,
 * ) => {
 *   if (age > 65) {
 *     retirees.push(name);
 *   }
 * };
 *
 * Object.keys(records).forEach((name) =>
 *   storeRetirementAge(records[name], name, records)
 * );
 *
 * console.assert(retirees.length === 2); // ✔
 * ```
 */
export type PredicateAction<
  // deno-lint-ignore no-explicit-any
  T extends AnyObject | AnyArray<any>,
> // deno-lint-ignore no-explicit-any
 = T extends AnyArray<any> ? (element: T[number], index: number, arr: T) => void
  : (element: T[keyof T], key: keyof T, obj: T) => void;

/**
 * A `PredicateFunction` is a function that accepts the value of a key on an
 * object for use in iterable features.
 *
 * The `PredicateFunc` type is a callback where the indices/elements of an
 * array, or the keys/properties of an object, are able to be iterated upon,
 * returning a result.
 *
 * @template R The type of value that is returned for each iteration.
 * @template T The type of array or object of which the indices/element, or keys/values, are being iterated.
 * @template K The index/key that is currently being iterated over.
 * @template V The value type of the element/value that is currently being iterated over.
 *
 * @example Example usage of the `PredicateFunc` type for arrays.
 * ```ts
 * import type { PredicateFunc } from './type_aliases.ts';
 *
 * type User = {
 *   name: string;
 *   age: number;
 *   role: string;
 * };
 *
 * const users: User[] = [
 *   { name: 'Amarachi', age: 58, role: 'user' },
 *   { name: 'Chinwe', age: 60, role: 'admin' },
 *   { name: 'Ngozi', age: 62, role: 'user' },
 * ];
 *
 * const storeAdmin: PredicateFunc<string, User[]> = (user) => {
 *   if (user.role === 'admin') {
 *     return `Admin:${user.name}`;
 *   }
 *
 *   return user.name;
 * };
 *
 * const list = users.map(storeAdmin).join(' ');
 *
 * console.assert(list === 'Amarachi Admin:Chinwe Ngozi'); // ✔
 * ```
 *
 * @example Example usage of the `PredicateFunc` type for objects.
 * ```ts
 * import type { PredicateFunc } from './type_aliases.ts';
 *
 * const records: Record<string, number> = {
 *   Chidimma: 45,
 *   Ifeatu: 29,
 *   Nkiruka: 33,
 *   Obiageli: 67,
 *   Ibekwe: 77,
 * };
 *
 * const storeRetirementAge: PredicateFunc<string, Record<string, number>> = (
 *   age,
 *   name,
 * ) => {
 *   if (age > 65) {
 *     return `${name} can retire`;
 *   }
 *
 *   return name;
 * };
 *
 * const list = Object.keys(records).map((name) =>
 *   storeRetirementAge(records[name], name, records)
 * ).join(' ');
 *
 * const expected = 'Chidimma Ifeatu Nkiruka Obiageli can retire Ibekwe can retire';
 *
 * console.assert(list === expected); // ✔
 * ```
 */
export type PredicateFunc<
  R,
  // deno-lint-ignore no-explicit-any
  T extends AnyObject | AnyArray<any>,
> // deno-lint-ignore no-explicit-any
 = T extends AnyArray<any> ? (element: T[number], index: number, arr: T) => R
  : (element: T[keyof T], key: keyof T, obj: T) => R;

/**
 * A `Primitive` is a value that is a {@link Nilable} {@link Scalar}.
 *
 * @example Example usage of the `Primitive` type.
 * ```ts
 * import type { Primitive } from './type_aliases.ts';
 *
 * function format(value: Primitive): string {
 *   if (value === null) return 'null';
 *   if (value === undefined) return 'undefined';
 *
 *   return String(value);
 * }
 *
 * const nullValue = format(null);
 * const undefinedValue = format(undefined);
 * const numberValue = format(25);
 * const stringValue = format('Hello, world!');
 * const booleanValue = format(true);
 *
 * console.assert(nullValue === 'null');            // ✔
 * console.assert(undefinedValue === 'undefined');  // ✔
 * console.assert(numberValue === '25');            // ✔
 * console.assert(stringValue === 'Hello, world!'); // ✔
 * console.assert(booleanValue === 'true');         // ✔
 * ```
 */
export type Primitive = Nilable<Scalar>;

/**
 * A `PrimitiveKey` is a value type used to key an object's property values.
 *
 * The `PrimitiveKey` type describes the value types that can be used to key
 * property values within integereleven's object design principles.
 *
 * > Design principles are followed to be more thoughtful about how the
 * > codebase is produced and the resulting public API. The design principle
 * > referenced defines only strings, numbers, and symbols may be used to key
 * > any object, and only integers may be used to index arrays.
 *
 * @example Example usage of the `PrimitiveKey` type.
 * ```ts
 * import type { PrimitiveKey } from './type_aliases.ts';
 *
 * const nameSymbol = Symbol('name');
 * const obj: Record<PrimitiveKey, number> = {
 *   4889576862: 87887511,
 *   userId: 9499963939,
 *   [nameSymbol]: 97503169,
 * };
 *
 * const keys = Object.keys(obj);
 *
 * console.assert(keys.length === 2); // ✔
 * ```
 */
export type PrimitiveKey = string | number | symbol;

/**
 * A `PropertyValue` is the type of value of a property at a specific path of
 * an object.
 *
 * The `PropertyValue` type is an alias for {@link PathValue}.
 *
 * @template T The type of object to get the dot-notated path property value type of.
 * @template K The dot-notated path of the property to get the value type of.
 *
 * @example Example usage of the `PropertyValue` type.
 * ```ts
 * import type { PropertyValue } from './type_aliases.ts';
 *
 * type User = {
 *   name: string;
 *   address: {
 *     city: string;
 *     country: string;
 *     zip: number;
 *   };
 * };
 *
 * const user: User = {
 *   name: 'Ifesinachi',
 *   address: {
 *     city: 'Pontiac',
 *     country: 'US',
 *     zip: 48342,
 *   },
 * };
 *
 * const city: PropertyValue<User, 'address.city'> = user.address.city;
 * const country: PropertyValue<User, 'address.country'> = user.address.country;
 * const zip: PropertyValue<User, 'address.zip'> = user.address.zip;
 *
 * console.assert(city === 'Pontiac'); // ✔
 * console.assert(country === 'US');   // ✔
 * console.assert(zip === 48342);      // ✔
 * ```
 */
export type PropertyValue<T extends AnyObject, K extends Paths<T>> = PathValue<
  T,
  K
>;

/**
 * A `Quadruple` is a tuple with four elements.
 *
 * The `Quadruple` type is an alias for a {@link Quaternary} tuple.
 *
 * @template T1 The type of the tuple's first element.
 * @template T2 The type of the tuple's second element.
 * @template T3 The type of the tuple's third element.
 * @template T4 The type of the tuple's fourth element.
 *
 * @example Example usage of the `Quadruple` type.
 * ```ts
 * import type { Quadruple, HexValue } from './type_aliases.ts';
 *
 * type Hex = Quadruple<HexValue>;
 *
 * function hexToNumber(hex: Hex): number {
 *   return parseInt(hex.join(''), 16);
 * }
 *
 * const num1 = hexToNumber([9, 6, 7, 'B']);
 * const num2 = hexToNumber(['A', 'C', 3, 'D']);
 *
 * console.assert(num1 === 38523); // ✔
 * console.assert(num2 === 44093); // ✔
 * ```
 *
 * @see {@link Quaternary}
 * @see {@link Tetradic}
 * @see {@link Empty}
 * @see {@link Single}
 * @see {@link Singleton}
 * @see {@link Couple}
 * @see {@link OrderedPair}
 * @see {@link Triple}
 * @see {@link Quintuple}
 * @see {@link Sextuple}
 * @see {@link Septuple}
 * @see {@link Octuple}
 */
export type Quadruple<T1, T2 = T1, T3 = T2, T4 = T3> = Quaternary<
  T1,
  T2,
  T3,
  T4
>;

/**
 * A `Quaternary` is a tuple with four elements.
 *
 * The `Quaternary` type describes a 4-tuple, or a four element tuple.
 *
 * @template T1 The type of the tuple's first element.
 * @template T2 The type of the tuple's second element.
 * @template T3 The type of the tuple's third element.
 * @template T4 The type of the tuple's fourth element.
 *
 * @example Example usage of the `Quaternary` type.
 * ```ts
 * import type { Quaternary, HexValue } from './type_aliases.ts';
 *
 * type Hex = Quaternary<HexValue>;
 *
 * function hexToNumber(hex: Hex): number {
 *   return parseInt(hex.join(''), 16);
 * }
 *
 * const num1 = hexToNumber([9, 6, 7, 'B']);
 * const num2 = hexToNumber(['A', 'C', 3, 'D']);
 *
 * console.assert(num1 === 38523); // ✔
 * console.assert(num2 === 44093); // ✔
 * ```
 *
 * @see {@link Quadruple}
 * @see {@link Tetradic}
 * @see {@link Nullary}
 * @see {@link Unary}
 * @see {@link Binary}
 * @see {@link Ternary}
 * @see {@link Quinary}
 * @see {@link Senary}
 * @see {@link Septenary}
 * @see {@link Octonary}
 */
export type Quaternary<T1, T2 = T1, T3 = T2, T4 = T3> = [T1, T2, T3, T4];

/**
 * A `Quinary` is a tuple with five elements.
 *
 * The `Quinary` type describes a 5-tuple, or a five element tuple.
 *
 * @template T1 The type of the tuple's first element.
 * @template T2 The type of the tuple's second element.
 * @template T3 The type of the tuple's third element.
 * @template T4 The type of the tuple's fourth element.
 * @template T5 The type of the tuple's fifth element.
 *
 * @example Example usage of the `Quinary` type.
 * ```ts
 * import type { Quinary } from './type_aliases.ts';
 *
 * type Address = Quinary<number, string, string, string, string>;
 *
 * function formatAddress(address: Address): string {
 *   const [num, suite, stDir, street, stType] = address;
 *
 *   return `${num} ${suite} ${stDir}. ${street} ${stType}.`;
 * }
 *
 * const address1 = formatAddress([123, 'Apt 2', 'N', 'Main', 'St']);
 * const address2 = formatAddress([456, 'Ste 3', 'S', 'Broad', 'Ave']);
 *
 * console.assert(address1 === '123 Apt 2 N. Main St.');   // ✔
 * console.assert(address2 === '456 Ste 3 S. Broad Ave.'); // ✔
 * ```
 *
 * @see {@link Quintuple}
 * @see {@link Nullary}
 * @see {@link Unary}
 * @see {@link Binary}
 * @see {@link Ternary}
 * @see {@link Quaternary}
 * @see {@link Senary}
 * @see {@link Septenary}
 * @see {@link Octonary}
 */
export type Quinary<T1, T2 = T1, T3 = T2, T4 = T3, T5 = T4> = [
  T1,
  T2,
  T3,
  T4,
  T5,
];

/**
 * A `Quintuple` is a tuple with five elements.
 *
 * The `Quintuple` type is an alias for a {@link Quinary} tuple.
 *
 * @template T1 The type of the tuple's first element.
 * @template T2 The type of the tuple's second element.
 * @template T3 The type of the tuple's third element.
 * @template T4 The type of the tuple's fourth element.
 * @template T5 The type of the tuple's fifth element.
 *
 * @example Example usage of the `Quintuple` type.
 * ```ts
 * import type { Quintuple } from './type_aliases.ts';
 *
 * type Address = Quintuple<number, string, string, string, string>;
 *
 * function formatAddress(address: Address): string {
 *   const [num, suite, stDir, street, stType] = address;
 *
 *   return `${num} ${suite} ${stDir}. ${street} ${stType}.`;
 * }
 *
 * const address1 = formatAddress([123, 'Apt 2', 'N', 'Main', 'St']);
 * const address2 = formatAddress([456, 'Ste 3', 'S', 'Broad', 'Ave']);
 *
 * console.assert(address1 === '123 Apt 2 N. Main St.');   // ✔
 * console.assert(address2 === '456 Ste 3 S. Broad Ave.'); // ✔
 * ```
 *
 * @see {@link Quinary}
 * @see {@link Empty}
 * @see {@link Single}
 * @see {@link Singleton}
 * @see {@link Couple}
 * @see {@link OrderedPair}
 * @see {@link Triple}
 * @see {@link Quadruple}
 * @see {@link Sextuple}
 * @see {@link Septuple}
 * @see {@link Octuple}
 */
export type Quintuple<T1, T2 = T1, T3 = T2, T4 = T3, T5 = T4> = Quinary<
  T1,
  T2,
  T3,
  T4,
  T5
>;

/**
 * A `ReducerFunc` is a function that accepts an accumulator and the value of
 * an included key/index on an included object/array for use in reducing
 * features.
 *
 * The `ReducerFunc` type is a callback where the indices/elements of an array,
 * or the keys/properties of an object, are able to be iterated upon, returning
 * an accumulated (reduced) result.
 *
 * @template A The type of value that is accumulated and returned for each iteration.
 * @template T The type of array or object of which the indices/element, or keys/values, are being iterated.
 * @template K The index/key that is currently being iterated over.
 * @template V The value type of the element/value that is currently being iterated over.
 *
 * @example Example usage of the `ReducerFunc` type for arrays.
 * ```ts
 * import type { ReducerFunc } from './type_aliases.ts';
 *
 * const numbers = [1, 2, 3, 4, 5];
 * const getSum: ReducerFunc<number, number[]> = (acc, value) => acc + value;
 * const sum = numbers.reduce(getSum, 0);
 *
 * console.assert(sum === 15); // ✔
 * ```
 *
 * @example Example usage of the `ReducerFunc` type for objects.
 * ```ts
 * import type { ReducerFunc } from './type_aliases.ts';
 *
 * const numbers: Record<string, number> = { a: 1, b: 2, c: 3, d: 4, e: 5 };
 * const getSum: ReducerFunc<number, typeof numbers> = (acc, value) =>
 *   acc + value;
 * const sum = Object.entries(numbers).reduce(
 *   (acc, [key, value]) =>
 *     getSum(acc, value, key, numbers),
 *   0,
 * );
 *
 * console.assert(sum === 15); // ✔
 * ```
 */
export type ReducerFunc<
  A,
  // deno-lint-ignore no-explicit-any
  T extends AnyObject | AnyArray<any>,
> // deno-lint-ignore no-explicit-any
 = T extends AnyArray<any>
  ? (acc: A, element: T[number], index: number, arr: T) => A
  : (acc: A, element: T[keyof T], key: keyof T, obj: T) => A;

/**
 * A `Register` is an object with required keys of a specific type.
 *
 * The `Register` type is similar to a `Record`, except that specifying the
 * keys type is optional.
 *
 * @template T The value type for entries in the register.
 * @template K The keys for entries in the register.
 *
 * @example Example usage of the `Register` type with default KeyOfAny keys.
 * ```ts
 * import type { Register } from './type_aliases.ts';
 *
 * const userExp: Register<number> = {
 *   Chihiro: 21,
 *   Waka: 52,
 *   Aemi: 39,
 *   Yuzu: 63,
 *   Chinami: 21,
 * };
 *
 * const sumOfExp = Object.values(userExp).reduce(
 *   (acc, value) => acc + value,
 *   0,
 * );
 *
 * console.assert(sumOfExp === 196); // ✔
 * ```
 *
 * @example Example usage of the `Register` type with specified keys.
 * ```ts
 * import type { Register } from './type_aliases.ts';
 *
 * type Users = 'Scheving' | 'Valdís' | 'Camilla' | 'Jón';
 *
 * const userExp: Register<number, Users> = {
 *   Scheving: 25,
 *   Valdís: 30,
 *   Camilla: 20,
 *   Jón: 45,
 * };
 *
 * const sumOfExp = Object.values(userExp).reduce(
 *   (acc, value) => acc + value,
 *   0,
 * );
 *
 * console.assert(sumOfExp === 120); // ✔
 * ```
 */
export type Register<T, K extends KeyOfAny = KeyOfAny> = { [key in K]: T };

/**
 * A `SafeRegister` is an object with optional keys of a specific type.
 *
 * The `Register` type is similar to a `Partial<Record>`, except that
 * specifying the keys type is optional.
 *
 * @template T The value type for entries in the register.
 * @template K The keys for entries in the register.
 *
 * @example Example usage of the `SafeRegister` type with default KeyOfAny keys.
 * ```ts
 * import type { SafeRegister } from './type_aliases.ts';
 *
 * const userExp: SafeRegister<number> = {
 *   Brenda: 30,
 *   Mahmud: 22,
 *   Juliët: 16,
 *   Dhiraj: 29,
 *   Neşe: 36,
 * };
 *
 * const sumOfExp = Object.values(userExp).reduce(
 *   (acc, value) => acc! + (value === undefined ? 0 : value),
 *   0,
 * );
 *
 * console.assert(sumOfExp === 133); // ✔
 * ```
 *
 * @example Example usage of the `SafeRegister` type with specified keys.
 * ```ts
 * import type { SafeRegister } from './type_aliases.ts';
 *
 * type Users = 'Eden' | 'Genet' | 'Anna' | 'Winta';
 *
 * const userExp: SafeRegister<number, Users> = {
 *   Eden: 15,
 *   Genet: 10,
 * };
 *
 * const sumOfExp = Object.values(userExp).reduce(
 *   (acc, value) => acc + value,
 *   0,
 * );
 *
 * console.assert(sumOfExp === 25); // ✔
 * ```
 */
export type SafeRegister<T, K extends KeyOfAny = KeyOfAny> = { [key in K]?: T };

/**
 * A `Scalar` is a value that is either `boolean`, a `bigint`, or a
 * {@link PrimitiveKey}.
 */
export type Scalar = boolean | bigint | PrimitiveKey;

/**
 * A `Senary` is a tuple with six elements.
 *
 * The `Senary` type describes a 6-tuple, or a six element tuple.
 *
 * @template T1 The type of the tuple's first element.
 * @template T2 The type of the tuple's second element.
 * @template T3 The type of the tuple's third element.
 * @template T4 The type of the tuple's fourth element.
 * @template T5 The type of the tuple's fifth element.
 * @template T6 The type of the tuple's sixth element.
 *
 * @example Example usage of the `Senary` type.
 * ```ts
 * import type { Senary } from './type_aliases.ts';
 *
 * type Address = Senary<number, string, string, string, string, number>;
 *
 * function formatAddress(address: Address): string {
 *   const [num, suite, stDir, street, stType, zip] = address;
 *
 *   return `${num} ${suite} ${stDir}. ${street} ${stType}. ${zip}`;
 * }
 *
 * const address1 = formatAddress([123, 'Apt 2', 'N', 'Main', 'St', 90602]);
 * const address2 = formatAddress([
 *   456,
 *   'Ste 3',
 *   'S',
 *   'Broad',
 *   'Ave',
 *   44142,
 * ]);
 *
 * console.assert(address1 === '123 Apt 2 N. Main St. 90602');   // ✔
 * console.assert(address2 === '456 Ste 3 S. Broad Ave. 44142'); // ✔
 * ```
 *
 * @see {@link Sextuple}
 * @see {@link Nullary}
 * @see {@link Unary}
 * @see {@link Binary}
 * @see {@link Ternary}
 * @see {@link Quaternary}
 * @see {@link Quinary}
 * @see {@link Septenary}
 * @see {@link Octonary}
 */
export type Senary<T1, T2 = T1, T3 = T2, T4 = T3, T5 = T4, T6 = T5> = [
  T1,
  T2,
  T3,
  T4,
  T5,
  T6,
];

/**
 * A `Septenary` is a tuple with seven elements.
 *
 * The `Septenary` type describes a 7-tuple, or a seven element tuple.
 *
 * @template T1 The type of the tuple's first element.
 * @template T2 The type of the tuple's second element.
 * @template T3 The type of the tuple's third element.
 * @template T4 The type of the tuple's fourth element.
 * @template T5 The type of the tuple's fifth element.
 * @template T6 The type of the tuple's sixth element.
 * @template T7 The type of the tuple's seventh element.
 *
 * @example Example usage of the `Septenary` type.
 * ```ts
 * import type { Septenary } from './type_aliases.ts';
 *
 * type Address = Septenary<number, string>;
 *
 * function formatAddress(address: Address): string {
 *   const [num, suite, stDir, street, stType, city, state] = address;
 *
 *   return `${num} ${suite} ${stDir}. ${street} ${stType}. ${city}, ${state}`;
 * }
 *
 * const address1 = formatAddress([
 *   123,
 *   'Apt 2',
 *   'N',
 *   'Main',
 *   'St',
 *   'South Bend',
 *   'IN',
 * ]);
 * const address2 = formatAddress([
 *   456,
 *   'Ste 3',
 *   'S',
 *   'Broad',
 *   'Ave',
 *   'Syracuse',
 *   'NY',
 * ]);
 *
 * console.assert(address1 === '123 Apt 2 N. Main St. South Bend, IN'); // ✔
 * console.assert(address2 === '456 Ste 3 S. Broad Ave. Syracuse, NY'); // ✔
 * ```
 *
 * @see {@link Septuple}
 * @see {@link Nullary}
 * @see {@link Unary}
 * @see {@link Binary}
 * @see {@link Ternary}
 * @see {@link Quaternary}
 * @see {@link Quinary}
 * @see {@link Senary}
 * @see {@link Octonary}
 */
export type Septenary<
  T1,
  T2 = T1,
  T3 = T2,
  T4 = T3,
  T5 = T4,
  T6 = T5,
  T7 = T6,
> = [T1, T2, T3, T4, T5, T6, T7];

/**
 * A `Septuple` is a tuple with seven elements.
 *
 * The `Septuple` type is an alias for a {@link Septenary} tuple.
 *
 * @template T1 The type of the tuple's first element.
 * @template T2 The type of the tuple's second element.
 * @template T3 The type of the tuple's third element.
 * @template T4 The type of the tuple's fourth element.
 * @template T5 The type of the tuple's fifth element.
 * @template T6 The type of the tuple's sixth element.
 * @template T7 The type of the tuple's seventh element.
 *
 * @example Example usage of the `Septuple` type.
 * ```ts
 * import type { Septuple } from './type_aliases.ts';
 *
 * type Address = Septuple<number, string>;
 *
 * function formatAddress(address: Address): string {
 *   const [num, suite, stDir, street, stType, city, state] = address;
 *
 *   return `${num} ${suite} ${stDir}. ${street} ${stType}. ${city}, ${state}`;
 * }
 *
 * const address1 = formatAddress([
 *   123,
 *   'Apt 2',
 *   'N',
 *   'Main',
 *   'St',
 *   'South Bend',
 *   'IN',
 * ]);
 * const address2 = formatAddress([
 *   456,
 *   'Ste 3',
 *   'S',
 *   'Broad',
 *   'Ave',
 *   'Syracuse',
 *   'NY',
 * ]);
 *
 * console.assert(address1 === '123 Apt 2 N. Main St. South Bend, IN'); // ✔
 * console.assert(address2 === '456 Ste 3 S. Broad Ave. Syracuse, NY'); // ✔
 * ```
 *
 * @see {@link Septenary}
 * @see {@link Empty}
 * @see {@link Single}
 * @see {@link Singleton}
 * @see {@link Couple}
 * @see {@link OrderedPair}
 * @see {@link Triple}
 * @see {@link Quadruple}
 * @see {@link Quintuple}
 * @see {@link Sextuple}
 * @see {@link Octuple}
 */
export type Septuple<T1, T2 = T1, T3 = T2, T4 = T3, T5 = T4, T6 = T5, T7 = T6> =
  Septenary<T1, T2, T3, T4, T5, T6, T7>;

/**
 * A `Sextuple` is a tuple with six elements.
 *
 * The `Sextuple` type is an alias for a {@link Senary} tuple.
 *
 * @template T1 The type of the tuple's first element.
 * @template T2 The type of the tuple's second element.
 * @template T3 The type of the tuple's third element.
 * @template T4 The type of the tuple's fourth element.
 * @template T5 The type of the tuple's fifth element.
 * @template T6 The type of the tuple's sixth element.
 *
 * @example Example usage of the `Sextuple` type.
 * ```ts
 * import type { Sextuple } from './type_aliases.ts';
 *
 * type Address = Sextuple<number, string, string, string, string, number>;
 *
 * function formatAddress(address: Address): string {
 *   const [num, suite, stDir, street, stType, zip] = address;
 *
 *   return `${num} ${suite} ${stDir}. ${street} ${stType}. ${zip}`;
 * }
 *
 * const address1 = formatAddress([123, 'Apt 2', 'N', 'Main', 'St', 90602]);
 * const address2 = formatAddress([
 *   456,
 *   'Ste 3',
 *   'S',
 *   'Broad',
 *   'Ave',
 *   44142,
 * ]);
 *
 * console.assert(address1 === '123 Apt 2 N. Main St. 90602');   // ✔
 * console.assert(address2 === '456 Ste 3 S. Broad Ave. 44142'); // ✔
 * ```
 *
 * @see {@link Senary}
 * @see {@link Empty}
 * @see {@link Single}
 * @see {@link Singleton}
 * @see {@link Couple}
 * @see {@link OrderedPair}
 * @see {@link Triple}
 * @see {@link Quadruple}
 * @see {@link Quintuple}
 * @see {@link Septuple}
 * @see {@link Octuple}
 */
export type Sextuple<T1, T2 = T1, T3 = T2, T4 = T3, T5 = T4, T6 = T5> = Senary<
  T1,
  T2,
  T3,
  T4,
  T5,
  T6
>;

/**
 * A `Single` is a tuple with one element.
 *
 * The `Single` type is an alias for a {@link Unary} tuple.
 *
 * @template T The type of the tuple's first, and only, element.
 *
 * @example
 * ```ts
 * import type { Empty, Single, Triple } from './type_aliases.ts';
 *
 * type Actions =
 * 	 | 'add'
 * 	 | 'sub'
 * 	 | 'div'
 * 	 | 'mx'
 * 	 | 'pow'
 * 	 | 'mod';
 *
 * type ItemTypes =
 * 	 | Empty
 * 	 | Single<number>
 * 	 | Triple<number, number, Actions>;
 *
 * function doMath(items: ItemTypes): number {
 * 	 if (!items.length) return 0;
 * 	 if (items.length === 1) return items[0];
 * 
 * 	 const [op1, op2, op] = items;
 * 
 * 	 if (op === 'add') return op1 + op2;
 * 	 if (op === 'sub') return op1 - op2;
 * 	 if (op === 'div') return op1 / op2;
 * 	 if (op === 'mx') return op1 * op2;
 * 	 if (op === 'pow') return Math.pow(op1, op2);
 * 
 * 	 return op1 % op2;
 * }
 *
 * console.assert(doMath([]) === 0);
 * console.assert(doMath([25]) === 25);
 * console.assert(doMath([2, 4, 'pow']) === 16);
 * console.assert(doMath([10, 5, 'div']) === 2);
 * ```
 *
 * @see {@link Unary}
 * @see {@link Monardic}
 * @see {@link Empty}
 * @see {@link Singleton}
 * @see {@link Couple}
 * @see {@link OrderedPair}
 * @see {@link Triple}
 * @see {@link Quadruple}
 * @see {@link Quintuple}
 * @see {@link Sextuple}
 * @see {@link Septuple}
 * @see {@link Octuple}
 */
export type Single<T> = Unary<T>;

/**
 * A `Singleton` is a tuple with one element.
 *
 * The `Singleton` type is an alias for a {@link Unary} tuple.
 *
 * @template T The type of the tuple's first, and only, element.
 *
 * @example
 * ```ts
 * import type { Empty, Singleton, Triple } from './type_aliases.ts';
 *
 * type Actions =
 * 	 | 'add'
 * 	 | 'sub'
 * 	 | 'div'
 * 	 | 'mx'
 * 	 | 'pow'
 * 	 | 'mod';
 *
 * type ItemTypes =
 * 	 | Empty
 * 	 | Singleton<number>
 * 	 | Triple<number, number, Actions>;
 *
 * function doMath(items: ItemTypes): number {
 * 	 if (!items.length) return 0;
 * 	 if (items.length === 1) return items[0];
 * 
 * 	 const [op1, op2, op] = items;
 * 
 * 	 if (op === 'add') return op1 + op2;
 * 	 if (op === 'sub') return op1 - op2;
 * 	 if (op === 'div') return op1 / op2;
 * 	 if (op === 'mx') return op1 * op2;
 * 	 if (op === 'pow') return Math.pow(op1, op2);
 * 
 * 	 return op1 % op2;
 * }
 *
 * console.assert(doMath([]) === 0);
 * console.assert(doMath([25]) === 25);
 * console.assert(doMath([2, 4, 'pow']) === 16);
 * console.assert(doMath([10, 5, 'div']) === 2);
 * ```
 *
 * @see {@link Unary}
 * @see {@link Monardic}
 * @see {@link Empty}
 * @see {@link Single}
 * @see {@link Couple}
 * @see {@link OrderedPair}
 * @see {@link Triple}
 * @see {@link Quadruple}
 * @see {@link Quintuple}
 * @see {@link Sextuple}
 * @see {@link Septuple}
 * @see {@link Octuple}
 */
export type Singleton<T> = Unary<T>;

/**
 * A `SystemArchitecture` is a string representing an operating system
 * architecture.
 */
export type SystemArchitecture = 'x86_64' | 'aarch64';

/**
 * A `SystemOS` is a string representing an operating system.
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
 * A `Ternary` is a tuple with three elements.
 *
 * The `Ternary` type describes a 3-tuple, or a three element tuple.
 *
 * @template T1 The type of the tuple's first element.
 * @template T2 The type of the tuple's second element.
 * @template T3 The type of the tuple's third element.
 *
 * @example Example usage of the `Ternary` type.
 * ```ts
 * import type { Ternary, Nullary, Unary } from './type_aliases.ts';
 *
 * type Actions =
 * 	 | 'add'
 * 	 | 'sub'
 * 	 | 'div'
 * 	 | 'mx'
 * 	 | 'pow'
 * 	 | 'mod';
 *
 * type ItemTypes =
 * 	 | Nullary
 * 	 | Unary<number>
 * 	 | Ternary<number, number, Actions>;
 *
 * function doMath(items: ItemTypes): number {
 * 	 if (!items.length) return 0;
 * 	 if (items.length === 1) return items[0];
 *
 * 	 const [op1, op2, op] = items;
 *
 * 	 if (op === 'add') return op1 + op2;
 * 	 if (op === 'sub') return op1 - op2;
 * 	 if (op === 'div') return op1 / op2;
 * 	 if (op === 'mx') return op1 * op2;
 * 	 if (op === 'pow') return Math.pow(op1, op2);
 *
 * 	 return op1 % op2;
 * }
 *
 * console.assert(doMath([]) === 0);
 * console.assert(doMath([25]) === 25);
 * console.assert(doMath([2, 4, 'pow']) === 16);
 * console.assert(doMath([10, 5, 'div']) === 2);
 * ```
 *
 * @see {@link Triple}
 * @see {@link Triadic}
 * @see {@link Nullary}
 * @see {@link Unary}
 * @see {@link Binary}
 * @see {@link Quaternary}
 * @see {@link Quinary}
 * @see {@link Senary}
 * @see {@link Septenary}
 * @see {@link Octonary}
 */
export type Ternary<T1, T2 = T1, T3 = T2> = [T1, T2, T3];

/**
 * A `Tetradic` is a tuple with four elements.
 *
 * The `Tetradic` type is an alias for a {@link Quaternary} tuple.
 *
 * @template T1 The type of the tuple's first element.
 * @template T2 The type of the tuple's second element.
 * @template T3 The type of the tuple's third element.
 * @template T4 The type of the tuple's fourth element.
 *
 * @example Example usage of the `Tetradic` type.
 * ```ts
 * import type { Tetradic, HexValue } from './type_aliases.ts';
 *
 * type Hex = Tetradic<HexValue>;
 *
 * function hexToNumber(hex: Hex): number {
 *   return parseInt(hex.join(''), 16);
 * }
 *
 * const num1 = hexToNumber([9, 6, 7, 'B']);
 * const num2 = hexToNumber(['A', 'C', 3, 'D']);
 *
 * console.assert(num1 === 38523); // ✔
 * console.assert(num2 === 44093); // ✔
 * ```
 *
 * @see {@link Quaternary}
 * @see {@link Quadruple}
 * @see {@link Niladic}
 * @see {@link Monadic}
 * @see {@link Dyadic}
 * @see {@link Triadic}
 */
export type Tetradic<T1, T2 = T1, T3 = T2, T4 = T3> = Quaternary<
  T1,
  T2,
  T3,
  T4
>;

/**
 * A `Triadic` is a tuple with three elements.
 *
 * The `Triadic` type is an alias for a {@link Ternary} tuple.
 *
 * @template T1 The type of the tuple's first element.
 * @template T2 The type of the tuple's second element.
 * @template T3 The type of the tuple's third element.
 *
 * @example Example usage of the `Triadic` type.
 * ```ts
 * import type { Triadic, Niladic, Monadic } from './type_aliases.ts';
 *
 * type Actions =
 * 	 | 'add'
 * 	 | 'sub'
 * 	 | 'div'
 * 	 | 'mx'
 * 	 | 'pow'
 * 	 | 'mod';
 *
 * type ItemTypes =
 * 	 | Niladic
 * 	 | Monadic<number>
 * 	 | Triadic<number, number, Actions>;
 *
 * function doMath(items: ItemTypes): number {
 * 	 if (!items.length) return 0;
 * 	 if (items.length === 1) return items[0];
 *
 * 	 const [op1, op2, op] = items;
 *
 * 	 if (op === 'add') return op1 + op2;
 * 	 if (op === 'sub') return op1 - op2;
 * 	 if (op === 'div') return op1 / op2;
 * 	 if (op === 'mx') return op1 * op2;
 * 	 if (op === 'pow') return Math.pow(op1, op2);
 *
 * 	 return op1 % op2;
 * }
 *
 * console.assert(doMath([]) === 0);
 * console.assert(doMath([25]) === 25);
 * console.assert(doMath([2, 4, 'pow']) === 16);
 * console.assert(doMath([10, 5, 'div']) === 2);
 * ```
 *
 * @see {@link Ternary}
 * @see {@link Triple}
 * @see {@link Niladic}
 * @see {@link Monadic}
 * @see {@link Dyadic}
 * @see {@link Tetradic}
 */
export type Triadic<T1, T2 = T1, T3 = T2> = Ternary<T1, T2, T3>;

/**
 * A `Triple` is a tuple with three elements.
 *
 * The `Triple` type is an alias for a {@link Ternary} tuple.
 *
 * @template T1 The type of the tuple's first element.
 * @template T2 The type of the tuple's second element.
 * @template T3 The type of the tuple's third element.
 *
 * @example Example usage of the `Triple` type.
 * ```ts
 * import type { Triple, Empty, Single } from './type_aliases.ts';
 *
 * type Actions =
 * 	 | 'add'
 * 	 | 'sub'
 * 	 | 'div'
 * 	 | 'mx'
 * 	 | 'pow'
 * 	 | 'mod';
 *
 * type ItemTypes =
 * 	 | Empty
 * 	 | Single<number>
 * 	 | Triple<number, number, Actions>;
 *
 * function doMath(items: ItemTypes): number {
 * 	 if (!items.length) return 0;
 * 	 if (items.length === 1) return items[0];
 *
 * 	 const [op1, op2, op] = items;
 *
 * 	 if (op === 'add') return op1 + op2;
 * 	 if (op === 'sub') return op1 - op2;
 * 	 if (op === 'div') return op1 / op2;
 * 	 if (op === 'mx') return op1 * op2;
 * 	 if (op === 'pow') return Math.pow(op1, op2);
 *
 * 	 return op1 % op2;
 * }
 *
 * console.assert(doMath([]) === 0);
 * console.assert(doMath([25]) === 25);
 * console.assert(doMath([2, 4, 'pow']) === 16);
 * console.assert(doMath([10, 5, 'div']) === 2);
 * ```
 *
 * @see {@link Ternary}
 * @see {@link Triadic}
 * @see {@link Empty}
 * @see {@link Single}
 * @see {@link Singleton}
 * @see {@link Couple}
 * @see {@link OrderedPair}
 * @see {@link Quadruple}
 * @see {@link Quintuple}
 * @see {@link Sextuple}
 * @see {@link Septuple}
 * @see {@link Octuple}
 */
export type Triple<T1, T2 = T1, T3 = T2> = Ternary<T1, T2, T3>;

/**
 * An `Unary` is a tuple with one element.
 *
 * The `Unary` type describes a 1-tuple, or a single element tuple.
 *
 * @template T The type of the tuple's first, and only, element.
 *
 * @example
 * ```ts
 * import type { Nullary, Unary, Ternary } from './type_aliases.ts';
 *
 * type Actions =
 * 	 | 'add'
 * 	 | 'sub'
 * 	 | 'div'
 * 	 | 'mx'
 * 	 | 'pow'
 * 	 | 'mod';
 *
 * type ItemTypes =
 * 	 | Nullary
 * 	 | Unary<number>
 * 	 | Ternary<number, number, Actions>;
 *
 * function doMath(items: ItemTypes): number {
 * 	 if (!items.length) return 0;
 * 	 if (items.length === 1) return items[0];
 * 
 * 	 const [op1, op2, op] = items;
 * 
 * 	 if (op === 'add') return op1 + op2;
 * 	 if (op === 'sub') return op1 - op2;
 * 	 if (op === 'div') return op1 / op2;
 * 	 if (op === 'mx') return op1 * op2;
 * 	 if (op === 'pow') return Math.pow(op1, op2);
 * 
 * 	 return op1 % op2;
 * }
 *
 * console.assert(doMath([]) === 0);
 * console.assert(doMath([25]) === 25);
 * console.assert(doMath([2, 4, 'pow']) === 16);
 * console.assert(doMath([10, 5, 'div']) === 2);
 * ```
 *
 * @see {@link Single}
 * @see {@link Singleton}
 * @see {@link Monadic}
 * @see {@link Nullary}
 * @see {@link Binary}
 * @see {@link Ternary}
 * @see {@link Quaternary}
 * @see {@link Quinary}
 * @see {@link Senary}
 * @see {@link Septenary}
 * @see {@link Octonary}
 */
export type Unary<T> = [T];

/**
 * Describes an action that accepts no arguments.
 */
type NiladicAction = () => void;

/**
 * Describes an action that accepts one argument.
 *
 * @template T1 The type of the first argument.
 */
type MonadicAction1<T1> = (arg1: T1) => void;

/**
 * Describes an action that accepts two arguments.
 *
 * @template T1 The type of the first argument.
 * @template T2 The type of the second argument.
 */
type DyadicAction2<T1, T2> = (arg1: T1, arg2: T2) => void;

/**
 * Describes an action that accepts options.
 *
 * @template O The type of the options.
 */
type NiladicOptionAction<O extends AnyObject> = (opts?: O) => void;

/**
 * Describes an action that accepts one argument and options.
 *
 * @template T1 The type of the first argument.
 * @template O The type of the options.
 */
type MonadicOptionAction<T1, O extends AnyObject> = (
  arg1: T1,
  opts?: O,
) => void;

/**
 * Describes an action that accepts two arguments and options.
 *
 * @template T1 The type of the first argument.
 * @template T2 The type of the second argument.
 * @template O The type of the options.
 */
type DyadicOptionAction<T1, T2, O extends AnyObject> = (
  arg1: T1,
  arg2: T2,
  opts?: O,
) => void;

/**
 * Describes a function that accepts no arguments and returns a value.
 *
 * @template R The type of the return value.
 */
type NiladicFunc<R> = () => R;

/**
 * Describes a function that accepts one argument and returns a value.
 *
 * @template T1 The type of the first argument.
 * @template R The type of the return value.
 */
type MonadicFunc1<T1, R> = (arg1: T1) => R;

/**
 * Describes a function that accepts two arguments and returns a value.
 *
 * @template T1 The type of the first argument.
 * @template T2 The type of the second argument.
 * @template R The type of the return value.
 */
type DyadicFunc2<T1, T2, R> = (arg1: T1, arg2: T2) => R;

/**
 * Describes a function that accepts options and returns a value.
 *
 * @template O The type of the options.
 * @template R The type of the return value.
 */
type NiladicOptionFunc<O extends AnyObject, R> = (opts?: O) => R;

/**
 * Describes a function that accepts one argument and options and returns a value.
 *
 * @template T1 The type of the first argument.
 * @template O The type of the options.
 * @template R The type of the return value.
 */
type MonadicOptionFunc<T1, O extends AnyObject, R> = (arg1: T1, opts?: O) => R;

/**
 * Describes a function that accepts two arguments and options and returns a value.
 *
 * @template T1 The type of the first argument.
 * @template T2 The type of the second argument.
 * @template O The type of the options.
 * @template R The type of the return value.
 */
type DyadicOptionFunc<T1, T2, O extends AnyObject, R> = (
  arg1: T1,
  arg2: T2,
  opts?: O,
) => R;

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
