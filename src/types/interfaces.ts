/**
 * @copyright 2020-2024 integereleven. All rights reserved. MIT license.
 * @file Interfaces for the module. For type aliases, see ./type_aliases.ts.
 */

import { ComparisonResult } from './enums.ts';

import type { AnyObject, Comparer, Converter } from './type_aliases.ts';

/**
 * An `IHashable` is an interface that provides a method for retrieving a
 * non-cryptographic hash corresponding to the value of the implementing type.
 *
 * The `IHashable` interface defines the {@link IHashable.getHashCode} method, which is used to
 * generate a numeric value corresponding to the implementing type's value.
 * This number (hash) is not intended to be cryptographically secure, and
 * should not be used as such.
 *
 * > For the purpose of uniqueness, it is recommended to use at least one
 * > instance property for input in the resulting hash. Hash codes should not
 * > use constants or static property values in hash generation.
 *
 * @example Example usage of the `IHashable` interface.
 * ```ts
 * import type { IHashable } from './interfaces.ts';
 *
 * class User implements IHashable {
 *   constructor(private name: string, private age: number) {}
 *
 *   #createHash(): number {
 *     const string = `${this.name}:${this.age}`;
 *
 *     return string.split('').reduce((acc, char) =>
 *       ((acc << 5) - acc + char.charCodeAt(0)) | 0
 *     , 0);
 *   }
 *
 *   getHashCode(): number {
 *     return this.#createHash();
 *   }
 * }
 *
 * const hashable = new User('Sidor', 80);
 *
 * console.assert(hashable.getHashCode() === 291855361); // ✔
 * ```
 */
export interface IHashable {
  /**
   * Returns the hash for this instance.
   */
  getHashCode(): number;
}

/**
 * An `IHelpful` is an interface that provides a property containing the
 * location of a help file for the implementing type.
 *
 * The `IHelpful` interface defines the {@link helpUrl} property, which
 * contains the location of a help file containing information about the
 * implementing type.
 *
 * Though the interface permits implementations allowing updating of the
 * {@link helpUrl} property, it is recommended to be a getter property
 * effectively returning a computed read-only value. It is also recommended the
 * value of the {@link helpUrl} property be based only on the initial state of
 * the implementing type. The value of the {@link helpUrl} property should not
 * change after instantiation and should not be affected by changes to
 * properties on the instance.
 *
 * @example Example usage of the `IHelpful` interface.
 * ```ts
 * import type { IHelpful } from './interfaces.ts';
 *
 * class ServiceDesk implements IHelpful {
 *   helpUrl: string = 'https://example.com/help/';
 * }
 *
 * const helpful = new ServiceDesk();
 *
 * console.assert(helpful.helpUrl === 'https://example.com/help/'); // ✔
 * ```
 *
 * @example Example usage of the `IHelpful` interface with a computed property.
 * ```ts
 * import type { IHelpful } from './interfaces.ts';
 *
 * class ServiceDesk implements IHelpful {
 *   constructor(private name: string) {}
 *
 *   get helpUrl(): string {
 *     return `https://example.com/help/${this.name}`;
 *   }
 * }
 *
 * const helpful = new ServiceDesk('ProductSupport');
 *
 * console.assert(helpful.helpUrl === 'https://example.com/help/ProductSupport'); // ✔
 * ```
 */
export interface IHelpful {
  /**
   * The help file associated with this instance.
   */
  helpUrl: string;
}

