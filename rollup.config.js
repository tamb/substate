import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

export default [
  {
    input: "./src/index.ts",
    external: ["clone-deep", "object-bystring"],
    output: {
      file: "dist/index.js",
      format: "umd",
      name: "substate",
      globals: {
        "object-bystring": "byString",
        "clone-deep": "cloneDeep",
        rfdc: "rfdc",
      },
    },
    plugins: [
      typescript(),
      terser({
        compress: {
          drop_console: true,
        },
        ecma: 2020,
      }),
    ],
  },
];
