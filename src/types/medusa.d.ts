import { Banner } from "../modules/banner/entities/banner";

declare module "@medusajs/medusa" {
  interface MedusaContainer {
    bannerService: import("../modules/banner/services/banner").BannerService;
  }
}

declare module "medusa-react" {
  interface AdminCustomQueryTypes {
    banner: {
      response: {
        banner: Banner;
      };
    };
  }
  interface AdminCustomPostTypes {
    banner: {
      response: {
        banner: Banner;
      };
      body: Partial<Banner>;
    };
  }
}