/**
 * An `IVersionDescriptor` is an interface describing a structured SemVer
 * compatible version.
 *
 * The `IVersionDescriptor` interface provides properties describing the
 * identifiers of a SemVer version.
 *
 * @example Example usage of the `IVersionDescriptor` interface.
 * ```ts
 * import type { IVersionDescriptor } from './interfaces.ts';
 *
 * const version: IVersionDescriptor = {
 *   major: 1,
 *   minor: 2,
 *   patch: 3,
 * };
 *
 * console.assert(version.major === 1); // ✔
 * console.assert(version.minor === 2); // ✔
 * console.assert(version.patch === 3); // ✔
 * ```
 *
 * @example Example usage of the `IVersionDescriptor` interface with the `preRelease` property.
 * ```ts
 * import type { IVersionDescriptor } from './interfaces.ts';
 *
 * const version1: IVersionDescriptor = {
 *   major: 1,
 *   minor: 2,
 *   patch: 3,
 *   preRelease: 'alpha',
 * };
 *
 * const version2: IVersionDescriptor = {
 *   major: 1,
 *   minor: 2,
 *   patch: 3,
 * };
 *
 * console.assert(version1.major === 1);              // ✔
 * console.assert(version1.minor === 2);              // ✔
 * console.assert(version1.patch === 3);              // ✔
 * console.assert(version1.preRelease === 'alpha');   // ✔
 *
 * console.assert(version2.major === 1);              // ✔
 * console.assert(version2.minor === 2);              // ✔
 * console.assert(version2.patch === 3);              // ✔
 * console.assert(version2.preRelease === undefined); // ✔
 * ```
 *
 * @example Example usage of the `IVersionDescriptor` interface with the `build` property.
 * ```ts
 * import type { IVersionDescriptor } from './interfaces.ts';
 *
 * const version1: IVersionDescriptor = {
 *   major: 1,
 *   minor: 2,
 *   patch: 3,
 *   build: 'build-1',
 * };
 *
 * const version2: IVersionDescriptor = {
 *   major: 1,
 *   minor: 2,
 *   patch: 3,
 * };
 *
 * console.assert(version1.major === 1);              // ✔
 * console.assert(version1.minor === 2);              // ✔
 * console.assert(version1.patch === 3);              // ✔
 * console.assert(version2.preRelease === undefined); // ✔
 * console.assert(version1.build === 'build-1');      // ✔
 *
 * console.assert(version2.major === 1);              // ✔
 * console.assert(version2.minor === 2);              // ✔
 * console.assert(version2.patch === 3);              // ✔
 * console.assert(version2.preRelease === undefined); // ✔
 * console.assert(version2.build === undefined);      // ✔
 * ```
 *
 * @see https://semver.org
 */
export interface IVersionDescriptor {
  /**
   * The major version identifier of the version.
   */
  major: number;

  /**
   * The minor version identifier of the version.
   */
  minor: number;

  /**
   * The patch version identifier of the version.
   */
  patch: number;

  /**
   * The pre-release version identifier of the version.
   */
  preRelease?: string;

  /**
   * The build metadata of the version.
   */
  build?: string;
}

/**
 * A `TBase` is an interface providing implementing types base methods to
 * convert their value to more specific types.
 *
 * The `TBase` interface is used across most classes in the kz modules as a
 * base for getting the value of an implementing type, as well as the string
 * and numerical representation of its value. It provides the native methods
 * of {@link [Symbol.toPrimitive]}, `{@link toString}, and {@link valueOf}.
 *
 * @template T The type of the implementing type's value.
 *
 * @example Example usage of the `TBase` interface.
 * ```ts
 * import type { TBase } from './interfaces.ts';
 *
 * class Currency implements TBase<number> {
 *   constructor(private value: number, private sym: string) {}
 *
 *   [Symbol.toPrimitive](hint: string): string | number {
 *     if (hint === 'number') return this.valueOf();
 *
 *     return this.toString();
 *   }
 *
 *   toString(): string {
 *     return `${this.value} ${this.sym}`;
 *   }
 *
 *   valueOf(): number {
 *     return this.value;
 *   }
 * }
 *
 * const value = new Currency(42, 'USD');
 *
 * console.assert(value[Symbol.toPrimitive]('string') === '42 USD'); // ✔
 * console.assert(value[Symbol.toPrimitive]('number') === 42);       // ✔
 * console.assert(value.toString() === '42 USD');                    // ✔
 * console.assert(value.valueOf() === 42);
 * ```
 */
export interface TBase<T> {
  /**
   * Returns the string or numerical representation of the implementing type's
   * value.
   *
   * Returns a `string` if `hint` is `"string"`, a `number` if `hint` is
   * `"number"`. Handling of the `"default"` `hint` is left up to
   * implementers.
   *
   * @param hint A hint for the expected value type to return.
   */
  [Symbol.toPrimitive](hint: string): string | number;

  /**
   * Returns a string representation of the implementing type's value.
   */
  toString(): string;

