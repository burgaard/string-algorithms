'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Linear-time computation of the Longest Common Substring.
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

exports.default = longestCommonSubstring;

var _suffixArray = require('./suffix-array');

var _suffixArray2 = _interopRequireDefault(_suffixArray);

var _longestCommonPrefix = require('./longest-common-prefix');

var _longestCommonPrefix2 = _interopRequireDefault(_longestCommonPrefix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Maps the position of strings s1 ... sK when concatenated into one string.
 * Concrete implementations provide different compromises between O(1) and
 * O(log(K)) lookup times versus O(n) and O(k) space requirements.
 */
var StringIndexMap = function () {
  /**
   * Initializes a new string index map.
   * @param {number} k the number of expected strings.
   */
  function StringIndexMap() {
    var k = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    _classCallCheck(this, StringIndexMap);

    this.add = this.add.bind(this);
    this.lookup = this.lookup.bind(this);
    this.ranges = new Array(k);
    this.k = 0;
    this.n = 0;
  }

  /* eslint-disable class-methods-use-this */

  /**
   * Adds a substring with the given length.
   * @throws {Error} not implemented.
   */


  _createClass(StringIndexMap, [{
    key: 'add',
    value: function add() {
      throw new Error('not implemented');
    }

    /**
     * Looks up the substring corresponding to the given position
     * in the concatenated string.
     * @throws {Error} not implemented.
     */

  }, {
    key: 'lookup',
    value: function lookup() {
      throw new Error('not implemented');
    }
    /* eslint-enable class-methods-use-this */

  }]);

  return StringIndexMap;
}();

/**
 * Given a string of length n composed of substrings s1 ... sK, this string index map enables
 * O(log(K)) substring lookup in O(K) space. This implementation is preferable for small K and/or
 * very large n.
 */


var LogStringIndexMap = function (_StringIndexMap) {
  _inherits(LogStringIndexMap, _StringIndexMap);

  function LogStringIndexMap() {
    _classCallCheck(this, LogStringIndexMap);

    return _possibleConstructorReturn(this, (LogStringIndexMap.__proto__ || Object.getPrototypeOf(LogStringIndexMap)).apply(this, arguments));
  }

  _createClass(LogStringIndexMap, [{
    key: 'add',

    /**
     * Adds a substring with the given length. O(1)
     * @param {number} length the length of the substring.
     * @return {number} the current total length of all substrings.
     */
    value: function add(length) {
      var m = this.n + length;
      var k = this.k;
      this.ranges[this.k++] = [this.n, m, k];
      return this.n = m;
    }

    /**
     * Looks up the substring corresponding to the given position
     * in the concatenated string. O(log(K)) binary search.
     * @param {number} position the position in the concatenated string.
     * @return {number} the index of the substring that contains the given position.
     */

  }, {
    key: 'lookup',
    value: function lookup(suffix, start, end) {
      if (start < 0) {
        throw new Error('start ' + start + ' is less than 0');
      }
      if (end <= start) {
        throw new Error('end ' + end + ' is less than or equal to start ' + start);
      }

      var s = start || 0;
      var e = end || this.ranges.length;
      var n = e - s;
      if (n === 1) {
        var _ranges$s = _slicedToArray(this.ranges[s], 3),
            ss = _ranges$s[0],
            se = _ranges$s[1],
            i = _ranges$s[2];

        if (suffix < ss) {
          throw new Error('suffix ' + suffix + ' is less than the range entry start ' + ss);
        }
        if (suffix > se) {
          throw new Error('suffix ' + suffix + ' is less than the range entry start ' + se);
        }
        return i;
      }

      var m = s + (n >>> 1); // eslint-disable-line no-bitwise
      return suffix < this.ranges[m][0] ? this.lookup(suffix, s, m) : this.lookup(suffix, m, e);
    }
  }]);

  return LogStringIndexMap;
}(StringIndexMap);

/**
 * Given a string of length n composed of substrings s1 ... sK, this string index map enables
 * log(1) substring lookup in O(n) space. This implementation is preferable for very large K and/or
 * small n.
 */


var LinearStringIndexMap = function (_StringIndexMap2) {
  _inherits(LinearStringIndexMap, _StringIndexMap2);

  function LinearStringIndexMap() {
    _classCallCheck(this, LinearStringIndexMap);

    var _this2 = _possibleConstructorReturn(this, (LinearStringIndexMap.__proto__ || Object.getPrototypeOf(LinearStringIndexMap)).call(this));

    _this2.initialize = _this2.initialize.bind(_this2);
    _this2.initialized = false;
    return _this2;
  }

  /**
   * Adds a substring with the given length. O(1)
   * @param {number} length the length of the substring.
   * @return {number} the current total length of all substrings.
   */


  _createClass(LinearStringIndexMap, [{
    key: 'add',
    value: function add(length) {
      this.initialized = false;
      this.ranges[this.k++] = length;
      return this.n += length;
    }

    /**
     * Fills in the index array in O(n).
     * @return {Boolean} true if the array was initialized, false if no initialization was needed.
     */

  }, {
    key: 'initialize',
    value: function initialize() {
      var _this3 = this;

      if (this.initialized) {
        return false;
      }

      this.indexMap = new Array(this.n);

      var i = 0;
      this.ranges.forEach(function (r, j) {
        _this3.indexMap.fill(j, i, i + r);
        i += r;
      });

      return this.initialized = true;
    }

    /**
     * Looks up the substring corresponding to the given position
     * in the concatenated string. O(1) array lookup [O(n) on first lookup to initialize index map]
     * @param {number} position the position in the concatenated string.
     * @return {number} the index of the substring that contains the given position.
     */

  }, {
    key: 'lookup',
    value: function lookup(suffix) {
      this.initialize();

      return this.indexMap[suffix];
    }
  }]);

  return LinearStringIndexMap;
}(StringIndexMap);

function createStringIndexMap(strategy, k) {
  switch (strategy) {
    case 'log':
      return new LogStringIndexMap(k);
    case 'linear':
      return new LinearStringIndexMap(k);
    default:
      throw new Error('strategy must be either \'log\' or \'linear\': ' + strategy);
  }
}

function ensureNonEmptyString(e) {
  if (typeof e !== 'string') {
    throw new TypeError('entry is not a string: ' + (typeof e === 'undefined' ? 'undefined' : _typeof(e)));
  }
  if (e.length === 0) {
    throw new Error('entry is an empty string');
  }
}

/**
 * Finds the longest common substring(s) in the given strings. If there are multiple
 * substrings that all share the longest length, then all such substrings are
 * returned. O(n) or O(n * log(K)) depending on the selected string indexing strategy.
 * 
 * Note: While this implementation works with 16-bit Unicode characters, none of the
 * input strings may contain characters in the Unicode Private character area.
 * 
 * @param {string[]} strings an array of strings.
 * @param {string} [strategy='log'] string indexing strategy. If given, it must be one of
 * 'log' or 'linear'.
 * @return {string|string[]} the longest common substring(s).
 */
function longestCommonSubstring(strings) {
  var strategy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'log';

  if (!Array.isArray(strings)) {
    throw new TypeError('strings argument must be an array of strings');
  }

  var k = strings.length;
  // handle trivial cases
  switch (k) {
    case 0:
      return [];
    case 1:
      ensureNonEmptyString(strings[0]);
      return strings;
    default:
      break;
  }

  var stringIndexMap = createStringIndexMap(strategy, k);

  // append each string as an array of unicodes + unique terminator
  // O(n)
  var terminator = 0xe000;
  var sequence = strings.reduce(function (a, e) {
    ensureNonEmptyString(e);
    stringIndexMap.add(e.length + 1);
    return a.concat(e.split('').map(function (c) {
      return c.charCodeAt(0);
    }).concat(terminator++));
  }, []);

  // calculate the suffix array in O(n)
  var sa = (0, _suffixArray2.default)(sequence, terminator);

  // calculate the longest common prefixes in O(n)
  var lcp = (0, _longestCommonPrefix2.default)(sequence.concat(terminator), sa);

  var result = [];
  var longest = 1;

  var i = 0;
  while (i < sa.length) {
    var h = lcp[i];
    if (h >= longest) {
      var _entries;

      var index = sa[i];

      var entries = (_entries = {}, _defineProperty(_entries, stringIndexMap.lookup(sa[i]), true), _defineProperty(_entries, stringIndexMap.lookup(sa[i + 1]), true), _entries);

      var j = i + 2;
      while (j < sa.length && h === lcp[j - 1]) {
        entries[stringIndexMap.lookup(sa[j])] = true;
        j++;
      }

      if (Object.keys(entries).length === k) {
        if (h === longest) {
          result.push([index, h]);
        } else {
          result = [[index, h]];
          longest = h;
        }
      }

      i = j;
    } else {
      i++;
    }
  }

  return result.map(function (r) {
    return sequence.slice(r[0], r[0] + r[1]).map(function (c) {
      return String.fromCharCode(c);
    }).join('');
  });
}