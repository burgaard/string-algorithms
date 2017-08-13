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

import getSuffixArray from './suffix-array.js';
import getLongestCommonPrefix from './longest-common-prefix.js';

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
        if (terminator.length != 1) {
            throw 'The terminator argument must be exactly one character';
        }

        // O(n)
        if (s.indexOf(terminator) != -1) {
            throw 'The terminator argument must not be a member of s';
        }
    } else {
        throw new Error('TODO');
    }

    // O(n)
    const sa = getSuffixArray(s, terminator);

    // O(n)
    const lcp = getLongestCommonPrefix(s + terminator, sa);

    // O(n)
    const tree = createCartesianTree(lcp);

    // O(n)
    addSuffixes(tree, sa);

    if (sa.length != 0) {
        throw new Error('Left-over suffix array entries');
    }

    print(s, tree);

    return tree;
}

// O(n) DFS pass to add suffix nodes to the cartesian LCP tree.
function addSuffixes(node, suffixArray) {
    if (node.left != null) {
        addSuffixes(node.left, suffixArray);
    } else {
        if (suffixArray.length == 0) {
            throw new Error(`The suffix array is empty at index ${ node.value }`);
        }

        node.left = suffixArray.shift();
    }

    if (node.right != null) {
        addSuffixes(node.right, suffixArray);
    } else {
        if (suffixArray.length == 0) {
            throw new Error(`The suffix array is empty at index ${ node.value }`);
        }

        node.right = suffixArray.shift();
    }
}

// O(n) cartesian tree construction
function createCartesianTree(sequence) {
    const n = sequence.length;

    let root = new Node(sequence[0]);

    let last = root;
    for (let i = 1; i < n; i++) {
        const node = new Node(sequence[i]);

        while (last.value > sequence[i] && last != root) {
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

function prune(node) {
    if (node.left != null) {
        if (node.value == node.left.value) {
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
        if (node.value == node.right.value) {
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

function print(s, node) {
    switch(typeof node.left) {
        case 'number':
            console.log(s.slice(node.left));
            break;
        case 'object':
            print(s, node.left);
            break;
        default:
            throw new Error(typeof node.left);
    }

    switch(typeof node.right) {
        case 'number':
            console.log(s.slice(node.right));
            break;
        case 'object':
            print(s, node.right);
            break;
        default:
            throw new Error(typeof node.right);
    }
}

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

export default suffixTree;

export {
    addSuffixes,
    createCartesianTree,
    prune
};