  /**
   * Returns the value of the implementing type.
   */
  valueOf(): T;
}

/**
 * A `TCloneable` is an interface providing implementing types a method to
 * clone themselves.
 *
 * The `TCloneable` interface provides the {@link clone} method which clones
 * the implementing type into a new instance of the same type and value.
 *
 * @template T The implementing type. Provided for utility.
 *
 * @example Example usage of the `TCloneable` interface.
 * ```ts
 * import type { TCloneable } from './interfaces.ts';
 *
 * class User implements TCloneable<User> {
 *   constructor(public name: string, public age: number) {}
 *
 *   clone(): User {
 *     return new User(this.name, this.age);
 *   }
 * }
 *
 * const user = new User('Sidor', 80);
 * const clone = user.clone();
 *
 * console.assert(clone.name === 'Sidor'); // ✔
 * console.assert(clone.age === 80);       // ✔
 * ```
 */
export interface TCloneable<T> {
  /**
   * Returns a new instance of the same type with the same value.
   */
  clone(): T;
}

/**
 * A `TComparable` is an interface providing implementing types a method to
 * compare themselves to an instance of a common type.
 *
 * The `TComparable` interface provides the {@link compareTo} method, which
 * compares an implementing type to a value of an overlapping type.
 *
 * @template T The overlapping type to compare.
 *
 * @example Example usage of the `TComparable` interface.
 * ```ts
 * import { ComparisonResult } from './enums.ts';
 * import type { TComparable } from './interfaces.ts';
 *
 * class User implements TComparable<User> {
 *   constructor(public name: string, public age: number) {}
 *
 *   compareTo(other: User, reverse = false): ComparisonResult {
 *     const [a, b] = reverse ? [other, this] : [this, other];
 *
 *     if (a.name === b.name) {
 *       if (a.age === b.age) return ComparisonResult.Equal;
 *
 *       return a.age > b.age
 * 	      ? ComparisonResult.Greater
 * 	      : ComparisonResult.Lesser;
 *     }
 *
 *     return a.name > b.name
 * 	    ? ComparisonResult.Greater
 * 	    : ComparisonResult.Lesser;
 *   }
 * }
 *
 * const user1 = new User('Fatima', 80);
 * const user2 = new User('Panteleimon', 80);
 * const user3 = new User('Panteleimon', 66);
 * const user4 = new User('Fatima', 80);
 *
 * console.assert(user1.compareTo(user2) === ComparisonResult.Lesser);       // ✔
 * console.assert(user2.compareTo(user1) === ComparisonResult.Greater);      // ✔
 * console.assert(user2.compareTo(user3, true) === ComparisonResult.Lesser); // ✔
 * console.assert(user4.compareTo(user1) === ComparisonResult.Equal);        // ✔
 * ```
 */
export interface TComparable<T> {
  /**
   * Compares the implementing type to an instance of an overlapping type,
   * optionally specifying whether to reverse the comparison.
   *
   * @param other The value to compare the implementing type to.
   * @param reverse Whether to reverse the comparison. Defaults to false.
   */
  compareTo(other: T, reverse?: boolean): ComparisonResult;
}

