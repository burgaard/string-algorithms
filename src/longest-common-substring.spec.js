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

import longestCommonSubstring, {
  StringIndexMap,
  LogStringIndexMap,
  LinearStringIndexMap,
} from './longest-common-substring';

describe('StringIndexMap', () => {
  it('defaults the ranges array to length 0', () => {
    const stringIndexMap = new StringIndexMap();

    expect(stringIndexMap.ranges.length).toEqual(0);
    expect(stringIndexMap.k).toEqual(0);
  });

  it('initializes the ranges array to the given length', () => {
    const stringIndexMap = new StringIndexMap(5);

    expect(stringIndexMap.ranges.length).toEqual(5);
    expect(stringIndexMap.k).toEqual(0);
  });

  it('throws an exception if the given argument is a boolean', () => {
    expect(() => new StringIndexMap(false)).toThrow();
    expect(() => new StringIndexMap(true)).toThrow();
  });

  it('throws an exception if the given argument is a string', () => {
    expect(() => new StringIndexMap('42')).toThrow();
    expect(() => new StringIndexMap('')).toThrow();
  });

  it('throws an exception if the given argument is an array', () => {
    expect(() => new StringIndexMap([])).toThrow();
  });

  it('throws an exception if the given argument is an object', () => {
    expect(() => new StringIndexMap({})).toThrow();
  });

  it('throws an exception if the given argument is a function', () => {
    expect(() => new StringIndexMap(() => {})).toThrow();
  });

  it('throws an exception if the given argument is a negative number', () => {
    expect(() => new StringIndexMap(-2)).toThrow();
  });

  it('add throws an exception', () => {
    expect(() => new StringIndexMap(5).add(42)).toThrow();
  });

  it('lookup throws an exception', () => {
    expect(() => new StringIndexMap(5).lookup(1, 2, 3)).toThrow();
  });

  it('toString throws an exception', () => {
    expect(() => new StringIndexMap(5).toString()).toThrow();
  });
});

describe('LogStringIndexMap', () => {
  it('records string lengths by index and start position', () => {
    const stringIndexMap = new LogStringIndexMap(3);

    stringIndexMap.add(5);
    stringIndexMap.add(2);
    stringIndexMap.add(9);

    expect(stringIndexMap.ranges).toEqual([
      [0, 0],
      [1, 5],
      [2, 7],
    ]);
  });

  it('throws an exception if the string is empty', () => {
    const stringIndexMap = new LogStringIndexMap(3);
    expect(() => stringIndexMap.add(0)).toThrow();
  });

  it('looks up a substring', () => {
    const stringIndexMap = new LogStringIndexMap(3);
    stringIndexMap.add(5);
    stringIndexMap.add(2);
    stringIndexMap.add(9);

    expect(stringIndexMap.lookup(0)).toEqual(0);
    expect(stringIndexMap.lookup(1)).toEqual(0);
    expect(stringIndexMap.lookup(2)).toEqual(0);
    expect(stringIndexMap.lookup(3)).toEqual(0);
    expect(stringIndexMap.lookup(4)).toEqual(0);
    expect(stringIndexMap.lookup(5)).toEqual(1);
    expect(stringIndexMap.lookup(6)).toEqual(1);
    expect(stringIndexMap.lookup(7)).toEqual(2);
    expect(stringIndexMap.lookup(8)).toEqual(2);
    expect(stringIndexMap.lookup(9)).toEqual(2);
    expect(stringIndexMap.lookup(10)).toEqual(2);
    expect(stringIndexMap.lookup(11)).toEqual(2);
    expect(stringIndexMap.lookup(12)).toEqual(2);
    expect(stringIndexMap.lookup(13)).toEqual(2);
    expect(stringIndexMap.lookup(14)).toEqual(2);
    expect(stringIndexMap.lookup(15)).toEqual(2);
  });

  it('handles one character strings', () => {
    const stringIndexMap = new LogStringIndexMap(3);
    stringIndexMap.add(1);
    stringIndexMap.add(1);
    stringIndexMap.add(1);

    expect(stringIndexMap.lookup(0)).toEqual(0);
    expect(stringIndexMap.lookup(1)).toEqual(1);
    expect(stringIndexMap.lookup(2)).toEqual(2);
  });

  it('throws an exception if start is less than 0', () => {
    const stringIndexMap = new LogStringIndexMap(3);
    stringIndexMap.add(89);
    expect(() => stringIndexMap.lookup(5, -1)).toThrow();
  });

  it('throws an exception if end is less than or equals start', () => {
    const stringIndexMap = new LogStringIndexMap(3);
    stringIndexMap.add(89);
    expect(() => stringIndexMap.lookup(5, 10, 10)).toThrow();
    expect(() => stringIndexMap.lookup(5, 10, 5)).toThrow();
  });

  it('implements toString', () => {
    const stringIndexMap = new LogStringIndexMap(3);
    stringIndexMap.add(5);
    stringIndexMap.add(2);
    stringIndexMap.add(9);

    expect(stringIndexMap.toString()).toEqual('[[0, 0], [1, 5], [2, 7]]');
  });
});

