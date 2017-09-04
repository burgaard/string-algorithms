/**
 * Copyright (C) 2017 Kim Burgaard <kim@burgaard.us>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the Software), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED AS IS, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import suffixTree from './suffix-tree';
// import { suffixTreeToString } from './suffix-tree';

describe('suffix-tree', () => {
  describe('returns the suffix tree corresponding to the given string', () => {
    test('when given "aabaaabbabaaaba"', () => {
      const s = 'aabaaabbabaaaba';
      const result = suffixTree(s, '$');

      expect(result).toEqual({
        height: 0,
        edges: [15], // 
        left: {
          height: 1,
          edges: [14], // a
          left: {
            height: 2,
            edges: [], // 
            left: {
              height: 4,
              edges: [10, 3], // aaaba, aaabbabaaaba
            },
            right: {
              height: 3,
              edges: [4], // aabbabaaaba
              left: {
                height: 4,
                edges: [11, 0], // aaba, aabaaabbabaaaba
              },
            },
          },
          right: {
            height: 2,
            edges: [5], // abbabaaaba
            left: {
              height: 3,
              edges: [12], // aba
              right: {
                height: 6,
                edges: [8, 1], // abaaaba, abaaabbabaaaba
              },
            },
          },
        },
        right: {
          height: 1,
          edges: [6], // bbabaaaba
          left: {
            height: 2,
            edges: [13, 7], // ba, babaaaba
            left: {
              height: 5,
              edges: [9, 2], // baaaba, baaabbabaaaba
            },
          },
        },
      });
    });

    test('when given "1apple2!3apple4@5apple6#"', () => {
      const s = '1apple2!3apple4@5apple6#';
      const result = suffixTree(s);

      expect(result).toEqual({
        height: 0,
        edges: [7, 23, 0, 6, 8, 14, 16, 22, 15],
        // !3apple4@5apple6#,
        // #,
        // 1apple2!3apple4@5apple6#,
        // 2!3apple4@5apple6#,
        // 3apple4@5apple6#,
        // 4@5apple6#,
        // 5apple6#,
        // 6#,
        // @5apple6#
        left: {
          height: 5,
          edges: [1, 9, 17], // apple2!3apple4@5apple6#, apple4@5apple6#, apple6#
        },
        right: {
          height: 0,
          edges: [], // 
          left: {
            height: 1,
            edges: [5, 13, 21], // e2!3apple4@5apple6#, e4@5apple6#, e6#
          },
          right: {
            height: 0,
            edges: [], // 
            left: {
              height: 2,
              edges: [4, 12, 20], // le2!3apple4@5apple6#, le4@5apple6#, le6#
            },
            right: {
              height: 0,
              edges: [24], // 
              left: {
                height: 1,
                edges: [], // 
                left: {
                  height: 3,
                  edges: [3, 11, 19], // ple2!3apple4@5apple6#, ple4@5apple6#, ple6#
                },
                right: {
                  height: 4,
                  edges: [2, 10, 18], // pple2!3apple4@5apple6#, pple4@5apple6#, pple6#
                },
              },
            },
          },
        },
      });
    });

    test('when given "nonsense"', () => {
      const s = 'nonsense';
      const result = suffixTree(s);

      expect(result).toEqual({
        height: 0,
        edges: [], // 
        left: {
          height: 1,
          edges: [4, 7], // ense, e
        },
        right: {
          height: 0,
          edges: [], // 
          left: {
            height: 1,
            edges: [0], // nonsense
            right: {
              height: 3,
              edges: [2, 5], // nsense, nse
            },
          },
          right: {
            height: 0,
            edges: [1, 8], // onsense, 
            left: {
              height: 2,
              edges: [3, 6], // sense, se
            },
          },
        },
      });
    });

    test('when given "monsoonnomnoms"', () => {
      const s = 'monsoonnomnoms';
      const result = suffixTree(s);

      expect(result).toEqual({
        height: 0,
        edges: [], // 
        left: {
          height: 1,
          edges: [9, 0, 12], // mnoms, monsoonnomnoms, ms
        },
        right: {
          height: 0,
          edges: [], // 
          left: {
            height: 1,
            edges: [6, 2], // nnomnoms, nsoonnomnoms
            left: {
              height: 3,
              edges: [7, 10], // nomnoms, noms
            },
          },
          right: {
            height: 0,
            edges: [], // 
            left: {
              height: 1,
              edges: [], // 
              left: {
                height: 2,
                edges: [8, 11], // omnoms, oms
              },
              right: {
                height: 1,
                edges: [4], // oonnomnoms
                left: {
                  height: 2,
                  edges: [5, 1], // onnomnoms, onsoonnomnoms
                },
              },
            },
            right: {
              height: 0,
              edges: [14], // 
              left: {
                height: 1,
                edges: [3, 13], // soonnomnoms, s
              },
            },
          },
        },
      });
    });
  });

  test('when given "mississippi"', () => {
    const s = 'mississippi';
    const result = suffixTree(s);

    expect(result).toEqual({
      height: 0,
      edges: [], // 
      left: {
        height: 1,
        edges: [7, 10], // ippi, i
        left: {
          height: 4,
          edges: [4, 1], // issippi, ississippi
        },
      },
      right: {
        height: 0,
        edges: [0], // mississippi
        left: {
          height: 1,
          edges: [9, 8], // pi, ppi
        },
        right: {
          height: 0,
          edges: [11], // 
          left: {
            height: 1,
            edges: [], // 
            left: {
              height: 2,
              edges: [6, 3], // sippi, sissippi
            },
            right: {
              height: 3,
              edges: [5, 2], // ssippi, ssissippi
            },
          },
        },
      },
    });
  });
});
