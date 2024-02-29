/**
 * This file contains package type aliases.
 *
 * @copyright 2024 integereleven. All rights reserved. MIT license.
 */

/**
 * An alias of any object with any indexable property key and unknown (indeterminate) value.
 *
 * @example
 * ```ts
 * const reg: IndeterminateObject = {
 *   name: "Dakota Cortez",
 *   age: 15,
 *   username: "dc655"
 * };
 *
 * function readReg<K extends keyof IndeterminateObject>(key: K) {
 *   return reg[key];
 * }
 *
 * console.log(readReg("na"));
 * //  undefined
 * console.log(readReg("name"));
 * //  Dakota Cortez
 * ```
 */
export type IndeterminateObject = Record<number | string | symbol, unknown>;

/**
 * The types of TypeScript decorator targets.
 */
export type DecoratorTarget =
  /** A class decorator. */
  | 'class'
  /** A class method decorator. */
  | 'method'
  /** A class property decorator. */
  | 'property'
  /** A class method parameter decorator. */
  | 'parameter'
  /** A class accessor decorator. */
  | 'accessor';

/**
 * The types of codebases, according to integereleven.
 *
 * > NOTE: Any codebase name. Not yet constrained.
 */
export type Codebase = string;

/**
 * The types of software operations, according to integereleven.
 *
 * > NOTE: Any software operation. Not yet constrained.
 */
export type SoftwareOperation = string;

/**
 * The supported operating systems.
 */
export type SystemOS =
  /** Unix core of Apple products. (mac OS, iOS, iPadOS…) */
  | 'darwin'
  /** Operating system based on the Linux kernel. */
  | 'linux'
  /** Modified version of the Linux kernel designed for touch devices. */
  | 'android'
  /** Proprietary OS developed by Microsoft. */
  | 'windows'
  /** Unix-like operating system descending from Berkeley Software Distribution. */
  | 'freebsd'
  /** Unix-like operating system descending from Berkeley Software Distribution. */
  | 'netbsd'
  /** Proprietary Unix system developed by IBM. */
  | 'aix'
  /** Proprietary Unix system developed by Oracle. */
  | 'solaris'
  /** Unix operating system based on OpenSolaris. */
  | 'illumos';

/**
<<<<<<< HEAD
 * The type of system architectures.
=======
 * The type of system architecture.
>>>>>>> bd96409f2e2e06daad90efe42d1ae114711581c4
 */
export type SystemArchitecture =
  /** 64-bit version of the x86 instruction set. */
  | 'x86_64'
  /** 64-bit extension of the ARM architecture family. */
  | 'aarch64';
