import { NvButton } from "@/components/ui/NvButton";
import { ARROW } from "@/components/ui/icons";

interface SectionHeadProps {
  title: string;
  description?: string;
  link?: { href: string; label: string };
  /** id for the h2, so the parent <section> can reference it with aria-labelledby. */
  titleId?: string;
  /** "split" puts the description beside the heading on large screens; "center" stacks everything centred. */
  layout?: "stack" | "split" | "center";
}

/** Section opener: h2 + supporting paragraph, with an optional outline link on the far side. */
export function SectionHead({ title, description, link, titleId, layout = "stack" }: SectionHeadProps) {
  if (layout === "center") {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
        <h2 id={titleId} className="nv-h2">
          {title}
        </h2>
        {description && <p className="nv-lead mx-auto">{description}</p>}
        {link && (
          <NvButton href={link.href} variant="outline" icon={ARROW} className="mt-1">
            {link.label}
          </NvButton>
        )}
      </div>
    );
  }

  if (layout === "split") {
    return (
      <div className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-12">
        <h2 id={titleId} className="nv-h2 lg:col-span-6">
          {title}
        </h2>
        <div className="flex flex-col items-start gap-6 lg:col-span-6">
          {description && <p className="nv-lead">{description}</p>}
          {link && (
            <NvButton href={link.href} variant="outline" icon={ARROW}>
              {link.label}
            </NvButton>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <h2 id={titleId} className="nv-h2">
          {title}
        </h2>
        {description && <p className="nv-lead mt-4">{description}</p>}
      </div>
      {link && (
        <NvButton href={link.href} variant="outline" icon={ARROW} className="self-start md:self-auto">
          {link.label}
        </NvButton>
      )}
    </div>
  );
}
