/**
 * Copyright (c) 2019-present, Mik BRY
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import chalk from 'chalk';
import emoji from 'node-emoji';
import minimist from 'minimist';
import { getPackage } from './utils/package';
import Packito from './Packito';

class PackitoCli {
  constructor(args, output, exit) {
    this.output = output;
    this.args = args;
    this.exit = exit;
    this.chalk = chalk;
    this.options = {
      string: ['dist'],
      boolean: ['nopublish', 'help'],
      stopEarly: true,
      alias: {
        d: 'dist',
        n: 'nopublish',
        h: 'help',
      },
      default: {
        dist: './dist',
        nopublish: false,
        help: false,
      },
    };
  }

  log(text, ...opts) {
    this.output.log(text, ...opts);
  }

  error(text, ...opts) {
    this.output.error(text, ...opts);
  }

  header() {
    const { version } = getPackage('packito');
    this.log(chalk.bold(emoji.emojify(`Packito cleans package before publishing v${version}`)));
  }

  usage() {
    this.log('Usage: $ packito [options] [bin-to-publisher]');
  }

  help() {
    this.usage();
    this.log('');
    this.log('Displays help informations.');
    this.log('');
    this.log('Options:');
    this.log('-d, --dist               Path to publish from');
    this.log('-n, --nopublish          Skips publishing step');
    this.log('-h, --help               Displays help informations');
    this.log('');
    this.log('Bin to publisher:');
    this.log('npm                      Publish using npm.');
    this.log('lerna                    Publish using lerna.');
    this.log('np                       Publish using np.');
    this.log('');
    this.log('Examples:');
    this.log('$ packito');
    this.log('$ packito -d ./publish');
    this.log('$ packito -d ./publish np patch');
  }

  async execute() {
    this.hrstart = process.hrtime();
    this.header();
    const args = minimist(this.args, this.options);
    if (args.help) {
      // Display help
      this.help();
    } else {
      // WIP execute
      const packito = new Packito(args.dist, args.n, args._);
      const pkg = getPackage();
      await packito.transform(pkg);
      // this.log('args=', args);
    }
  }
}

const start = async (output = console) => {
  const version = process.versions.node;
  const major = parseInt(version.split('.')[0], 10);

  if (major < 10) {
    output.error(`Node version ${version} is not supported, please use Node.js 10.0 or higher.`);
    process.exit(1);
  }

  // Grab arguments
  const [, , ...args] = process.argv;
  const cli = new PackitoCli(args, output, process.exit);
  await cli.execute();
  return cli;
};
export { PackitoCli };
export default start;
