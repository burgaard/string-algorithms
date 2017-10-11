/*
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

import suffixArray, { suffixArrayToString } from './suffix-array';
import stringToSequence from './string-sequence';

function expectStringOrder(a, b) {
  let [i, j] = [0, 0];
  const na = a.length - 1;
  const nb = b.length - 1;
  while (i < na && j < nb && a[i] === b[j]) {
    i++;
    j++;
  }

  let result;

  switch ((i === na ? 1 : 0) + (j === nb ? 2 : 0)) {
    case 0: {
      const av = a[i];
      const bv = b[j];
      result = (av < 0 && bv < 0) ? true : a[i] <= b[j];
      break;
    }
    case 1:
      // a is a substring of b
      result = true;
      break;
    case 2:
      // b is a substring of a
      result = a[i] < 0 && b[j] < 0;
      break;
    default:
      throw new Error(`a ${a} and b ${b} are equal`);
  }

  if (!result) {
    // eslint-disable-next-line no-console
    throw new Error(`Expected a to compare less than or equal to b:\n    a: ${a}\n    b: ${b}`);
  }
}

function expectSuffixArray(s, terminator, sa) {
  const n = s.length;
  expect(sa.length).toEqual(n + 1);

  const sequence = [
    ...typeof s === 'string' ? stringToSequence(s) : s,
    terminator,
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

describe('suffixArray', () => {
  it('returns the suffix array corresponding to the given string', () => {
    const s = 'monsoonnomnoms';

    const result = suffixArray(s);

    expectSuffixArray(s, -1, result);
  });

  it('accepts array input', () => {
    const s = [97, 120, -1, 97, 120, -2, 97, -3];

    const result = suffixArray(s);

    expectSuffixArray(s, -4, result);
  });

  it('handles a string with repetitive sections', () => {
    const s = ' 1 2 apple 3 4~4 5 apple 6 7!8 9 apple 1 2@apple 3 4#5 6 apple$apple%'.split('').map(c => c.charCodeAt(0));

    const result = suffixArray(s);

    expectSuffixArray(s, -1, result);
  });

  it('handles recursion', () => {
    const sequence = 'abc3abc2abc1'.split('').map(c => c.charCodeAt(0));

    const result = suffixArray(sequence);

    expectSuffixArray(sequence, -1, result);
  });

  it('handles no recursion', () => {
    const sequence = 'abcdefghijklmnopqrstuvwxyz'.split('').map(c => c.charCodeAt(0));

    const result = suffixArray(sequence);

    expectSuffixArray(sequence, -1, result);
  });

  it('handles the empty string', () => {
    const result = suffixArray('');

    expectSuffixArray('', -1, result);
  });

  it('handles a one character string', () => {
    const result = suffixArray('1');

    expectSuffixArray('1', -1, result);
  });

  it('handles a two character string where the first character is less than the second', () => {
    const result = suffixArray('12');

    expectSuffixArray('12', -1, result);
  });

  it('handles a two character string where the second character is less than the first', () => {
    const result = suffixArray('21');

    expectSuffixArray('21', -1, result);
  });

  it('handles array input', () => {
    const result = suffixArray('mississippi'.split('').map(c => c.charCodeAt(0)));

    expectSuffixArray('mississippi', -1, result);
  });

  it('handles a negative terminator input', () => {
    const result = suffixArray('mississippi', -2);

    expectSuffixArray('mississippi', -2, result);
  });

  it('handles a null terminator', () => {
    const result = suffixArray('mississippi', null);

    expectSuffixArray('mississippi', -1, result);
  });

  it('handles an undefined terminator', () => {
    const result = suffixArray('mississippi', undefined);

    expectSuffixArray('mississippi', -1, result);
  });

  it('handles invalid terminator terminator input', () => {
    expect(() => suffixArray('mississippi', 0)).toThrow();
    expect(() => suffixArray('mississippi', 1)).toThrow();
    expect(() => suffixArray('mississippi', 'a')).toThrow();
    expect(() => suffixArray('mississippi', [])).toThrow();
    expect(() => suffixArray('mississippi', {})).toThrow();
    expect(() => suffixArray('mississippi', () => {})).toThrow();
  });
});

describe('suffixArrayToString', () => {
  it('returns a string representation of the given suffix array', () => {
    const s = 'mississippi';
    const sa = suffixArray(s);

    const result = suffixArrayToString(s, sa);

    expect(result).toEqual('[\n  11, // \n  10, // i\n  7, // ippi\n  4, // issippi\n  1, // ississippi\n  0, // mississippi\n  9, // pi\n  8, // ppi\n  6, // sippi\n  3, // sissippi\n  5, // ssippi\n  2, // ssissippi\n]');
  });

  it('handles array input', () => {
    const s = 'mississippi';
    const sa = suffixArray(s);

    const result = suffixArrayToString(s.split('').map(c => c.charCodeAt(0)), sa);

    expect(result).toEqual('[\n  11, // \n  10, // i\n  7, // ippi\n  4, // issippi\n  1, // ississippi\n  0, // mississippi\n  9, // pi\n  8, // ppi\n  6, // sippi\n  3, // sissippi\n  5, // ssippi\n  2, // ssissippi\n]');
  });
});
