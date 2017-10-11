/*
 * Implementation of the linear Knutt-Morris-Pratt string searching algorithm.
 * 
 * https://en.wikipedia.org/wiki/Knuth–Morris–Pratt_algorithm
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

function computeTable(term) {
  const result = new Array(term.length);

  result[0] = -1;
  for (let i = 0; i < term.length; i++) {
    result[i + 1] = result[i] + 1;
    while (result[i + 1] > 0 && term[i] !== term[result[i + 1] - 1]) {
      result[i + 1] = result[result[i + 1] - 1] + 1;
    }
  }
  return result;
}

/**
 * Finds all occurrences of term in text in linear time.
 *
 * @param {string} text the string to be searched.
 * @param {string} term the term to search for.
 * @return [number] an array with the start index of all
 *    occurrences of term in text.
 */
export default function search(text, term) {
  const T = computeTable(term);
  const result = [];

  let i = 0;
  let j = 0;
  while (j < text.length) {
    while (i > -1 && term[i] !== text[j]) {
      i = T[i];
    }

    i++;
    j++;
    if (i >= term.length) {
      result.push(j - i);
      i = T[i];
    }
  }

  return result;
}

