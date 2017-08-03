/**
 * Linear-time suffix array implementation using the DC3 (Difference Cover
 * modulo 3) algorithm.
 *
 * For more information about DC3, see the following resources:
 * http://algo2.iti.kit.edu/documents/jacm05-revised.pdf
 * http://web.stanford.edu/class/archive/cs/cs166/cs166.1146/lectures/11/Small11.pdf
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
 * Calculates the suffix array for the given string and terminator character
 * (which may not be present in the input string).
 *
 * @param {string} s the string to compute the suffix array for.
 * @param {string} terminator a character not in s to use as terminator.
 * @return {string[]} a suffix array.
 */
function getSuffixArray(s, terminator) {
    const sequence = stringToSequence(s);
    const result = suffixArray(sequence, terminator.charCodeAt(0));

    // console.log(result.map(suffix => s.slice(suffix)));

    return result;
}

function stringToSequence(s) {
    return s.split('').map(c => c.charCodeAt(0));
}

function suffixArray(sequence, terminator) {
    const n = sequence.length;

    // handle trivial cases
    switch (n) {
        case 0: return [];
        case 1: return [ 0 ];
        case 2: return sequence[ 0 ] < sequence[ 1 ] ? [ 0, 1 ] : [ 1, 0 ];
        default:
            sequence = [ ...sequence, terminator ]; // add terminator to copy of sequence
            break;
    }

    // calculate the sets B0 and C = B1 u B2
    const [ nonSampledPositions, sampledPositions ] = sample(sequence, terminator);

    let sortedSamples = radixSort(sampledPositions, entry => entry.slice(1));
    let { samplesSequence, unique, samplesTerminator } = samplesToSequence(sortedSamples);
    if (! unique) {
        // recurse to sort the suffixes of sortedSamplesSequence
        const recursiveSuffixArray = suffixArray(samplesSequence, samplesTerminator);
        const sortedSamplesSequence = recursiveSuffixArray.map(suffix => samplesSequence[ suffix ]);
        const sortedSamples = sortedSamplesSeque.map(rank => sortedSamples[ rank ]);
    }

    const s = sequence.map(c => String.fromCharCode(c));

    const suffixes = sortedSamplesToSuffixes(sortedSamples);

    const sortedNonSampledPairs = radixSort(createNonSampledPairs(sequence, suffixes), entry => entry.slice(1));

    let rank = 0;
    sortedNonSampledPairs.forEach(nonSample => suffixes[nonSample[0]] = rank++);

    return merge(sequence, sortedNonSampledPairs, sortedSamples, suffixes);
}

function sample(sequence, terminator) {
    const n = sequence.length;
    if (n < 3) {
        throw new Error(`The sequence must contain at least 3 characters. Actual length: ${ n }`);
    }

    const remainder = n % 3;
    const blocks = (n - remainder) / 3;

    const b0 = [];
    const b1 = [];
    const b2 = [];

    let i = 0;
    while (i < blocks - 1) {
        b0.push(createNonSample(i, sequence));
        b1.push(createSample(i, 1, sequence));
        b2.push(createSample(i, 2, sequence));
        i++;
    }

    b0.push(createNonSample(i, sequence));

    let lastB1 = createSample(i, 1, sequence, 2);
    const lastB2 = createSample(i, 2, sequence, 1);

    i++;

    switch (remainder) {
        case 2:
            lastB1.push(sequence[ i * 3 ]);
            b1.push(lastB1);
            lastB1 = [ (i * 3) + 1, terminator, terminator, terminator ];
            lastB2.push(sequence[ i * 3 ], terminator);
            b0.push(createNonSample(i, sequence));
            break;
        case 1:
            lastB1.push(sequence[ i * 3 ], terminator);
            lastB2.push(sequence[ i * 3 ]);
            b0.push(createNonSample(i, sequence));
            break;
        case 0:
            break;
    }

    while(lastB1.length % 4 != 0) {
        lastB1.push(terminator);
    }

    while(lastB2.length % 4 != 0) {
        lastB2.push(terminator);
    }

    b1.push(lastB1);
    b2.push(lastB2);

    return [ b0, b1.concat(b2) ];
}

function createNonSample(block, sequence) {
    const suffix = block * 3;
    return [ suffix,  sequence[ suffix ] ]; // prefix nonsample with suffix
}

function createSample(block, offset, sequence, length = 3) {
    const suffix = (block * 3) + offset;
    return [ suffix, ...sequence.slice(suffix, suffix + length) ]; // prefix triplet with suffix
}

/**
 * Radix sorts an array of arrays where all sub-array must be of the same
 * length. The sort algorithm assumes the last element in each sub-array is
 * the least significant and the first element is the most significant.
 *
 * @param {Object[]} entries an array of entries to be sorted.
 * @param {function} [getEntry] a function which is given the current entry, the current index, and entries for obtaining each subarray. If not given, entries will be assumed to contain an array of subarrays.
 */
