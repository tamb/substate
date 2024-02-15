import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

export default [
  {
    input: "./src/index.ts",
    output: {
      file: "dist/index.js",
      format: "umd",
      name: "substate",
      globals: {
        "object-bystring": "byString",
        rfdc: "rfdc",
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
