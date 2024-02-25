/**
 * This file contains package interfaces.
 *
 * @copyright 2024 integereleven. All rights reserved. MIT license.
 */

/**
 * The `IHelpful` interface provides a consistent property providing a URL to help resources.
 *
 * @example
 * ```ts
 * class Exception extends Error implements IHelpful {
 *  helpUrl = 'https://example.com';
 * }
 *
 * try {
 *   throw new Exception('I make stuff up. Nothing really happened');
 * } catch(e) {
 *   console.log((e as IHelpful).helpUrl);
 *   //  https://example.com
 * }
 * ```
 */
export interface IHelpful {
  /**
   * The help URL for this object type.
   */
  helpUrl: string;
}
