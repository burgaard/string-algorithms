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

import longestCommonPrefix from './longest-common-prefix';

describe('longest-common-prefix', () => {
  it('computes the longest common prefix from a sequence and its suffix arrray', () => {
    const sequence = [109, 111, 110, 115, 111, 111, 110, 110, 111, 109, 110, 111, 109, 115, 36];
    const suffixArray = [14, 9, 0, 12, 6, 7, 10, 2, 8, 11, 5, 1, 4, 13, 3];

    const result = longestCommonPrefix(sequence, suffixArray);

    expect(result).toEqual([0, 1, 1, 0, 1, 3, 1, 0, 2, 1, 2, 1, 0, 1]);
  });

  it('throws an error when sequence and suffix array are not the same length', () => {
    const sequence = [1, 2];
    const suffixArray = [1, 2, 3];

    expect(() => longestCommonPrefix(sequence, suffixArray)).toThrow();
  });
});
