import type { Sector } from "@/content/types";

/** Site photography (public domain / CC0 / Pexels — see public/images/photos/SOURCES.md). */
export const photo = (name: string) => `/images/photos/${name}.jpg`;

export interface Pic {
  src: string;
  /** Tailwind object-position class, e.g. "object-[50%_40%]". */
  position?: string;
}

export type { Sector };

export const SECTOR_ORDER: Sector[] = ["healthcare", "education", "government", "hospitality"];

export const SECTOR_IMAGE: Record<Sector, Pic> = {
  healthcare: { src: photo("hospital-mri"), position: "object-[34%_center]" },
  education: { src: photo("ksu-gate") },
  government: { src: photo("sector-government"), position: "object-[42%_center]" },
  hospitality: { src: photo("sector-hospitality"), position: "object-[50%_55%]" },
};

/** Home "foundation" tabbed section image (alt text lives in the locale dictionaries). */
export const FOUNDATION_IMAGE: Pic = { src: photo("server-rack"), position: "object-[50%_30%]" };

/** Page-hero backgrounds. */
export const HERO_IMAGE = {
  about: { src: photo("riyadh-tower-dusk"), position: "object-[50%_40%]" },
  services: { src: photo("network-cables"), position: "object-center" },
  brands: { src: photo("server-rack"), position: "object-[50%_32%]" },
  projects: { src: photo("substation"), position: "object-[50%_55%]" },
  contact: { src: photo("riyadh-plaza"), position: "object-[50%_50%]" },
} satisfies Record<string, Pic>;
