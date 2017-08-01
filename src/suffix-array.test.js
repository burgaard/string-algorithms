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

import getSuffixArray, {
    suffixArray,
    stringToSequence,
    sample,
    radixSort,
    samplesToSequence,
    sampleToString,
    sortedSamplesToSuffixes,
    createNonSampledPairs,
    merge
} from './suffix-array.js';

describe('suffix-array', () => {
    describe('getSuffixArray', () => {
        test('returns the suffix array corresponding to the given string', () => {
            const s = 'monsoonnomnoms';

            const result = getSuffixArray(s, '$');

            expect(result).toEqual([ 1, 7, 3, 4, 8, 6, 3, 1, 4, 0, 2, 5, 2, 9, 0 ]);
        });
    });

    describe('suffixArray', () => {
        test('handles sequences of length 2 when sequence[0] < sequence[1]', () => {
            expect(suffixArray([ 0, 1 ], 2)).toEqual([ 0, 1 ]);
        });

        test('handles sequences of length 2 when sequence[1] < sequence[0]', () => {
            expect(suffixArray([ 1, 0 ], 2)).toEqual([ 1, 0 ]);
        });

        test('handles sequences of length 1', () => {
            expect(suffixArray([ 0 ], 1)).toEqual([ 0 ]);
        });

        test('handles sequences of length 0', () => {
            expect(suffixArray([], 0)).toEqual([]);
        });
    });

    describe('stringToSequence', () => {
        test('converts a string to an array of unicodes', () => {
            const s = 'monsoonnomnoms';

            const result = stringToSequence(s);

            expect(result).toEqual([109, 111, 110, 115, 111, 111, 110, 110, 111, 109, 110, 111, 109, 115]);
        });
    });

    describe('sample', () => {
        test('returns the non sampled and sampled arrays', () => {
            //                 m  o  n  s  o  o  n  n  o  m  n  o  m  s  $
            const sequence = [ 1, 2, 3, 4, 2, 2, 3, 3, 2, 1, 3, 2, 1, 4, 5 ];

            const result = sample(sequence, 5);

            expect(result[ 0 ]).toEqual([
                [ 0, 1 ],
                [ 3, 4 ],
                [ 6, 3 ],
                [ 9, 1 ],
                [ 12, 1 ]
            ]);

            expect(result[ 1 ]).toEqual([
                [ 1, 2, 3, 4 ],
                [ 4, 2, 2, 3 ],
                [ 7, 3, 2, 1 ],
                [ 10, 3, 2, 1 ],
                [ 13, 4, 5, 5 ],
                [ 2, 3, 4, 2 ],
                [ 5, 2, 3, 3 ],
                [ 8, 2, 1, 3 ],
                [ 11, 2, 1, 4 ],
                [ 14, 5, 5, 5 ]
            ]);
        });

        test('pads b0 and b1 so the length is a multiple of 3', () => {
            //                 m  o  n  s  o  o  n  n  o  m  n  o  m  $
            const sequence = [ 1, 2, 3, 4, 2, 2, 3, 3, 2, 1, 3, 2, 1, 5 ];

            const result = sample(sequence, 5);

            expect(result[ 0 ]).toEqual([
                [ 0, 1 ],
                [ 3, 4 ],
                [ 6, 3 ],
                [ 9, 1 ],
                [ 12, 1 ]
            ]);

            expect(result[ 1 ]).toEqual([
                [ 1, 2, 3, 4 ],
                [ 4, 2, 2, 3 ],
                [ 7, 3, 2, 1 ],
                [ 10, 3, 2, 1 ],
                [ 13, 5, 5, 5 ],
                [ 2, 3, 4, 2 ],
                [ 5, 2, 3, 3 ],
                [ 8, 2, 1, 3 ],
                [ 11, 2, 1, 5 ]
            ]);
        });

        test('handles sequences of length 3', () => {
            //                 m  o  $
            const sequence = [ 1, 2, 3 ];

            const result = sample(sequence, 3);

            expect(result[ 0 ]).toEqual([ [ 0, 1 ] ]);
            expect(result[ 1 ]).toEqual([ [ 1, 2, 3, 3 ], [ 2, 3, 3, 3 ] ]);
        });

        test('throws an error if the sequence only contains 2 characters', () => {
            //                 m  $
            const sequence = [ 1, 2 ];

            expect(() => sample(sequence, 2)).toThrow();
        });

        test('throws an error if the sequence only contains 1 character', () => {
            //                 $
            const sequence = [ 1 ];

            expect(() => sample(sequence, 1)).toThrow();
        });

        test('throws an error if the sequence is empty', () => {
            const sequence = [ ];

            expect(() => sample(sequence, 0)).toThrow();
        });
    });

    describe('radixSort', () => {
        test('sorts array elements with 3 entries', () => {
            const input = [
                [ 9, 4, 0 ],
                [ 4, 2, 3 ],
                [ 4, 2, 1 ],
                [ 1, 0, 6 ],
                [ 4, 2, 5 ],
                [ 4, 6, 8 ]
            ];

            const result = radixSort(input);

            expect(result).toEqual([
                [ 1, 0, 6 ],
                [ 4, 2, 1 ],
                [ 4, 2, 3 ],
                [ 4, 2, 5 ],
                [ 4, 6, 8 ],
                [ 9, 4, 0 ]
            ]);
        });

        test('uses the given function to compute each subarray', () => {
            const input = [
                { a: 1, b: [ 9, 4, 0 ] },
                { a: 2, b: [ 4, 2, 3 ] },
                { a: 3, b: [ 4, 2, 1 ] },
                { a: 4, b: [ 1, 0, 6 ] },
                { a: 5, b: [ 4, 2, 5 ] },
                { a: 6, b: [ 4, 6, 8 ] }
            ];

            const result = radixSort(input, entry => entry.b);

            expect(result).toEqual([
                { a: 4, b: [ 1, 0, 6 ] },
                { a: 3, b: [ 4, 2, 1 ] },
                { a: 2, b: [ 4, 2, 3 ] },
                { a: 5, b: [ 4, 2, 5 ] },
                { a: 6, b: [ 4, 6, 8 ] },
                { a: 1, b: [ 9, 4, 0 ] }
            ]);
        });

        test('returns the original array when there is only one entry to sort', () => {
            const input = [
                [ 1, 2 ]
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
                [],
                [],
                []
            ];

            const result = radixSort(input);

            expect(result).toBe(input);
        });

        test('throws an error if a sub-array is shorter than the first sub-array', () => {
            const input = [
                [ 9, 4, 0 ],
                [ 4, 2, 3 ],
                [ 4, 2, 1 ],
                [ 1, 0, 6 ],
                [ 4, 2 ],
                [ 4, 6, 8 ]
            ];

            expect(() => radixSort(input)).toThrow(Error);
        });
    });

    describe('samplesToSequence', () => {
        test('converts an array of samples to a sequence', () => {
            const input = [
                [109, 111, 110],
                [115, 111, 111],
                [110, 110, 111],
                [109, 111, 110]
            ];

            const output = samplesToSequence(input);

            expect(output).toEqual({
                samplesSequence: [0, 1, 2, 0],
                unique: false,
                samplesTerminator: 3
            });
        });

        test('pads strings of length modulo 3 == 2', () => {
            const input = [
                [109, 111, 110],
                [115, 111, 111],
                [110, 110, 111],
                [109, 111, 110],
                [115, 111, 111]
            ];

            const output = samplesToSequence(input);

            expect(output).toEqual({
                samplesSequence: [0, 1, 2, 0, 1],
                unique: false,
                samplesTerminator: 3
            });
        });

        test('does not pad strings of length modulo 3 == 0', () => {
            const input = [
                [109, 111, 110],
                [115, 111, 111],
                [115, 111, 111]
            ];

            const output = samplesToSequence(input);

            expect(output).toEqual({
                samplesSequence: [0, 1, 1],
                unique: false,
                samplesTerminator: 2
            });
        });

        test('returns unique == true if all samples are unique', () => {
            const input = [
                [109, 111, 110],
                [115, 111, 111],
                [110, 110, 111],
                [108, 111, 110],
                [112, 111, 111]
            ];

            const output = samplesToSequence(input);

            expect(output).toEqual({
                samplesSequence: [0, 1, 2, 3, 4],
                unique: true,
                samplesTerminator: 5
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

    describe('sortedSamplesToSuffixes', () => {
        test('populates the suffixes from the sorted samples', () => {
            const sortedSamples = [
                [ 14, 36, 36, 36 ],
                [ 7, 110, 111, 109 ],
                [ 10, 110, 111, 109 ],
                [ 2, 110, 115, 111 ],
                [ 8, 111, 109, 110 ],
                [ 11, 111, 109, 115 ],
                [ 5, 111, 110, 110 ],
                [ 1, 111, 110, 115 ],
                [ 4, 111, 111, 110 ],
                [ 13, 115, 36, 36 ]
            ];

            const result = sortedSamplesToSuffixes(sortedSamples);

            expect(result).toEqual([ , 7, 3, , 8, 6, , 1, 4, , 2, 5, , 9, 0 ]);
        });
    });

    describe('createNonSampledPairs', () => {
        test('pairs modulo 3 == 0 letters with the suffix rank of the following letter', () => {
            //                 m  o  n  s  o  o  n  n  o  m  n  o  m  s  $
            const sequence = [ 1, 2, 3, 4, 2, 2, 3, 3, 2, 1, 3, 2, 1, 4, 5 ];

            const suffixes = [  , 7, 3,  , 8, 6,  , 1, 4,  , 2, 5,  , 9, 0 ];

            const result = createNonSampledPairs(sequence, suffixes);

            expect(result).toEqual([
                [ 1, 7 ],
                [ 4, 8 ],
                [ 3, 1 ],
                [ 1, 2 ],
                [ 1, 9 ]
            ]);
        });

        test('throws an error if sequence and suffixes are not the same length', () => {
            //                 m  o  n  s  o  o  n  n  o  m  n  o  m  s  $
            const sequence = [ 1, 2, 3, 4, 2, 2, 3, 3, 2, 1, 3, 2, 1, 4, 5 ];

            const suffixes = [  , 7, 3,  , 8, 6,  , 1, 4,  , 2, 5,  , 9 ];

            expect(() => createNonSampledPairs(sequence, suffixes)).toThrow();
        });
    });

    describe('merge', () => {
        const sequence = [ 1, 2, 3, 4, 2, 2, 3, 3, 2, 1, 3, 2, 1, 4, 5 ];

        const suffixes = [  , 7, 3,  , 8, 6,  , 1, 4,  , 2, 5,  , 9, 0 ];

        const result = merge(sequence, suffixes);

        expect(result).toEqual([ 1, 7, 3, 4, 8, 6, 3, 1, 4, 0, 2, 5, 2, 9, 0 ]);
    });
});
