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

import radixSort from './radix-sort';

describe('radixSort', () => {
  test('sorts array elements with 3 entries', () => {
    const input = [
      [9, 4, 0], [4, 2, 3], [4, 2, 1], [1, 0, 6], [4, 2, 5], [4, 6, 8],
    ];

    const result = radixSort(input);

    expect(result).toEqual([
      [1, 0, 6], [4, 2, 1], [4, 2, 3], [4, 2, 5], [4, 6, 8], [9, 4, 0],
    ]);
  });

  test('uses the given function to compute each subarray', () => {
    const input = [
      { a: 1, b: [9, 4, 0] },
      { a: 2, b: [4, 2, 3] },
      { a: 3, b: [4, 2, 1] },
      { a: 4, b: [1, 0, 6] },
      { a: 5, b: [4, 2, 5] },
      { a: 6, b: [4, 6, 8] },
    ];

    const result = radixSort(input, entry => entry.b);

    expect(result).toEqual([
      { a: 4, b: [1, 0, 6] },
      { a: 3, b: [4, 2, 1] },
      { a: 2, b: [4, 2, 3] },
      { a: 5, b: [4, 2, 5] },
      { a: 6, b: [4, 6, 8] },
      { a: 1, b: [9, 4, 0] },
    ]);
  });

  test('returns the original array when there is only one entry to sort', () => {
    const input = [
      [1, 2],
    ];

    const result = radixSort(input);

    expect(result).toBe(input);
  });

  test('returns the original array when there are no entries to sort', () => {
    const input = [];

    const result = radixSort(input);

    expect(result).toBe(input);
  });

  test('returns the original array when the sub-arrays are empty', () => {
    const input = [
      [], [], [],
    ];

    const result = radixSort(input);

    expect(result).toBe(input);
  });

  test('throws an error if a sub-array is shorter than the first sub-array', () => {
    const input = [
      [9, 4, 0],
      [4, 2, 3],
      [4, 2, 1],
      [1, 0, 6],
      [4, 2],
      [4, 6, 8],
    ];

    expect(() => radixSort(input)).toThrow(Error);
  });
});
