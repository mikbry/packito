// eslint-disable-next-line import/no-unresolved
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';

export default [
  {
    input: 'src/index.js',
    external: ['chalk', 'node-emoji', 'minimist', 'fs', 'path', 'child_process'],
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true },
      { file: pkg.module, format: 'esm', sourcemap: true },
    ],
    plugins: [resolve(), json()],
  },
];
