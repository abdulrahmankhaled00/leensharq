import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";

type Variant = "surface" | "surface-2" | "paper" | "dark" | "teal" | "accent" | "photo";

const variantClass: Record<Variant, string> = {
  surface: "bg-[var(--surface)] text-ink",
  "surface-2": "bg-[var(--surface-2)] text-ink",
  paper: "bg-[var(--paper)] text-ink",
  dark: "bg-[var(--teal-900)] text-white",
  teal: "bg-[var(--teal-600)] text-white",
  accent: "bg-[var(--red-600)] text-white",
  photo: "text-white",
};

interface TileProps {
  children: ReactNode;
  variant?: Variant;
  colSpan?: number; // out of 12
  rowSpan?: number;
  minHeight?: string;
  href?: string;
  className?: string;
  style?: CSSProperties;
  index?: number; // for staggered entrance via --i
  reveal?: boolean;
}

export function Tile({
  children,
  variant = "surface",
  colSpan = 12,
  rowSpan,
  minHeight,
  href,
  className = "",
  style,
  index,
  reveal = true,
}: TileProps) {
  const spanStyle: CSSProperties = {
    gridColumn: `span ${colSpan} / span ${colSpan}`,
    gridRow: rowSpan ? `span ${rowSpan} / span ${rowSpan}` : undefined,
    minHeight,
    ...(index !== undefined ? ({ "--i": index } as CSSProperties) : {}),
    ...style,
  };

  const cls = `tile ${variantClass[variant]} rounded-[var(--radius)] p-6 md:p-8 transition-all duration-300 ${href ? "group hover:-translate-y-1 hover:shadow-2xl hover:border-[var(--teal-400)]" : ""} ${className}`;

  const content = (
    <div
      className={cls}
      style={spanStyle}
      {...(reveal ? { "data-reveal": "" } : {})}
    >
      {children}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="contents">
        {content}
      </Link>
    );
  }

  return content;
}

export function Board({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`board ${className}`}>{children}</div>;
}
