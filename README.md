# String Algorithms

## Features

This package implements a collection of linear-time and linear-space string
algorithms that are often used when implementing more advanced searching,
sorting and indexing algorithms. The algorithms all accept and properly handle
16-bit [Unicode](http://www.unicode.org) strings.

The algorithms implemented are:

 - `longestCommonPrefix` calculates the
   [longest common prefixes](https://en.wikipedia.org/wiki/LCP_array) given a
   suffix array in O(n).
 - `multipleLongestCommonSubstring` calculates the longest common substring of
   two or more strings in O(n) or O(n + log(k)) depending on the chosen index
   map implementation. The O(n) version requires an additional O(n) space,
   wheras the O(n + log(k)) version only requires an additional O(k) space).
 - `radixSort` sorts an array with number arrays that are all of the same
   length in O(n).
 - `suffixArray` calculates the
   [suffix array](https://en.wikipedia.org/wiki/Suffix_array) of a given string
   in O(n).

**Note**: While the algorithms are linear-time implementations, they are still
outperformed by readily available C/C++ implementations. Due to limitations of
Node.js, the maximum string size is currently limited too by the maximum heap
size which is currently just shy of 2GB. The actual longest string that can
be handled by the multiple longest common substring algorithm will be sevaral
factors shorter than the maximum heap size.

## Examples

### Longest Common Substring of Multiple Strings

Find the longest common substring:

```javascript
import { multipleLongestCommonSubstring } from 'string-algorithms';

const strings = [
  '12apple',
  '3apple4',
  'apple56'
];

console.log(multipleLongestCommonSubstring(strings));
```

produces the output `apple`.

### Suffix Array

Find the suffix array of `mississippi`:

```javascript
import { suffixArray } from 'string-algorithms';

console.log(suffixArray('mississippi'));
```

produces the output

```javascript
[
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
  2, //  ssissippi
  11 //  $
]
```

## Install

    npm install --save string-algorithms

## API

### `radixSort`

...

### `suffixArray`

...

### `longestCommonPrefix`

...

### `multipleLongestCommonSubstring`

...

## Contributing

Contributions welcome; Please submit all pull requests against the master
branch. If your pull request contains JavaScript patches or features, you
should include relevant unit tests. Please check the
[Contributing Guidelines](./CONTRIBUTING.md)
for more details. Thanks!

## Author

Kim Burgaard.

## License

[MIT](./LICENSE.txt)

