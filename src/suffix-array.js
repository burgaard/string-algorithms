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

export function stringToSequence(s) {
  return s.split('').map(c => c.charCodeAt(0));
}

/**
* Radix sorts an array of arrays where all sub-array must be of the same
* length. The sort algorithm assumes the last element in each sub-array is
* the least significant and the first element is the most significant.
*
* @param {Object[]} entries an array of entries to be sorted.
* @param {function} [getEntry] a function which is given the current entry, the
*  current index, and entries for obtaining each subarray. If not given,
*  entries will be assumed to contain an array of subarrays.
*/
export function radixSort(entries, getEntry = entry => entry) {
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

function createSample(block, offset, sequence, length = 3) {
  const suffix = (block * 3) + offset;
  return [suffix, ...sequence.slice(suffix, suffix + length)]; // prefix triplet with suffix
}

export function sampleSequence(sequence, terminator) {
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
export function samplesToSequence(unsorted, sorted, rankOffset = 0x21 /* ! */) {
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

export function rankSortedSamples(n, sortedSamples) {
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

export function createNonSampledPairs(sequence, ranks) {
  const n = sequence.length;

  const nonSampledPairs = [];

  let i = 0;
  while (i < n) {
    nonSampledPairs.push([i, sequence[i], ranks[i + 1]]);
    i += 3;
  }

  return nonSampledPairs;
}

function arrayToString(a) {
  return ['[']
    .concat(a.map(e => `  ${e},`))
    .concat('];')
    .join('\n');
}

function sequenceToString(sequence) {
  return ['[']
    .concat(sequence.map(e => `  ${e}, // ${String.fromCharCode(e)}`))
    .concat('];')
    .join('\n');
}

function stringIndexArrayToString(a, sequence) {
  return ['[']
    .concat(a.map(e => `  ${e}, // ${sequence.slice(e).map(c => String.fromCharCode(c)).join('')}`))
    .concat('];')
    .join('\n');
}

function indirectStringIndexArrayToString(arrayArrays, sequence) {
  return ['[']
    .concat(arrayArrays.map(e => (e != null
      ? `  [${e.join(', ')}], // ${sequence.slice(e[0]).map(c => String.fromCharCode(c)).join('')}`
      : '  undefined')))
    .concat('];')
    .join('\n');
}

export function merge(sequence, sortedNonSampledPairs, sortedSamples, ranks) {
  console.log([
    '// merging ',
    `const sequence = ${sequenceToString(sequence)}`,
    `const sortedNonSampledPairs = ${indirectStringIndexArrayToString(sortedNonSampledPairs, sequence)}`,
    `const sortedSamples = ${indirectStringIndexArrayToString(sortedSamples, sequence)}`,
    `const ranks = ${arrayToString(ranks, sequence)}`,
  ].join('\n\n'));
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
        // console.log(`comparing s[${i}] = ${String.fromCharCode(sequence[i])} to s[${j}] = ${String.fromCharCode(sequence[j])}`);
        if (d === 0) {
          d = ranks[i + 1] - ranks[j + 1];
          // console.log(`comparing rank ${i + 1} = ${ranks[i + 1]} to ${j + 1} = ${ranks[j + 1]}`);
        }
        break;
      case 2:
        // console.log(`comparing s[${i}] = ${String.fromCharCode(sequence[i])} to s[${j}] = ${String.fromCharCode(sequence[j])}`);
        if (d === 0) {
          // console.log(`comparing s[${i + 1}] = ${String.fromCharCode(sequence[i + 1])} to s[${j + 1}] = ${String.fromCharCode(sequence[j + 1])}`);
          d = sequence[i + 1] - sequence[j + 1];
          if (d === 0) {
            d = ranks[i + 2] - ranks[j + 2];
            // console.log(`comparing rank ${i + 2} = ${ranks[i + 2]} to ${j + 2} = ${ranks[j + 2]}`);
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

  console.log([
    `const result = ${stringIndexArrayToString(result, sequence)}`,
  ].join('\n\n'));


  return result;
}

export function createSuffixArray(sequence, terminator) {
  const n = sequence.length;

  // handle trivial cases
  switch (n) {
    case 0: return [];
    case 1: return [0];
    case 2: return sequence[0] < sequence[1] ? [0, 1] : [1, 0];
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
    // recurse to sort the suffixes of sortedSamplesSequence
    const recursiveSuffixArray = createSuffixArray(samplesSequence, samplesTerminator);

    console.log([
      '// recursion ',
      `const sampledPositions = ${indirectStringIndexArrayToString(sampledPositions, sequence)}`,
      `const sortedSamples = ${indirectStringIndexArrayToString(sortedSamples, sequence)}`,
      `const samplesSequence = ${sequenceToString(samplesSequence)}`,
      `const samplesTerminator = ${String.fromCharCode(samplesTerminator)}`,
      `const recursiveSuffixArray = ${stringIndexArrayToString(recursiveSuffixArray, samplesSequence)}`,
    ].join('\n\n'));

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
 * @param {string} s the string to compute the suffix array for.
 * @param {string} terminator a character not in s to use as terminator.
 * @return {string[]} a suffix array.
 */
export default function suffixArray(s, terminator) {
  const sequence = stringToSequence(s);
  const result = createSuffixArray(sequence, terminator.charCodeAt(0));
  if ((sequence.length + 1) !== result.length) {
    throw new Error(`String and suffix array lengths differ ${sequence.length} + 1 != ${result.length}`);
  }

  return result;
}
