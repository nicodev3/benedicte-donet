// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.benedictedonet-psyenligne.com",
  trailingSlash: "always",
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/admin"),
    }),
  ],
  build: {
    format: "directory",
  },
});
