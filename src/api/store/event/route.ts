import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import EventModuleService from "../../../modules/event/service";
import { EVENT_MODULE } from "../../../modules/event";

type EventData = {
  id?: string;
  title: string;
  description?: string;
  start_date: string | Date;
  location?: string;
  image_urls?: string[];
  is_published?: boolean;
};

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const eventService: EventModuleService = req.scope.resolve(EVENT_MODULE);

  try {
    const { id } = req.query;

    if (id) {
      const events = await eventService.listEvents();
      const event = events.find((e) => e.id === id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json({ event });
    } else {
      const events = await eventService.listEvents();
      res.json({ events });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const eventService: EventModuleService = req.scope.resolve(EVENT_MODULE);

  try {
    const { title, description, start_date, location, image_urls } =
      req.body as EventData;

    const event = await eventService.createEvents({
      title,
      description: description || null,
      start_date: new Date(start_date),
      location: location || null,
      image_urls: Array.isArray(image_urls) ? { urls: image_urls } : image_urls,
    });

    res.json({ event });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const eventService: EventModuleService = req.scope.resolve(EVENT_MODULE);

  try {
    const {
      id,
      title,
      description,
      start_date,
      location,
      image_urls,
      is_published,
    } = req.body as {
      id: string;
      title?: string;
      description?: string | null;
      start_date?: string | Date;
      location?: string | null;
      image_urls?: string[] | Record<string, unknown> | null;
      is_published?: boolean;
    };

    if (!id) {
      return res.status(400).json({ error: "ID is required for update" });
    }

    // Преобразование image_urls в нужный формат
    const formattedImageUrls = Array.isArray(image_urls)
      ? { urls: image_urls } // преобразуем массив в объект { urls: [...] }
      : image_urls;

    // Подготовка объекта для обновления
    const updateData = {
      id,
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(start_date !== undefined && { start_date: new Date(start_date) }),
      ...(location !== undefined && { location }),
      ...(image_urls !== undefined && { image_urls: formattedImageUrls }),
      ...(is_published !== undefined && { is_published }),
    };

    // Вызов метода updateEvents
    const event = await eventService.updateEvents(updateData);
    res.json({ event });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const eventService: EventModuleService = req.scope.resolve(EVENT_MODULE);

  try {
    const { id } = req.body as { id: string };

    if (!id) {
      return res.status(400).json({ error: "ID is required for deletion" });
    }

    await eventService.deleteEvents(id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
