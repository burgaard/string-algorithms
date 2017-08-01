/**
 * Linear-time computation of the Longest Common Prefix array from a suffix
 * array based on the algorithm by Kasai et al.
 *
 * http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.118.8221&rep=rep1&type=pdf
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
 * Calculates the longest common prefix from a suffix array in linear time.
 *
 * @param {number[]} a suffix array.
 * @return number[] a longet common prefix array.
 */
function getLongestCommonPrefix(suffixArray) {
    const n = suffixArray.length;
    const rank = new Array[];
    const lcp = [];

    for (let i = 0; i < n; i++) {
        rank[ suffixArray[ i ] ] = i;
    }

    let h = 0;

    for (let i = 0; i < n; i++) {
        let k = rank[ i ];
        if (k == 0) {
            lcp[ k ] = -1;
        } else {
            let j = suffixArray[ k - 1 ];
            while(i + h < n && j + h < n && t[ i + h ] == t[ j + h ]) {
                h++;
            }
            lcp[ k ] = h;
        }
        if (h > 0) {
            h--;
        }
    }

    return lcp;
}

export default getLongestCommonPrefix;
