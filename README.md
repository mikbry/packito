# 📦 Packito

[![Build Status][travis-image]][travis-url]
[![codecov][codecov-image]][codecov-url]
[![NPM version][npm-image]][npm-url]
[![License][license-image]][license-url]

[travis-image]: https://travis-ci.com/mikbry/packito.svg?branch=master
[travis-url]: https://travis-ci.com/mikbry/packito
[codecov-image]: https://codecov.io/gh/mikbry/packito/branch/master/graph/badge.svg?token=K4P0vnM5fh
[codecov-url]: https://codecov.io/gh/mikbry/packito
[npm-image]: https://img.shields.io/npm/v/packito.svg
[npm-url]: https://npmjs.org/package/packito
[license-image]: https://img.shields.io/npm/l/packito.svg
[License-url]:./LICENSE

> Packito is a cli tool to clean package before publishing it.


### Purpose
Before publishing to npm, did you take care of your package.json ?

* devDependencies, some scripts and other entries("husky", ...) could be removed.
* add some new or change entries, like "main" source file name
* use a dist file and copy some extra files/directories in it (README.md, LICENSE, ...).
* and finally publish your package using npm, np or lerna.

***Simple using one command:***
```bash
$ packito
```
By default it will remove "scripts" and "devDependencies", copy README.md and LICENSE if they exist to './dist' folder.

### Install
```bash
$ yarn add --dev packito
```

Or using npm
```bash
$ npm add --dev packito
```

### Usage
```bash
$ packito [options] [bin-to-publisher]
```

***Options***

| name | alias | description |
| ----------- | --- | ----------- |
| --dist     | -d | Path to publish from |
| --nopublish     | -n | Skips publishing step |
| --help     | -h | Displays help informations |

***Bin to publisher***

| name | description |
| -----------  | ----------- |
| npm     | Publish using npm |
| lerna     | Publish using npm |
| np     | Publish using np |


***.packito.json***

It is the configuration file.
This json should be at root of the project, a sample:
```json
{
  "remove": {
    "devDependencies": "*",
    "scripts": "*",
    "type": true,
    "esm": true,
    "husky": true,
    "commitlint": true
  },
  "replace": {
    "main": "index.js",
    "module": "index.mjs"
  },
  "publisher":  "np"
}
```

| name | type | description |
| ----------- | --- | ----------- |
| remove     | object | all keys to remove from packages.json (if =true or ='*' replace all) |
| replace     | object | all keys+values to replace in packages.json |
| copy     | object | all files to copy in dist |
| output     | string | folder to publish to |
| publisher     | string\|object | The publisher to use (npm, np, lerna) |

***Other command examples***
> Publish to path 'publish'
```bash
$ packito -d ./publish
```
> Publish to path 'publish' and use `np patch`to publish
```bash
$ packito -d ./publish np patch
```

### Coded using state of the art and simplicity in mind
- Simple to use
- Modern ES6+ syntax (import instead of require, await/async, ...)
- Follows [Node best practices](https://github.com/goldbergyoni/nodebestpractices)

### Requirements
- Node >= 10

## Contribution

Read [Contributing Guide](CONTRIBUTING.md) for development setup instructions.
