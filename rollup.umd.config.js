import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

export default {
  input: './src/index.ts',
  external: [],
  output: {
    file: './dist/index.umd.js',
    format: 'umd',
    name: 'substate',
    globals: {},
    sourcemap: true,
  },
  plugins: [
    resolve({
      preferBuiltins: false,
    }),
    commonjs(),
    typescript({
      declaration: false, // Only generate declarations once (in ESM build)
      declarationMap: false,
      rootDir: 'src',
      exclude: [
        '**/*.test.*',
        '**/*.spec.*',
        '**/*.example.*',
        '**/test/**/*',
        '**/tests/**/*',
        'dist/**/*',
      ],
    }),
    terser({
      compress: {
        drop_console: true,
      },
      ecma: 2020,
    }),
  ],
};
