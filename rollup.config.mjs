import peerDepsExternal from "rollup-plugin-peer-deps-external";
import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import sourceMaps from "rollup-plugin-sourcemaps";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import gzipPlugin from "rollup-plugin-gzip";
import sizes from "rollup-plugin-sizes";
import path from "path";
import { readFileSync } from "fs";

const pkg = JSON.parse(readFileSync("package.json", { encoding: "utf8" }));

export default {
  input: {
    index: "./src/index.ts",
    "src/Color": "./src/Color.ts",
    "src/utils": "./src/utils.ts",
    "src/types": "./src/types.ts",
  },

  output: [
    {
      dir: path.dirname(pkg.main),
      format: "cjs",
      exports: "named",
      sourcemap: true,
    },
    {
      dir: path.dirname(pkg.module),
      format: "es",
      exports: "named",
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    // Allow json resolution
    json(),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        exclude: ["./tests", "./**/*.test.*"],
      },
    }),
    commonjs(),
    resolve(),
    babel({ babelHelpers: "bundled", extensions: [".js", ".ts"] }),
    sourceMaps(),
    terser(),
    gzipPlugin(),
    sizes(),
  ],
};
