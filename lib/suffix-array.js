'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringToSequence = stringToSequence;
exports.radixSort = radixSort;
exports.createNonSample = createNonSample;
exports.createSample = createSample;
exports.sampleSequence = sampleSequence;
exports.sampleToString = sampleToString;
exports.samplesToSequence = samplesToSequence;
exports.sortedSamplesToSuffixes = sortedSamplesToSuffixes;
exports.createNonSampledPairs = createNonSampledPairs;
exports.sortedNonSampledPairsToSuffixes = sortedNonSampledPairsToSuffixes;
exports.merge = merge;
exports.createSuffixArray = createSuffixArray;
exports.default = suffixArray;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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

function stringToSequence(s) {
  return s.split('').map(function (c) {
    return c.charCodeAt(0);
  });
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
function radixSort(entries) {
  var getEntry = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (entry) {
    return entry;
  };

  if (entries.length < 2) {
    return entries;
  }

  var n = getEntry(entries[0], 0, entries).length;

  // sort from least significan to most significant digit
  for (var i = 0; i < n; i++) {
    var buckets = {};

    for (var j = 0; j < entries.length; j++) {
      var e = entries[j];
      var entry = getEntry(e, j, entries);
      if (entry.length < n) {
        throw new Error('Entry is not of length ' + n + ': ' + entry);
      }

      // default undefined and null to 0
      var key = entry[entry.length - i - 1] != null ? entry[entry.length - i - 1] : 0;
      if (key in buckets) {
        buckets[key].push(e);
      } else {
        buckets[key] = [e];
      }
    }

    entries = [];
    for (var _key in buckets) {
      // eslint-disable-line guard-for-in
      entries = entries.concat(buckets[_key]);
    }
  }

  return entries;
}

function createNonSample(block, sequence) {
  var suffix = block * 3;
  return [suffix, sequence[suffix]]; // prefix nonsample with suffix
}

function createSample(block, offset, sequence) {
  var length = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 3;

  var suffix = block * 3 + offset;
  return [suffix].concat(_toConsumableArray(sequence.slice(suffix, suffix + length))); // prefix triplet with suffix
}

function sampleSequence(sequence, terminator) {
  var n = sequence.length;
  if (n < 3) {
    throw new Error('The sequence must contain at least 3 characters. Actual length: ' + n);
  }

  var remainder = n % 3;
  var blocks = (n - remainder) / 3;

  var b1 = [];
  var b2 = [];

  var i = 0;
  while (i < blocks - 1) {
    b1.push(createSample(i, 1, sequence));
    b2.push(createSample(i, 2, sequence));
    i++;
  }

  var lastB1 = createSample(i, 1, sequence, 2);
  var lastB2 = createSample(i, 2, sequence, 1);

  i++;

  switch (remainder) {
    case 2:
      lastB1.push(sequence[i * 3]);
      b1.push(lastB1);
      lastB1 = [i * 3 + 1, terminator, terminator, terminator];
      lastB2.push(sequence[i * 3], terminator);
      break;
    case 1:
      lastB1.push(sequence[i * 3], terminator);
      lastB2.push(sequence[i * 3]);
      break;
    case 0:
      break;
    default:
      throw new Error('Impossible remainder: ' + remainder);
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

function sampleToString(sample) {
  return String.fromCharCode.apply(this, sample);
}

/**
* Converts an array of samples to a sequence with each sample's rank.
*/
function samplesToSequence(samples) {
  var sampleToRank = {};
  var rank = 0;
  var samplesSequence = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = samples[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var sample = _step.value;

      var sampleString = sampleToString(sample);
      if (sampleString in sampleToRank) {
        samplesSequence.push(sampleToRank[sampleString]);
      } else {
        samplesSequence.push(rank);
        sampleToRank[sampleString] = rank++;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return {
    samplesSequence: samplesSequence,
    unique: rank === samples.length,
    samplesTerminator: rank
  };
}

function sortedSamplesToSuffixes(sortedSamples) {
  var result = new Array(sortedSamples.length);
  sortedSamples.forEach(function (sample, i) {
    return result[sample[0]] = i;
  });
  return result;
}

function createNonSampledPairs(sequence, suffixes) {
  var n = sequence.length;

  var nonSampledPairs = [];

  var i = 0;
  while (i < n) {
    nonSampledPairs.push([i, sequence[i], suffixes[i + 1]]); // prefix pair with suffix
    i += 3;
  }

  return nonSampledPairs;
}

function sortedNonSampledPairsToSuffixes(suffixes, sortedNonSampledPairs) {
  var rank = 0;
  sortedNonSampledPairs.forEach(function (nonSample) {
    return suffixes[nonSample[0]] = rank++;
  });
}

function merge(sequence, sortedNonSampledPairs, sortedSamples, suffixes) {
  var result = [];

  var a = 0;
  var b = 0;
  while (a < sortedNonSampledPairs.length) {
    var j = sortedNonSampledPairs[a][0];
    if (j % 3 !== 0) {
      throw new Error('Sorted non-samples should only contain offset 0 (mod 3) entries');
    }

    nextNonSampled: while (b < sortedSamples.length) {
      var i = sortedSamples[b][0];
      switch (i % 3) {
        case 1:
          if (sequence[i] < sequence[j] || sequence[i] === sequence[j] && suffixes[i + 1] < suffixes[j + 1]) {
            result.push(sortedSamples[b++][0]);
          } else {
            result.push(sortedNonSampledPairs[a++][0]);
            break nextNonSampled;
          }
          break;
        case 2:
          if (sequence[i] < sequence[j] || sequence[i] === sequence[j] && sequence[i + 1] < sequence[j + 1] || sequence[i] === sequence[j] && sequence[i + 1] === sequence[j + 1] && suffixes[i + 2] < suffixes[j + 2]) {
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

function createSuffixArray(sequence, terminator) {
  var n = sequence.length;

  // handle trivial cases
  switch (n) {
    case 0:
      return [];
    case 1:
      return [0];
    case 2:
      return sequence[0] < sequence[1] ? [0, 1] : [1, 0];
    default:
      sequence = [].concat(_toConsumableArray(sequence), [terminator]); // add terminator to copy of sequence
      break;
  }

  // calculate the set C = B1 u B2
  var sampledPositions = sampleSequence(sequence, terminator);

  var sortedSamples = radixSort(sampledPositions, function (entry) {
    return entry.slice(1);
  });

  var _samplesToSequence = samplesToSequence(sortedSamples),
      samplesSequence = _samplesToSequence.samplesSequence,
      unique = _samplesToSequence.unique,
      samplesTerminator = _samplesToSequence.samplesTerminator;

  if (!unique) {
    // recurse to sort the suffixes of sortedSamplesSequence
    var recursiveSuffixArray = createSuffixArray(samplesSequence, samplesTerminator);
    var sortedSamplesSequence = recursiveSuffixArray.map(function (suffix) {
      return samplesSequence[suffix];
    });
    sortedSamples = sortedSamplesSequence.map(function (rank) {
      return sortedSamples[rank];
    });
  }

  var suffixes = sortedSamplesToSuffixes(sortedSamples);

  var sortedNonSampledPairs = radixSort(createNonSampledPairs(sequence, suffixes), function (entry) {
    return entry.slice(1);
  });

  var rank = 0;
  sortedNonSampledPairs.forEach(function (nonSample) {
    return suffixes[nonSample[0]] = rank++;
  });

  return merge(sequence, sortedNonSampledPairs, sortedSamples, suffixes);
}

/**
 * Calculates the suffix array for the given string and terminator character
 * (which may not be present in the input string).
 *
 * @param {string} s the string to compute the suffix array for.
 * @param {string} terminator a character not in s to use as terminator.
 * @return {string[]} a suffix array.
 */
function suffixArray(s, terminator) {
  var sequence = stringToSequence(s);
  var result = createSuffixArray(sequence, terminator.charCodeAt(0));

  return result;
}