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

const stack = [];
const consol = {
  log: (text, ...opts) => {
    stack.push(text.concat(' ', ...opts));
  },
  error: (text, ...opts) => {
    stack.push(text.concat(' ', ...opts));
  },
};

describe('Cli', () => {
  it('init', async () => {
    const c = await cli(consol);
    expect(c).to.be.an('object');
    const { version } = getPackage('packito');
    expect(stack[0]).to.equal(`\u001b[1mPackito cleans package before publishing v${version}\u001b[22m `);
  });
  it('constructor', async () => {
    const pcli = new PackitoCli([], console, process.exit);
    await pcli.execute(true);
    expect(pcli).to.be.an('object');
    const { version } = getPackage('packito');
    expect(stack[0]).to.equal(`\u001b[1mPackito cleans package before publishing v${version}\u001b[22m `);
  });
});
