// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      GOOGLE_CLIENT_ID: "",
      // Add more environment variables as needed
    },
  },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  modules: [],
  css: ["@/assets/css/global.css"],
});
