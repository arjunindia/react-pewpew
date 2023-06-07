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
      packageJsonPath: resolve(__dirname, "package.json"),
    }),
    react(),
    tsConfigPaths(),
    dts(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "react-pewpew",
      formats: ["es","cjs"],
      fileName: (format) =>
        `react-pewpew.${format === "es" ? "esm" : format}.js`,
      sourcemap: true,
      query: {
        external: Object.keys(packageJson.peerDependencies),
      },
      imports: {
        react: "react",
      },

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