function radixSort(entries, getEntry = entry => entry) {
    if (entries.length < 2) {
        return entries;
    }

    const n = getEntry(entries[0], 0, entries).length;

    // sort from least significan to most significant digit
    for (let i = 0; i < n; i++) {
        const buckets = {};

        entries.forEach((e, index) => {
            let entry = getEntry(e, index, entries);
            if (entry.length < n) {
                throw new Error(`Entry is not of length ${n}: ${entry}`);
            }

             // default undefined and null to 0
            const key = entry[ entry.length - i - 1 ] != null ? entry[ entry.length - i - 1 ] : 0;
            if (key in buckets) {
                buckets[ key ].push(e);
            } else {
                buckets[ key ] = [ e ];
            }
        });

        entries = [];
        for (let key in buckets) {
            entries = entries.concat(buckets[ key ]);
        }
    }

    return entries;
}

/**
 * Converts an array of samples to a sequence with each sample's rank.
 */
function samplesToSequence(samples) {
    const sampleToRank = {};
    let rank = 0;
    const samplesSequence = [];
    for (let sample of samples) {
        const sampleString = sampleToString(sample);
        if (sampleString in sampleToRank) {
            samplesSequence.push(sampleToRank[ sampleString ]);
        } else {
            samplesSequence.push(rank);
            sampleToRank[ sampleString ] = rank++;
        }
    }
/*
    // pad with terminator until the samplesSequence length is a multiple of 3
    while (samplesSequence.length % 3 != 0) {
        samplesSequence.push(rank);
    }
*/
    return {
        samplesSequence,
        unique: rank == samples.length,
        samplesTerminator: rank
    };
}

function sampleToString(sample) {
     return String.fromCharCode.apply(this, sample);
}

function sortedSamplesToSuffixes(sortedSamples) {
    const result = new Array(sortedSamples.length);
    sortedSamples.forEach((sample, i) => result[sample[0]] = i);
    return result;
}

function createNonSampledPairs(sequence, suffixes) {
    const n = sequence.length;

    const nonSampledPairs = [];

    let i = 0;
    while (i < n) {
         nonSampledPairs.push([ i, sequence[ i ], suffixes[ i + 1 ] ]); // prefix pair with suffix
         i = i + 3;
    }

    return nonSampledPairs;
}

function sortedNonSampledPairsToSuffixes(suffixes, sortedNonSampledPairs) {
    let rank = 0;
    sortedNonSampledPairs.forEach(nonSample => suffixes[nonSample[0]] = rank++);
}

function merge(sequence, sortedNonSampledPairs, sortedSamples, suffixes) {
    const result = [];

    let a = 0;
    let b = 0;
    while (a < sortedNonSampledPairs.length) {
        const j = sortedNonSampledPairs[a][0];
        if (j % 3 != 0) {
            throw new Error('Sorted non-samples should only contain offset 0 (mod 3) entries');
        }

        nextNonSampled: while(b < sortedSamples.length) {
            const i = sortedSamples[b][0];
            switch(i % 3) {
                case 1:
                    if ((sequence[i] < sequence[j])
                        || ((sequence[i] === sequence[j]) && (suffixes[i+1] < suffixes[j+1])) ) {
                        result.push(sortedSamples[b++][0]);
                    } else {
                        result.push(sortedNonSampledPairs[a++][0]);
                        break nextNonSampled;
                    }
                    break;
                case 2:
                    if ( (sequence[i] < sequence[j])
                        || ( (sequence[i] === sequence[j]) && (sequence[i+1] < sequence[j+1]) )
                        || ( (sequence[i] === sequence[j]) && (sequence[i+1] === sequence[j+1]) && (suffixes[i+2] < suffixes[j+2]) ) ) {
                        result.push(sortedSamples[b++][0]);
                    } else {
                        result.push(sortedNonSampledPairs[a++][0]);
                        break nextNonSampled;
                    }
                    break;
                default:
                    throw new Error('Sorted samples should only contain offset != 0 (mod 3) entries');
            }
        }

        if (b === sortedSamples.length) {
            result.push(sortedNonSampledPairs[a++][0]);
        }
    }

    while (b < sortedSamples.lenth) {
        result.push(sortedSamples[b++][0]);
    }

    return result;
}

export default getSuffixArray;

export {
    suffixArray,
    stringToSequence,
    sample,
    radixSort,
    samplesToSequence,
    sampleToString,
    sortedSamplesToSuffixes,
    createNonSampledPairs,
    sortedNonSampledPairsToSuffixes,
    merge
};
