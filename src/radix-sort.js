/**
 * Linear radix sort implementation.
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

/**
 * Radix sorts an array of entries. If getEntry is not given, then entries is assumed to contain
 * an array of arrays where each sub-array is of the same length. If getEntry is given, then the
 * entries may be of any type, but getEntry must return an array corresponding to each entry.
 * @param {*[]} entries an array of entries to be radix sorted.
 * @param {function} [getEntry] an optional function for retrieving each entry.
 * @return the sorted entries.
 */
export default function radixSort(entries, getEntry = entry => entry) {
  if (entries.length < 2) {
    return entries;
  }

  const n = getEntry(entries[0], 0, entries).length;

  // sort from least significan to most significant digit
  for (let i = 0; i < n; i++) {
    const buckets = {};

    for (let j = 0; j < entries.length; j++) {
      const e = entries[j];
      const entry = getEntry(e, j, entries);
      if (entry.length < n) {
        throw new Error(`Entry is not of length ${n}: ${entry}`);
      }

      // default undefined and null to 0
      const key = entry[entry.length - i - 1] != null ? entry[entry.length - i - 1] : 0;
      if (key in buckets) {
        buckets[key].push(e);
      } else {
        buckets[key] = [e];
      }
    }

    entries = [];
    for (const key in buckets) { // eslint-disable-line guard-for-in
      entries = entries.concat(buckets[key]);
    }
  }

  return entries;
}
