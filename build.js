const esbuild = require("esbuild");
const fs = require("fs-extra");

const isWatch = process.argv.includes("--watch");

/** @type {import('esbuild').BuildOptions} */
const buildOptions = {
  entryPoints: ["src/index.js", "src/background.js", "src/popup.js"],
  bundle: true,
  outdir: "dist",
  format: "iife",
  target: ["chrome58", "firefox57"],
  // minify: true,
  sourcemap: true,
  // loader: {
  //   ".json": "copy",
  // },
};

// Copy static files
async function copyStaticFiles() {
  // Ensure dist directory exists
  await fs.ensureDir("dist");

  // Copy popup HTML
  await fs.copy("src/popup", "dist/popup", {
    filter: (src) => !src.endsWith(".js"), // Don't copy JS files, they'll be bundled
  });
}

if (isWatch) {
  // Watch mode
  esbuild.context(buildOptions).then(async (context) => {
    await copyStaticFiles();
    context.watch();
    console.log("Watching for changes...");
  });
} else {
  // Single build
  esbuild.build(buildOptions).then(async () => {
    await copyStaticFiles();
    console.log("Build complete");
  });
}
