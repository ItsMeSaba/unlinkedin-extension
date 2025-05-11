import esbuild from "esbuild";
import fs from "fs-extra";
import { copy } from "esbuild-plugin-copy";

const isWatch = process.argv.includes("--watch");

/** @type {import('esbuild').BuildOptions} */
const buildOptions = {
  entryPoints: [
    "src/index.js",
    "src/background/background.js",
    "src/popup/popup.js",
    "manifest.json",
  ],
  bundle: true,
  outdir: "dist",
  format: "iife",
  target: ["chrome58", "firefox57"],
  // minify: true,
  sourcemap: true,
  loader: {
    // ".json": "copy",
    ".json": "json",
    ".png": "copy",
    ".svg": "copy",
  },
  plugins: [
    copy({
      resolveFrom: "cwd",
      assets: {
        from: ["./public/*"],
        to: ["./dist/public"],
      },
      watch: isWatch,
    }),
    copy({
      resolveFrom: "cwd",
      assets: {
        from: ["./manifest.json"],
        to: ["./dist/manifest.json"],
      },
      watch: isWatch,
    }),
    copy({
      resolveFrom: "cwd",
      assets: {
        from: ["./src/popup/popup.html"],
        to: ["./dist/src/popup/popup.html"],
      },
      watch: isWatch,
    }),
  ],
};

// // Copy static files
// async function copyStaticFiles() {
//   // Ensure dist directory exists
//   await fs.ensureDir("dist");

//   // Copy popup HTML
//   await fs.copy("src/popup", "dist/src/popup", {
//     filter: (src) => !src.endsWith(".js"), // Don't copy JS files, they'll be bundled
//   });
// }

if (isWatch) {
  // Watch mode
  esbuild.context(buildOptions).then(async (context) => {
    // await copyStaticFiles();
    context.watch();
    console.log("Watching for changes...");
  });
} else {
  // Single build
  esbuild.build(buildOptions).then(async () => {
    // await copyStaticFiles();
    console.log("Build complete");
  });
}
