import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsConfigPaths from "vite-tsconfig-paths";
import * as packageJson from "./package.json";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

export default defineConfig(() => ({
  plugins: [
    peerDepsExternal({
      packageJsonPath: resolve(import.meta.url, "package.json"),
    }),
    react(),
    tsConfigPaths(),
    dts({
      include: ["src"],
    }),
  ],
  build: {
    lib: {
      entry: resolve("src", "index.ts"),
      name: "react-pewpew",
      formats: ["es"],
      fileName: (format) =>
        `react-pewpew.${format === "es" ? "esm" : format}.js`,
    },
    optimizeDeps: {
      exclude: Object.keys(packageJson.peerDependencies),
      force: true,
    },
    esbuild: {
      minify: true,
    },
  },
}));
