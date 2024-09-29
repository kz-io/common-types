/**
 * @copyright 2020-2024 integereleven. All rights reserved. MIT license.
 * @file This file tests package type aliases.
 */

import { describe, it } from '@std/testing/bdd';
import { assertEquals } from '@std/assert';

import { ComparisonResult } from '../../mod.ts';

import type {
  Comparer,
  Converter,
  IHashable,
  IHelpful,
  IVersionDescriptor,
  TBase,
  TCloneable,
  TComparable,
  TComparer,
  TConverter,
  TConvertible,
  TSortable,
} from '../../mod.ts';

describe('Interfaces', () => {
  describe('IHashable', () => {
    it('must have a getHashCode method', () => {
      class User implements IHashable {
        constructor(private name: string, private age: number) {}

        #createHash(): number {
          const string = `${this.name}:${this.age}`;

          return string.split('').reduce(
            (acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0,
            0,
          );
        }

        getHashCode(): number {
          return this.#createHash();
        }
      }

      const hashable = new User('Sidor', 80);

      assertEquals(hashable.getHashCode(), 291855361);
    });
  });

  describe('IHelpful', () => {
    it('must have a helpUrl property', () => {
      class ServiceDesk implements IHelpful {
        helpUrl: string = 'https://example.com/help/';
      }

      const helpful = new ServiceDesk();

      assertEquals(helpful.helpUrl, 'https://example.com/help/');
    });

    it('may be a getter property', () => {
      class ServiceDesk implements IHelpful {
        constructor(private name: string) {}

        get helpUrl(): string {
          return `https://example.com/help/${this.name}`;
        }
      }

      const helpful = new ServiceDesk('ProductSupport');

      assertEquals(helpful.helpUrl, 'https://example.com/help/ProductSupport');
    });
  });

  describe('IVersionDescriptor', () => {
    it('must have a major, minor, and patch property', () => {
      const version: IVersionDescriptor = {
        major: 1,
        minor: 2,
        patch: 3,
      };

      assertEquals(version.major, 1);
      assertEquals(version.minor, 2);
      assertEquals(version.patch, 3);
    });

    it('may have a pre-release property', () => {
      const version1: IVersionDescriptor = {
        major: 1,
        minor: 2,
        patch: 3,
        preRelease: 'alpha',
      };

      const version2: IVersionDescriptor = {
        major: 1,
        minor: 2,
        patch: 3,
      };

      assertEquals(version1.major, 1);
      assertEquals(version1.minor, 2);
      assertEquals(version1.patch, 3);
      assertEquals(version1.preRelease, 'alpha');

      assertEquals(version2.major, 1);
      assertEquals(version2.minor, 2);
      assertEquals(version2.patch, 3);
      assertEquals(version2.preRelease, undefined);
    });

    it('may have a build property', () => {
      const version1: IVersionDescriptor = {
        major: 1,
        minor: 2,
        patch: 3,
        build: 'build-1',
      };

      const version2: IVersionDescriptor = {
        major: 1,
        minor: 2,
        patch: 3,
      };

      assertEquals(version1.major, 1);
      assertEquals(version1.minor, 2);
      assertEquals(version1.patch, 3);
      assertEquals(version2.preRelease, undefined);
      assertEquals(version1.build, 'build-1');

      assertEquals(version2.major, 1);
      assertEquals(version2.minor, 2);
      assertEquals(version2.patch, 3);
      assertEquals(version2.preRelease, undefined);
      assertEquals(version2.build, undefined);
    });
  });

  describe('TBase', () => {
    it('must have a [Symbol.toPrimitive], toString, and valueOf method', () => {
      class Currency implements TBase<number> {
        constructor(private value: number, private sym: string) {}

        [Symbol.toPrimitive](hint: string): string | number {
          if (hint === 'number') return this.valueOf();

          return this.toString();
        }

        toString(): string {
          return `${this.value} ${this.sym}`;
        }

        valueOf(): number {
          return this.value;
        }
      }

      const value = new Currency(42, 'USD');

      assertEquals(value[Symbol.toPrimitive]('string'), '42 USD');
      assertEquals(value[Symbol.toPrimitive]('number'), 42);
      assertEquals(value.toString(), '42 USD');
      assertEquals(value.valueOf(), 42);
    });
  });

  describe('TCloneable', () => {
    it('must have a clone method', () => {
      class User implements TCloneable<User> {
        constructor(public name: string, public age: number) {}

        clone(): User {
          return new User(this.name, this.age);
        }
      }

      const user = new User('Sidor', 80);
      const clone = user.clone();

      assertEquals(clone.name, 'Sidor');
      assertEquals(clone.age, 80);
    });
  });

  describe('TComparable', () => {
    it('must have a compareTo method', () => {
      class User implements TComparable<User> {
        constructor(public name: string, public age: number) {}

        compareTo(other: User, reverse = false): ComparisonResult {
          const [a, b] = reverse ? [other, this] : [this, other];

          if (a.name === b.name) {
            if (a.age === b.age) return ComparisonResult.Equal;

            return a.age > b.age
              ? ComparisonResult.Greater
              : ComparisonResult.Lesser;
          }

          return a.name > b.name
            ? ComparisonResult.Greater
            : ComparisonResult.Lesser;
        }
      }

      const user1 = new User('Fatima', 80);
      const user2 = new User('Panteleimon', 80);
      const user3 = new User('Panteleimon', 66);
      const user4 = new User('Fatima', 80);

      assertEquals(user1.compareTo(user2), ComparisonResult.Lesser);
      assertEquals(user2.compareTo(user1), ComparisonResult.Greater);
      assertEquals(user2.compareTo(user3, true), ComparisonResult.Lesser);
      assertEquals(user4.compareTo(user1), ComparisonResult.Equal);
    });
  });

  describe('TComparer', () => {
    it('must have a compare method', () => {
      type User = {
        name: string;
        age: number;
      };

      const comparer: TComparer<User> = {
        compare(a: User, b: User, reverse = false): ComparisonResult {
          if (reverse) [a, b] = [b, a];

          if (a.name === b.name) {
            if (a.age === b.age) return ComparisonResult.Equal;

            return a.age > b.age
              ? ComparisonResult.Greater
              : ComparisonResult.Lesser;
          }

          return a.name > b.name
            ? ComparisonResult.Greater
            : ComparisonResult.Lesser;
        },
      };

      const user1: User = { name: 'Savely', age: 45 };
      const user2: User = { name: 'Nestor', age: 45 };
      const user3: User = { name: 'Nestor', age: 25 };
      const user4: User = { name: 'Savely', age: 45 };

      assertEquals(comparer.compare(user2, user1), ComparisonResult.Lesser);
      assertEquals(comparer.compare(user1, user2), ComparisonResult.Greater);
      assertEquals(
        comparer.compare(user2, user3, true),
        ComparisonResult.Lesser,
      );
      assertEquals(comparer.compare(user1, user4), ComparisonResult.Equal);
    });
  });

  describe('TConverter', () => {
    it('must have a convert method', () => {
      type User = {
        name: string;
        age: number;
      };

      const converter: TConverter<User, string> = {
        convert(user: User): string {
          return `${user.name} is ${user.age} years old`;
        },
      };

      const user: User = { name: 'Charles', age: 22 };
      const converted = converter.convert(user);

      assertEquals(converted, 'Charles is 22 years old');
    });
  });

  describe('TConvertible', () => {
    it('must have a convertTo and convert method', () => {
      type UserConversion = {
        message: string;
        signature: string;
        age: number;
      };

      class User implements TConvertible<number, UserConversion> {
        constructor(private name: string, private age: number) {}

        [Symbol.toPrimitive](hint: string): string | number {
          if (hint === 'number') return this.valueOf();

          return this.toString();
        }

        toString(): string {
          return this.name;
        }

        valueOf(): number {
          return this.age;
        }

        convertTo<K extends keyof UserConversion>(type: K): UserConversion[K] {
          if (type === 'message') {
            return `${this.name} is ${this.age} years old` as UserConversion[K];
          }
          if (type === 'signature') {
            return `${this.name}:${this.age}` as UserConversion[K];
          }
          if (type === 'age') return this.age as UserConversion[K];

          throw new Error('Invalid conversion type');
        }

        convert<C>(converter: Converter<number, C>): C {
          if (typeof converter === 'function') return converter(this.age);

          return converter.convert(this.age);
        }
      }

      const untilRetirement = (age: number): number => 65 - age;

      const user = new User('Azura', 19);

      assertEquals(user.convertTo('message'), 'Azura is 19 years old');
      assertEquals(user.convertTo('signature'), 'Azura:19');
      assertEquals(user.convertTo('age'), 19);
      assertEquals(user.convert(untilRetirement), 46);
    });
  });

  describe('TSortable', () => {
    it('must have a sort method', () => {
      type User = {
        name: string;
        age: number;
      };

      class UserGroup implements TSortable<User> {
        constructor(private users: User[]) {}

        sort(comparer: Comparer<User>, reverse = false): void {
          this.users = [...this.users].sort((a, b) => {
            if (typeof comparer === 'function') return comparer(a, b, reverse);
            return comparer.compare(a, b, reverse);
          });
        }

        get list(): string {
          return this.users.map((u) => `${u.name}:${u.age}`).join(' ');
        }
      }

      const users = [
        { name: 'Amabella', age: 46 },
        { name: 'Malagigi', age: 56 },
        { name: 'Claude', age: 25 },
        { name: 'Malagigi', age: 46 },
      ];

      const group = new UserGroup(users);
      const userSorter = (
        a: User,
        b: User,
        reverse = false,
      ): ComparisonResult => {
        if (reverse) [a, b] = [b, a];

        if (a.name === b.name) {
          if (a.age === b.age) return ComparisonResult.Equal;

          return a.age > b.age
            ? ComparisonResult.Greater
            : ComparisonResult.Lesser;
        }

        return a.name > b.name
          ? ComparisonResult.Greater
          : ComparisonResult.Lesser;
      };

      group.sort(userSorter);
      const sortedList = group.list;

      group.sort(userSorter, true);
      const reversedList = group.list;

      assertEquals(sortedList, 'Amabella:46 Claude:25 Malagigi:46 Malagigi:56');
      assertEquals(
        reversedList,
        'Malagigi:56 Malagigi:46 Claude:25 Amabella:46',
      );
    });
  });
});
