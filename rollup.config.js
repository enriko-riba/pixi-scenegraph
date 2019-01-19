import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
//import json from 'rollup-plugin-json';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],
  
//    not needed, the dependencies are external by default
//   external: [ 
//     ...Object.keys(pkg.dependencies || {}),
//     ...Object.keys(pkg.peerDependencies || {}),
//   ],

plugins: [
    typescript({
      typescript: require('typescript'),
    }),
    // json(
    //   {
    //     exclude: [ 'node_modules/**'],
    //     preferConst: true,
    //   },
    // )
  ],
}