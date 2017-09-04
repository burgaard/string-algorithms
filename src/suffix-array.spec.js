/**
 * Copyright (C) 2017 Kim Burgaard <kim@burgaard.us>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import suffixArray from './suffix-array';
import stringToSequence from './string-sequence';

function expectStringOrder(a, b) {
  let [i, j] = [0, 0];
  while (i < a.length && j < b.length && a.charCodeAt(i) === b.charCodeAt(j)) {
    i++;
    j++;
  }

  let result;

  // eslint-disable-next-line default-case
  switch ((i === a.length ? 1 : 0) + (j === b.length ? 2 : 0)) {
    case 0:
      // a[i] !== b[j]
      result = a.charCodeAt(i) - b.charCodeAt(j);
      break;
    case 1:
      // b is a substring of a
      result = 1;
      break;
    case 2:
      // a is a substring of b
      return;
    case 3:
      // a and b are equal
      return;
  }

  if (result > 0) {
    // eslint-disable-next-line no-console
    throw new Error(`Expected a to compare less than or equal to b:\n    a: ${a}\n    b: ${b}'`);
  }
}

function expectSuffixArray(s, terminator, sa) {
  const n = s.length;
  expect(sa.length).toEqual(n + 1);

  const sequence = [
    ...typeof s === 'string' ? stringToSequence(s) : s,
    typeof terminator === 'number' ? terminator : terminator.charCodeAt(0),
  ];
  const counter = {};

  let prev = sa[0];
  counter[prev] = 1;
  expect(prev).toBeLessThanOrEqual(n);
  if (n > 1) {
    for (let i = 1; i <= n; i++) {
      const next = sa[i];
      expect(next).toBeLessThanOrEqual(n);

      expect(counter).not.toHaveProperty(`${next}`);
      counter[next] = 1;

      expectStringOrder(sequence.slice(prev), sequence.slice(next));

      prev = next;
    }
  }
}

describe('suffix-array', () => {
  describe('suffixArray', () => {
    test('returns the suffix array corresponding to the given string', () => {
      const s = 'monsoonnomnoms';

      const result = suffixArray(s, '$');

      expectSuffixArray(s, '$', result);
    });

    test('handles long strings', () => {
      const sequence = ' 1 2 apple 3 4~4 5 apple 6 7!8 9 apple 1 2@apple 3 4#5 6 apple$apple%'.split('').map(c => c.charCodeAt(0));

      const result = suffixArray(sequence, '^');

      expectSuffixArray(sequence, '^', result);
    });

    test('handles recursion', () => {
      const sequence = 'abc3abc2abc1'.split('').map(c => c.charCodeAt(0));

      const result = suffixArray(sequence, '$');

      expectSuffixArray(sequence, '$', result);
    });

    test('handles no recursion', () => {
      const sequence = 'abcdefghijklmnopqrstuvwxyz'.split('').map(c => c.charCodeAt(0));

      const result = suffixArray(sequence, '$');

      expectSuffixArray(sequence, '$', result);
    });

    test('handles the empty string', () => {
      const result = suffixArray([], '$');

      expectSuffixArray([], '$', result);
    });
  });
});
