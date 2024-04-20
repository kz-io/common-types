/**
 * The @kz/common-types module provides a collection of the most common types
 * used across kz packages, adapted for API consistency and case-coverage,
 * exhaustively tested, and documented thoroughly.
 *
 * ## Installation
 *
 * ### JSR
 *
 * [jsr](https://jsr.io) is used for stable releases.
 *
 * To install, simply run the `deno add` command:
 *
 * ```bash
 * $ deno add @kz/common-types
 * ```
 *
 * You may also specify a specific version:
 *
 * ```bash
 * $ deno add @kz/common-types@^0.0.1
 * ```
 *
 * And then import into your module.
 *
 * ```ts ignore
 * import {} from '@kz/common-types';
 * ```
 *
 * ### denopkg.com
 *
 * If you require a development or unstable release, you can use denopkg.com to import a package.
 *
 * ```json
 * // deno.json
 * {
 *   "imports": {
 *     "@kz/common-types": "https://denopkg.com/kz-io/common-types",
 *   }
 * }
 * ```
 *
 * You may also specify a release or branch.
 *
 * ```json
 * // deno.json
 * {
 *   "imports": {
 *     "@kz/common-types": "https://denopkg.com/kz-io/common-types@dev",
 *   }
 * }
 * ```
 *
 * And then import into your module.
 *
 * ```ts ignore
 * import {} from '@kz/common-types';
 * ```
 *
 * @copyright 2020-2024 integereleven. All rights reserved. MIT license.
 * @module
 */

export * from './src/mod.ts';
