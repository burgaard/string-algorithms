import now from 'performance-now';

import suffixArray from './suffix-array';
import longestCommonSubstring from './longest-common-substring';

// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateString(n, min, max) {
  const result = new Array(n);
  let i = 0;
  while (i < n) {
    result[i++] = getRandomInt(min, max);
  }

  return result.map(c => String.fromCharCode(c)).join('');
}

describe('Performance', () => {
  it('suffixArray', () => {
    const results = {};

    for (let r = 0; r < 10; r++) {
      for (let n = 100; n < 1000; n += 100) {
        const start = now();
        suffixArray(generateString(n, 'a'.charCodeAt(0), 'z'.charCodeAt(0)));
        const delta = now() - start;
        if (n in results) {
          results[n].push(delta);
        } else {
          results[n] = [delta];
        }
      }
    }

    const times = [];
    for (const key of Object.keys(results)) {
      const samples = results[key];
      times.push(samples.reduce((a, e) => a + e, 0) / (samples.length * key));
    }
    // console.log(times.join('\n'));
  });

  it('longestCommonSubstring', () => {
    const results = {};

    for (let r = 0; r < 10; r++) {
      for (let k = 2; k < 10; k++) {
        for (let n = 100; n < 1000; n += 100) {
          const strings = new Array(k);
          let i = 0;
          while (i < k) {
            strings[i++] = generateString(n, 'a'.charCodeAt(0), 'z'.charCodeAt(0));
          }
          const start = now();
          longestCommonSubstring(strings);
          const delta = now() - start;
          const key = `${k}.${n}`;
          if (key in results) {
            results[key].push(delta);
          } else {
            results[key] = [delta];
          }
        }
      }
    }

    const times = [];
    for (const key of Object.keys(results)) {
      const [k, n] = key.split('.');
      const samples = results[key];
      times.push(samples.reduce((a, e) => a + e, 0) / (samples.length * k * n));
    }
    // console.log(times.join('\n'));
  });
});
