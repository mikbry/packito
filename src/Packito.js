/**
 * Copyright (c) Mik BRY
 * mik@miklabs.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import fs from 'fs';
import path from 'path';

const fsp = fs.promises;

export default class Packito {
  constructor(outputDir, noPublish, publisherArguments = []) {
    this.outputDir = outputDir;
    this.noPublish = noPublish;
    this.publisherArguments = publisherArguments;
  }

  async readOptions() {
    const f = path.join('./', '.packito.json');
    let filehandle = null;
    let options = null;
    try {
      filehandle = await fsp.open(f, 'r');
      const raw = await filehandle.readFile();
      options = JSON.parse(raw);
    } finally {
      if (filehandle) {
        await filehandle.close();
      }
    }
    if (!options) {
      options = {};
    }
    this.options = options;
    return options;
  }

  async transform(_pkg) {
    const pkg = { ..._pkg };
    const options = await this.readOptions();
    const { remove, replace } = options;
    if (typeof remove === 'object') {
      Object.keys(remove).forEach(e => {
        if (remove[e] || remove[e] === '*') {
          delete pkg[e];
        }
      });
    }
    if (typeof replace === 'object') {
      Object.keys(replace).forEach(e => {
        if (replace[e]) {
          pkg[e] = replace[e];
        }
      });
    }
    if (typeof options.publisher === 'object') {
      this.publisher = options.publisher;
    } else if (typeof options.publisher === 'string') {
      this.publisher = { name: options.publisher };
    } else if (this.publisherArguments) {
      this.publisher = { name: this.publisherArguments };
    }
    this.pkg = pkg;
    this.data = JSON.stringify(this.pkg, null, '\t');
    await this.write();
    // TODO handle publisher
    return this.pkg;
  }

  async write() {
    // TODO test if outputDir exist
    const f = path.join(this.outputDir, 'package.json');
    let filehandle = null;
    try {
      filehandle = await fsp.open(f, 'w');
      await filehandle.writeFile(this.data);
    } finally {
      if (filehandle) {
        await filehandle.close();
      }
    }
  }

  async publish() {
    if (!this.noPublish) {
      // TODO
    }
  }
}
