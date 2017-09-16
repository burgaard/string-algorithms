'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.longestCommonSubstring = exports.suffixTree = exports.longestCommonPrefix = exports.suffixArray = exports.radixSort = undefined;

var _radixSort = require('./radix-sort');

var _radixSort2 = _interopRequireDefault(_radixSort);

var _suffixArray = require('./suffix-array');

var _suffixArray2 = _interopRequireDefault(_suffixArray);

var _longestCommonPrefix = require('./longest-common-prefix');

var _longestCommonPrefix2 = _interopRequireDefault(_longestCommonPrefix);

var _suffixTree = require('./suffix-tree');

var _suffixTree2 = _interopRequireDefault(_suffixTree);

var _longestCommonSubstring = require('./longest-common-substring');

var _longestCommonSubstring2 = _interopRequireDefault(_longestCommonSubstring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.radixSort = _radixSort2.default;
exports.suffixArray = _suffixArray2.default;
exports.longestCommonPrefix = _longestCommonPrefix2.default;
exports.suffixTree = _suffixTree2.default;
exports.longestCommonSubstring = _longestCommonSubstring2.default; /**
                                                                    * Linear time implementations of Radix sorting, suffix array calculation,
                                                                    * longest common substring calculation, suffix tree calculation and longest
                                                                    * common substring (of multiple strings).
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