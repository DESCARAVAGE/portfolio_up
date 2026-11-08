import { OG_SIZE, ogAlt, renderOgImage } from "@/app/components/seo/OgImage";

export const alt = ogAlt("en");
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage("en");
}
