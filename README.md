# String Algorithms


[![Build Status](https://travis-ci.org/burgaard/string-algorithms.svg?branch=master)](https://travis-ci.org/burgaard/string-algorithms) [![Coverage Status](https://coveralls.io/repos/burgaard/string-algorithms/badge.svg)](https://coveralls.io/r/burgaard/string-algorithms)

## Features

This package implements a collection of linear-time and linear-space string
algorithms that are often used when implementing more advanced searching,
sorting and indexing algorithms. The algorithms all accept and properly handle
16-bit [Unicode](http://www.unicode.org) strings.

The algorithms implemented are:

 - `longestCommonPrefix` calculates the
   [longest common prefixes](https://en.wikipedia.org/wiki/LCP_array) given a
   suffix array. This implementation is based on
   [Kasei et al's algorithm](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.118.8221&rep=rep1&type=pdf).
 - `longestCommonSubstring` calculates the longest common substring of
   two or more strings in O(*n* + *k*) or O(*n* + (*k* log(*k*))) depending on
   the chosen index map implementation. The former version requires an additional
   O(*n*) space, whereas the latter version only requires an additional O(*k*)
   space.
 - `radixSort` sorts an array with sub-arrays that are all the same length.
 - `search` finds all instances of the given term in string. This implementation
   is based on
   [Knuth, Morris and Pratt's algorithm](https://en.wikipedia.org/wiki/Knuth–Morris–Pratt_algorithm).
 - `suffixArray` calculates the
   [suffix array](https://en.wikipedia.org/wiki/Suffix_array) of a given string.
   This implementation is based on the
   [Difference Cover modulo 3 (DC3)/skew algorithm by Kärkkäinen et al](http://algo2.iti.kit.edu/documents/jacm05-revised.pdf).

**Note**: While the algorithms provided here are linear-time implementations,
they are still outperformed by readily available C/C++ implementations.

Also note that although these implementations are O(*n*), linear time does not
automatically beat O(*n* log(*n*)) all the time. More efficient implementations
that are O(*n* log(*n*)) may in fact be faster in practice in many situations.
To see that, consider that log<sub>2</sub>(*n*) grows very slowly. For example
log<sub>2</sub>(100,000) is approximately 16.6. The linear-time longest common
substring implementation makes many linear passes through the input string,
quite possibly more than 16 in total. So if there exists an O(*n* log(*n*))
implementation that can do everything it needs to do in just one pass through
the input, it would already come out ahead of the linear time implementation
for n less than or equal to 100,000.

Due to limitations of Node.js, the maximum string size is currently limited too
by the maximum heap size which is currently just shy of 2GB--and the actual
longest string that can be handled by the multiple longest common substring
algorithm will be sevaral factors shorter than the maximum heap size.

## Examples

### Longest Common Substring of Multiple Strings

Find the longest common substring:

```javascript
import { longestCommonSubstring } from 'string-algorithms';

const strings = [
  '12apple',
  '3apple4',
  'apple56'
];

console.log(longestCommonSubstring(strings));
```

produces the output `apple`.

[Run the example](https://runkit.com/burgaard/59d49064735bd50012ba2525).

### Suffix Array

Find the suffix array of `mississippi`:

```javascript
import { suffixArray } from 'string-algorithms';

console.log(suffixArray('mississippi'));
```

produces the output

```javascript
[
  11, //  $
  10, // i
  7, //  ippi
  4, //  issippi
  1, //  ississippi
  0, //  mississippi
  9, //  pi
  8, //  ppi
  6, //  sippi
  3, //  sissippi
  5, //  ssippi
  2 //  ssissippi
]
```

[Run the example](https://runkit.com/burgaard/59d4902271579b00119965db).

### Radix Sort

Given an array with arrays of integers:

```javascript
import { radixSort } from 'string-algorithms';

const integers = [
  [-9,  4,  0],
  [ 4, -2,  3],
  [ 4,  2, -1],
  [ 1,  0,  6],
  [-4, -2, -5],
  [ 4,  6,  8],
];

const result = radixSort(integers);

/*
[
  [-9,  4,  0],
  [-4, -2, -5],
  [ 1,  0,  6],
  [ 4, -2,  3],
  [ 4,  2, -1],
  [ 4,  6,  8],
];
*/
```

[Run the example](https://runkit.com/burgaard/59d48f7d71579b0011996590).

Given an array of strings that are all the same length, and a function that converts
each string to an array of char codes:

```javascript
const strings = [
  'image',
  'mania',
  'genom',
  'mango'
];

const result = radixSort(strings, s => s.split('').map(c => c.charCodeAt(0)));

/*
[
  'genom',
  'image',
  'mango',
  'mania'
]
*/
```

[Run the example](https://runkit.com/burgaard/59d482d2735bd50012ba1ee7).

## Install

```
npm install --save string-algorithms
```

## API

### `function search(text, term)`

Finds all instances of term in the given text.

`text` is the string to be searched.

`term` is the substring to search for.

Returns an array with the start index of all occurrences of term in text.

**Note:** 

### `function radixSort(entries, getEntry)`

Radix sorts an array of entries. If `getEntry` is not given, then `entries` is assumed to contain
an array of arrays where each sub-array is of the same length. If `getEntry` is given, then the
entries may be of any type, but `getEntry` must return an array of the same length corresponding
to each given entry.

`entries` is an array with entries to be radix sorted.

`getEntry` is an optional function for retrieving each entry as an array. For example, entries
may contain arrays that are all 4 elements long, but only the last three elements should be
considered for sorting. In that case, `getEntry` could be `entry => entry.slice(1)`.

Returns a new array with the sorted entries.

**Note:** Although this is a linear-time sort algorithm, it requires input to be of a uniform
length (arrays with k entries, strings with at most k characters, digits with at most k digits
and so on). The constant overhead is also pretty big, so for something as simple as sorting
integers, a fast O(n * log(n)) implementation will probably beat radix sorting even for pretty
big n.

### `function suffixArray(s, terminator)`

Calculates the suffix array for the given string and an optional terminator code which must be
negative.

`s` is the string or array of character codes to compute the suffix array for.

`terminator` is an optional negative terminator code. The terminator code must not be present
anywhere in `s`.

Returns an array with the sorted suffixes of `s`.

### `function longestCommonPrefix(sequence, suffixArray)`

Calculates the longest common prefix from a suffix array in linear time.

`sequence` is a sequence of character codes.

`suffixArray` is the suffix array corresponding to `sequence`.

Returns an array indicating the height of the shared prefix between adjecent suffix array
entries.

### `function longestCommonSubstring(strings, indexMap)`

 Finds the longest common substring(s) in the set of given strings. If there are multiple
 substrings that all share the longest length, then all such substrings are returned.
 O(*n* + *k*) or O(*n* + *k* log(*k*)) depending on the selected string indexing strategy.
 
 `strings` is an array of strings.

 `indexMap` is the optional string indexing map strategy. If given a string, it must be one
 of 'log' or 'linear'. Otherwise it must be an object that derives from `StringIndexMap`. The
 default value is 'log'.

Returns an array with the longest common substrings(s).

### `class StringIndexMap`

Maps the position of strings s<sub>1</sub> ... s<sub>K</sub> when concatenated into one string.
Concrete implementations provide different compromises between O(1) and O(log(*k*)) lookup times
versus O(*n*) and O(*k*) space requirements. Extend this class to implement custom mappings from
string positions to substring indices with different runtime/space tradeoffs than the two
pre-defined implementations.

#### `function add(length)`

Adds a substring with the given length.

`length` is the length of the substring.

Returns the current total length of all substrings.

#### `lookup(position)`

Looks up the substring corresponding to the given position in the concatenated string.

`position` is the position in the concatenated string

Returns the index of the substring that contains the given position.

#### `toString()`

Returns a string representation of the string index map.
 
## Contributing

Contributions welcome; Please submit all pull requests against the master branch. If your
pull request contains JavaScript patches or features, you should include relevant unit
tests. Please check the [Contributing Guidelines](./CONTRIBUTING.md) for more details.
Thanks!

## Author

Kim Burgaard &lt;kim@burgaard.us&gt;.

Made in Sunny California with love and sustainably harvested coffee.

## License

[MIT](./LICENSE)

