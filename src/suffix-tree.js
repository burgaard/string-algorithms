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
import longestCommonPrefix from './longest-common-prefix';

/**
 * Node instances have a value, which is the node's LCP rank and at least two
 * children which may either be other nodes or leafs that represent the start
 * index of a suffix string.
 */
export function Node(value) {
  this.value = value;

  this.parent = undefined;
  this.left = undefined;
  this.right = undefined;
}

export function prune(node) {
  if (node == null) {
    throw new Error('Attempt to prune null or undefined node');
  }

  if (node.left != null) {
    prune(node.left);
  }

  if (node.left != null) {
    if (node.value !== 0 && node.value === node.left.value) {
      console.log('prune fusing left side');
      const { left, right } = node.left;
      node.left = left;
      if (right != null) {
        if (node.right != null) {
          throw new Error('Can\'t fuse left node when both right nodes are defined');
        }
        node.right = node.left.right;
      }
    }
  }

  if (node.right != null) {
    prune(node.right);
  }

  if (node.right) {
    if (node.value !== 0 && node.value === node.right.value) {
      console.log('prune fusing right side');
      const { left, right } = node.right;
      node.right = right;
      if (left != null) {
        if (node.left != null) {
          throw new Error('Can\'t fuse right node when both left nodes are defined');
        }
        node.left = left;
      }
    }
  }

  delete node.parent;

  return node;
}

// O(n) DFS pass to add suffix nodes to the cartesian LCP tree.
export function addSuffixes(node, sa) {
  if (node.left != null) {
    addSuffixes(node.left, sa);
  } else {
    if (sa.length === 0) {
      throw new Error(`The suffix array is empty at index ${node.value}`);
    }

    node.left = sa.shift();
  }

  if (node.right != null) {
    addSuffixes(node.right, sa);
  } else {
    if (sa.length === 0) {
      throw new Error(`The suffix array is empty at index ${node.value}`);
    }

    node.right = sa.shift();
  }
}

export function printable(s, node) {
  if (node == null) {
    throw new Error('node is null');
  }

  const result = { value: node.value };

  const leftType = typeof node.left;
  switch (leftType) {
    case 'number':
      result.left = s.slice(node.left);
      break;
    case 'object':
      result.left = printable(s, node.left);
      break;
    case 'undefined':
      break;
    default:
      throw new Error(leftType);
  }

  const rightType = typeof node.right;
  switch (rightType) {
    case 'number':
      result.right = s.slice(node.right); // eslint-disable-line no-console
      break;
    case 'object':
      result.right = printable(s, node.right);
      break;
    case 'undefined':
      break;
    default:
      throw new Error(rightType);
  }

  return result;
}

// O(n) cartesian tree construction
export function createCartesianTree(sequence) {
  console.log('createCartesianTree', sequence);

  const n = sequence.length;

  let root = new Node(sequence[0]);

  let last = root;
  for (let i = 1; i < n; i++) {
    const node = new Node(sequence[i]);

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

/**
 * Calculates the suffix tree for the given string.
 *
 * @param {string} s a string.
 * @param {string} [terminator] an optional terminator character, which may not
 *    be present in s. If none are specified, then a character in the Unicode
 *    private use area will be used.
 */
export default function suffixTree(s, terminator) {
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
  const sa = suffixArray(s, terminator);
  console.log('sa', sa);
  for (const i of sa) {
    console.log(s.slice(i));
  }

  // O(n)
  const lcp = longestCommonPrefix(s + terminator, sa);
  console.log('lcp', lcp);
  for (const i of lcp) {
    console.log(s.slice(i));
  }

  // O(n)
  const tree = createCartesianTree(lcp);

  // O(n)
  addSuffixes(tree, sa);

  if (sa.length !== 0) {
    console.error(sa);
    throw new Error('Left-over suffix array entries');
  }

  return tree;
}
