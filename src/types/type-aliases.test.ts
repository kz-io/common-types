/**
 * @copyright 2020-2024 integereleven. All rights reserved. MIT license.
 * @file This file type tests the module interfaces.
 */

import { describe, it } from '@std/testing/bdd';
import { assertEquals } from '@std/assert';

import type {
  Codebase,
  Contructor,
  DecoratorTarget,
  Defined,
  IndeterminateObject,
  Scalar,
  SoftwareOperation,
  SystemArchitecture,
  SystemOS,
} from './type-aliases.ts';

const _codebase0: Codebase = 'package';
const _codebase1: Codebase = 'module';
const _codebase2: Codebase = 'plugin';
const _codebase3: Codebase = 'extension';

class Test {
  constructor() {
    return this;
  }
}

const _constructor: Contructor<Test> = Test;

const _decoratorTargetClass: DecoratorTarget = 'class';
const _decoratorTargetMethod: DecoratorTarget = 'method';
const _decoratorTargetProperty: DecoratorTarget = 'property';
const _decoratorTargetParameter: DecoratorTarget = 'parameter';
const _decoratorTargetAccessor: DecoratorTarget = 'accessor';

const _defined1: Defined<string> = 'defined';
let _defined2: Defined<string>;

const _scalarBoolean: Scalar = true;
const _scalarNumber: Scalar = 1;
const _scalarString: Scalar = 'scalar';
const _scalarSymbol: Scalar = Symbol('scalar');

const _indeterminateObjectEmpty: IndeterminateObject = {};
const _indeterminateObjectNumber: IndeterminateObject = { 0: 'zero' };
const _indeterminateObjectString: IndeterminateObject = { 'one': 1 };
const symbol = Symbol('two');
const _indeterminateObjectSymbol: IndeterminateObject = { [symbol]: 2 };

const _softwareOperation0: SoftwareOperation = 'operation';
const _softwareOperation1: SoftwareOperation = 'process';
const _softwareOperation2: SoftwareOperation = 'task';
const _softwareOperation3: SoftwareOperation = 'workflow';

const _systemArchitectureARM: SystemArchitecture = 'aarch64';
const _systemArchitectureX86: SystemArchitecture = 'x86_64';

const _systemOSAIX: SystemOS = 'aix';
const _systemOSAndroid: SystemOS = 'android';
const _systemOSMacOS: SystemOS = 'darwin';
const _systemOSFreeBSD: SystemOS = 'freebsd';
const _systemOSIllumos: SystemOS = 'illumos';
const _systemOSLinux: SystemOS = 'linux';
const _systemOSNetBSD: SystemOS = 'netbsd';
const _systemOSSolaris: SystemOS = 'solaris';
const _systemOSWindows: SystemOS = 'windows';

describe('types', () => {
  it('should have a codebase type', () => {
    assertEquals(_codebase0, 'package');
    assertEquals(_codebase1, 'module');
    assertEquals(_codebase2, 'plugin');
    assertEquals(_codebase3, 'extension');
  });

  it('should have a constructor type', () => {
    assertEquals(_constructor, Test);
  });

  it('should have a decorator target type', () => {
    assertEquals(_decoratorTargetClass, 'class');
    assertEquals(_decoratorTargetMethod, 'method');
    assertEquals(_decoratorTargetProperty, 'property');
    assertEquals(_decoratorTargetParameter, 'parameter');
    assertEquals(_decoratorTargetAccessor, 'accessor');
  });

  it('should have a defined type', () => {
    assertEquals(_defined1, 'defined');
    assertEquals(_defined2, undefined);

    _defined2 = _defined1;

    assertEquals(_defined2, _defined1);
  });

  it('should have an indeterminate object type', () => {
    assertEquals(_indeterminateObjectEmpty, {});
    assertEquals(_indeterminateObjectNumber, { 0: 'zero' });
    assertEquals(_indeterminateObjectString, { 'one': 1 });
    assertEquals(_indeterminateObjectSymbol, { [symbol]: 2 });
  });

  it('should have a scalar type', () => {
    assertEquals(_scalarBoolean, true);
    assertEquals(_scalarNumber, 1);
    assertEquals(_scalarString, 'scalar');
    assertEquals(_scalarSymbol, _scalarSymbol);
  });

  it('should have a software operation type', () => {
    assertEquals(_softwareOperation0, 'operation');
    assertEquals(_softwareOperation1, 'process');
    assertEquals(_softwareOperation2, 'task');
    assertEquals(_softwareOperation3, 'workflow');
  });

  it('should have a system architecture type', () => {
    assertEquals(_systemArchitectureARM, 'aarch64');
    assertEquals(_systemArchitectureX86, 'x86_64');
  });

  it('should have a system OS type', () => {
    assertEquals(_systemOSAIX, 'aix');
    assertEquals(_systemOSAndroid, 'android');
    assertEquals(_systemOSMacOS, 'darwin');
    assertEquals(_systemOSFreeBSD, 'freebsd');
    assertEquals(_systemOSIllumos, 'illumos');
    assertEquals(_systemOSLinux, 'linux');
    assertEquals(_systemOSNetBSD, 'netbsd');
    assertEquals(_systemOSSolaris, 'solaris');
    assertEquals(_systemOSWindows, 'windows');
  });
});
