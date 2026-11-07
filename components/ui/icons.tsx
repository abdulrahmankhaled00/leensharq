import type { ReactNode } from "react";
import type { AboutIconKey, ServiceIconKey } from "@/content/types";

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const ARROW = (
  <svg className="nv-arrow" width="18" height="18" viewBox="0 0 18 18" strokeWidth="1.8" {...base}>
    <path d="M3 9h12M10 4l5 5-5 5" />
  </svg>
);

export const CHECK = (
  <svg width="22" height="22" viewBox="0 0 22 22" strokeWidth="1.8" {...base}>
    <circle cx="11" cy="11" r="9" />
    <path d="M7 11.5l3 3 5-6" />
  </svg>
);

const I = (children: ReactNode) => (
  <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" {...base}>
    {children}
  </svg>
);

/**
 * Service icons — one hand-drawn family: 24px grid, 1.5 stroke, round caps and joins, no fills.
 * Referenced by key from service records (ServiceIconKey in content/types.ts); size them with CSS.
 */
export const SERVICE_ICONS: Record<ServiceIconKey, ReactNode> = {
  // two-unit server rack
  server: I(
    <>
      <rect x="3" y="3.5" width="18" height="7" rx="1.5" />
      <rect x="3" y="13.5" width="18" height="7" rx="1.5" />
      <path d="M7 7h.01M7 17h.01M11 7h6M11 17h6" />
    </>
  ),
  // product package
  box: I(
    <>
      <path d="M12 2.75l8.25 4.5v9.5L12 21.25l-8.25-4.5v-9.5L12 2.75z" />
      <path d="M3.75 7.25L12 11.75l8.25-4.5" />
      <path d="M12 11.75v9.5" />
      <path d="M7.9 5l8.25 4.5" />
    </>
  ),
  // switch feeding three endpoints
  network: I(
    <>
      <rect x="3" y="3.5" width="18" height="6" rx="1.5" />
      <path d="M6.5 6.5h.01M9.5 6.5h.01M13 6.5h4.5" />
      <path d="M12 9.5v7.75M5 17.25V15.5a2 2 0 012-2h10a2 2 0 012 2v1.75" />
      <circle cx="5" cy="19" r="1.75" />
      <circle cx="12" cy="19" r="1.75" />
      <circle cx="19" cy="19" r="1.75" />
    </>
  ),
  // power plug with a charge bolt
  power: I(
    <>
      <path d="M9 3v4M15 3v4" />
      <path d="M6 7h12v3a6 6 0 01-12 0V7z" />
      <path d="M12 16v5" />
      <path d="M12.6 9l-1.6 2.25h2L11.4 13.5" />
    </>
  ),
  // multimeter: display, selector dial, probe jacks
  gauge: I(
    <>
      <rect x="5" y="2.5" width="14" height="19" rx="2.5" />
      <rect x="8" y="5.5" width="8" height="4.5" rx="1" />
      <circle cx="12" cy="14.75" r="2.75" />
      <path d="M12 14.75l1.5-1.5" />
      <path d="M8.75 19h.01M15.25 19h.01" />
    </>
  ),
  // shield with a padlock
  shield: I(
    <>
      <path d="M12 2.75l7.25 2.75v5.75c0 4.6-3.05 8.3-7.25 9.75-4.2-1.45-7.25-5.15-7.25-9.75V5.5L12 2.75z" />
      <rect x="9" y="10.75" width="6" height="4.75" rx="1" />
      <path d="M10.25 10.75V9.5a1.75 1.75 0 013.5 0v1.25" />
    </>
  ),
  // wireless signal over an access point
  wifi: I(
    <>
      <path d="M4 9.5a11.5 11.5 0 0116 0" />
      <path d="M7 12.75a7 7 0 0110 0" />
      <path d="M10 16a2.8 2.8 0 014 0" />
      <circle cx="12" cy="19" r="1.25" />
    </>
  ),
  // wall-mounted CCTV camera
  camera: I(
    <>
      <path d="M3 8.25L15 5l1.6 6-12 3.25L3 8.25z" />
      <path d="M16.1 7.6l3.9-1.05v4.5l-3 .8" />
      <path d="M9.5 12.9l1 4.1H5" />
      <path d="M5 15v4" />
    </>
  ),
  // UPS battery with charge bolt
  battery: I(
    <>
      <rect x="2.5" y="7" width="17" height="10" rx="2" />
      <path d="M21.5 10.5v3" />
      <path d="M11.75 9l-2.5 3.25h3.5l-2.5 3.25" />
    </>
  ),
  // wrench
  tools: I(
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
  ),
};

export const ICON = {
  phone: I(<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />),
  whatsapp: I(
    <>
      <path d="M3 21l1.6-4.6A8.5 8.5 0 1112 20.5a8.4 8.4 0 01-4-1L3 21z" />
      <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-2-1-.9.7a3.6 3.6 0 01-1.6-1.6l.7-.9-1-2L9 9.5z" />
    </>
  ),
  mail: I(
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  pin: I(
    <>
      <path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  download: I(<path d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14" />),
  eye: I(
    <>
      <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  target: I(
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  shield: I(
    <>
      <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </>
  ),
  building: I(
    <>
      <path d="M4 21V5.5A1.5 1.5 0 015.5 4h7A1.5 1.5 0 0114 5.5V21" />
      <path d="M14 9h4.5a1.5 1.5 0 011.5 1.5V21" />
      <path d="M2.5 21h19" />
      <path d="M7.5 8h3M7.5 12h3M7.5 16h3M17 13h.01M17 17h.01" />
    </>
  ),
};

/** Icons an About card can reference by key (AboutIconKey in content/types.ts). */
export const ABOUT_ICONS: Record<AboutIconKey, ReactNode> = {
  building: ICON.building,
  eye: ICON.eye,
  target: ICON.target,
};