/**
 * A `TComparer` is an interface providing a method to compare two instances of
 * a common type.
 *
 * The `TComparer` interface provides the {@link compare} method for comparing
 * two values of the same type.
 *
 * Comparisons are treated in terms of how `a` compares to `b`. For example, if
 * `a = 5` and `b = 6` and comparing `a` to `b` would result in `a < b`, or a
 * {@link ComparisonResult} or {@link ComparisonResult.Lesser}.
 *
 * Specifying `true` in the reverse argument should result in the comparison
 * value switching sides, so while we are still comparing `a = 5` and `b = 6`,
 * we are now comparing `b` to `a`, such that `b > a` resulting in a
 * {@link ComparisonResult} of {@link ComparisonResult.Greater}.
 *
 * @template T The type of the values to compare.
 *
 * @example Example usage of the `TComparer` interface.
 * ```ts
 * import { ComparisonResult } from './enums.ts';
 * import type { Comparer } from './type_aliases.ts';
 * import type { TComparer } from './interfaces.ts';
 *
 * type User = {
 *   name: string;
 *   age: number;
 * }
 *
 * const comparer: TComparer<User> = {
 *   compare(a: User, b: User, reverse = false): ComparisonResult {
 *     if (reverse) [a, b] = [b, a];
 *
 *     if (a.name === b.name) {
 *       if (a.age === b.age) return ComparisonResult.Equal;
 *
 *       return a.age > b.age
 * 	      ? ComparisonResult.Greater
 * 	      : ComparisonResult.Lesser;
 *     }
 *
 *     return a.name > b.name
 * 	    ? ComparisonResult.Greater
 * 		   : ComparisonResult.Lesser;
 *   }
 * }
 *
 * const user1: User = { name: 'Savely', age: 45 };
 * const user2: User = { name: 'Nestor', age: 45 };
 * const user3: User = { name: 'Nestor', age: 25 };
 * const user4: User = { name: 'Savely', age: 45 };
 *
 * console.assert(comparer.compare(user2, user1) === ComparisonResult.Lesser);       // ✔
 * console.assert(comparer.compare(user1, user2) === ComparisonResult.Greater);      // ✔
 * console.assert(comparer.compare(user2, user3, true) === ComparisonResult.Lesser); // ✔
 * console.assert(comparer.compare(user1, user4) === ComparisonResult.Equal);        // ✔
 * ```
 */
export interface TComparer<T> {
  /**
   * Compares two value of the same type, optionally reversing the comparison.
   *
   * @param a The first value to compare.
   * @param b The second value to compare.
   * @param reverse Whether to reverse the comparison. Defaults to `false`.
   */
  compare(a: T, b: T, reverse?: boolean): ComparisonResult;
}

/**
 * A `TConverter` is an interface providing a method for converting a value of
 * one type that another type.
 *
 * The `TConverter` interface provides the {@link convert} method for
 * converting a value of one type to another type.
 *
 * @template F The type of value that is to be converted.
 * @template T The type the input value is to be converted to.
 *
 * @example Example usage of the `TConverter` interface.
 * ```ts
 * import type { TConverter } from './interfaces.ts';
 *
 * type User = {
 *   name: string;
 *   age: number;
 * }
 *
 * const converter: TConverter<User, string> = {
 *   convert(user: User): string {
 *     return `${user.name} is ${user.age} years old`;
 *   }
 * }
 *
 * const user: User = { name: 'Charles', age: 22 };
 * const converted = converter.convert(user);
 *
 * console.assert(converted === 'Charles is 22 years old'); // ✔
 * ```
 */
export interface TConverter<F, T> {
  /**
   * Converts an input value of type `F` to a value of type `T`.
   *
   * @param value The value that is to be converted.
   */
  convert(value: F): T;
}

/**
 * A `TConvertible` is an interface providing that can convert its value to
 * other types.
 *
 * The `TConvertible` interface provides methods to convert an implementing
 * type's value to other types.
 *
 * The `M` type is a mapping type, mapping named conversions as keys to the
 * conversion types they represent.
 *
 * @template T The type of the object's value. For {@link TBase} and conversion source value.
 * @template M The map of named conversion keys to the target conversion types they represent.
 *
 * @see {@link TBase}
 *
 * @example Example usage of the `TConvertible` interface.
 * ```ts
 * import type { Converter } from './type_aliases.ts';
 * import type { TConvertible } from './interfaces.ts';
 *
 * type UserConversion = {
 *   message: string;
 *   signature: string;
 *   age: number;
 * }
 *
 * class User implements TConvertible<number, UserConversion> {
 *   constructor(private name: string, private age: number) {}
 *
 *   [Symbol.toPrimitive](hint: string): string | number {
 *     if (hint === 'number') return this.valueOf();
 *
 *     return this.toString();
 *   }
 *
 *   toString(): string {
 *     return this.name;
 *   }
 *
 *   valueOf(): number {
 *     return this.age;
 *   }
 *
 *   convertTo<K extends keyof UserConversion>(type: K): UserConversion[K] {
 *     if (type === 'message') {
 * 	    return `${this.name} is ${this.age} years old` as UserConversion[K];
 *     }
 *     if (type === 'signature') {
 * 	    return `${this.name}:${this.age}` as UserConversion[K];
 *     }
 *     if (type === 'age') return this.age as UserConversion[K];
 *
 *     throw new Error('Invalid conversion type');
 *   }
 *
 *   convert<C>(converter: Converter<number, C>): C {
 *     if (typeof converter === 'function') return converter(this.age);
 *
 *     return converter.convert(this.age);
 *   }
 * }
 *
 * const untilRetirement = (age: number): number => 65 - age;
 *
 * const user = new User('Azura', 19);
 *
 * console.assert(user.convertTo('message') === 'Azura is 19 years old'); // ✔
 * console.assert(user.convertTo('signature') === 'Azura:19');            // ✔
 * console.assert(user.convertTo('age') === 19);                          // ✔
 * console.assert(user.convert(untilRetirement) === 46);                  // ✔
 * ```
 */
