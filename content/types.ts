export type Locale = "ar" | "en";

export interface NavLink {
  href: string;
  label: string;
}

export interface Service {
  id: "networking" | "measurements" | "power" | "tools";
  name: string;
  summary: string;
  detail: string;
}

export interface SeedBrand {
  name: string;
  description: string;
}

export interface Project {
  name: string;
  client: string;
  location: string;
  scope: string;
  sector: "healthcare" | "education" | "government" | "hospitality";
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
      trustedBy: string;
      brandsLabel: string;
      servicesLink: string;
      projectsTitle: string;
      projectsLink: string;
      projectsAllCta: string;
      sectorsTitle: string;
      partnersTitle: string;
      partnersIntro: string;
      partnerPlaceholder: string;
      whyTitle: string;
      whyBody: string;
      whyChecks: string[];
      whyCta: string;
      whyImageAlt: string;
      heroImageAlt: string;
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
    intro: string;
    vision: { title: string; body: string };
    mission: { title: string; body: string };
    whyUs: { title: string; body: string };
  };
  services: {
    headline: string;
    intro: string;
    list: Service[];
  };
  brands: {
    headline: string;
    intro: string;
    seed: SeedBrand[];
  };
  projects: {
    headline: string;
    intro: string;
    sectorLabels: Record<Project["sector"], string>;
    list: Project[];
  };
  contact: {
    headline: string;
    intro: string;
    phoneLabel: string;
    whatsappLabel: string;
    emailLabel: string;
    addressLabel: string;
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
  addressAr: "الرياض، العليا، سوق الحاسب الآلي، 12211، المملكة العربية السعودية",
  addressEn: "Riyadh, Al Olaya, Computer Market, 12211, Saudi Arabia",
} as const;
