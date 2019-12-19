/**
 * Copyright (c) Mik BRY
 * mik@miklabs.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { expect } from 'chai';
import { getPackageDependencyVersion } from '../src/utils/package';

describe('Package', () => {
  it('getPackageDependencyVersion undefined', async () => {
    const p = getPackageDependencyVersion();
    expect(p).to.equal(undefined);
  });
  it('getPackageDependencyVersion chalk', async () => {
    const p = getPackageDependencyVersion('chalk');
    expect(p).to.equal('3.0.0');
  });
  it('getPackageDependencyVersion dummy', async () => {
    const p = getPackageDependencyVersion('dummy', '1.0.0');
    expect(p).to.equal('1.0.0');
  });
});
