import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
    input: "./src/index.ts",
    external: [],
    output: {
      file: "dist/index.umd.js",
      format: "umd",
      name: "substate",
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
        rootDir: "src",
        exclude: ["**/*.test.ts", "**/*.test.js", "dist/**/*"]
      }),
      terser({
        compress: {
          drop_console: true,
        },
        ecma: 2020,
      }),
    ],
  };