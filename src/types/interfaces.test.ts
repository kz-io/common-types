/**
 * @copyright 2020-2024 integereleven. All rights reserved. MIT license.
 * @file This file type tests the module interfaces.
 */

import { describe, it } from '@std/testing/bdd';
import { assertEquals } from '@std/assert';

import type { IHashable, IHelpful } from './interfaces.ts';

const _helpful: IHelpful = {
  helpUrl: 'https://example.com',
};

class _Helpful implements IHelpful {
  helpUrl: string;

  constructor(helpUrl: string) {
    this.helpUrl = helpUrl;
  }
}

const _hashable: IHashable = {
  hash: '0x1234567890abcdef',
};

class _Hashable implements IHashable {
  hash: string;

  constructor(hash: string) {
    this.hash = hash;
  }
}

describe('interfaces', () => {
  it('should have a helpUrl property', () => {
    const helpful = new _Helpful('https://example.com');

    assertEquals(helpful.helpUrl, 'https://example.com');
    assertEquals(_helpful.helpUrl, 'https://example.com');
  });

  it('should have a hash property', () => {
    const hashable = new _Hashable('0x1234567890abcdef');

    assertEquals(hashable.hash, '0x1234567890abcdef');
    assertEquals(_hashable.hash, '0x1234567890abcdef');
  });
});
