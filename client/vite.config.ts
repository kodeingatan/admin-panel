import { defineConfig, mergeConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
import path from "node:path";
import { fileURLToPath } from "node:url";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import tailwindcss from "@tailwindcss/vite";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

const srcDir = path.resolve(dirname, "src");

const viteConfig = defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": srcDir,
    },
  },
});

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const vitestConfig = {
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
        },
      },
    ],
  },
} as any;

export default mergeConfig(viteConfig, vitestConfig);
