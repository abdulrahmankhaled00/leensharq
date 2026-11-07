import type { LogoItem } from "@/content/types";

/** Box aspect ratio (width / height) for each size; matches .nv-logo-* in nova.css. */
const BOX_RATIO = { md: 2.5, lg: 2 } as const;

/**
 * Width (as % of the box) that gives every logo roughly the same visual area whatever its shape:
 * wide wordmarks get shorter, square marks get narrower, and nothing overflows the box.
 */
function normalizedWidth(logoRatio: number, boxRatio: number, fill = 0.42): number {
  let h = Math.sqrt((fill * boxRatio) / logoRatio); // in box heights
  let w = logoRatio * h; // in box heights
  const scale = Math.min(1, 1 / h, boxRatio / w);
  h *= scale;
  w *= scale;
  return (w / boxRatio) * 100;
}

/** One or two initials for the neutral placeholder mark. */
function initials(name: string): string {
  const words = name.split(/[\s—–&()-]+/).filter(Boolean);
  if (!/^[A-Za-z0-9]/.test(name)) return Array.from(words[0] ?? name)[0] ?? "";
  return words
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

interface LogoMarkProps {
  item: LogoItem;
  size?: keyof typeof BOX_RATIO;
  /** Show the name under the placeholder mark, when nothing else on screen names the logo. */
  showName?: boolean;
}

/**
 * A logo in a fixed box, scaled to a consistent visual weight without stretching or cropping.
 * Without a logo file it renders a neutral placeholder (initials in a plain tile), never an
 * imitation of the real mark.
 */
export function LogoMark({ item, size = "md", showName = false }: LogoMarkProps) {
  if (item.logo) {
    const width = normalizedWidth(item.logo.width / item.logo.height, BOX_RATIO[size]);
    return (
      <span className={`nv-logo nv-logo-${size}`}>
        {/* Logos may be dashboard uploads at any path, so a plain img avoids the image optimizer allow-list. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.logo.src}
          alt={item.alt ?? item.name}
          width={item.logo.width}
          height={item.logo.height}
          loading="lazy"
          decoding="async"
          style={{ width: `${width}%`, height: "auto" }}
        />
      </span>
    );
  }

  return (
    <span className={`nv-logo nv-logo-${size} nv-logo-placeholder`} data-placeholder>
      <span className="nv-logo-monogram" aria-hidden dir="auto">
        {initials(item.name)}
      </span>
      {showName && (
        <span className="nv-logo-name" dir="auto">
          {item.name}
        </span>
      )}
    </span>
  );
}
