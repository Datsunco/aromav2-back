import { model } from "@medusajs/framework/utils";

const Banner = model.define("banner", {
  id: model.id().primaryKey(),
  content: model.text().nullable(),
  link: model.text().nullable(),
});

export default Banner;
