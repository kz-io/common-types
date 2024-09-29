/**
 * @copyright 2020-2024 integereleven. All rights reserved. MIT license.
 * @file This file tests package type aliases.
 */

import { describe, it } from '@std/testing/bdd';
import { assert, assertEquals } from '@std/assert';

import { ComparisonResult } from '../../mod.ts';

import type {
  Action,
  AnyArray,
  AnyObject,
  Binary,
  BitValue,
  // Clean, Currently untestable
  Comparer,
  ComparerFn,
  Constructor,
  Converter,
  ConverterFn,
  Couple,
  Dyadic,
  // DecoratorTarget, Currently untestable
  Empty,
  Func,
  HexValue,
  IndeterminateObject,
  IsAny,
  IsNever,
  IsUnknown,
  // KeyOfAny, Currently untestable
  MaybeArray,
  MaybeCalculated,
  MaybePromise,
  Monadic,
  // Native, Currently untestable
  Nil,
  Nilable,
  Niladic,
  Nullable,
  Nullary,
  Octonary,
  Octuple,
  OrderedPair,
  Paths,
  PathValue,
  PredicateAction,
  PredicateFunc,
  Primitive,
  PrimitiveKey,
  PropertyValue,
  Quadruple,
  Quaternary,
  Quinary,
  Quintuple,
  ReducerFunc,
  Register,
  SafeRegister,
  Senary,
  Septenary,
  Septuple,
  Sextuple,
  Single,
  Singleton,
  Ternary,
  Tetradic,
  Triadic,
  Triple,
  Unary,
} from '../../mod.ts';

