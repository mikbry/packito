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
  constructor(outputDir, noPublish, publisherArguments) {
    this.outputDir = outputDir;
    this.noPublish = noPublish;
    this.publisherArguments = publisherArguments;
  }

  async readOptions(optionsFile = '.packito.json', dir = './') {
    const f = path.join(dir, optionsFile);
    let filehandle = null;
    let options = null;
    try {
      filehandle = await fsp.open(f, 'r');
      const raw = await filehandle.readFile();
      options = JSON.parse(raw);
    } catch (error) {
      this.error = error;
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

  async transform(_pkg, _options) {
    const pkg = { ..._pkg };
    const options = _options || (await this.readOptions());
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
    // TODO handle publisher
    return this.pkg;
  }

  async write() {
    let filehandle = null;
    try {
      const f = path.join(this.outputDir, 'package.json');
      // TODO test if outputDir exist
      filehandle = await fsp.open(f, 'w');
      await filehandle.writeFile(this.data);
    } catch (error) {
      this.error = error;
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
