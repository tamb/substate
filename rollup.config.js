import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "./src/substate.js",
    output: {
      file: "dist/index.js",
      format: "umd",
      name: "substate"
    },
    plugins: [
      terser({
        compress: true,
        ecma: 8,
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
];
