export type Locale = "ar" | "en";

export interface NavLink {
  href: string;
  label: string;
}

/** A value written once per locale — the shape every dashboard-managed text field will take. */
export type Localized<T = string> = Record<Locale, T>;

/** Keys of the line icons in components/ui/icons.tsx that a service can use. */
export type ServiceIconKey = "server" | "network" | "box" | "power" | "gauge" | "shield" | "wifi" | "camera" | "battery" | "tools";

/** A site image: public path + optional Tailwind object-position class (e.g. "object-[50%_40%]"). */
export interface ImageRef {
  src: string;
  position?: string;
}

// ───────── Collection records (content/services.ts) ─────────
// Brands, clients, partners, projects and the company PDF are database tables: see lib/db/schema.ts.
// One record per row, with every localized field side by side, so each list can later be
// loaded from the dashboard unchanged. Components never read these directly — they get the
// resolved, single-locale views below from content/index.ts.

export interface ServiceCategoryRecord {
  id: string;
  icon: ServiceIconKey;
  name: Localized;
  description: Localized;
  /** Optional background photo for the service card (decorative, so no alt text). */
  image?: ImageRef;
  order: number;
  visible: boolean;
}

export interface ServiceItemRecord {
  id: string;
  /** The ServiceCategoryRecord.id this service belongs to. */
  categoryId: string;
  icon: ServiceIconKey;
  name: Localized;
  description: Localized;
  /** Optional link target; when set the card becomes a link. */
  href?: string;
  order: number;
  visible: boolean;
}

export type Sector = "healthcare" | "education" | "government" | "hospitality";


// ───────── Resolved single-locale views ─────────

export interface ServiceCategory {
  id: string;
  icon: ServiceIconKey;
  name: string;
  description: string;
  image?: ImageRef;
}

export interface ServiceItem {
  id: string;
  categoryId: string;
  icon: ServiceIconKey;
  name: string;
  description: string;
  href?: string;
}

/** A project as the public site renders it (resolved for one locale, client name joined in). */
export interface Project {
  id: string;
  /** Missing when no photo was uploaded; the card shows a branded placeholder. */
  image?: ImageRef;
  imageAlt: string;
  projectName: string;
  client: string;
  location: string;
  scopeOfWork: string;
  description?: string;
}

/**
 * A logo asset with its intrinsic size, so mixed logos can be scaled into a fixed box without
 * distortion. Logos are best supplied as SVG or transparent PNG, trimmed to the mark.
 */
export interface LogoAsset {
  src: string;
  width: number;
  height: number;
}


/** Resolved logo entry for the brand / client marquees and the brands directory. */
export interface LogoItem {
  id: string;
  name: string;
  /** Alt text for the logo image; defaults to the name. */
  alt?: string;
  /** Missing → placeholder. Never a generated imitation of the real mark. */
  logo?: LogoAsset;
  /** Optional external website (brands directory only). */
  url?: string;
}

export type AboutIconKey = "building" | "eye" | "target";

/** One card of the About page "Who we are / Vision / Mission" group. */
export interface AboutCard {
  id: string;
  icon: AboutIconKey;
  title: string;
  body: string;
  /** Short supporting points, shown as a check list. */
  points: string[];
}


/** Heading + supporting paragraph used to open a section. */
export interface SectionIntro {
  heading: string;
  body: string;
}

export interface FoundationTab {
  id: string;
  label: string;
  body: string;
}

export interface SiteContent {
  locale: Locale;
  meta: {
    siteName: string;
    tagline: string;
  };
  nav: {
    home: string;
    about: string;
    services: string;
    brands: string;
    projects: string;
    contact: string;
    getInTouch: string;
    switchLanguage: string;
  };
  home: {
    heroEyebrowless: string; // first sentence, no eyebrow label per house rules
    heroHeadline: string;
    heroSub: string;
    heroCta: string;
    landing: {
      eyebrow: string;
      headlineLead: string; // plain part of the H1
      headlineAccent: string; // highlighted tail of the H1
      secondaryCta: string;
      servicesLink: string;
      projectsTitle: string;
      projectsAllCta: string;
      sectorsTitle: string;
      brandsTitle: string;
      brandsIntro: string;
      brandsLink: string;
      clientsTitle: string;
      clientsIntro: string;
      heroImageAlt: string;
    };
    /** Second home section: intro row above the service categories. */
    servicesIntro: SectionIntro;
    /** Two-column tabbed "about" section. Its image lives in lib/photos.ts (FOUNDATION_IMAGE). */
    foundation: {
      eyebrow: string;
      heading: string;
      tabsLabel: string;
      tabs: FoundationTab[];
      benefits: [string, string];
      cta: string;
      imageAlt: string;
    };
    sectionTeasers: {
      about: string;
      services: string;
      brands: string;
      projects: string;
      contact: string;
    };
  };
  about: {
    headline: string;
    /** Who we are / Vision / Mission, rendered in this order. */
    overview: AboutCard[];
    whyUs: { title: string; body: string };
  };
  services: {
    headline: string;
    intro: string;
    /** Services page intro row above the three categories. */
    introSection: SectionIntro;
    /** Services page detailed grid. */
    detail: SectionIntro;
    /** Link text on each primary service card. */
    discover: string;
    /** Visible call to action on each detailed service card. */
    detailCta: string;
    /** Small label above the sub-services listed on a primary service card. */
    includes: string;
  };
  brands: {
    headline: string;
    intro: string;
    /** Accessible hint on brand tiles that link to an external website. */
    opensInNewTab: string;
  };
  projects: {
    headline: string;
    intro: string;
    sectorLabels: Record<Sector, string>;
    fieldLabels: {
      projectName: string;
      client: string;
      location: string;
      scopeOfWork: string;
    };
  };
  contact: {
    headline: string;
    intro: string;
    phoneLabel: string;
    whatsappLabel: string;
    emailLabel: string;
    addressLabel: string;
    locationHeading: string;
    mapTitle: string;
    openInMaps: string;
    profileDownload: string;
  };
  footer: {
    rights: string;
    eyebrow: string;
    heading: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    legalNote: string;
  };
}

export const CONTACT = {
  phoneDisplay: "+966 53 824 7629",
  phoneE164: "+966538247629",
  email: "sales@leen2030.com",
  addressAr: "الرياض، العليا، 12211، المملكة العربية السعودية",
  addressEn: "Riyadh, Al Olaya, 12211, Kingdom of Saudi Arabia",
  /** Google Maps share link for the office pin ("Open in Google Maps"). */
  mapLink: "https://maps.app.goo.gl/iGLkNRpFTqHYf7tg8",
  /** Google Maps "Share → Embed a map" URL for the same pin (English labels). No API key needed. */
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4569.380479440153!2d46.68466236378507!3d24.682431899999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03086e532e35%3A0x4b736b1c27cc9c79!2zTEVFTiBBTCBTSEFSUSBDTy4g2LTYsdmD2Kkg2YTZitmGINin2YTYtNix2YIgLg!5e1!3m2!1sen!2sus!4v1793985293046!5m2!1sen!2sus",
} as const;

/** Map embed for the page language: the embed's language segments ("!1sen") switched to Arabic on Arabic pages. */
export function mapEmbedUrl(locale: Locale): string {
  return locale === "ar" ? CONTACT.mapEmbed.replace(/!1sen!2sus/g, "!1sar!2ssa") : CONTACT.mapEmbed;
}

export function mapLinkUrl(): string {
  return CONTACT.mapLink;
}