describe('Type aliases', () => {
  describe('Action', () => {
    it('is a function', () => {
      const action: Action<Niladic> = () => {};

      assertEquals(typeof action, 'function');
    });

    it('can only accept a max of 2 named arguments', () => {
      const action: IsNever<Action<Niladic>> = false;
      const action1: IsNever<Action<Monadic<number>>> = false;
      const action2: IsNever<Action<Dyadic<number, number>>> = false;
      const action3: IsNever<Action<Triadic<number, number, number>>> = true;

      assert(!action);
      assert(!action1);
      assert(!action2);
      assert(action3);
    });

    it('can accept an options object as a 3rd argument', () => {
      type Options = {
        target: string;
        value: number;
      };

      const action: Action<Niladic, Options> = (_options) => {};
      const action1: Action<Monadic<number>, Options> = (_, _options) => {};
      const action2: Action<Dyadic<number, number>, Options> = (
        _a,
        _b,
        _options,
      ) => {};

      assertEquals(typeof action, 'function');
      assertEquals(typeof action1, 'function');
      assertEquals(typeof action2, 'function');
    });

    it('can be used to define a callback', () => {
      type Info = Couple<number, number>;
      type Callback = Action<Dyadic<number, Info>>;

      function process(items: number[], callback: Callback): Info {
        const info: Info = [0, 0];

        for (const item of items) {
          callback(item, info);
        }

        return info;
      }

      const sumAndCount: Callback = (num, info) => {
        info[0] += num;
        info[1] += 1;
      };

      const [sum, count] = process([1, 2, 3, 4, 5], sumAndCount);

      assertEquals(sum, 15);
      assertEquals(count, 5);
    });

    it('can be used to define a callback with options', () => {
      type Info = Couple<number, number>;
      type Options = { step: number };
      type Callback = Action<Dyadic<number, Info>, Options>;

      function process(items: number[], callback: Callback): Info {
        const info: Info = [0, 0];

        for (const item of items) {
          callback(item, info, { step: 2 });
        }

        return info;
      }

      const sumAndCount: Callback = (num, info, options) => {
        info[0] += num;
        info[1] += 1 * (options?.step || 1);
      };

      const [sum, count] = process([1, 2, 3, 4, 5], sumAndCount);

      assertEquals(sum, 15);
      assertEquals(count, 10);
    });
  });

  describe('AnyArray', () => {
    it('can be a mutable array', () => {
      const items: AnyArray<number> = [1, 2, 3, 4, 5];

      assertEquals(items.length, 5);
    });

    it('can be a readonly array', () => {
      const items: ReadonlyArray<number> = [1, 2, 3, 4, 5];

      assertEquals(items.length, 5);
    });

    it('can be used where an array will not be mutated', () => {
      function sum(items: AnyArray<number>): number {
        return items.reduce((acc, item) => acc + item, 0);
      }

      const readonlyItems: ReadonlyArray<number> = [1, 2, 3, 4, 5];

      const total = sum([1, 2, 3, 4, 5]);
      const readonlyTotal = sum(readonlyItems);

      assertEquals(total, 15);
      assertEquals(readonlyTotal, 15);
    });
  });

  describe('AnyObject', () => {
    it('can be any object', () => {
      const obj1: AnyObject = { name: 'John', age: 25 };
      const obj2: AnyObject = { group: 'Admin', role: 'Manager' };

      assertEquals(obj1.name, 'John');
      assertEquals(obj1.age, 25);
      assertEquals(obj2.group, 'Admin');
      assertEquals(obj2.role, 'Manager');
    });

    it('can be used where an object will not be mutated', () => {
      function objectToString(obj: AnyObject): string {
        return JSON.stringify(obj);
      }

      const obj1: AnyObject = { name: 'John', age: 25 };
      const obj2: AnyObject = { group: 'Admin', role: 'Manager' };

      const str1 = objectToString(obj1);
      const str2 = objectToString(obj2);

      assertEquals(str1, '{"name":"John","age":25}');
      assertEquals(str2, '{"group":"Admin","role":"Manager"}');
    });
  });

  describe('Binary', () => {
    it('is a tuple with 2 items', () => {
      function createId(pair: Binary<string, number>): string {
        const [name, id] = pair;

        return `${name}-${id}`;
      }

      const id1 = createId(['Michel', 3838449417]);
      const id2 = createId(['Wen', 2786402361]);

      assertEquals(id1, 'Michel-3838449417');
      assertEquals(id2, 'Wen-2786402361');
    });
  });

  describe('BitValue', () => {
    it('can be a boolean or a number', () => {
      function bitsToNumber(value: Octuple<BitValue>): number {
        return value.reduce((acc, bit) => (acc << 1) | bit, 0 as number);
      }

      const num1 = bitsToNumber([1, 0, 0, 1, 1, 0, 1, 1]);
      const num2 = bitsToNumber([1, 1, 0, 0, 1, 1, 0, 1]);

      assertEquals(num1, 155);
      assertEquals(num2, 205);
    });
  });

  // describe('Clean', () => {
  //   Currently untestable
  // });

  describe('Comparer', () => {
    it('can be a ComparerFn or TComparer', () => {
      type User = {
        name: string;
        age: number;
      };

      const compareByName: Comparer<User> = (a, b) =>
        a.name.localeCompare(b.name);
      const compareByAge: Comparer<User> = {
        compare: (a, b) => {
          return a.age - b.age;
        },
      };

      const people: User[] = [
        { name: 'Jin', age: 25 },
        { name: 'Luwam', age: 30 },
        { name: 'Jörg', age: 20 },
      ];

      const byName = [...people].sort(compareByName);
      const byAge = [...people].sort(compareByAge.compare);
      const byNameList = byName.map((a) => a.name).join(' ');
      const byAgeList = byAge.map((a) => a.age).join(' ');

      assertEquals(byNameList, 'Jin Jörg Luwam');
      assertEquals(byAgeList, '20 25 30');
    });
  });

  describe('ComparerFn', () => {
    it('must be a function', () => {
      const compare1: ComparerFn<number> = (a, b): ComparisonResult => {
        return a === b
          ? ComparisonResult.Equal
          : a > b
          ? ComparisonResult.Greater
          : ComparisonResult.Lesser;
      };
      const compare2: ComparerFn<number> = (a, b, reverse = false) => {
        [a, b] = reverse ? [b, a] : [a, b];

        return compare1(a, b);
      };

      assertEquals(typeof compare1, 'function');
      assertEquals(typeof compare2, 'function');
    });

    it('can sort in ascending or descending order', () => {
      type User = {
        name: string;
        age: number;
      };

      const userCompare: ComparerFn<User> = (
        a,
        b,
        reverse = false,
      ): ComparisonResult => {
        [a, b] = reverse ? [b, a] : [a, b];

        if (a.name === b.name) {
          return a.age === b.age
            ? ComparisonResult.Equal
            : a.age > b.age
            ? ComparisonResult.Greater
            : ComparisonResult.Lesser;
        }

        return a.name === b.name
          ? ComparisonResult.Equal
          : a.name > b.name
          ? ComparisonResult.Greater
          : ComparisonResult.Lesser;
      };

      const users: User[] = [
        { name: 'Raquildis', age: 25 },
        { name: 'Eric', age: 30 },
        { name: 'Melissa', age: 20 },
      ];

      const sortAsc = [...users].sort(userCompare);
      const sortDesc = [...users].sort((a, b) => userCompare(a, b, true));
      const ascList = sortAsc.map((a) => a.name).join(' ');
      const descList = sortDesc.map((a) => a.age).join(' ');

      assertEquals(ascList, 'Eric Melissa Raquildis');
      assertEquals(descList, '25 20 30');
    });
  });

  describe('Constructor', () => {
    it('is a newable function', () => {
      class User {
        protected role: string = 'user';

        constructor(protected name: string) {}

        toString(): string {
          return `[${this.role}]${this.name}`;
        }
      }

      class ComplianceAdmin extends User {
        protected role: string = 'compliance-admin';
      }

      class Admin extends User {
        protected role: string = 'admin';
      }

      function createUser(name: string, role: Constructor<User>): User {
        return new role(name);
      }

      const user = createUser('Cara', User);
      const complianceAdmin = createUser('Gustavo', ComplianceAdmin);
      const admin = createUser('Sayoka', Admin);

      assertEquals(user.toString(), '[user]Cara');
      assertEquals(complianceAdmin.toString(), '[compliance-admin]Gustavo');
      assertEquals(admin.toString(), '[admin]Sayoka');
    });
  });

  describe('Converter', () => {
    it('can be a ConverterFn or TConverter', () => {
      type User = {
        name: string;
        age: number;
      };

      const toNumber: Converter<User, number> = (value) => value.age;
      const toString: Converter<User, string> = {
        convert: (value) => `${value.name}:${value.age}`,
      };

      const user: User = { name: 'Takahito', age: 25 };
      const num = toNumber(user);
      const str = toString.convert(user);

      assertEquals(num, 25);
      assertEquals(str, 'Takahito:25');
    });
  });

  describe('ConverterFn', () => {
    it('can convert between types', () => {
      type User = {
        name: string;
        age: number;
      };

      const toString: ConverterFn<User, string> = (value) =>
        `${value.name}:${value.age}`;
      const user: User = { name: 'Macarena', age: 25 };
      const str = toString(user);

      assertEquals(str, 'Macarena:25');
    });
  });

  describe('Couple', () => {
    it('is a tuple with 2 items', () => {
      function createId(pair: Couple<string, number>): string {
        const [name, id] = pair;

        return `${name}-${id}`;
      }

      const id1 = createId(['Jarmila', 7227111290]);
      const id2 = createId(['Štefan', 1242868855]);

      assertEquals(id1, 'Jarmila-7227111290');
      assertEquals(id2, 'Štefan-1242868855');
    });
  });

  // describe('DecoratorTarget', () => {
  //   Currently untestable
  // });

  describe('Dyadic', () => {
    it('is a tuple with 2 items', () => {
      function createId(pair: Dyadic<string, number>): string {
        const [name, id] = pair;

        return `${name}-${id}`;
      }

      const id1 = createId(['Miluše', 5395605338]);
      const id2 = createId(['Hamish', 3599968758]);

      assertEquals(id1, 'Miluše-5395605338');
      assertEquals(id2, 'Hamish-3599968758');
    });
  });

  describe('Empty', () => {
    it('is be an empty tuple', () => {
      type Actions =
        | 'add'
        | 'sub'
        | 'div'
        | 'mx'
        | 'pow'
        | 'mod';

      type ItemTypes =
        | Empty
        | Single<number>
        | Triple<number, number, Actions>;

      function doMath(items: ItemTypes): number {
        if (!items.length) return 0;
        if (items.length === 1) return items[0];

        const [op1, op2, op] = items;

        if (op === 'add') return op1 + op2;
        if (op === 'sub') return op1 - op2;
        if (op === 'div') return op1 / op2;
        if (op === 'mx') return op1 * op2;
        if (op === 'pow') return Math.pow(op1, op2);

        return op1 % op2;
      }

      assertEquals(doMath([]), 0);
      assertEquals(doMath([25]), 25);
      assertEquals(doMath([2, 4, 'pow']), 16);
      assertEquals(doMath([10, 5, 'div']), 2);
    });
  });

  describe('Func', () => {
    it('is a function', () => {
      const action: Func<Niladic, string> = () => 'Hello, world!';

      assertEquals(typeof action, 'function');
    });

    it('can only accept a max of 2 named arguments', () => {
      const action: IsNever<Func<Niladic, string>> = false;
      const action1: IsNever<Func<Monadic<number>, string>> = false;
      const action2: IsNever<Func<Dyadic<number, number>, string>> = false;
      const action3: IsNever<Func<Triadic<number, number, number>, string>> =
        true;

      assert(!action);
      assert(!action1);
      assert(!action2);
      assert(action3);
    });

    it('can accept an options object as a 3rd argument', () => {
      type Options = {
        target: string;
        value: number;
      };

      const action: Func<Niladic, string, Options> = (_options) =>
        'Hello, world!';
      const action1: Func<Monadic<number>, string, Options> = (_, _options) =>
        'Hello, world!';
      const action2: Func<Dyadic<number, number>, string, Options> = (
        _a,
        _b,
        _options,
      ) => 'Hello, world!';

      assertEquals(typeof action, 'function');
      assertEquals(typeof action1, 'function');
      assertEquals(typeof action2, 'function');
    });

    it('can be used to define a callback', () => {
      type Info = Couple<number, number>;
      type Callback = Func<Dyadic<number, Info>, number>;

      function process(items: number[], callback: Callback): [Info, number[]] {
        const info: Info = [0, 0];
        const results: number[] = [];

        for (const item of items) {
          results.push(callback(item, info));
        }

        return [info, results];
      }

      const sumAndCount: Callback = (num, info) => {
        info[0] += num;
        info[1] += 1;

        return num * info[1];
      };

      const [info, result] = process([1, 2, 3, 4, 5], sumAndCount);
      const [sum, count] = info;
      const resultingSum = result.reduce((acc, item) => acc + item, 0);

      assertEquals(sum, 15);
      assertEquals(count, 5);
      assertEquals(resultingSum, 55);
    });

    it('can be used to define a callback with options', () => {
      type Info = Couple<number, number>;
      type Options = { step: number };
      type Callback = Func<Dyadic<number, Info>, number, Options>;

      function process(items: number[], callback: Callback): [Info, number[]] {
        const info: Info = [0, 0];
        const results: number[] = [];

        for (const item of items) {
          results.push(callback(item, info, { step: 2 }));
        }

        return [info, results];
      }

      const sumAndCount: Callback = (num, info, options) => {
        info[0] += num;
        info[1] += 1 * (options?.step || 1);

        return num * info[1];
      };

      const [info, result] = process([1, 2, 3, 4, 5], sumAndCount);
      const [sum, count] = info;
      const resultingSum = result.reduce((acc, item) => acc + item, 0);

      assertEquals(sum, 15);
      assertEquals(count, 10);
      assertEquals(resultingSum, 110);
    });
  });

  describe('HexValue', () => {
    it('can be a string or a number', () => {
      function hexToNumber(hex: Quadruple<HexValue>): number {
        return parseInt(hex.join(''), 16);
      }

      const num1 = hexToNumber([9, 6, 7, 'B']);
      const num2 = hexToNumber(['A', 'C', 3, 'D']);

      assertEquals(num1, 38523);
      assertEquals(num2, 44093);
    });
  });

  describe('IndeterminateObject', () => {
    it('can be any object', () => {
      const obj1: IndeterminateObject = { name: 'Jensine', age: 25 };
      const obj2: IndeterminateObject = { group: 'Admin', role: 'Manager' };

      assertEquals(obj1.name, 'Jensine');
      assertEquals(obj1.age, 25);
      assertEquals(obj2.group, 'Admin');
      assertEquals(obj2.role, 'Manager');
    });

    it('has values of unknown type', () => {
      const obj: IndeterminateObject = { name: 'Jensine', age: 25 };
      const name: IsUnknown<typeof obj.name> = true;
      const age: IsUnknown<typeof obj.age> = true;

      assert(name);
      assert(age);
    });

    it('can be used where an object will not be mutated', () => {
      function objectToString(obj: IndeterminateObject): string {
        return JSON.stringify(obj);
      }

      const obj1: IndeterminateObject = { name: 'Jensine', age: 25 };
      const obj2: IndeterminateObject = { group: 'Admin', role: 'Manager' };

      const str1 = objectToString(obj1);
      const str2 = objectToString(obj2);

      assertEquals(str1, '{"name":"Jensine","age":25}');
      assertEquals(str2, '{"group":"Admin","role":"Manager"}');
    });
  });

  describe('IsAny', () => {
    it('checks that a type is an any', () => {
      // deno-lint-ignore no-explicit-any
      const anyValue: IsAny<any> = true;
      const value: IsAny<number> = false;

      assert(anyValue);
      assert(!value);
    });
  });

  describe('IsNever', () => {
    it('checks that a type is a never', () => {
      const neverValue: IsNever<never> = true;
      const value: IsNever<number> = false;

      assert(neverValue);
      assert(!value);
    });
  });

  describe('IsUnknown', () => {
    it('checks that a type is an unknown', () => {
      const unknownValue: IsUnknown<unknown> = true;
      const value: IsUnknown<number> = false;

      assert(unknownValue);
      assert(!value);
    });
  });

  // describe('KeyOfAny', () => {
  //   Currently untestable
  // });

  describe('MaybeArray', () => {
    it('can be an array or a single item', () => {
      type User = {
        name: string;
        age: number;
      };

      function getNames(users: MaybeArray<User>): string[] {
        return Array.isArray(users) ? users.map((u) => u.name) : [users.name];
      }

      const admin = { name: 'Benoît', age: 54 };

      const users = [
        { name: 'Danielle', age: 25 },
        { name: 'Pacífico', age: 30 },
        { name: 'Li', age: 20 },
      ];

      const adminNames = getNames(admin);
      const userNames = getNames(users);
      const adminList = adminNames.join(' ');
      const userList = userNames.join(' ');

      assertEquals(adminList, 'Benoît');
      assertEquals(userList, 'Danielle Pacífico Li');
    });
  });

  describe('MaybeCalculated', () => {
    it('can be used to calculate a value', () => {
      type Config = {
        heartbeat: number;
        timeout: number;
        maxAttempts: number;
        iterations: number;
      };

      type UserConfig = {
        [K in keyof Config]: MaybeCalculated<Config[K], Monadic<Config>>;
      };

      const baseConfig: Config = {
        heartbeat: 1000,
        timeout: 5000,
        maxAttempts: 3,
        iterations: 6,
      };

      function createConfig(cfg: UserConfig): Config {
        const config: Partial<Config> = {};

        for (const key in cfg) {
          const k = key as keyof Config;

          if (typeof cfg[k] === 'function') {
            config[k] = cfg[k](baseConfig);
          } else {
            config[k] = cfg[k];
          }
        }

        return config as Config;
      }

      const userConfig: UserConfig = {
        heartbeat: 1000,
        timeout: 5000,
        maxAttempts: 3,
        iterations: (cfg) => cfg.maxAttempts * 2,
      };

      const config = createConfig(userConfig);

      assertEquals(config.heartbeat, 1000);
      assertEquals(config.timeout, 5000);
      assertEquals(config.maxAttempts, 3);
      assertEquals(config.iterations, 6);
    });
  });

  describe('MaybePromise', () => {
    it('can be a promise or a single item', async () => {
      type User = {
        name: string;
        age: number;
      };

      async function getNames(user: MaybePromise<User>): Promise<string> {
        const userObject = await Promise.resolve(user);

        return userObject.name;
      }
      const users = [
        { name: 'Guang', age: 25 },
        Promise.resolve({ name: 'Edo', age: 30 }),
        { name: 'Martin', age: 20 },
      ];

      const userNames = await Promise.all(users.map(getNames));
      const userList = userNames.join(' ');

      assertEquals(userList, 'Guang Edo Martin');
    });
  });

  describe('Monadic', () => {
    it('is a tuple with 1 item', () => {
      type Actions =
        | 'add'
        | 'sub'
        | 'div'
        | 'mx'
        | 'pow'
        | 'mod';

      type ItemTypes =
        | Niladic
        | Monadic<number>
        | Triadic<number, number, Actions>;

      function doMath(items: ItemTypes): number {
        if (!items.length) return 0;
        if (items.length === 1) return items[0];

        const [op1, op2, op] = items;

        if (op === 'add') return op1 + op2;
        if (op === 'sub') return op1 - op2;
        if (op === 'div') return op1 / op2;
        if (op === 'mx') return op1 * op2;
        if (op === 'pow') return Math.pow(op1, op2);

        return op1 % op2;
      }

      assertEquals(doMath([]), 0);
      assertEquals(doMath([25]), 25);
      assertEquals(doMath([2, 4, 'pow']), 16);
      assertEquals(doMath([10, 5, 'div']), 2);
    });
  });

  // describe('Native', () => {
  //  Currently untestable
  // });

  describe('Nil', () => {
    it('is either null or undefined', () => {
      const nilValue: Nil = null;
      const undefinedValue: Nil = undefined;

      assertEquals(nilValue, null);
      assertEquals(undefinedValue, undefined);
    });
  });

  describe('Nilable', () => {
    it('can be a value or a Nil', () => {
      type User = {
        name: string;
        age: number;
      };

      function getUserImage(user: Nilable<User>): string {
        if (!user) return 'default.png';

        return `${user.name}.png`;
      }

      const user: User = { name: 'Malik', age: 77 };

      const image1 = getUserImage(undefined);
      const image2 = getUserImage(user);

      assertEquals(image1, 'default.png');
      assertEquals(image2, 'Malik.png');
    });
  });

  describe('Niladic', () => {
    it('is be an empty tuple', () => {
      type Actions =
        | 'add'
        | 'sub'
        | 'div'
        | 'mx'
        | 'pow'
        | 'mod';

      type ItemTypes =
        | Niladic
        | Monadic<number>
        | Triadic<number, number, Actions>;

      function doMath(items: ItemTypes): number {
        if (!items.length) return 0;
        if (items.length === 1) return items[0];

        const [op1, op2, op] = items;

        if (op === 'add') return op1 + op2;
        if (op === 'sub') return op1 - op2;
        if (op === 'div') return op1 / op2;
        if (op === 'mx') return op1 * op2;
        if (op === 'pow') return Math.pow(op1, op2);

        return op1 % op2;
      }

      assertEquals(doMath([]), 0);
      assertEquals(doMath([25]), 25);
      assertEquals(doMath([2, 4, 'pow']), 16);
      assertEquals(doMath([10, 5, 'div']), 2);
    });
  });

  describe('Nullable', () => {
    it('can be a value or null', () => {
      type User = {
        name: string;
        age: number;
      };

      function getUserImage(user: Nullable<User>): string {
        if (!user) return 'default.png';

        return `${user.name}.png`;
      }

      const user: User = { name: 'Malik', age: 77 };

      const image1 = getUserImage(null);
      const image2 = getUserImage(user);

      assertEquals(image1, 'default.png');
      assertEquals(image2, 'Malik.png');
    });
  });

  describe('Nullary', () => {
    it('should be an empty tuple', () => {
      type Actions =
        | 'add'
        | 'sub'
        | 'div'
        | 'mx'
        | 'pow'
        | 'mod';

      type ItemTypes =
        | Nullary
        | Unary<number>
        | Ternary<number, number, Actions>;

      function doMath(items: ItemTypes): number {
        if (!items.length) return 0;
        if (items.length === 1) return items[0];

        const [op1, op2, op] = items;

        if (op === 'add') return op1 + op2;
        if (op === 'sub') return op1 - op2;
        if (op === 'div') return op1 / op2;
        if (op === 'mx') return op1 * op2;
        if (op === 'pow') return Math.pow(op1, op2);

        return op1 % op2;
      }

      assertEquals(doMath([]), 0);
      assertEquals(doMath([25]), 25);
      assertEquals(doMath([2, 4, 'pow']), 16);
      assertEquals(doMath([10, 5, 'div']), 2);
    });
  });

  describe('Octonary', () => {
    it('is a tuple with 8 items', () => {
      type Byte = Octonary<BitValue>;

      function byteToNumber(byte: Byte): number {
        return byte.reduce((acc, bit) => (acc << 1) | bit, 0 as number);
      }

      const num1 = byteToNumber([1, 0, 0, 1, 1, 0, 1, 1]);
      const num2 = byteToNumber([1, 1, 0, 0, 1, 1, 0, 1]);

      assertEquals(num1, 155);
      assertEquals(num2, 205);
    });
  });

  describe('Octuple', () => {
    it('is a tuple with 8 items', () => {
      type Byte = Octuple<BitValue>;

      function byteToNumber(byte: Byte): number {
        return byte.reduce((acc, bit) => (acc << 1) | bit, 0 as number);
      }

      const num1 = byteToNumber([1, 0, 0, 1, 1, 0, 1, 1]);
      const num2 = byteToNumber([1, 1, 0, 0, 1, 1, 0, 1]);

      assertEquals(num1, 155);
      assertEquals(num2, 205);
    });
  });

  describe('OrderedPair', () => {
    it('is a tuple with 2 items', () => {
      function createId(pair: OrderedPair<string, number>): string {
        const [name, id] = pair;

        return `${name}-${id}`;
      }

      const id1 = createId(['Garðar', 9913853218]);
      const id2 = createId(['Amadi', 5135789123]);

      assertEquals(id1, 'Garðar-9913853218');
      assertEquals(id2, 'Amadi-5135789123');
    });
  });

  describe('Paths', () => {
    it('aggregates paths of nested properties', () => {
      type User = {
        name: string;
        address: {
          city: string;
          country: string;
        };
      };

      type UserPaths = Paths<User>;

      const city: UserPaths = 'address.city';
      const country: UserPaths = 'address.country';

      assertEquals(city, 'address.city');
      assertEquals(country, 'address.country');
    });
  });

  describe('PathValue', () => {
    it('gets the value type of a nested property', () => {
      type User = {
        name: string;
        address: {
          city: string;
          country: string;
          zip: number;
        };
      };

      const user: User = {
        name: 'Ifesinachi',
        address: {
          city: 'Pontiac',
          country: 'US',
          zip: 48342,
        },
      };

      const city: PathValue<User, 'address.city'> = user.address.city;
      const country: PathValue<User, 'address.country'> = user.address.country;
      const zip: PathValue<User, 'address.zip'> = user.address.zip;

      assertEquals(city, 'Pontiac');
      assertEquals(country, 'US');
      assertEquals(zip, 48342);
    });
  });

  describe('PredicateAction', () => {
    it('is a function', () => {
      const action: PredicateAction<[]> = () => {};

      assertEquals(typeof action, 'function');
    });

    it('can be used on arrays', () => {
      type User = {
        name: string;
        age: number;
        role: string;
      };

      const admins: User[] = [];
      const users: User[] = [
        { name: 'Amarachi', age: 58, role: 'user' },
        { name: 'Chinwe', age: 60, role: 'admin' },
        { name: 'Ngozi', age: 62, role: 'user' },
      ];

      const storeAdmin: PredicateAction<User[]> = (user) => {
        if (user.role === 'admin') {
          admins.push(user);
        }
      };

      users.forEach(storeAdmin);

      assertEquals(admins.length, 1);
    });

    it('can be used on objects', () => {
      const records: Record<string, number> = {
        Chidimma: 45,
        Ifeatu: 29,
        Nkiruka: 33,
        Obiageli: 67,
        Ibekwe: 77,
      };

      const retirees: string[] = [];

      const storeRetirementAge: PredicateAction<Record<string, number>> = (
        age,
        name,
      ) => {
        if (age > 65) {
          retirees.push(name);
        }
      };

      Object.keys(records).forEach((name) =>
        storeRetirementAge(records[name], name, records)
      );

      assertEquals(retirees.length, 2);
    });
  });

  describe('PredicateFunc', () => {
    it('is a function', () => {
      const action: PredicateFunc<string, []> = () => 'Hello, world!';

      assertEquals(typeof action, 'function');
    });

    it('can be used on arrays', () => {
      type User = {
        name: string;
        age: number;
        role: string;
      };

      const users: User[] = [
        { name: 'Amarachi', age: 58, role: 'user' },
        { name: 'Chinwe', age: 60, role: 'admin' },
        { name: 'Ngozi', age: 62, role: 'user' },
      ];

      const storeAdmin: PredicateFunc<string, User[]> = (user) => {
        if (user.role === 'admin') {
          return `Admin:${user.name}`;
        }

        return user.name;
      };

      const list = users.map(storeAdmin).join(' ');

      assertEquals(list, 'Amarachi Admin:Chinwe Ngozi');
    });

    it('can be used on objects', () => {
      const records: Record<string, number> = {
        Chidimma: 45,
        Ifeatu: 29,
        Nkiruka: 33,
        Obiageli: 67,
        Ibekwe: 77,
      };

      const storeRetirementAge: PredicateFunc<string, Record<string, number>> =
        (
          age,
          name,
        ) => {
          if (age > 65) {
            return `${name} can retire`;
          }

          return name;
        };

      const list = Object.keys(records).map((name) =>
        storeRetirementAge(records[name], name, records)
      ).join(' ');

      assertEquals(
        list,
        'Chidimma Ifeatu Nkiruka Obiageli can retire Ibekwe can retire',
      );
    });
  });

  describe('Primitive', () => {
    it('is a nilable scalar', () => {
      function format(value: Primitive): string {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';

        return String(value);
      }

      const nullValue = format(null);
      const undefinedValue = format(undefined);
      const numberValue = format(25);
      const stringValue = format('Hello, world!');
      const booleanValue = format(true);

      assertEquals(nullValue, 'null');
      assertEquals(undefinedValue, 'undefined');
      assertEquals(numberValue, '25');
      assertEquals(stringValue, 'Hello, world!');
      assertEquals(booleanValue, 'true');
    });
  });

  describe('PrimitiveKey', () => {
    it('is a value used for keying object', () => {
      const nameSymbol = Symbol('name');
      const obj: Record<PrimitiveKey, number> = {
        4889576862: 87887511,
        userId: 9499963939,
        [nameSymbol]: 97503169,
      };

      const keys = Object.keys(obj);

      assertEquals(keys.length, 2);
    });
  });

  describe('PropertyValue', () => {
    it('gets the value type of a nested property', () => {
      type User = {
        name: string;
        address: {
          city: string;
          country: string;
          zip: number;
        };
      };

      const user: User = {
        name: 'Ifesinachi',
        address: {
          city: 'Pontiac',
          country: 'US',
          zip: 48342,
        },
      };

      const city: PropertyValue<User, 'address.city'> = user.address.city;
      const country: PropertyValue<User, 'address.country'> =
        user.address.country;
      const zip: PropertyValue<User, 'address.zip'> = user.address.zip;

      assertEquals(city, 'Pontiac');
      assertEquals(country, 'US');
      assertEquals(zip, 48342);
    });
  });

  describe('Quadruple', () => {
    it('is a tuple with 4 items', () => {
      type Hex = Quadruple<HexValue>;

      function hexToNumber(hex: Hex): number {
        return parseInt(hex.join(''), 16);
      }

      const num1 = hexToNumber([9, 6, 7, 'B']);
      const num2 = hexToNumber(['A', 'C', 3, 'D']);

      assertEquals(num1, 38523);
      assertEquals(num2, 44093);
    });
  });

  describe('Quaternary', () => {
    it('is a tuple with 4 items', () => {
      type Hex = Quaternary<HexValue>;

      function hexToNumber(hex: Hex): number {
        return parseInt(hex.join(''), 16);
      }

      const num1 = hexToNumber([9, 6, 7, 'B']);
      const num2 = hexToNumber(['A', 'C', 3, 'D']);

      assertEquals(num1, 38523);
      assertEquals(num2, 44093);
    });
  });

  describe('Quinary', () => {
    it('is a tuple with 5 items', () => {
      type Address = Quinary<number, string, string, string, string>;

      function formatAddress(address: Address): string {
        const [num, suite, stDir, street, stType] = address;

        return `${num} ${suite} ${stDir}. ${street} ${stType}.`;
      }

      const address1 = formatAddress([123, 'Apt 2', 'N', 'Main', 'St']);
      const address2 = formatAddress([456, 'Ste 3', 'S', 'Broad', 'Ave']);

      assertEquals(address1, '123 Apt 2 N. Main St.');
      assertEquals(address2, '456 Ste 3 S. Broad Ave.');
    });
  });

  describe('Quintuple', () => {
    it('is a tuple with 5 items', () => {
      type Address = Quintuple<number, string, string, string, string>;

      function formatAddress(address: Address): string {
        const [num, suite, stDir, street, stType] = address;

        return `${num} ${suite} ${stDir}. ${street} ${stType}.`;
      }

      const address1 = formatAddress([123, 'Apt 2', 'N', 'Main', 'St']);
      const address2 = formatAddress([456, 'Ste 3', 'S', 'Broad', 'Ave']);

      assertEquals(address1, '123 Apt 2 N. Main St.');
      assertEquals(address2, '456 Ste 3 S. Broad Ave.');
    });
  });

  describe('ReducerFunc', () => {
    it('is a function', () => {
      const action: ReducerFunc<number, number[]> = (acc, value) => acc + value;

      assertEquals(typeof action, 'function');
    });

    it('can be used to reduce an array', () => {
      const numbers = [1, 2, 3, 4, 5];
      const getSum: ReducerFunc<number, number[]> = (acc, value) => acc + value;
      const sum = numbers.reduce(getSum, 0);

      assertEquals(sum, 15);
    });

    it('can be used to reduce an object', () => {
      const numbers: Record<string, number> = { a: 1, b: 2, c: 3, d: 4, e: 5 };
      const getSum: ReducerFunc<number, typeof numbers> = (acc, value) =>
        acc + value;
      const sum = Object.entries(numbers).reduce(
        (acc, [key, value]) => getSum(acc, value, key, numbers),
        0,
      );

      assertEquals(sum, 15);
    });
  });

  describe('Register', () => {
    it("doesn't require key definition", () => {
      const userExp: Register<number> = {
        Chihiro: 21,
        Waka: 52,
        Aemi: 39,
        Yuzu: 63,
        Chinami: 21,
      };

      const sumOfExp = Object.values(userExp).reduce(
        (acc, value) => acc + value,
        0,
      );

      assertEquals(sumOfExp, 196);
    });

    it('can specify named keys', () => {
      type Users = 'Scheving' | 'Valdís' | 'Camilla' | 'Jón';

      const userExp: Register<number, Users> = {
        Scheving: 25,
        Valdís: 30,
        Camilla: 20,
        Jón: 45,
      };

      const sumOfExp = Object.values(userExp).reduce(
        (acc, value) => acc + value,
        0,
      );

      assertEquals(sumOfExp, 120);
    });
  });

  describe('SafeRegister', () => {
    it("doesn't require key definition", () => {
      const userExp: SafeRegister<number> = {
        Brenda: 30,
        Mahmud: 22,
        Juliët: 16,
        Dhiraj: 29,
        Neşe: 36,
      };

      const sumOfExp = Object.values(userExp).reduce(
        (acc, value) => acc! + (value === undefined ? 0 : value),
        0,
      );

      assertEquals(sumOfExp, 133);
    });

    it('can specify named keys', () => {
      type Users = 'Eden' | 'Genet' | 'Anna' | 'Winta';

      const userExp: SafeRegister<number, Users> = {
        Eden: 15,
        Genet: 10,
      };

      const sumOfExp = Object.values(userExp).reduce(
        (acc, value) => acc + value,
        0,
      );

      assertEquals(sumOfExp, 25);
    });
  });

  describe('Senary', () => {
    it('is a tuple with 6 items', () => {
      type Address = Senary<number, string, string, string, string, number>;

      function formatAddress(address: Address): string {
        const [num, suite, stDir, street, stType, zip] = address;

        return `${num} ${suite} ${stDir}. ${street} ${stType}. ${zip}`;
      }

      const address1 = formatAddress([123, 'Apt 2', 'N', 'Main', 'St', 90602]);
      const address2 = formatAddress([
        456,
        'Ste 3',
        'S',
        'Broad',
        'Ave',
        44142,
      ]);

      assertEquals(address1, '123 Apt 2 N. Main St. 90602');
      assertEquals(address2, '456 Ste 3 S. Broad Ave. 44142');
    });
  });

  describe('Septenary', () => {
    it('is a tuple with 7 items', () => {
      type Address = Septenary<number, string>;

      function formatAddress(address: Address): string {
        const [num, suite, stDir, street, stType, city, state] = address;

        return `${num} ${suite} ${stDir}. ${street} ${stType}. ${city}, ${state}`;
      }

      const address1 = formatAddress([
        123,
        'Apt 2',
        'N',
        'Main',
        'St',
        'South Bend',
        'IN',
      ]);
      const address2 = formatAddress([
        456,
        'Ste 3',
        'S',
        'Broad',
        'Ave',
        'Syracuse',
        'NY',
      ]);

      assertEquals(address1, '123 Apt 2 N. Main St. South Bend, IN');
      assertEquals(address2, '456 Ste 3 S. Broad Ave. Syracuse, NY');
    });
  });

  describe('Septuple', () => {
    it('is a tuple with 7 items', () => {
      type Address = Septuple<number, string>;

      function formatAddress(address: Address): string {
        const [num, suite, stDir, street, stType, city, state] = address;

        return `${num} ${suite} ${stDir}. ${street} ${stType}. ${city}, ${state}`;
      }

      const address1 = formatAddress([
        123,
        'Apt 2',
        'N',
        'Main',
        'St',
        'South Bend',
        'IN',
      ]);
      const address2 = formatAddress([
        456,
        'Ste 3',
        'S',
        'Broad',
        'Ave',
        'Syracuse',
        'NY',
      ]);

      assertEquals(address1, '123 Apt 2 N. Main St. South Bend, IN');
      assertEquals(address2, '456 Ste 3 S. Broad Ave. Syracuse, NY');
    });
  });

  describe('Sextuple', () => {
    it('is a tuple with 6 items', () => {
      type Address = Sextuple<number, string, string, string, string, number>;

      function formatAddress(address: Address): string {
        const [num, suite, stDir, street, stType, zip] = address;

        return `${num} ${suite} ${stDir}. ${street} ${stType}. ${zip}`;
      }

      const address1 = formatAddress([123, 'Apt 2', 'N', 'Main', 'St', 90602]);
      const address2 = formatAddress([
        456,
        'Ste 3',
        'S',
        'Broad',
        'Ave',
        44142,
      ]);

      assertEquals(address1, '123 Apt 2 N. Main St. 90602');
      assertEquals(address2, '456 Ste 3 S. Broad Ave. 44142');
    });
  });

  describe('Single', () => {
    it('is a tuple with 1 item', () => {
      type Actions =
        | 'add'
        | 'sub'
        | 'div'
        | 'mx'
        | 'pow'
        | 'mod';

      type ItemTypes =
        | Empty
        | Single<number>
        | Triple<number, number, Actions>;

      function doMath(items: ItemTypes): number {
        if (!items.length) return 0;
        if (items.length === 1) return items[0];

        const [op1, op2, op] = items;

        if (op === 'add') return op1 + op2;
        if (op === 'sub') return op1 - op2;
        if (op === 'div') return op1 / op2;
        if (op === 'mx') return op1 * op2;
        if (op === 'pow') return Math.pow(op1, op2);

        return op1 % op2;
      }

      assertEquals(doMath([]), 0);
      assertEquals(doMath([25]), 25);
      assertEquals(doMath([2, 4, 'pow']), 16);
      assertEquals(doMath([10, 5, 'div']), 2);
    });
  });

  describe('Singleton', () => {
    it('is a tuple with 1 item', () => {
      type Actions =
        | 'add'
        | 'sub'
        | 'div'
        | 'mx'
        | 'pow'
        | 'mod';

      type ItemTypes =
        | Empty
        | Singleton<number>
        | Triple<number, number, Actions>;

      function doMath(items: ItemTypes): number {
        if (!items.length) return 0;
        if (items.length === 1) return items[0];

        const [op1, op2, op] = items;

        if (op === 'add') return op1 + op2;
        if (op === 'sub') return op1 - op2;
        if (op === 'div') return op1 / op2;
        if (op === 'mx') return op1 * op2;
        if (op === 'pow') return Math.pow(op1, op2);

        return op1 % op2;
      }

      assertEquals(doMath([]), 0);
      assertEquals(doMath([25]), 25);
      assertEquals(doMath([2, 4, 'pow']), 16);
      assertEquals(doMath([10, 5, 'div']), 2);
    });
  });

  describe('Ternary', () => {
    it('is a tuple with 3 items', () => {
      type Actions =
        | 'add'
        | 'sub'
        | 'div'
        | 'mx'
        | 'pow'
        | 'mod';

      type ItemTypes =
        | Nullary
        | Unary<number>
        | Ternary<number, number, Actions>;

      function doMath(items: ItemTypes): number {
        if (!items.length) return 0;
        if (items.length === 1) return items[0];

        const [op1, op2, op] = items;

        if (op === 'add') return op1 + op2;
        if (op === 'sub') return op1 - op2;
        if (op === 'div') return op1 / op2;
        if (op === 'mx') return op1 * op2;
        if (op === 'pow') return Math.pow(op1, op2);

        return op1 % op2;
      }

      assertEquals(doMath([]), 0);
      assertEquals(doMath([25]), 25);
      assertEquals(doMath([2, 4, 'pow']), 16);
      assertEquals(doMath([10, 5, 'div']), 2);
    });
  });

  describe('Tetradic', () => {
    it('is a tuple with 4 items', () => {
      type Hex = Tetradic<HexValue>;

      function hexToNumber(hex: Hex): number {
        return parseInt(hex.join(''), 16);
      }

      const num1 = hexToNumber([9, 6, 7, 'B']);
      const num2 = hexToNumber(['A', 'C', 3, 'D']);

      assertEquals(num1, 38523);
      assertEquals(num2, 44093);
    });
  });

  describe('Triadic', () => {
    it('is a tuple with 3 items', () => {
      type Actions =
        | 'add'
        | 'sub'
        | 'div'
        | 'mx'
        | 'pow'
        | 'mod';

      type ItemTypes =
        | Niladic
        | Monadic<number>
        | Triadic<number, number, Actions>;

      function doMath(items: ItemTypes): number {
        if (!items.length) return 0;
        if (items.length === 1) return items[0];

        const [op1, op2, op] = items;

        if (op === 'add') return op1 + op2;
        if (op === 'sub') return op1 - op2;
        if (op === 'div') return op1 / op2;
        if (op === 'mx') return op1 * op2;
        if (op === 'pow') return Math.pow(op1, op2);

        return op1 % op2;
      }

      assertEquals(doMath([]), 0);
      assertEquals(doMath([25]), 25);
      assertEquals(doMath([2, 4, 'pow']), 16);
      assertEquals(doMath([10, 5, 'div']), 2);
    });
  });

  describe('Triadic', () => {
    it('is a tuple with 3 items', () => {
      type Actions =
        | 'add'
        | 'sub'
        | 'div'
        | 'mx'
        | 'pow'
        | 'mod';

      type ItemTypes =
        | Empty
        | Single<number>
        | Triple<number, number, Actions>;

      function doMath(items: ItemTypes): number {
        if (!items.length) return 0;
        if (items.length === 1) return items[0];

        const [op1, op2, op] = items;

        if (op === 'add') return op1 + op2;
        if (op === 'sub') return op1 - op2;
        if (op === 'div') return op1 / op2;
        if (op === 'mx') return op1 * op2;
        if (op === 'pow') return Math.pow(op1, op2);

        return op1 % op2;
      }

      assertEquals(doMath([]), 0);
      assertEquals(doMath([25]), 25);
      assertEquals(doMath([2, 4, 'pow']), 16);
      assertEquals(doMath([10, 5, 'div']), 2);
    });
  });

  describe('Unary', () => {
    it('is a tuple with 1 item', () => {
      type Actions =
        | 'add'
        | 'sub'
        | 'div'
        | 'mx'
        | 'pow'
        | 'mod';

      type ItemTypes =
        | Nullary
        | Unary<number>
        | Ternary<number, number, Actions>;

      function doMath(items: ItemTypes): number {
        if (!items.length) return 0;
        if (items.length === 1) return items[0];

        const [op1, op2, op] = items;

        if (op === 'add') return op1 + op2;
        if (op === 'sub') return op1 - op2;
        if (op === 'div') return op1 / op2;
        if (op === 'mx') return op1 * op2;
        if (op === 'pow') return Math.pow(op1, op2);

        return op1 % op2;
      }

      assertEquals(doMath([]), 0);
      assertEquals(doMath([25]), 25);
      assertEquals(doMath([2, 4, 'pow']), 16);
      assertEquals(doMath([10, 5, 'div']), 2);
    });
  });
});
