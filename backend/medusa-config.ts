import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  modules: [
    {
      resolve: "./src/modules/brand",
    },
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            // if module provider is in a plugin, use `plugin-name/providers/my-payment`
            resolve: "./src/modules/payment",
            id: "payment",
            options: {
              merchant_id: process.env.PAYTR_MERCHANT_ID,
              merchant_key: process.env.PAYTR_MERCHANT_KEY,
              merchant_salt: process.env.PAYTR_MERCHANT_SALT,
            },
          },
        ],
      },
    },
  ],
});
