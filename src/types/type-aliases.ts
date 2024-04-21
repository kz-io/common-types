/**
 * @copyright 2020-2024 integereleven. All rights reserved. MIT license.
 * @file Type aliases for the module. For interfaces, see ./interfaces.ts.
 */

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
