import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
    input: "./src/index.ts",
    external: [],
    output: {
      file: "dist/index.esm.js",
      format: "es",
      sourcemap: true,
    },
    plugins: [
      resolve({
        preferBuiltins: false,
      }),
      commonjs(),
      typescript({
        declaration: true,
        declarationDir: "dist",
        declarationMap: true,
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