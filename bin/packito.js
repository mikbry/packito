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
  const output = console;
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    try {
      await import('../src/cli');
    } catch (e) {
      //
    }
  } else {
    try {
      const path = require('path');
      // eslint-disable-next-line import/no-unresolved
      // eslint-disable-next-line import/no-dynamic-require
      require(path.join(__dirname, '../index.js'));
    } catch (e) {
      //
      output.error(e);
    }
  }
})();
