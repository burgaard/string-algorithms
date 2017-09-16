'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.suffixTreeToString = suffixTreeToString;
exports.default = suffixTree;

var _suffixArray = require('./suffix-array');

var _suffixArray2 = _interopRequireDefault(_suffixArray);

var _stringSequence = require('./string-sequence');

var _stringSequence2 = _interopRequireDefault(_stringSequence);

var _longestCommonPrefix = require('./longest-common-prefix');

var _longestCommonPrefix2 = _interopRequireDefault(_longestCommonPrefix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
                                                                                                                                                           * Linear-time construction of a suffix trees created via linear-time
                                                                                                                                                           * algorithms for computing suffix arrays and longest common prefixes.
                                                                                                                                                           *
                                                                                                                                                           * For more information, see the following resource:
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

var UNICODE_BPM_PRIVATE_USE_AREA_START = 0xe000;

var Node = function Node(height) {
  _classCallCheck(this, Node);

  this.left = undefined;
  this.right = undefined;
  this.parent = undefined;
  this.height = height;
  this.edges = [];
};

// O(n) DFS pass to add suffix nodes to the cartesian LCP tree.


function addSuffixes(node, sa) {
  var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  delete node.parent; // don't need parent anymore

  var o = offset;

  if (node.left != null) {
    o = addSuffixes(node.left, sa, o);
  } else {
    node.edges.push(sa[o++]);
  }

  if (node.right != null) {
    o = addSuffixes(node.right, sa, o);
  } else {
    node.edges.push(sa[o++]);
  }

  return o;
}

function mergeNodes(node) {
  if (node.left != null) {
    mergeNodes(node.left);
  }

  if (node.right != null) {
    var _node$edges;

    mergeNodes(node.right);

    var right = node.right;
    if (right.height !== node.height) {
      return node;
    }

    if (right.left != null && node.left != null) {
      return node;
    }

    // merge the right node into this node
    (_node$edges = node.edges).push.apply(_node$edges, _toConsumableArray(right.edges));

    node.right = right.right;
    if (node.left == null) {
      node.left = right.left;
    }
  }

  return node;
}

// O(n) cartesian tree construction
function createCartesianTree(sequence) {
  var n = sequence.length;

  var root = new Node(sequence[0]);
  var last = root;

  for (var i = 1; i < n; i++) {
    var height = sequence[i];

    while (last !== root && height < last.height) {
      // traverse up the tree
      last = last.parent;
    }

    var node = new Node(height);

    if (height < last.height) {
      // we have a new root
      root.parent = node;
      node.left = root;
      root = node;
    } else if (last.right == null) {
      // add node to last node's right edge
      last.right = node;
      node.parent = last;
    } else {
      // insert node to last node's right edge
      last.right.parent = node;
      node.left = last.right;
      last.right = node;
      node.parent = last;
    }
    last = node;
  }

  return root;
}

function createSuffixTree(s, terminator) {
  // O(n)
  var sequence = (0, _stringSequence2.default)(s);

  // O(n)
  var sa = (0, _suffixArray2.default)(sequence, terminator);

  // O(n)
  var lcp = (0, _longestCommonPrefix2.default)(sequence.concat(terminator), sa);

  // O(n)
  var tree = createCartesianTree(lcp);

  // O(n)
  var offset = addSuffixes(tree, sa);

  if (offset !== sa.length) {
    throw new Error('Offset ' + offset + ' does not match suffix array length ' + sa.length);
  }

  return mergeNodes(tree);
}

/**
 * Converts a suffix three to a string representation.
 * @param {Node} node a suffix tree node.
 * @param {string} s the string the suffix tree is based on.
 * @param {number} [indent] an optional indentation level.
 * @return a string.
 */
function suffixTreeToString(node, s) {
  var indent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  if (!(node instanceof Node)) {
    throw new TypeError('node is not an instance of Node: ' + (typeof node === 'undefined' ? 'undefined' : _typeof(node)));
  }

  if (typeof s !== 'string') {
    throw new TypeError('s is not a string: ' + (typeof s === 'undefined' ? 'undefined' : _typeof(s)));
  }

  if (indent != null && typeof indent !== 'number') {
    throw new TypeError('indent is not a number: ' + (typeof s === 'undefined' ? 'undefined' : _typeof(s)));
  }

  var baseIndentation = ' '.repeat(indent);
  var result = ['{'];

  result.push(baseIndentation + '  height: ' + node.height + ',');
  result.push(baseIndentation + '  edges: [' + node.edges.join(', ') + '], // ' + node.edges.map(function (i) {
    return s.slice(i);
  }).join(', '));

  if (node.left != null) {
    result.push(baseIndentation + '  left: ' + suffixTreeToString(node.left, s, indent + 2) + ',');
  }

  if (node.right != null) {
    result.push(baseIndentation + '  right: ' + suffixTreeToString(node.right, s, indent + 2) + ',');
  }

  result.push(baseIndentation + '}');

  return result.join('\n');
}

/**
 * Calculates the suffix tree for the given string.
 *
 * @param {string} s a string.
 * @param {string} [terminator] an optional terminator character, which may not
 *    be present in s. If none are specified, then a character in the Unicode
 *    private use area will be used.
 */
function suffixTree(s, terminator) {
  var t = void 0;
  if (terminator != null) {
    if (terminator.length !== 1) {
      throw new Error('The terminator argument must be exactly one character');
    }
    t = terminator.charCodeAt(0);
  } else {
    t = UNICODE_BPM_PRIVATE_USE_AREA_START;
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      if (c >= t) {
        t = c + 1;
      }
    }
  }

  return createSuffixTree(s, String.fromCharCode(t));
}