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
      typescript(),
    ],
  },
];
