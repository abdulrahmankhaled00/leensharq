/** Site photography (public domain / CC0 / Pexels — see public/images/photos/SOURCES.md). */
export const photo = (name: string) => `/images/photos/${name}.jpg`;

export interface Pic {
  src: string;
  /** Tailwind object-position class, e.g. "object-[50%_40%]". */
  position?: string;
}

export type Sector = "healthcare" | "education" | "government" | "hospitality";

export const SECTOR_ORDER: Sector[] = ["healthcare", "education", "government", "hospitality"];

export const SECTOR_IMAGE: Record<Sector, Pic> = {
  healthcare: { src: photo("sector-healthcare"), position: "object-[30%_center]" },
  education: { src: photo("ksu-gate") },
  government: { src: photo("sector-government"), position: "object-[42%_center]" },
  hospitality: { src: photo("sector-hospitality"), position: "object-[50%_55%]" },
};

/** Several photos per sector so a list of projects doesn't repeat one picture; chosen in list order. */
export const SECTOR_POOL: Record<Sector, Pic[]> = {
  // no people in the health set: server hall (network maintenance), cameras (CCTV), MRI suite (hospital systems)
  healthcare: [{ src: photo("data-center-aerial") }, { src: photo("cctv-cameras") }, { src: photo("hospital-mri"), position: "object-[35%_center]" }],
  education: [SECTOR_IMAGE.education, { src: photo("network-cables") }],
  government: [SECTOR_IMAGE.government, { src: photo("riyadh-kafd"), position: "object-[50%_40%]" }, { src: photo("switchgear-room") }],
  hospitality: [SECTOR_IMAGE.hospitality],
};

export const SERVICE_PHOTOS: Record<string, Pic> = {
  networking: { src: photo("network-cables") },
  measurements: { src: photo("multimeter") },
  power: { src: photo("switchgear-room") },
  tools: { src: photo("network-cable"), position: "object-[50%_40%]" },
};

/** Page-hero backgrounds. */
export const HERO_IMAGE = {
  about: { src: photo("riyadh-tower-dusk"), position: "object-[50%_40%]" },
  services: { src: photo("network-cables"), position: "object-center" },
  brands: { src: photo("server-rack"), position: "object-[50%_32%]" },
  projects: { src: photo("substation"), position: "object-[50%_55%]" },
  contact: { src: photo("riyadh-plaza"), position: "object-[50%_50%]" },
} satisfies Record<string, Pic>;
