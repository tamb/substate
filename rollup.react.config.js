import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
  input: "./src/integrations/react/index.ts",
  external: ["react", "react/jsx-runtime"],
  output: {
    file: "./dist/react/index.js",
    format: "es",
    sourcemap: true,
  },
  plugins: [
    typescript({
      declaration: false,
      declarationMap: false,
      exclude: [
        "**/*.test.*",
        "**/*.spec.*",
        "**/*.example.*",
        "**/test/**/*",
        "**/tests/**/*",
        "dist/**/*",
        "integration-tests/**/*",
        "build-tests/**/*",
        "performance-tests/**/*",
      ],
    }),
    resolve({
      preferBuiltins: false,
    }),
    commonjs(),
    terser({
      compress: {
        drop_console: true,
      },
      ecma: 2020,
    }),
  ],
};
