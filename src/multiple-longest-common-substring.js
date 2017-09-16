/**
 *
 * Linear-time computation of the Longest Common Substring.
 *
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
import longestCommonPrefix from './longest-common-prefix';

/**
 * Maps the position of strings s1 ... sK when concatenated into one string.
 * Concrete implementations provide different compromises between O(1) and
 * O(log(K)) lookup times versus O(n) and O(k) space requirements.
 */
export class StringIndexMap {
  /**
   * Initializes a new string index map.
   * @param {number} k the number of expected strings.
   */
  constructor(k = 0) {
    if (typeof k !== 'number') {
      throw TypeError(`k is not an integer: ${typeof k}`);
    }
    if (k < 0) {
      throw Error('k may not be negative');
    }
    this.add = this.add.bind(this);
    this.lookup = this.lookup.bind(this);
    this.toString = this.toString.bind(this);
    this.ranges = new Array(k);
    this.k = 0;
    this.n = 0;
  }

  /* eslint-disable class-methods-use-this */

  /**
   * Adds a substring with the given length.
   * @throws {Error} not implemented.
   */
  add() {
    throw new Error('not implemented');
  }

  /**
   * Looks up the substring corresponding to the given position
   * in the concatenated string.
   * @throws {Error} not implemented.
   */
  lookup() {
    throw new Error('not implemented');
  }

  /**
   * Returns a string representation of the string index map.
   * @return {string} a string representation.
   */
  toString() {
    throw new Error('not implemented');
  }
  /* eslint-enable class-methods-use-this */
}

/**
 * Given a string of length n composed of substrings s1 ... sK, this string index map enables
 * O(log(K)) substring lookup in O(K) space. This implementation is preferable for small K and/or
 * very large n.
 */
export class LogStringIndexMap extends StringIndexMap {
  /**
   * Adds a substring with the given length. O(1)
   * @param {number} length the length of the substring.
   * @return {number} the current total length of all substrings.
   */
  add(length) {
    if (length < 1) {
      throw Error(`the length must be a number greater than 0: ${length}`);
    }
    const m = this.n + length;
    const k = this.k;
    this.ranges[this.k++] = [k, this.n];
    return this.n = m;
  }

  /**
   * Looks up the substring corresponding to the given position
   * in the concatenated string. O(log(K)) binary search.
   * @param {number} position the position in the concatenated string.
   * @return {number} the index of the substring that contains the given position.
   */
  lookup(suffix, start, end) {
    if (start < 0) {
      throw new Error(`start ${start} is less than 0`);
    }
    if (end <= start) {
      throw new Error(`end ${end} is less than or equal to start ${start}`);
    }

    const s = start || 0;
    const e = end || this.ranges.length;
    const n = e - s;
    if (n === 1) {
      return this.ranges[s][0];
    }

    const m = s + (n >>> 1); // eslint-disable-line no-bitwise
    return suffix < this.ranges[m][1] ? this.lookup(suffix, s, m) : this.lookup(suffix, m, e);
  }

  toString() {
    return `[${this.ranges.map(r => `[${r.join(', ')}]`).join(', ')}]`;
  }
}

/**
 * Given a string of length n composed of substrings s1 ... sK, this string index map enables
 * log(1) substring lookup in O(n) space. This implementation is preferable for very large K and/or
 * small n.
 */
export class LinearStringIndexMap extends StringIndexMap {
  constructor() {
    super();
    this.initialize = this.initialize.bind(this);
    this.initialized = false;
  }

  /**
   * Adds a substring with the given length. O(1)
   * @param {number} length the length of the substring.
   * @return {number} the current total length of all substrings.
   */
  add(length) {
    if (length < 1) {
      throw Error(`the length must be a number greater than 0: ${length}`);
    }
    this.initialized = false;
    this.ranges[this.k++] = length;
    return this.n += length;
  }

