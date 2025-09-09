import esm from "./rollup.esm.config.js";
import umd from "./rollup.umd.config.js";
import react from "./rollup.react.config.js";
import preact from "./rollup.preact.config.js";

export default [
  // Core library builds
  esm,
  umd,
  // Framework integration builds
  react,
  preact,
];
