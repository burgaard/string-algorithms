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

import search from './search';

describe('search', () => {
  it('finds one occurrence', () => {
    const result = search('ABC ABCDAB ABCDABCDABDE', 'ABCDABD');

    expect(result).toEqual([15]);
  });

  it('first letter', () => {
    const result = search('ABCD', 'A');

    expect(result).toEqual([0]);
  });

  it('second letter', () => {
    const result = search('ABCD', 'B');

    expect(result).toEqual([1]);
  });

  it('last letter', () => {
    const result = search('ABCD', 'D');

    expect(result).toEqual([3]);
  });

  it('prefix', () => {
    const result = search('ABCD', 'AB');

    expect(result).toEqual([0]);
  });

  it('suffix', () => {
    const result = search('ABCD', 'CD');

    expect(result).toEqual([2]);
  });

  it('infix', () => {
    const result = search('ABCD', 'BC');

    expect(result).toEqual([1]);
  });

  it('multiple occurrences', () => {
    const result = search('ABXYZCDXYZEFXYGHXYZIJ', 'XYZ');

    expect(result).toEqual([2, 7, 16]);
  });
});
