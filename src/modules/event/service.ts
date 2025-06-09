import { MedusaService } from "@medusajs/framework/utils";
import Event from "./models/event";

export default class EventModuleService extends MedusaService({
  Event,
}) {}
