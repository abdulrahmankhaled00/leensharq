import Image from "@/components/ui/Photo";
import type { CSSProperties } from "react";
import type { Project, SiteContent } from "@/content/types";
import { ICON } from "@/components/ui/icons";

interface ProjectFeatureProps {
  project: Project;
  /** Position in the rendered list: drives the 01/02 number and which side the image sits on. */
  index: number;
  labels: SiteContent["projects"]["fieldLabels"];
  /** h2 when the list sits directly under the page h1 (/projects), h3 under a section h2 (home). */
  headingLevel?: "h2" | "h3";
}

/**
 * Split project card. Image first on small screens; from lg up the image alternates sides.
 * The alternation uses grid `order`, which follows the writing direction, so RTL mirrors it correctly.
 * Server component, shared by the home page and /projects.
 */
export function ProjectFeature({ project, index, labels, headingLevel = "h3" }: ProjectFeatureProps) {
  const flip = index % 2 === 1;
  const Heading = headingLevel;
  return (
    <article className="nv-project" data-reveal style={{ "--i": 0 } as CSSProperties}>
      <div className={`nv-project-media ${flip ? "lg:order-last" : ""}`}>
        {project.image ? (
          <Image
            src={project.image.src}
            alt={project.imageAlt}
            fill
            sizes="(min-width: 1024px) 46vw, 100vw"
            className={`object-cover ${project.image.position ?? "object-center"}`}
          />
        ) : (
          <span className="nv-project-placeholder" aria-hidden>
            <Image src="/icon.png" alt="" width={72} height={72} />
          </span>
        )}
      </div>

      <div className="nv-project-body">
        <div className="flex flex-col gap-2">
          <span className="nv-field-label">{labels.projectName}</span>
          <Heading className="nv-project-title">{project.projectName}</Heading>
        </div>

        {project.description && (
          <p className="text-[var(--muted)]" style={{ fontSize: "var(--step-body)", lineHeight: 1.65 }}>
            {project.description}
          </p>
        )}

        <dl className="nv-project-fields">
          <div className="sm:col-span-2">
            <dt className="nv-field-label">{labels.client}</dt>
            <dd>{project.client}</dd>
          </div>
          <div>
            <dt className="nv-field-label">{labels.location}</dt>
            <dd className="flex items-start gap-2">
              <span className="nv-field-icon">{ICON.pin}</span>
              {project.location}
            </dd>
          </div>
          <div>
            <dt className="nv-field-label">{labels.scopeOfWork}</dt>
            <dd>{project.scopeOfWork}</dd>
          </div>
        </dl>

        <span className="nv-project-index nums" aria-hidden>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </article>
  );
}
