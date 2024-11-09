import { staticAdapter } from "@builder.io/qwik-city/adapters/static/vite";
import { extendConfig } from "@builder.io/qwik-city/vite";
import baseConfig from "../../vite.config";

const origin = process.env.SITE_ORIGIN;

if (!origin) {
  throw new Error('SITE_ORIGIN environment variable must be set');
}

export default extendConfig(baseConfig, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ["@qwik-city-plan"],
      },
    },
    plugins: [
      staticAdapter({
        origin: 'https://' + origin,
      }),
    ],
  };
});
