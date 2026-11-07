import type { SiteContent } from "@/content/types";
import { getServiceCategories, getServiceItems } from "@/content";
import { PageHero } from "@/components/pages/PageHero";
import { SectionHead } from "@/components/ui/SectionHead";
import { ServiceShowcase } from "@/components/sections/ServiceShowcase";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { HERO_IMAGE } from "@/lib/photos";

/** Hero → intro with the three primary services → detailed services grid. Ends at the regular footer. */
export function Services({ content }: { content: SiteContent }) {
  const s = content.services;
  const base = content.locale === "ar" ? "" : "/en";
  const items = getServiceItems(content.locale);

  return (
    <main>
      <PageHero label={content.nav.services} title={s.headline} lead={s.intro} image={HERO_IMAGE.services} />

      <section className="nv-container nv-section" aria-labelledby="services-intro-title">
        <SectionHead title={s.introSection.heading} description={s.introSection.body} titleId="services-intro-title" layout="center" />
        <div className="mt-10 lg:mt-12">
          <ServiceShowcase
            categories={getServiceCategories(content.locale)}
            items={items}
            hrefPrefix="#service-"
            labels={{ discover: s.discover, includes: s.includes }}
          />
        </div>
      </section>

      <ServiceGrid intro={s.detail} items={items} titleId="services-detail-title" base={base} ctaLabel={s.detailCta} />
    </main>
  );
}
