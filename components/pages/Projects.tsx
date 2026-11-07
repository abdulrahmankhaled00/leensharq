import type { Project, SiteContent } from "@/content/types";
import { PageHero } from "@/components/pages/PageHero";
import { ProjectFeature } from "@/components/sections/ProjectFeature";
import { HERO_IMAGE } from "@/lib/photos";

/** Every visible project, in order, as alternating split cards. No filtering. */
export function Projects({ content, projects }: { content: SiteContent; projects: Project[] }) {
  const p = content.projects;

  return (
    <main>
      <PageHero label={content.nav.projects} title={p.headline} lead={p.intro} image={HERO_IMAGE.projects} />

      <section className="nv-container nv-section">
        <ul className="flex flex-col gap-5 lg:gap-6" role="list">
          {projects.map((item, i) => (
            <li key={item.id}>
              <ProjectFeature project={item} index={i} labels={p.fieldLabels} headingLevel="h2" />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
