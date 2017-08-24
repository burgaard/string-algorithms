'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
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

exports.Node = Node;
exports.prune = prune;
exports.addSuffixes = addSuffixes;
exports.createCartesianTree = createCartesianTree;
exports.print = print;
exports.default = suffixTree;

var _suffixArray = require('./suffix-array');

var _suffixArray2 = _interopRequireDefault(_suffixArray);

var _longestCommonPrefix = require('./longest-common-prefix');

var _longestCommonPrefix2 = _interopRequireDefault(_longestCommonPrefix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Node instances have a value, which is the node's LCP rank and at least two
 * children which may either be other nodes or leafs that represent the start
 * index of a suffix string.
 */
function Node(value) {
  this.value = value;

  this.parent = undefined;
  this.left = undefined;
  this.right = undefined;
}

function prune(node) {
  if (node.left != null) {
    if (node.value === node.left.value) {
      node.left = node.left.left;

      if (node.right != null) {
        if (node.left.right != null) {
          throw new Error('Can\'t fuse left node when both right nodes are defined');
        }
      } else {
        node.right = node.left.right;
      }
    }

    prune(node.left);
  }

  if (node.right != null) {
    if (node.value === node.right.value) {
      node.right = node.right.right;

      if (node.left != null) {
        if (node.right.left != null) {
          throw new Error('Can\'t fuse right node when both left nodes are defined');
        }
      } else {
        node.left = node.right.left;
      }
    }

    prune(node.right);
  }

  delete node.parent;

  return node;
}

// O(n) DFS pass to add suffix nodes to the cartesian LCP tree.
function addSuffixes(node, suffixArray) {
  if (node.left != null) {
    addSuffixes(node.left, suffixArray);
  } else {
    if (suffixArray.length === 0) {
      throw new Error('The suffix array is empty at index ' + node.value);
    }

    node.left = suffixArray.shift();
  }

  if (node.right != null) {
    addSuffixes(node.right, suffixArray);
  } else {
    if (suffixArray.length === 0) {
      throw new Error('The suffix array is empty at index ' + node.value);
    }

    node.right = suffixArray.shift();
  }
}

// O(n) cartesian tree construction
function createCartesianTree(sequence) {
  var n = sequence.length;

  var root = new Node(sequence[0]);

  var last = root;
  for (var i = 1; i < n; i++) {
    var node = new Node(sequence[i]);

    while (last.value > sequence[i] && last !== root) {
      last = last.parent;
    }

    if (last.value > sequence[i]) {
      root.parent = node;
      node.left = root;
      root = node;
    } else if (last.right == null) {
      last.right = node;
      node.parent = last;
    } else {
      last.right.parent = node;
      node.left = last.right;
      last.right = node;
      node.parent = last;
    }
  }

  return prune(root);
}

function print(s, node) {
  switch (_typeof(node.left)) {
    case 'number':
      console.log(s.slice(node.left)); // eslint-disable-line no-console
      break;
    case 'object':
      print(s, node.left);
      break;
    default:
      throw new Error(_typeof(node.left));
  }

  switch (_typeof(node.right)) {
    case 'number':
      console.log(s.slice(node.right)); // eslint-disable-line no-console
      break;
    case 'object':
      print(s, node.right);
      break;
    default:
      throw new Error(_typeof(node.right));
  }
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
  if (terminator != null) {
    if (terminator.length !== 1) {
      throw new Error('The terminator argument must be exactly one character');
    }

    // O(n)
    if (s.indexOf(terminator) !== -1) {
      throw new Error('The terminator argument must not be a member of s');
    }
  } else {
    throw new Error('TODO');
  }

  // O(n)
  var sa = (0, _suffixArray2.default)(s, terminator);

  // O(n)
  var lcp = (0, _longestCommonPrefix2.default)(s + terminator, sa);

  // O(n)
  var tree = createCartesianTree(lcp);

  // O(n)
  addSuffixes(tree, sa);

  if (sa.length !== 0) {
    throw new Error('Left-over suffix array entries');
  }

  print(s, tree);

  return tree;
}
