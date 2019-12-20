/**
 * Copyright (c) 2019-present, Mik BRY
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { spawn } from 'child_process';

const aspawn = async (exe, args, opts, con = console) =>
  new Promise((resolve, reject) => {
    const proc = spawn(exe, args, opts);

    proc.stdout.on('data', buf => con.log(buf.toString()));
    proc.stderr.on('data', buf => con.error(buf.toString()));

    proc.on('error', reject);
    proc.on('close', code => {
      resolve({
        code,
      });
    });
  });

export default aspawn;
