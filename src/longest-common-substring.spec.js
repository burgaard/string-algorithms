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

import longestCommonSubstring from './longest-common-substring';

describe('longestCommonSubstring', () => {
  it('finds the longest common substring', () => {
    const result = longestCommonSubstring(['aba', 'bab']);

    expect(result).toEqual(['ab', 'ba']);
  });

  it('handles no strings', () => {
    const result = longestCommonSubstring([]);

    expect(result).toEqual([]);
  });

  it('handles one string', () => {
    const result = longestCommonSubstring(['alpha']);

    expect(result).toEqual(['alpha']);
  });

  it('finds the longest common substring of multiple strings', () => {
    const result = longestCommonSubstring(['1apple2', '2apple3', '3apple4', '4apple5', '5apple6']);

    expect(result).toEqual(['apple']);
  });

  it('works with linear index mapping', () => {
    const result = longestCommonSubstring(['1apple2', '2apple3', '3apple4', '4apple5', '5apple6'], 'linear');

    expect(result).toEqual(['apple']);
  });

  it('finds the longest common substring of multiple strings with no common substring', () => {
    const result = longestCommonSubstring(['aaaa', 'bbbb', 'cccc', 'dddd', 'eeee']);

    expect(result).toEqual([]);
  });

  it('finds the longest common substring of multiple identical strings', () => {
    const result = longestCommonSubstring(['aaaa', 'aaaa', 'aaaa', 'aaaa', 'aaaa']);

    expect(result).toEqual(['aaaa']);
  });

  it('finds the longest common substring of multiple almost identical strings', () => {
    const result = longestCommonSubstring(['aaaa', 'aaaa', 'aaaa', 'aaaa', 'aaas']);

    expect(result).toEqual(['aaa']);
  });

  it('throws an error when given a boolean', () => {
    expect(() => longestCommonSubstring(true)).toThrow();
    expect(() => longestCommonSubstring(false)).toThrow();
  });

  it('throws an error when given a number', () => {
    expect(() => longestCommonSubstring(1)).toThrow();
    expect(() => longestCommonSubstring(-1.2)).toThrow();
  });

  it('throws an error when given an object', () => {
    expect(() => longestCommonSubstring({})).toThrow();
  });

  it('throws an error when given an array with a boolean', () => {
    expect(() => longestCommonSubstring([true])).toThrow();
  });

  it('throws an error when given an array with a number', () => {
    expect(() => longestCommonSubstring([42])).toThrow();
  });

  it('throws an error when given an empty string', () => {
    expect(() => longestCommonSubstring([''])).toThrow();
  });

  it('throws an error when given multiple strings and one is empty', () => {
    expect(() => longestCommonSubstring(['alpha', 'beta', ''])).toThrow();
  });
});
