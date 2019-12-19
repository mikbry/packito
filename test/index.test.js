/**
 * Copyright (c) Mik BRY
 * mik@miklabs.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { expect } from 'chai';
import { getPackage } from '../src/utils/package';
import cli, { PackitoCli } from '../src/cli';

let stack = [];
const consol = {
  log: (text, ...opts) => {
    stack.push(text.concat(' ', ...opts).trim());
  },
  error: (text, ...opts) => {
    stack.push(text.concat(' ', ...opts).trim());
  },
};

describe('Cli', () => {
  it('init', async () => {
    const c = await cli(consol);
    expect(c).to.be.an('object');
    const { version } = getPackage('packito');
    expect(stack[0]).to.equal(`\u001b[1mPackito cleans package before publishing v${version}\u001b[22m`);
  });
  it('constructor', async () => {
    const pcli = new PackitoCli([], consol, process.exit);
    await pcli.execute(true);
    expect(pcli).to.be.an('object');
    const { version } = getPackage('packito');
    expect(stack[0]).to.equal(`\u001b[1mPackito cleans package before publishing v${version}\u001b[22m`);
  });
  it('help', async () => {
    const pcli = new PackitoCli(['--help'], consol, process.exit);
    await pcli.execute(true);
    expect(pcli).to.be.an('object');
    const { version } = getPackage('packito');
    expect(stack[0]).to.equal(`\u001b[1mPackito cleans package before publishing v${version}\u001b[22m`);
    expect(stack.length).to.equal(21);
  });
  it('error', async () => {
    stack = [];
    const pcli = new PackitoCli([], consol, process.exit);
    pcli.error('show an error');
    expect(stack[0]).to.equal(`show an error`);
    expect(stack.length).to.equal(1);
  });
});
