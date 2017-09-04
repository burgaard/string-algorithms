/**
 * Linear-time suffix array implementation using the DC3 (Difference Cover
 * modulo 3) algorithm.
 *
 * For more information about DC3, see the following resources:
 * http://algo2.iti.kit.edu/documents/jacm05-revised.pdf
 * http://web.stanford.edu/class/archive/cs/cs166/cs166.1146/lectures/11/Small11.pdf
 *
 * This implementation is pure ES2015 JavaScript without any other dependencies,
 * meaning it can be run in pretty much any JavaScript interpreter (when transpiled
 * using e.g. babel).
 * 
 * Although this implementation is linear, it uses more memory and does some
 * string and array operations that cause additional linear passes compared to
 * more compact implementations in C and other languages.
 * 
 * Further, it is limited by Node.js's current string length limit (slightly less
 * than 250 million characters), which means applications to problems like DNA
 * sequence matching on data sets larger than about 100MB should look to other
 * platforms than JavaScript and Node.js.
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

import radixSort from './radix-sort';
import stringToSequence from './string-sequence';

function createSample(block, offset, sequence, length = 3) {
  const suffix = (block * 3) + offset;
  return [suffix, ...sequence.slice(suffix, suffix + length)]; // prefix triplet with suffix
}

function sampleSequence(sequence, terminator) {
  const n = sequence.length;
  if (n < 3) {
    throw new Error(`The sequence must contain at least 3 characters. Actual length: ${n}`);
  }

  const remainder = n % 3;
  const blocks = (n - remainder) / 3;

  const b1 = [];
  const b2 = [];

  let i = 0;
  while (i < blocks - 1) {
    b1.push(createSample(i, 1, sequence));
    b2.push(createSample(i, 2, sequence));
    i++;
  }

  let lastB1 = createSample(i, 1, sequence, 2);
  const lastB2 = createSample(i, 2, sequence, 1);

  i++;

  switch (remainder) {
    case 2:
      lastB1.push(sequence[i * 3]);
      b1.push(lastB1);
      lastB1 = [(i * 3) + 1];
      lastB2.push(sequence[i * 3]);
      break;
    case 1:
      lastB1.push(sequence[i * 3]);
      lastB2.push(sequence[i * 3]);
      break;
    case 0:
      break;
    default:
      throw new Error(`Impossible remainder: ${remainder}`);
  }

  while (lastB1.length % 4 !== 0) {
    lastB1.push(terminator);
  }

  while (lastB2.length % 4 !== 0) {
    lastB2.push(terminator);
  }

  b1.push(lastB1);
  b2.push(lastB2);

  return b1.concat(b2);
}

export function sampleToString(sample) {
  return String.fromCharCode.apply(this, sample);
}

// Converts an array of samples to a sequence with each sample's rank.
function samplesToSequence(unsorted, sorted, rankOffset = 0x21 /* ! */) {
  // rank sorted samples
  const sampleToRank = {};
  let rank = rankOffset;
  let unique = true;
  for (const sample of sorted) {
    const sampleString = sampleToString(sample.slice(1));
    if (sampleString in sampleToRank) {
      unique = false;
    } else {
      sampleToRank[sampleString] = rank++;
    }
  }

  if (unique) {
    return {
      unique: true,
    };
  }

  // construct new sequence based on the unsorted samples and their ranks
  const samplesSequence = unsorted.map(
    sample => sampleToRank[sampleToString(sample.slice(1))],
  );

  return {
    unique: false,
    samplesSequence,
    samplesTerminator: rank,
  };
}

function rankSortedSamples(n, sortedSamples) {
  const r = n % 3;
  const m = n + (r !== 0 ? 3 - r : 0);
  const result = new Array(m);

  let rank = 1;
  sortedSamples.forEach(sample => (sample !== undefined ? result[sample[0]] = rank++ : 0));

  switch (r) {
    default:
      break;
    case 2:
      result[n + 2] = 0;
      // fall through
    case 1:
      result[n + 1] = 0;
      break;
  }
  return result;
}

function createNonSampledPairs(sequence, ranks) {
  const n = sequence.length;

  const nonSampledPairs = [];

  let i = 0;
  while (i < n) {
    nonSampledPairs.push([i, sequence[i], ranks[i + 1]]);
    i += 3;
  }

  return nonSampledPairs;
}

function merge(sequence, sortedNonSampledPairs, sortedSamples, ranks) {
  const result = [];

  let a = 0;
  let b = 0;
  while (a < sortedNonSampledPairs.length && b < sortedSamples.length) {
    const i = sortedSamples[b][0];
    const j = sortedNonSampledPairs[a][0];
    if (j % 3 !== 0) {
      throw new Error('Sorted non-samples should only contain offset 0 (mod 3) entries');
    }

    let d = sequence[i] - sequence[j];
    switch (i % 3) {
      case 1:
        if (d === 0) {
          d = ranks[i + 1] - ranks[j + 1];
        }
        break;
      case 2:
        if (d === 0) {
          d = sequence[i + 1] - sequence[j + 1];
          if (d === 0) {
            d = ranks[i + 2] - ranks[j + 2];
          }
        }
        break;
      default:
        throw new Error('Sorted samples should only contain offset != 0 (mod 3) entries');
    }

    if (d <= 0) {
      result.push(i);
      b++;
    } else {
      result.push(j);
      a++;
    }
  }

  while (b < sortedSamples.length) {
    result.push(sortedSamples[b++][0]);
  }

  while (a < sortedNonSampledPairs.length) {
    result.push(sortedNonSampledPairs[a++][0]);
  }

  return result;
}

function createSuffixArray(sequence, terminator) {
  const n = sequence.length;

  // handle trivial cases
  switch (n) {
    case 0: return [terminator];
    case 1: return [0, terminator];
    case 2: return sequence[0] < sequence[1] ? [0, 1, terminator] : [1, 0, terminator];
    default:
      sequence = [...sequence, terminator]; // add terminator to copy of sequence
      break;
  }

  // calculate the set C = B1 u B2
  const sampledPositions = sampleSequence(sequence, terminator);

  let sortedSamples = radixSort(sampledPositions, entry => entry.slice(1));
  const { unique, samplesSequence, samplesTerminator }
    = samplesToSequence(sampledPositions, sortedSamples, 0x21 /* ! */);
  if (!unique) {
    const recursiveSuffixArray = createSuffixArray(samplesSequence, samplesTerminator);

    sortedSamples = recursiveSuffixArray.map(suffix => sampledPositions[suffix]);
    sortedSamples.pop(); // remove terminator
  }

  const ranks = rankSortedSamples(n, sortedSamples);

  const sortedNonSampledPairs = radixSort(
    createNonSampledPairs(sequence, ranks), entry => entry.slice(1),
  );

  const result = merge(sequence, sortedNonSampledPairs, sortedSamples, ranks);
  return result;
}

/**
 * Calculates the suffix array for the given string and terminator character
 * (which may not be present in the input string).
 *
 * @param {number[]|string} s the string or sequence to compute the suffix array for.
 * @param {number|string} terminator a character not in s to use as terminator.
 * @return {number[]} a suffix array.
 */
export default function suffixArray(s, terminator) {
  const sequence = Array.isArray(s) ? s : stringToSequence(s);
  const t = typeof terminator === 'string' ? terminator.charCodeAt(0) : terminator;

  const result = createSuffixArray(sequence, t);

  if ((sequence.length + 1) !== result.length) {
    throw new Error(`String and suffix array lengths differ ${sequence.length} + 1 != ${result.length}`);
  }

  return result;
}
