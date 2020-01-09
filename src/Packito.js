/**
 * Copyright (c) Mik BRY
 * mik@miklabs.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import fs from 'fs';
import path from 'path';
import spawn from './utils/spawn';

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
      // Default options
      options = {
        remove: {
          devDependencies: '*',
          script: '*',
        },
        copy: ['README.md', 'LICENSE'],
      };
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
    }
    this.pkg = pkg;
    this.data = JSON.stringify(this.pkg, null, '\t');
    // TODO handle publisher
    return this.pkg;
  }

  async copyRecursive(file, outputDir) {
    try {
      await fsp.copyFile(file, path.join(outputDir, path.basename(file)));
    } catch (error) {
      if (error.code === 'EISDIR') {
        const files = await fsp.readdir(file);
        await Promise.all(files.map(f => this.copyRecursive(path.join(file, f), path.join(outputDir, file))));
      }
    }
  }

  async write(packageFile = 'package.json') {
    let filehandle = null;
    let outputDir = this.options ? this.options.output : undefined;
    if (!outputDir) {
      ({ outputDir } = this);
    }
    try {
      await fsp.mkdir(outputDir, { recursive: true });
    } catch (error) {
      //
    }
    try {
      const f = path.join(outputDir, packageFile);
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
    if (this.options && Array.isArray(this.options.copy)) {
      await Promise.all(this.options.copy.map(e => this.copyRecursive(e, outputDir)));
    }
  }

  async publish(con) {
    if (!this.noPublish && (this.publisher || this.publisherArguments)) {
      let [exe, ...args] = this.publisherArguments || [];
      if (!exe) {
        [exe, ...args] = this.publisher.name.split(' ');
      }
      return spawn(exe, args, undefined, con);
    }
    return { code: -1 };
  }
}
