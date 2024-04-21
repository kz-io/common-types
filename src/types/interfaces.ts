/**
 * @copyright 2020-2024 integereleven. All rights reserved. MIT license.
 * @file Interfaces for the module. For type aliases, see ./type-aliases.ts.
 */

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
