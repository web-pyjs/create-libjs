import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-replace";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

export default [
  // CommonJS
  {
    input: "src/index.js",
    output: {
      file: "lib/<%= name %>.cjs.js",
      format: "cjs",
      indent: false
    },
    external: [...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      resolve(),
      babel({
        exclude: "node_modules/**" // only transpile our source code
      })
    ]
  },
  // ES
  {
    input: "src/index.js",
    output: {
      file: "lib/<%= name %>.es.js",
      format: "es",
      indent: false
    },
    external: [...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      resolve(),
      babel({
        exclude: "node_modules/**" // only transpile our source code
      })
    ]
  },
  // ES for Browsers
  {
    input: "src/index.js",
    output: {
      file: "lib/<%= name %>.es.mjs",
      format: "es",
      indent: false
    },
    external: [...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      resolve(),
      babel({
        exclude: "node_modules/**" // only transpile our source code
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("production")
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      })
    ]
  },
  // UMD Development
  {
    input: "src/index.js",
    output: {
      file: "umd/<%= name %>.js",
      format: "umd",
      globals: pkg.peerDependencies,
      name: "<%= name %>",
      indent: false
    },
    external: [...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      resolve(),
      babel({
        exclude: "node_modules/**" // only transpile our source code
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("development")
      })
    ]
  },
  {
    input: "src/index.js",
    output: {
      file: "umd/<%= name %>.min.js",
      format: "umd",
      globals: pkg.peerDependencies,
      name: "<%= name %>",
      indent: false
    },
    external: [...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      resolve(),
      babel({
        exclude: "node_modules/**" // only transpile our source code
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("production")
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      })
    ]
  }
];
