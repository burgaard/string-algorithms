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

import suffixArray, {
  createSuffixArray,
  stringToSequence,
  sampleSequence,
  radixSort,
  samplesToSequence,
  sampleToString,
  rankSortedSamples,
  createNonSampledPairs,
  merge,
} from './suffix-array';

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

  const sequence = s + terminator;
  const counter = {};

  let prev = sa[0];
  counter[prev] = 1;
  expect(prev).toBeLessThanOrEqual(n);
  for (let i = 1; i <= n; i++) {
    const next = sa[i];
    expect(next).toBeLessThanOrEqual(n);

    expect(counter).not.toHaveProperty(`${next}`);
    counter[next] = 1;

    expectStringOrder(sequence.slice(prev), sequence.slice(next));

    prev = next;
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
      const s = ' 1 2 apple 3 4~4 5 apple 6 7!8 9 apple 1 2@apple 3 4#5 6 apple$apple%';

      const result = suffixArray(s, '^');

      expectSuffixArray(s, '^', result);
    });

    test('handles recursion', () => {
      const s = 'abc3abc2abc1';

      const result = suffixArray(s, '$');

      expectSuffixArray(s, '$', result);
    });

    test('handles no recursion', () => {
      const s = 'abcdefghijklmnopqrstuvwxyz';

      const result = suffixArray(s, '$');

      expectSuffixArray(s, '$', result);
    });
  });

  describe('createSuffixArray', () => {
    test('handles sequences of length 2 when sequence[0] < sequence[1]', () => {
      expect(createSuffixArray([0, 1], 2)).toEqual([0, 1]);
    });

    test('handles sequences of length 2 when sequence[1] < sequence[0]', () => {
      expect(createSuffixArray([1, 0], 2)).toEqual([1, 0]);
    });

    test('handles sequences of length 1', () => {
      expect(createSuffixArray([0], 1)).toEqual([0]);
    });

    test('handles sequences of length 0', () => {
      expect(createSuffixArray([], 0)).toEqual([]);
    });
  });

  describe('stringToSequence', () => {
    test('converts a string to an array of unicodes', () => {
      const s = 'monsoonnomnoms';

      const result = stringToSequence(s);

      expect(result).toEqual([
        109, 111, 110, 115, 111, 111, 110, 110, 111, 109, 110, 111, 109, 115,
      ]);
    });
  });

  describe('sampleSequence', () => {
    test('returns the sampled arrays', () => {
      //                m  o  n  s  o  o  n  n  o  m  n  o  m  s  $
      const sequence = [1, 2, 3, 4, 2, 2, 3, 3, 2, 1, 3, 2, 1, 4, 5];

      const result = sampleSequence(sequence, 5);

      expect(result).toEqual([
        [1, 2, 3, 4],
        [4, 2, 2, 3],
        [7, 3, 2, 1],
        [10, 3, 2, 1],
        [13, 4, 5, 5],
        [2, 3, 4, 2],
        [5, 2, 3, 3],
        [8, 2, 1, 3],
        [11, 2, 1, 4],
        [14, 5, 5, 5],
      ]);
    });

    test('pads b0 and b1 so the length is a multiple of 3', () => {
      //                m  o  n  s  o  o  n  n  o  m  n  o  m  $
      const sequence = [1, 2, 3, 4, 2, 2, 3, 3, 2, 1, 3, 2, 1, 5];

      const result = sampleSequence(sequence, 5);

      expect(result).toEqual([
        [1, 2, 3, 4],
        [4, 2, 2, 3],
        [7, 3, 2, 1],
        [10, 3, 2, 1],
        [13, 5, 5, 5],
        [2, 3, 4, 2],
        [5, 2, 3, 3],
        [8, 2, 1, 3],
        [11, 2, 1, 5],
      ]);
    });

    test('handles sequences of length 3', () => {
      //         m o $
      const sequence = [1, 2, 3];

      const result = sampleSequence(sequence, 3);

      expect(result).toEqual([[1, 2, 3, 3], [2, 3, 3, 3]]);
    });

    test('throws an error if the sequence only contains 2 characters', () => {
      //         m $
      const sequence = [1, 2];

      expect(() => sampleSequence(sequence, 2)).toThrow();
    });

    test('throws an error if the sequence only contains 1 character', () => {
      //         $
      const sequence = [1];

      expect(() => sampleSequence(sequence, 1)).toThrow();
    });

    test('throws an error if the sequence is empty', () => {
      const sequence = [];

      expect(() => sampleSequence(sequence, 0)).toThrow();
    });
  });

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

  describe('samplesToSequence', () => {
    test('converts an array of samples to a sequence', () => {
      const sampledPositions = [
        [1, 111, 110, 115], //  onsoonnomnoms$
        [4, 111, 111, 110], //  oonnomnoms$
        [7, 110, 111, 109], //  nomnoms$
        [10, 110, 111, 109], // noms$
        [13, 115, 36, 36], //   s$
        [2, 110, 115, 111], //  nsoonnomnoms$
        [5, 111, 110, 110], //  onnomnoms$
        [8, 111, 109, 110], //  omnoms$
        [11, 111, 109, 115], // oms$
        [14, 36, 36, 36], //    $
      ];

      const sortedSamples = [
        [14, 36, 36, 36], // $
        [7, 110, 111, 109], //  nomnoms$
        [10, 110, 111, 109], // noms$
        [2, 110, 115, 111], //  nsoonnomnoms$
        [8, 111, 109, 110], //  omnoms$
        [11, 111, 109, 115], // oms$
        [5, 111, 110, 110], //  onnomnoms$
        [1, 111, 110, 115], //  onsoonnomnoms$
        [4, 111, 111, 110], //  oonnomnoms$
        [13, 115, 36, 36], //   s$
      ];

      const output = samplesToSequence(sampledPositions, sortedSamples);

      expect(output).toEqual({
        unique: false,
        samplesSequence: [
          39, // '
          40, // (
          34, // "
          34, // "
          41, // )
          35, // #
          38, // &
          36, // $
          37, // %
          33, // !
        ],
        samplesTerminator: 42,
      });
    });

    test('returns unique == true if all samples are unique', () => {
      const sampledPositions = [
        [0, 97, 2], // abcdefghijklmnopqrstuvwxyz$
        [3, 100, 4], // defghijklmnopqrstuvwxyz$
        [6, 103, 6], // ghijklmnopqrstuvwxyz$
        [9, 106, 8], // jklmnopqrstuvwxyz$
        [12, 109, 10], // mnopqrstuvwxyz$
        [15, 112, 12], // pqrstuvwxyz$
        [18, 115, 14], // stuvwxyz$
        [21, 118, 16], // vwxyz$
        [24, 121, 18], // yz$
      ];

      const sortedSamples = [
        [26, 36, 36, 36], // $
        [1, 98, 99, 100], // bcdefghijklmnopqrstuvwxyz$
        [2, 99, 100, 101], // cdefghijklmnopqrstuvwxyz$
        [4, 101, 102, 103], // efghijklmnopqrstuvwxyz$
        [5, 102, 103, 104], // fghijklmnopqrstuvwxyz$
        [7, 104, 105, 106], // hijklmnopqrstuvwxyz$
        [8, 105, 106, 107], // ijklmnopqrstuvwxyz$
        [10, 107, 108, 109], // klmnopqrstuvwxyz$
        [11, 108, 109, 110], // lmnopqrstuvwxyz$
        [13, 110, 111, 112], // nopqrstuvwxyz$
        [14, 111, 112, 113], // opqrstuvwxyz$
        [16, 113, 114, 115], // qrstuvwxyz$
        [17, 114, 115, 116], // rstuvwxyz$
        [19, 116, 117, 118], // tuvwxyz$
        [20, 117, 118, 119], // uvwxyz$
        [22, 119, 120, 121], // wxyz$
        [23, 120, 121, 122], // xyz$
        [25, 122, 36, 36], // z$
      ];

      const output = samplesToSequence(sampledPositions, sortedSamples);

      expect(output).toEqual({
        unique: true,
      });
    });
  });

  describe('sampleToString', () => {
    test('converts an array of unicodes to the corresponding string', () => {
      const input = [109, 111, 110, 115, 111, 111, 110, 110, 111, 109, 110, 111, 109, 115];

      const result = sampleToString(input);

      expect(result).toEqual('monsoonnomnoms');
    });
  });

  describe('createNonSampledPairs', () => {
    test('pairs modulo 3 == 0 letters with the suffix rank of the following letter', () => {
      //                m  o  n  s  o  o  n  n  o  m  n  o  m  s  $
      const sequence = [1, 2, 3, 4, 2, 2, 3, 3, 2, 1, 3, 2, 1, 4, 5];

      const ranks = [
        undefined,
        7,
        3,
        undefined,
        8,
        6,
        undefined,
        1,
        4,
        undefined,
        2,
        5,
        undefined,
        9,
        0,
      ];

      const result = createNonSampledPairs(sequence, ranks);

      expect(result).toEqual([
        [0, 1, 7],
        [3, 4, 8],
        [6, 3, 1],
        [9, 1, 2],
        [12, 1, 9],
      ]);
    });
  });

  describe('rankSortedSamples', () => {
    test('ranks the sorted samples', () => {
      const sortedSamples = [
        [7, 33, 51, 97], //     !3apple4@5apple6#$
        [23, 35, 36, 36], //    #$
        [8, 51, 97, 112], //    3apple4@5apple6#$
        [14, 52, 64, 53], //    4@5apple6#$
        [16, 53, 97, 112], //   5apple6#$
        [22, 54, 35, 36], //    6#$
        [1, 97, 112, 112], //   apple2!3apple4@5apple6#$
        [17, 97, 112, 112], //  apple6#$
        [5, 101, 50, 33], //    e2!3apple4@5apple6#$
        [13, 101, 52, 64], //   e4@5apple6#$
        [4, 108, 101, 50], //   le2!3apple4@5apple6#$
        [20, 108, 101, 54], //  le6#$
        [19, 112, 108, 101], // ple6#$
        [11, 112, 108, 101], // ple4@5apple6#$
        [10, 112, 112, 108], // pple4@5apple6#$
        [2, 112, 112, 108], //  pple2!3apple4@5apple6#$
      ];

      const result = rankSortedSamples(25, sortedSamples);

      expect(result).toEqual([
        undefined,
        7,
        16,
        undefined,
        11,
        9,
        undefined,
        1,
        3,
        undefined,
        15,
        14,
        undefined,
        10,
        4,
        undefined,
        5,
        8,
        undefined,
        13,
        12,
        undefined,
        6,
        2,
        undefined,
        undefined,
        0,
      ]);
    });
  });

  describe('merge', () => {
    test('sorts the non sampled and sampled tuples', () => {
      const sequence = [
        39, // '
        40, // (
        34, // "
        34, // "
        41, // )
        35, // #
        38, // &
        36, // $
        37, // %
        33, // !
        42, // *
      ];

      const sortedNonSampledPairs = [
        [9, 33, 7], // !*
        [3, 34, 6], // ")#&$%!*
        [6, 38, 3], // &$%!*
        [0, 39, 5], // '("")#&$%!*
      ];

      const sortedSamples = [
        [2, 34, 34, 41], // "")#&$%!*
        [5, 35, 38, 36], // #&$%!*
        [7, 36, 37, 33], // $%!*
        [8, 37, 33, 42], // %!*
        [1, 40, 34, 34], // ("")#&$%!*
        [4, 41, 35, 38], // )#&$%!*
        [10, 42, 42, 42], // *
      ];

      const ranks = [
        undefined,
        5,
        1,
        undefined,
        6,
        2,
        undefined,
        3,
        4,
        undefined,
        7,
        0,
      ];

      const result = merge(sequence, sortedNonSampledPairs, sortedSamples, ranks);

      expect(result).toEqual([
        9, // !*
        2, // "")#&$%!*
        3, // ")#&$%!*
        5, // #&$%!*
        7, // $%!*
        8, // %!*
        6, // &$%!*
        0, // '("")#&$%!*
        1, // ("")#&$%!*
        4, // )#&$%!*
        10, // *
      ]);
    });
  });
});
