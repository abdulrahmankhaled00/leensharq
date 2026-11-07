import type { LogoItem } from "@/content/types";
import { LogoMark } from "@/components/ui/LogoMark";

/**
 * Brands directory tile: logo area + name, nothing else. It only behaves like a control
 * (hover lift, focus ring) when the brand has a website to open.
 */
export function BrandTile({ item, external }: { item: LogoItem; external: string }) {
  const body = (
    <>
      <span className="nv-brand-tile-logo">
        <LogoMark item={item} size="lg" />
      </span>
      <span className="nv-brand-tile-name" dir="auto">
        {item.name}
      </span>
    </>
  );

  if (item.url) {
    return (
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="nv-brand-tile nv-brand-tile-link" aria-label={`${item.name} (${external})`}>
        {body}
      </a>
    );
  }
  return <div className="nv-brand-tile">{body}</div>;
}
