import Medusa from "@medusajs/js-sdk";

// Set default values that will be overridden by environment variables if available
// local
// let MEDUSA_BACKEND_URL = "http://localhost:7001";
// let PUBLISHABLE_KEY = "pk_54beb361d556684645f71d8062ee6a793ddcb8c2d4a38dfefaf9dbc785c0d072"
// prod
let MEDUSA_BACKEND_URL = "https://admin.aroma-vdohnovenie.ru";
let PUBLISHABLE_KEY = "pk_0b80c4e551d5710f5d15edc86933676c1f6ba0ca3ab28473d5b60cd4acdf62e2";

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  publishableKey:
    PUBLISHABLE_KEY,
  //   debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
});
