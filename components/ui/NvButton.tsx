import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "outline" | "accent" | "outline-light";

const variantClass: Record<Variant, string> = {
  primary: "",
  outline: "nv-btn-outline",
  accent: "nv-btn-accent",
  "outline-light": "nv-btn-outline-light",
};

interface NvButtonProps {
  href: string;
  children: string;
  variant?: Variant;
  size?: "md" | "sm";
  className?: string;
  external?: boolean;
  icon?: ReactNode;
}

/** Pill button. The label is rendered twice inside a clipped box so hover can roll it upward. */
export function NvButton({ href, children, variant = "primary", size = "md", className = "", external, icon }: NvButtonProps) {
  const cls = `nv-btn ${variantClass[variant]} ${size === "sm" ? "nv-btn-sm" : ""} ${className}`;
  const label = (
    <>
      <span className="nv-btn-text">
        <span>{children}</span>
        <span aria-hidden>{children}</span>
      </span>
      {icon}
    </>
  );
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {label}
    </Link>
  );
}
