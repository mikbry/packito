#!/usr/bin/env node
/* eslint-disable global-require */
/* istanbul ignore file */

/**
 * Copyright (c) Mik BRY
 * mik@miklabs.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// These file need to be executable
// chmod +x packito.js

(async () => {
  let d;
  let cli;
  const output = console;
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    try {
      d = await import('../src/cli');
      cli = d.default;

      if (cli) {
        await cli();
      } else {
        output.error(`Packito can't be started`);
      }
    } catch (e) {
      //
    }
  } else {
    try {
      const path = require('path');
      const [, , ...args] = process.argv;
      console.log('path=', args[0]);
      const p = args[0] || './index.js';
      // eslint-disable-next-line import/no-unresolved
      // eslint-disable-next-line import/no-dynamic-require
      d = require(path.join(__dirname, p));
      cli = d.default;
    } catch (e) {
      //
      output.error(e);
    }
  }
})();
