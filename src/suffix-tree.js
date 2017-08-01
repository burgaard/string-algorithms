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
        if (s.indexOf(terminator)) {
            throw 'The terminator argument must not be a member of s';
        }
    } else {

    }

    // O(n)
    const sa = getSuffixArray(s);

    // O(n)
    const lcp = getLongestCommonPrefix(sa);

    // O(n)
    const tree = fuseDuplicates(getCartesianTree(lcp));

    // O(n)
    addSuffixes(tree, [ ...sa ]);

    return tree;
}

// O(n) DFS pass to add suffix nodes to the cartesian LCP tree.
function addSuffixes(node, sa) {
    const children = node.getChildren();
    for (let i = 0; i < children.length; i++) {
        const child = children [ i ];
        if (child != null) {
            addSuffixes(child, sa);
        } else {
            children[ i ] = sa.shift();
        }
    }
}

// O(n) fuse parent-child nodes with identical LCP values
function fuseDuplicates(node) {
    let i = 0;
    while (i < node.children.length) {
        let child = node.getChild(i);

        fuseDuplicates(child);

        while (child != null && child.value == node.value) {
            // remove child and merge its children into this node's children
            node.replaceChild(i, child.children);

            child = node.getChild(i);
        }

        i++;
    }
}

// O(n) cartesian tree construction
function getCartesianTree(sequence) {
    const { smaller, bigger } = nearestValues(sequence);

    const nodes = {};
    for (let i = 0; i < sequence.length; i++) {
        const value = sequence[ i ];
        const node = getNode(nodes, value);

        const smallerValue = smaller[ i ];
        if (smallerValue != null) {
            node.addChild(0, getNode(nodes, smallerValue));
        }

        const biggerValue = bigger[ i ];
        if (biggerValue != null) {
            node.addChild(1, getNode(nodes, biggerValue));
        }
    }
}

// O(1) node lookup
function getNode(nodes, value) {
    if (value in nodes) {
        return nodes[ value ];
    }

    return nodes[ value ] = new Node(value);
}

/**
 * Node instances have a value, which is the node's LCP rank and at least two
 * children which may either be other nodes or leafs that represent the start
 * index of a suffix string.
 */
function Node(value) {
    this.value = value;
    this.children = new Array(2);

    /**
     * Sets the given node as a child at the given index.
     * @param {number} index the child's index.
     * @param {Node|number} node a Node instance or an integer index.
     */
    this.setChild = function(index, node) {
        this.children[ index ] = node;
    }

    /**
     * Replaces the child at the given index with zero or more children.
     * @param {number} index the child's index.
     * @param {Array.<Node|number>} children an array with Nodes and/or integer indices.
     */
    this.replaceChild(index, children) {
        this.children.splice(index, 1, children);
    }

    /**
     * Gets the child at the given index.
     * @param {number} index the index of a child node.
     * @return {Node|number} a node or an integer.
     */
    this.getChild = function(index) {
        return this.children[ index ];
    }

    /**
     * Gets the children of this node.
     * @return {Array.<Node|number>} an array with Nodes and/or integers.
     */
    this.getChildren = function() {
        return this.chilren;
    }
}

// O(n) all nearest smaller/bigger values algorithm
function nearestValues(sequence) {
    const n = sequence.length;

    const smaller = new Array(n);
    const smallerStack = [];

    const bigger = new Array(n);
    const biggerStack = [];

    for (let i = 0; i < n; i++) {
        const x = sequence[i];

        while (smallerStack.length > 0 && s[0] <= x) {
            smallerStack.shift();
        }
        if (smallerStack.length > 0) {
            result[i] = smallerStack[ 0 ];
        }
        smallerStack.unshift(x);

        while (biggerStack.length > 0 && s[0] >= x) {
            biggerStack.shift();
        }
        if (biggerStack.length > 0) {
            result[i] = biggerStack[ 0 ];
        }
        biggerStack.unshift(x);
    }

    return { smaler, bigger };
}
