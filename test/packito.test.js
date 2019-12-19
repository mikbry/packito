/**
 * Copyright (c) Mik BRY
 * mik@miklabs.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import path from 'path';
import fs from 'fs';
import { expect } from 'chai';
import rimraf from 'rimraf';
import Packito from '../src/Packito';

const fsp = fs.promises;
const TMP_PATH = './tmp_test';
describe('Packito', () => {
  before(async () => {
    // Recursive is node >= 12
    await fsp.mkdir(TMP_PATH);
  });

  after(async () => {
    // Recursive is node >= 12
    // await fsp.rmdir(TMP_PATH, { recursive: true });
    rimraf.sync(TMP_PATH);
  });

  it('init', async () => {
    const p = new Packito();
    expect(p).to.be.an('object');
  });

  it('readOptions', async () => {
    const p = new Packito();
    const opts = await p.readOptions();
    expect(opts).to.be.an('object');
  });

  it('readOptions empty', async () => {
    const p = new Packito();
    const opts = await p.readOptions('dummy.json');
    expect(opts).to.be.an('object');
    expect(Object.keys(opts).length).to.equal(0);
    expect(p.error.message).to.equal("ENOENT: no such file or directory, open 'dummy.json'");
  });

  it('transform empty', async () => {
    const p = new Packito();
    const pkg = await p.transform({}, {});
    expect(pkg).to.be.an('object');
  });

  it('transform remove', async () => {
    const p = new Packito();
    const pkg = await p.transform({}, { remove: { n1: '*', n2: true, n3: false } });
    expect(pkg).to.be.an('object');
  });

  it('transform replace', async () => {
    const p = new Packito();
    const pkg = await p.transform({}, { replace: { n1: 'v', n2: true, n3: false } });
    expect(pkg).to.be.an('object');
  });

  it('transform publisher', async () => {
    const p = new Packito();
    const pkg = await p.transform({}, { publisher: 'npm' });
    expect(pkg).to.be.an('object');
  });

  it('transform publisherArguments', async () => {
    const p = new Packito(null, false, 'npm');
    const pkg = await p.transform({}, {});
    expect(pkg).to.be.an('object');
  });

  it('write error', async () => {
    const p = new Packito();
    await p.write();
    expect(p.error.message).to.equal(`The "path" argument must be of type string. Received type undefined`);
  });

  it('write to path', async () => {
    const p = new Packito(path.join(TMP_PATH, 't1'));
    await p.write('pkg.json');
    expect(p.error).to.equal(undefined);
  });

  it('publish', async () => {
    const p = new Packito();
    await p.publish();
    expect(p).to.be.an('object');
  });

  it('no publish', async () => {
    const p = new Packito('./', true);
    await p.publish();
    expect(p).to.be.an('object');
  });
});
