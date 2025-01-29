import { SITE_OGP_IMAGE_HEIGHT, SITE_OGP_IMAGE_WIDTH } from "@/constants";

export const size = {
  width: SITE_OGP_IMAGE_WIDTH,
  height: SITE_OGP_IMAGE_HEIGHT,
};

export function ogpImageUrl({
  title,
}: {
  title: string;
}): string {
  return `/og?title=${encodeURIComponent(title)}`;
}
