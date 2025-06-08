import Medusa from "@medusajs/js-sdk";

export const sdk = new Medusa({
  baseUrl: "http://localhost:7001/",
  publishableKey:
    "pk_54beb361d556684645f71d8062ee6a793ddcb8c2d4a38dfefaf9dbc785c0d072",
  //   debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
});
