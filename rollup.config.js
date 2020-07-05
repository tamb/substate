import { terser } from "rollup-plugin-terser";
import babel from "@rollup/plugin-babel";
import typescript from "rollup-plugin-typescript2";
import stripCode from "rollup-plugin-strip-code";

export default [
  {
    input: "./src/index.ts",
    output: {
      file: "dist/index.js",
      format: "umd",
      name: "substate",
      globals: {
        "object-bystring": "byString",
      },
    },
    plugins: [
      terser({
        compress: true,
        ecma: 8,
        compress: {
          drop_console: true,
        },
      }),
      stripCode({
        start_comment: "START.DEV",
        end_comment: "END.DEV",
      }),
      typescript(),
    ],
  },
  {
    input: "./src/index.ts",
    output: {
      file: "dist/index.dev.js",
      format: "umd",
      name: "substate",
      globals: {
        "object-bystring": "byString",
      },
    },
    plugins: [typescript()],
  },
  {
    input: "./src/index.ts",
    output: {
      file: "dist/index.es5.js",
      format: "umd",
      name: "substate",
      globals: {
        "object-bystring": "byString",
      },
    },
    plugins: [
      babel({
        exclude: "node_modules/**",
        babelHelpers: "bundled",
      }),
      stripCode({
        start_comment: "START.DEV",
        end_comment: "END.DEV",
      }),
      terser({
        compress: true,
        ecma: 5,
        compress: {
          drop_console: true,
        },
      }),
      typescript(),
    ],
  },
  {
    input: "./src/index.ts",
    output: {
      file: "dist/index.es5.dev.js",
      format: "umd",
      name: "substate",
      globals: {
        "object-bystring": "byString",
      },
    },
    plugins: [
      babel({
        exclude: "node_modules/**",
        babelHelpers: "bundled",
      }),
      typescript(),
    ],
  },
];
