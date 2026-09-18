// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.benedictedonet-psyenligne.com",
  trailingSlash: "always",
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/admin"),
      i18n: {
        defaultLocale: "fr",
        locales: {
          fr: "fr-FR",
          en: "en-US",
        },
      },
    }),
  ],
  build: {
    format: "directory",
    // CSS homepage ~40 Ko : inline pour supprimer les requêtes render-blocking
    inlineStylesheets: "always",
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Raleway",
      cssVariable: "--font-heading",
      weights: ["100 900"],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      fallbacks: ["Trebuchet MS", "sans-serif"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Rubik",
      cssVariable: "--font-body",
      weights: ["300 900"],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      fallbacks: ["system-ui", "sans-serif"],
    },
  ],
});
