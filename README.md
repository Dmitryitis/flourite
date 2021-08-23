# Flourite - Language detector

A fork of [ts95/lang-detector](https://github.com/ts95/lang-detector), rewritten in Typescript with more language support.

Detects a programming language from a given string.

- Built-in support for CommonJS and ESM format
- Built-in Typescript typings
- No external dependencies
- 100 test cases and growing!

## Detectable languages

| Languages |            |        |
| --------- | ---------- | ------ |
| C         | HTML       | PHP    |
| C++       | Java       | Python |
| C#        | Javascript | Ruby   |
| CSS       | Julia      | Rust   |
| Go        | Lua        | SQL    |

## Install

```bash
$ npm install flourite
```

or via a CDN (unpkg or jsdelivr)

```html
<script src="https://unpkg.com/flourite@1.0.2"></script>
<script src="https://cdn.jsdelivr.net/npm/flourite@1.0.2/dist/index.iife.js"></script>
```

## Usage

```js
import flourite from 'flourite';

const code = flourite('console.log("Hello World");'); // => Javascript
```

You could supply options to make see numbers of points for a certain language:

```js
import flourite from 'flourite';

const code = flourite('printf("Hello World")', { statistics: true });

// code.detected = 'C'
// code.statistics = {
//   C: 5,
//   'C++': 0,
//   'C#': 0,
//   CSS: 0,
//   Go: 0,
//   HTML: 0,
//   Java: 0,
//   Javascript: 0,
//   Julia: 0,
//   Lua: -20,
//   PHP: 0,
//   Python: 0,
//   Ruby: 0,
//   Rust: 0,
//   SQL: 0,
//   Unknown: 1
// }
```

Or if you want to integrate it with [Shiki](https://github.com/shikijs/shiki), you could pass:

```js
const code = flourite('Console.WriteLine("Hello world!");', { shiki: true }); // => csharp
```

If you want to handle `Unknown` value, you could pass:

```js
const code = flourite("SELECT 'Hello world!' text FROM dual;", { noUnknown: true });
```

### With Typescript

```typescript
import flourite from 'flourite';
import type { Options, StatisticOutput } from 'flourite';

const flouriteOptions: Options = {
  heuristic: true,
  statistics: true,
};

const code = flourite('print!({:?}, &v);', flouriteOptions) as StatisticOutput;
```

### Available Options

| Key        | Type      | Default | Description                                                                                      |
| ---------- | --------- | ------- | ------------------------------------------------------------------------------------------------ |
| heuristic  | `boolean` | `true`  | Checks for codes on the top of the given input. Only checks when the lines of code is above 500. |
| statistics | `boolean` | `false` | If `true`, will return the statistics of all the guessed language.                               |
| shiki      | `boolean` | `false` | Straightforward compatibility with Shiki's language specification type                           |
| noUnknown  | `boolean` | `false` | If `true`, will not output `Unknown` on detected and statistics result                           |

## Development

- Use the Node.js version as defined on the `.nvmrc` file.
- Run `npm run test:tdd` to initiate a test driven development environment.
- Run `npm run lint` and `npm run format` before commit a change.

## License

[MIT](./LICENSE)
