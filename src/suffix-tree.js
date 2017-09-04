/**
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

import suffixArray from './suffix-array';
import stringToSequence from './string-sequence';
import longestCommonPrefix from './longest-common-prefix';

const UNICODE_BPM_PRIVATE_USE_AREA_START = 0xe000;

class Node {
  constructor(height) {
    this.left = undefined;
    this.right = undefined;
    this.parent = undefined;
    this.height = height;
    this.edges = [];
  }
}

// O(n) DFS pass to add suffix nodes to the cartesian LCP tree.
function addSuffixes(node, sa, offset = 0) {
  delete node.parent; // don't need parent anymore

  let o = offset;

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
    mergeNodes(node.right);

    const right = node.right;
    if (right.height !== node.height) {
      return node;
    }

    if (right.left != null && node.left != null) {
      return node;
    }

    // merge the right node into this node
    node.edges.push(...right.edges);

    node.right = right.right;
    if (node.left == null) {
      node.left = right.left;
    }
  }

  return node;
}

// O(n) cartesian tree construction
function createCartesianTree(sequence) {
  const n = sequence.length;

  let root = new Node(sequence[0]);
  let last = root;

  for (let i = 1; i < n; i++) {
    const height = sequence[i];

    while (last !== root && height < last.height) {
      // traverse up the tree
      last = last.parent;
    }

    const node = new Node(height);

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
  const sequence = stringToSequence(s);

  // O(n)
  const sa = suffixArray(sequence, terminator);

  // O(n)
  const lcp = longestCommonPrefix(sequence.concat(terminator), sa);

  // O(n)
  const tree = createCartesianTree(lcp);

  // O(n)
  const offset = addSuffixes(tree, sa);

  if (offset !== sa.length) {
    throw new Error(`Offset ${offset} does not match suffix array length ${sa.length}`);
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
export function suffixTreeToString(node, s, indent = 0) {
  if (!(node instanceof Node)) {
    throw new TypeError(`node is not an instance of Node: ${typeof node}`);
  }

  if (typeof s !== 'string') {
    throw new TypeError(`s is not a string: ${typeof s}`);
  }

  if (indent != null && typeof indent !== 'number') {
    throw new TypeError(`indent is not a number: ${typeof s}`);
  }

  const baseIndentation = ' '.repeat(indent);
  const result = [
    '{',
  ];

  result.push(`${baseIndentation}  height: ${node.height},`);
  result.push(`${baseIndentation}  edges: [${node.edges.join(', ')}], // ${node.edges.map(i => s.slice(i)).join(', ')}`);

  if (node.left != null) {
    result.push(`${baseIndentation}  left: ${suffixTreeToString(node.left, s, indent + 2)},`);
  }

  if (node.right != null) {
    result.push(`${baseIndentation}  right: ${suffixTreeToString(node.right, s, indent + 2)},`);
  }

  result.push(`${baseIndentation}}`);

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
export default function suffixTree(s, terminator) {
  let t;
  if (terminator != null) {
    if (terminator.length !== 1) {
      throw new Error('The terminator argument must be exactly one character');
    }
    t = terminator.charCodeAt(0);
  } else {
    t = UNICODE_BPM_PRIVATE_USE_AREA_START;
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      if (c >= t) {
        t = c + 1;
      }
    }
  }

  return createSuffixTree(s, String.fromCharCode(t));
}
