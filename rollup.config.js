import { terser } from "rollup-plugin-terser";
import babel from 'rollup-plugin-babel';

export default [
  {
    input: "./src/substate.ts",
    output: {
      file: "dist/index.js",
      format: "umd",
      name: "substate"
    },
    plugins: [
      terser({
        compress: true,
        ecma: 8,
        compress:{
          drop_console: true,          
        } 
      }),
    ]
  },
  {
    input: "./src/substate.js",
    output: {
      file: "dist/index.dev.js",
      format: "umd",
      name: "substate"
    }
  },
  {
    input: "./src/substate.js",
    output: {
      file: "dist/index.es5.js",
      format: "umd",
      name: "substate"
    },
    plugins: [
      babel({
        exclude: 'node_modules/**'
      }),
      terser({
        compress: true,
        ecma: 5,
        compress:{
          drop_console: true,          
        } 
      }),
    ]
  },
  {
    input: "./src/substate.js",
    output: {
      file: "dist/index.es5.dev.js",
      format: "umd",
      name: "substate"
    },
    plugins: [
      babel({
        exclude: 'node_modules/**'
      })
    ]
  },
];
