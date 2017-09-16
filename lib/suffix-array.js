'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sampleToString = sampleToString;
exports.default = suffixArray;

var _radixSort = require('./radix-sort');

var _radixSort2 = _interopRequireDefault(_radixSort);

var _stringSequence = require('./string-sequence');

var _stringSequence2 = _interopRequireDefault(_stringSequence);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
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
                                                                                                                                                                                                     * On the other hand, this implememtation supports UTF-16 while the reference DC3
                                                                                                                                                                                                     * implementation expects a byte sized alphabet.
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
      lastB1 = [i * 3 + 1];
      lastB2.push(sequence[i * 3]);
      break;
    case 1:
      lastB1.push(sequence[i * 3]);
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

// Converts an array of samples to a sequence with each sample's rank.
function samplesToSequence(unsorted, sorted) /* ! */{
  var rankOffset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0x21;

  // rank sorted samples
  var sampleToRank = {};
  var rank = rankOffset;
  var unique = true;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = sorted[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var sample = _step.value;

      var sampleString = sampleToString(sample.slice(1));
      if (sampleString in sampleToRank) {
        unique = false;
      } else {
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

  if (unique) {
    return {
      unique: true
    };
  }

  // construct new sequence based on the unsorted samples and their ranks
  var samplesSequence = unsorted.map(function (sample) {
    return sampleToRank[sampleToString(sample.slice(1))];
  });

  return {
    unique: false,
    samplesSequence: samplesSequence,
    samplesTerminator: rank
  };
}

function rankSortedSamples(n, sortedSamples) {
  var r = n % 3;
  var m = n + (r !== 0 ? 3 - r : 0);
  var result = new Array(m);

  var rank = 1;
  sortedSamples.forEach(function (sample) {
    return sample !== undefined ? result[sample[0]] = rank++ : 0;
  });

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
  var n = sequence.length;

  var nonSampledPairs = [];

  var i = 0;
  while (i < n) {
    nonSampledPairs.push([i, sequence[i], ranks[i + 1]]);
    i += 3;
  }

  return nonSampledPairs;
}

function merge(sequence, sortedNonSampledPairs, sortedSamples, ranks) {
  var result = [];

  var a = 0;
  var b = 0;
  while (a < sortedNonSampledPairs.length && b < sortedSamples.length) {
    var i = sortedSamples[b][0];
    var j = sortedNonSampledPairs[a][0];
    if (j % 3 !== 0) {
      throw new Error('Sorted non-samples should only contain offset 0 (mod 3) entries');
    }

    var d = sequence[i] - sequence[j];
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
  var n = sequence.length;

  // handle trivial cases
  switch (n) {
    case 0:
      return [0];
    case 1:
      return [0, 1];
    case 2:
      return sequence[0] < sequence[1] ? [0, 1, 2] : [1, 0, 2];
    default:
      sequence = [].concat(_toConsumableArray(sequence), [terminator]); // add terminator to copy of sequence
      break;
  }

  // calculate the set C = B1 u B2
  var sampledPositions = sampleSequence(sequence, terminator);

  var sortedSamples = (0, _radixSort2.default)(sampledPositions, function (entry) {
    return entry.slice(1);
  });

  var _samplesToSequence = samplesToSequence(sampledPositions, sortedSamples, 0x21 /* ! */),
      unique = _samplesToSequence.unique,
      samplesSequence = _samplesToSequence.samplesSequence,
      samplesTerminator = _samplesToSequence.samplesTerminator;

  if (!unique) {
    var recursiveSuffixArray = createSuffixArray(samplesSequence, samplesTerminator);

    sortedSamples = recursiveSuffixArray.map(function (suffix) {
      return sampledPositions[suffix];
    });
    sortedSamples.pop(); // remove terminator
  }

  var ranks = rankSortedSamples(n, sortedSamples);

  var sortedNonSampledPairs = (0, _radixSort2.default)(createNonSampledPairs(sequence, ranks), function (entry) {
    return entry.slice(1);
  });

  var result = merge(sequence, sortedNonSampledPairs, sortedSamples, ranks);
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
function suffixArray(s, terminator) {
  var sequence = Array.isArray(s) ? s : (0, _stringSequence2.default)(s);
  var t = typeof terminator === 'string' ? terminator.charCodeAt(0) : terminator;

  var result = createSuffixArray(sequence, t);

  if (sequence.length + 1 !== result.length) {
    throw new Error('String and suffix array lengths differ ' + sequence.length + ' + 1 != ' + result.length);
  }

  return result;
}