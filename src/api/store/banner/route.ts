import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import BannerModuleService from "../../../modules/banner/service";
import { BANNER_MODULE } from "../../../modules/banner";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const bannerModuleService: BannerModuleService =
    req.scope.resolve(BANNER_MODULE);
  // const banner = await bannerModuleService.listBanners();

  // res.json({
  //   banner: banner || null,
  // });
  try {
    const [banner] = await bannerModuleService.listBanners();

    res.json({
      id: banner?.id || null,
      content: banner?.content || "",
      link: banner?.link || "",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

type BannerData = {
  id: string;
  content?: string;
  link?: string;
  start_date?: string | null;
  end_date?: string | null;
};

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const bannerModuleService: BannerModuleService =
    req.scope.resolve(BANNER_MODULE);

  const { id, content, link } = req.body as BannerData;
  //   const banner = await bannerModuleService.updateBanners({
  //     id,
  //     content,
  //     link,
  //   });

  //   res.json({
  //     banner: banner || null,
  //   });
  try {
    const [existingBanner] = await bannerModuleService.listBanners();
    let banner;

    if (existingBanner) {
      // Обновляем существующий баннер
      banner = await bannerModuleService.updateBanners({
        id: existingBanner.id,
        content,
        link,
      });
    } else {
      // Создаем новый баннер
      banner = await bannerModuleService.createBanners({
        content,
        link,
      });
    }

    res.json(banner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