export interface TConvertible<T, M extends AnyObject> extends TBase<T> {
  /**
   * Converts the object's type to a type associated with a named conversion
   * key.
   *
   * @param toType The key of the named conversion to convert the object's type to.
   *
   * @template K The named conversion keys.
   */
  convertTo<K extends keyof M>(toType: K): M[K];

  /**
   * Converts the object's type to another type using a {@link Converter}.
   *
   * @param converter The {@link Converter} to use to convert the object's value to another type.
   *
   * @template C The resulting type of the conversion.
   *
   * @see {@link Converter}
   */
  convert<C>(converter: Converter<T, C>): C;
}

/**
 * A `TSortable` is an interface providing implementing types a method to sort
 * their internal array.
 *
 * The `TSortable` interface provides the {@link sort} method for sorting the
 * elements of the implementing type's internal array.
 *
 * @template T The type of the elements of the object's internal array.
 *
 * @example Example usage of the `TSortable` interface.
 * ```ts
 * import { ComparisonResult } from './enums.ts';
 * import type { Comparer } from './type_aliases.ts';
 * import type { TSortable } from './interfaces.ts';
 *
 * type User = {
 *   name: string;
 *   age: number;
 * }
 *
 * class UserGroup implements TSortable<User> {
 *   constructor(private users: User[]) {}
 *
 *   sort(comparer: Comparer<User>, reverse = false): void {
 *     this.users = [...this.users].sort((a, b) => {
 *       if (typeof comparer === 'function') return comparer(a, b, reverse);
 *       return comparer.compare(a, b, reverse);
 *     });
 *   }
 *
 *   get list(): string {
 *     return this.users.map((u) => `${u.name}:${u.age}`).join(' ');
 *   }
 * }
 *
 * const users = [
 *   { name: 'Amabella', age: 46 },
 *   { name: 'Malagigi', age: 56 },
 *   { name: 'Claude', age: 25 },
 *   { name: 'Malagigi', age: 46 },
 * ];
 *
 * const group = new UserGroup(users);
 * const userSorter = (
 * 	a: User,
 * 	b: User,
 * 	reverse = false
 * ): ComparisonResult => {
 *   if (reverse) [a, b] = [b, a];
 *
 *   if (a.name === b.name) {
 *     if (a.age === b.age) return ComparisonResult.Equal;
 *
 *     return a.age > b.age
 * 	    ? ComparisonResult.Greater
 * 	    : ComparisonResult.Lesser;
 *   }
 *
 *   return a.name > b.name
 * 	  ? ComparisonResult.Greater
 * 	  : ComparisonResult.Lesser;
 * };
 *
 * group.sort(userSorter);
 * const sortedList = group.list;
 *
 * group.sort(userSorter, true);
 * const reversedList = group.list;
 *
 * console.assert(sortedList === 'Amabella:46 Claude:25 Malagigi:46 Malagigi:56');   // ✔
 * console.assert(reversedList === 'Malagigi:56 Malagigi:46 Claude:25 Amabella:46'); // ✔
 * ```
 */
export interface TSortable<T> {
  /**
   * Sorts the elements of the object's internal array using a
   * {@link Comparer}, optionally specifying whether to reverse the sort.
   *
   * @param comparer The {@link Comparer} to use to sort the elements of the object's internal array.
   * @param reverse Whether to reverse the comparison. Defaults to `false`.
   */
  sort(comparer: Comparer<T>, reverse?: boolean): void;
}
