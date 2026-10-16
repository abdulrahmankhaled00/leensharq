import type { ReactNode } from "react";

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
  <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.6" {...base}>
    {children}
  </svg>
);

export const SERVICE_ICONS: Record<string, ReactNode> = {
  networking: I(
    <>
      <rect x="9" y="3" width="6" height="5" rx="1" />
      <rect x="3" y="16" width="6" height="5" rx="1" />
      <rect x="15" y="16" width="6" height="5" rx="1" />
      <path d="M12 8v4M6 16v-4h12v4" />
    </>
  ),
  measurements: I(
    <>
      <path d="M4 17a8 8 0 1116 0" />
      <path d="M12 17l4-6" />
      <path d="M4 17h16" />
    </>
  ),
  power: I(<path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z" />),
  tools: I(
    <>
      <path d="M14.5 6.5a4 4 0 005 5L10 21l-4-4 9.5-9.5z" />
      <path d="M14.5 6.5l3-3" />
    </>
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
};