  /**
   * Fills in the index array in O(n).
   * @return {Boolean} true if the array was initialized, false if no initialization was needed.
   */
  initialize() {
    if (this.initialized) {
      return false;
    }

    this.indexMap = new Array(this.n);

    let i = 0;
    this.ranges.forEach((r, j) => {
      this.indexMap.fill(j, i, i + r);
      i += r;
    });


    return this.initialized = true;
  }

  /**
   * Looks up the substring corresponding to the given position
   * in the concatenated string. O(1) array lookup [O(n) on first lookup to initialize index map]
   * @param {number} position the position in the concatenated string.
   * @return {number} the index of the substring that contains the given position.
   */
  lookup(suffix) {
    this.initialize();

    return this.indexMap[suffix];
  }

  toString() {
    this.initialize();

    return `{\n  ranges: [${this.ranges.join(', ')}],\n  indexMap: [${this.indexMap.join(', ')}]\n}`;
  }
}

function createStringIndexMap(indexMap, k) {
  if (indexMap instanceof StringIndexMap) {
    return indexMap;
  }

  if (typeof indexMap !== 'string') {
    throw new TypeError(`the index map argument must be a string or a StringIndexMap instance: ${typeof indexMap}`);
  }

  switch (indexMap) {
    case 'log':
      return new LogStringIndexMap(k);
    case 'linear':
      return new LinearStringIndexMap(k);
    default:
      throw new Error(`strategy must be either 'log' or 'linear': ${indexMap}`);
  }
}

function ensureNonEmptyString(e) {
  if (typeof e !== 'string') {
    throw new TypeError(`entry is not a string: ${typeof e}`);
  }
  if (e.length === 0) {
    throw new Error('entry is an empty string');
  }
}

/**
 * Finds the longest common substring(s) in the set of given strings. If there
 * are multiple substrings that all share the longest length, then all such
 * substrings are returned. O(n) or O(n * log(K)) depending on the selected
 * string indexing strategy.
 * 
 * @param {string[]} strings an array of strings.
 * @param {string|StringIndexMap} [indexMap='log'] string indexing map. If
 *   given a string, it must be one of 'log' or 'linear'.
 * @return {string|string[]} the longest common substring(s).
 */
export default function multipleLongestCommonSubstring(strings, indexMap = 'log') {
  if (!Array.isArray(strings)) {
    throw new TypeError('strings argument must be an array of strings');
  }

  const k = strings.length;
  // handle trivial cases
  switch (k) {
    case 0:
      return [];
    case 1:
      ensureNonEmptyString(strings[0]);
      return strings;
    default:
      break;
  }

  const stringIndexMap = createStringIndexMap(indexMap, k);

  // append each string as an array of unicodes + unique terminator
  // O(n)
  let terminator = -1;
  const sequence = strings.reduce((a, e) => {
    ensureNonEmptyString(e);
    stringIndexMap.add(e.length + 1);
    return a.concat(e.split('').map(c => c.charCodeAt(0)).concat(terminator--));
  }, []);

  // calculate the suffix array in O(n)
  const sa = suffixArray(sequence, terminator);

  // calculate the longest common prefixes in O(n)
  const lcp = longestCommonPrefix(sequence.concat(terminator), sa);

  let result = [];
  let longest = 1;

  let i = 0;
  while (i < sa.length - 1) {
    const h = lcp[i];
    if (h >= longest) {
      const index = sa[i];
      const entries = {
        [stringIndexMap.lookup(sa[i])]: true,
        [stringIndexMap.lookup(sa[i + 1])]: true,
      };

      let j = i + 2;
      while (j < sa.length && h === lcp[j - 1]) {
        entries[stringIndexMap.lookup(sa[j])] = true;
        j++;
      }

      if (Object.keys(entries).length === k) {
        if (h === longest) {
          result.push([index, h]);
        } else {
          result = [[index, h]];
          longest = h;
        }
      }

      i = j - 1;
    } else {
      i++;
    }
  }

  return result.map(r => sequence.slice(r[0], r[0] + r[1]).map(c => String.fromCharCode(c)).join(''));
}
