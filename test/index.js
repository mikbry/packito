/**
 * Copyright (c) Mik BRY
 * mik@miklabs.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// import { expect } from 'chai';
import cli from '../src/cli';

describe('Cli', () => {
  it('init', async () => {
    await cli();
  });
});
