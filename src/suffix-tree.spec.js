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

import suffixTree, {
  addSuffixes,
  getCartesianTree
} from './suffix-tree';

describe('suffix-tree', () => {
  test('returns the suffix tree corresponding to the given string', () => {
    const result = suffixTree('aabaaabbabaaaba', '$');

    expect(result).toEqual(
      {
        left: 15,
        right: {
          left: {
            left: {
              left: {
                left: {
                  left: {
                    left: {
                      left: {
                        left: {
                          left: {
                            left: {
                              left: {
                                left: {
                                  left: {
                                    left: 12,
                                    right: 3,
                                    value: 2,
                                  },
                                  right: 0,
                                  value: 1,
                                },
                                right: 13,
                                value: 2,
                              },
                              right: 14,
                              value: 1,
                            },
                            right: 10,
                            value: 4,
                          },
                          right: 4,
                          value: 2,
                        },
                        right: 11,
                        value: 3,
                      },
                      right: 1,
                      value: 1,
                    },
                    right: 8,
                    value: 6,
                  },
                  right: 5,
                  value: 2,
                },
                right: 2,
                value: 0,
              },
              right: 9,
              value: 5,
            },
            right: 7,
            value: 2,
          },
          right: 6,
          value: 1,
        },
        value: undefined,
      },
    );
  });

  test('returns the suffix tree corresponding to the given string', () => {
    const result = suffixTree('1apple2!3apple4@5apple6#', '$');

    expect(result).toEqual(
      {
      },
    );
  });
});
