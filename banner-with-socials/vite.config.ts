import { qwikCity } from "@builder.io/qwik-city/vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { defineConfig, type UserConfig } from "vite";
import compression from 'vite-plugin-compression2';
import tsconfigPaths from "vite-tsconfig-paths";
import pkg from "./package.json";

type PkgDep = Record<string, string>;
const { dependencies = {}, devDependencies = {} } = pkg as any as {
  dependencies: PkgDep;
  devDependencies: PkgDep;
  [key: string]: unknown;
};
errorOnDuplicatesPkgDeps(devDependencies, dependencies);

export default defineConfig(({ command, mode }): UserConfig => {
  return {
    plugins: [
      qwikCity(),
      qwikVite(),
      tsconfigPaths(),
      compression({
        include: [/\.(js|css|html|txt|json|xml|svg)$/],
        threshold: 30, // Aggressive compression threshold
        algorithm: 'gzip',
        deleteOriginalAssets: false,
      }),
      compression({
        include: [/\.(js|css|html|txt|json|xml|svg)$/],
        threshold: 30,
        algorithm: 'brotliCompress',
        deleteOriginalAssets: false,
      })
    ],
    optimizeDeps: {},
    server: {
      headers: {
        "Cache-Control": "public, max-age=0",
      },
    },
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
    build: {
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          }
        }
      }
    }
  };
});

function errorOnDuplicatesPkgDeps(devDependencies: PkgDep, dependencies: PkgDep) {
  let msg = "";
  const duplicateDeps = Object.keys(devDependencies).filter((dep) => dependencies[dep]);

  const qwikPkg = Object.keys(dependencies).filter((value) => /qwik/i.test(value));
  msg = `Move qwik packages ${qwikPkg.join(", ")} to devDependencies`;

  if (qwikPkg.length > 0) {
    throw new Error(msg);
  }

  msg = `
    Warning: The dependency "${duplicateDeps.join(", ")}" is listed in both "devDependencies" and "dependencies".
    Please move the duplicated dependencies to "devDependencies" only and remove it from "dependencies"
  `;

  if (duplicateDeps.length > 0) {
    throw new Error(msg);
  }
}
