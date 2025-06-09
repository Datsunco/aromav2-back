import { model } from "@medusajs/framework/utils";

const Event = model.define("event", {
  id: model.id().primaryKey(),
  title: model.text(), // убираем notNull()
  description: model.text().nullable(),
  start_date: model.dateTime(), // используем dateTime() вместо timestamp()
  location: model.text().nullable(),
  image_urls: model.json().nullable(), // массив URL изображений как JSON
  is_published: model.boolean().default(false),
});

export default Event;
