import { Banner } from "../modules/banner/entities/banner";

declare module "medusa-extender" {
  interface MedusaContainer {
    bannerService: import("../modules/banner/services/banner").BannerService;
  }
}

declare module "@medusajs/medusa" {
  interface MedusaContainer {
    bannerService: import("../modules/banner/services/banner").BannerService;
  }
}
