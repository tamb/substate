import esm from "./rollup.esm.config.js";
import umd from "./rollup.umd.config.js";

export default [
  // ESM build
  esm,
  // UMD build (for browsers and legacy compatibility)
  umd,  
];