describe('LinearStringIndexMap', () => {
  it('records string lengths', () => {
    const stringIndexMap = new LinearStringIndexMap(3);

    stringIndexMap.add(5);
    stringIndexMap.add(2);
    stringIndexMap.add(9);

    expect(stringIndexMap.ranges).toEqual([5, 2, 9]);
  });

  it('throws an exception if the string is empty', () => {
    const stringIndexMap = new LinearStringIndexMap(3);
    expect(() => stringIndexMap.add(0)).toThrow();
  });

  it('looks up a substring', () => {
    const stringIndexMap = new LinearStringIndexMap(3);
    stringIndexMap.add(5);
    stringIndexMap.add(2);
    stringIndexMap.add(9);

    expect(stringIndexMap.lookup(0)).toEqual(0);
    expect(stringIndexMap.lookup(1)).toEqual(0);
    expect(stringIndexMap.lookup(2)).toEqual(0);
    expect(stringIndexMap.lookup(3)).toEqual(0);
    expect(stringIndexMap.lookup(4)).toEqual(0);
    expect(stringIndexMap.lookup(5)).toEqual(1);
    expect(stringIndexMap.lookup(6)).toEqual(1);
    expect(stringIndexMap.lookup(7)).toEqual(2);
    expect(stringIndexMap.lookup(8)).toEqual(2);
    expect(stringIndexMap.lookup(9)).toEqual(2);
    expect(stringIndexMap.lookup(10)).toEqual(2);
    expect(stringIndexMap.lookup(11)).toEqual(2);
    expect(stringIndexMap.lookup(12)).toEqual(2);
    expect(stringIndexMap.lookup(13)).toEqual(2);
    expect(stringIndexMap.lookup(14)).toEqual(2);
    expect(stringIndexMap.lookup(15)).toEqual(2);
  });

  it('handles one character strings', () => {
    const stringIndexMap = new LinearStringIndexMap(3);
    stringIndexMap.add(1);
    stringIndexMap.add(1);
    stringIndexMap.add(1);

    expect(stringIndexMap.lookup(0)).toEqual(0);
    expect(stringIndexMap.lookup(1)).toEqual(1);
    expect(stringIndexMap.lookup(2)).toEqual(2);
  });

  it('implements toString', () => {
    const stringIndexMap = new LinearStringIndexMap(3);
    stringIndexMap.add(5);
    stringIndexMap.add(2);
    stringIndexMap.add(9);

    expect(stringIndexMap.toString()).toEqual('{\n  ranges: [5, 2, 9],\n  indexMap: [0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2]\n}');
  });
});

describe('longestCommonSubstring', () => {
  it('finds the longest common substring', () => {
    const result = longestCommonSubstring(['testing mississipi', 'xmississipiy', 'mississipipy']);

    expect(result).toEqual(['mississipi']);
  });

  it('handles string index map == log', () => {
    const result = longestCommonSubstring(['testing mississipi', 'xmississipiy', 'mississipipy'], 'log');

    expect(result).toEqual(['mississipi']);
  });

  it('handles string index map == linear', () => {
    const result = longestCommonSubstring(['testing mississipi', 'xmississipiy', 'mississipipy'], 'linear');

    expect(result).toEqual(['mississipi']);
  });

  it('handles a LogStringIndexMap', () => {
    const result = longestCommonSubstring(['testing mississipi', 'xmississipiy', 'mississipipy'], new LogStringIndexMap(3));

    expect(result).toEqual(['mississipi']);
  });

  it('handles a LinearStringIndexMap', () => {
    const result = longestCommonSubstring(['testing mississipi', 'xmississipiy', 'mississipipy'], new LinearStringIndexMap(3));

    expect(result).toEqual(['mississipi']);
  });

  it('handles identical one character strings', () => {
    const result = longestCommonSubstring(['a', 'a']);

    expect(result).toEqual(['a']);
  });

  it('handles different character strings', () => {
    const result = longestCommonSubstring(['a', 'b']);

    expect(result).toEqual([]);
  });

  it('handles identical two character strings', () => {
    const result = longestCommonSubstring(['ab', 'ab']);

    expect(result).toEqual(['ab']);
  });

  it('handles two character strings with overlap', () => {
    const result = longestCommonSubstring(['ab', 'ba']);

    expect(result).toEqual(['a', 'b']);
  });

  it('handles two character strings with no common substring', () => {
    const result = longestCommonSubstring(['ab', 'cd']);

    expect(result).toEqual([]);
  });

  it('handles short strings', () => {
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
    const result = longestCommonSubstring(['a', 'ax', 'ax', 'a']);

    expect(result).toEqual(['a']);
  });

  it('finds the longest common substring of two almost identical strings', () => {
    const result = longestCommonSubstring(['aaaa', 'aaas']);

    expect(result).toEqual(['aaa']);
  });

  it('handles repeat substring in one string but no common substring', () => {
    const result = longestCommonSubstring(['alphaalpha', 'xyz']);

    expect(result).toEqual([]);
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

  it('throws an error when given an string', () => {
    expect(() => longestCommonSubstring('[]')).toThrow();
    expect(() => longestCommonSubstring('')).toThrow();
  });

  it('throws an error when given an function', () => {
    expect(() => longestCommonSubstring(() => {})).toThrow();
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

  it('throws an error when given an boolean indexMap', () => {
    expect(() => longestCommonSubstring(['a', 'b'], false)).toThrow();
    expect(() => longestCommonSubstring(['a', 'b'], true)).toThrow();
  });

  it('throws an error when given an number indexMap', () => {
    expect(() => longestCommonSubstring(['a', 'b'], 42)).toThrow();
  });

  it('throws an error when given an object indexMap', () => {
    expect(() => longestCommonSubstring(['a', 'b'], {})).toThrow();
  });

  it('throws an error when given an array indexMap', () => {
    expect(() => longestCommonSubstring(['a', 'b'], [])).toThrow();
  });

  it('throws an error when given an function indexMap', () => {
    expect(() => longestCommonSubstring(['a', 'b'], () => {})).toThrow();
  });

  it('throws an error when given an invalid string', () => {
    expect(() => longestCommonSubstring(['a', 'b'], 'alpha')).toThrow();
    expect(() => longestCommonSubstring(['a', 'b'], '')).toThrow();
  });
});
