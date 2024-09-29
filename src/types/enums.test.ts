/**
 * @copyright 2020-2024 integereleven. All rights reserved. MIT license.
 * @file This file tests package enums.
 */

import { describe, it } from '@std/testing/bdd';
import { assertEquals } from '@std/assert';

import { ComparisonResult, ListPosition, Parity } from '../mod.ts';

describe('Enums', () => {
  describe('ComparisonResult', () => {
    it('can be used within a native sort function', () => {
      type User = {
        name: string;
        age: number;
      };

      const comparer = (
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

      const users = [
        { name: 'Tiffany', age: 46 },
        { name: 'Florian', age: 56 },
        { name: 'Edgar', age: 25 },
        { name: 'Florian', age: 46 },
      ];

      const sorted = [...users].sort((a, b) => comparer(a, b));
      const sortedList = sorted.map((u) => `${u.name}:${u.age}`).join(' ');
      const reversed = [...users].sort((a, b) => comparer(a, b, true));
      const reversedList = reversed.map((u) => `${u.name}:${u.age}`).join(' ');

      assertEquals(sortedList, 'Edgar:25 Florian:46 Florian:56 Tiffany:46');
      assertEquals(reversedList, 'Tiffany:46 Florian:56 Florian:46 Edgar:25');
    });

    it('should have a Equal value of 0', () =>
      assertEquals(ComparisonResult.Equal, 0));
    it('should have a Lesser value of -1', () =>
      assertEquals(ComparisonResult.Lesser, -1));
    it('should have a Greater value of 1', () =>
      assertEquals(ComparisonResult.Greater, 1));
  });

  describe('ListPosition', () => {
    it('can be used to identify the position of an item in a list', () => {
      function getItemPosition(index: number, length: number): ListPosition {
        if (length === 0) return ListPosition.Outside;
        if (index === 0 && length === 1) return ListPosition.Only;
        if (index === length - 1) return ListPosition.Last;
        if (index === 0) return ListPosition.First;

        return ListPosition.Middle;
      }

      assertEquals(getItemPosition(0, 1), ListPosition.Only);
      assertEquals(getItemPosition(0, 2), ListPosition.First);
      assertEquals(getItemPosition(1, 2), ListPosition.Last);
      assertEquals(getItemPosition(1, 3), ListPosition.Middle);
    });

    it('should have a First value of 1', () =>
      assertEquals(ListPosition.First, 1));
    it('should have a Middle value of 2', () =>
      assertEquals(ListPosition.Middle, 2));
    it('should have a Last value of 4', () =>
      assertEquals(ListPosition.Last, 4));
    it('should have a Only value of 7', () =>
      assertEquals(ListPosition.Only, 7));
    it('should have a Outside value of 0', () =>
      assertEquals(ListPosition.Outside, 0));
    it('should have a Only value cumulative of First, Last, and Middle', () =>
      assertEquals(
        ListPosition.Only,
        ListPosition.First | ListPosition.Last | ListPosition.Middle,
      ));
  });

  describe('Parity', () => {
    it('can be used to identify if a value as even or odd', () => {
      function getItemParity(index: number): Parity {
        return index % 2 === 0 ? Parity.Even : Parity.Odd;
      }

      assertEquals(getItemParity(0), Parity.Even);
      assertEquals(getItemParity(1), Parity.Odd);
      assertEquals(getItemParity(2), Parity.Even);
      assertEquals(getItemParity(3), Parity.Odd);
    });

    it('should have an Even value of 0', () => assertEquals(Parity.Even, 0));
    it('should have an Odd value of 1', () => assertEquals(Parity.Odd, 1));
  });
});
