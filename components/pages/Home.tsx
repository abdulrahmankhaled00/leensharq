import Image from "@/components/ui/Photo";
import type { ReactNode } from "react";
import type { SiteContent } from "@/content/types";
import { getServiceCategories, getServiceItems } from "@/content";
import type { HomepageSectionKey } from "@/content/seed";
import { getBrands, getClients, getHomepageSections, getProjects } from "@/lib/site-data";
import { HeroMotion } from "@/components/pages/HeroMotion";
import { FOUNDATION_IMAGE, photo, SECTOR_IMAGE, SECTOR_ORDER } from "@/lib/photos";
import { NvButton } from "@/components/ui/NvButton";
import { SectionHead } from "@/components/ui/SectionHead";
import { ServiceShowcase } from "@/components/sections/ServiceShowcase";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { ProjectFeature } from "@/components/sections/ProjectFeature";
import { FoundationTabs } from "@/components/sections/FoundationTabs";

const SECTOR_PHOTOS = SECTOR_ORDER.map((sector) => ({ sector, ...SECTOR_IMAGE[sector] }));

export async function Home({ content }: { content: SiteContent }) {
  const base = content.locale === "ar" ? "" : "/en";
  const { landing } = content.home;
  const locale = content.locale;
  const [order, featured, brands, clients] = await Promise.all([
    getHomepageSections(),
    getProjects(locale, { homepage: true }),
    getBrands(locale, { homepage: true }),
    getClients(locale, { homepage: true }),
  ]);

  /** Every reorderable homepage section. Order and visibility come from the dashboard (homepage_sections). */
  const blocks: Record<HomepageSectionKey, ReactNode> = {
    services: (
      // ───────── Services: intro + three primary services (shared with /services) ─────────
      <section className="nv-container" aria-labelledby="home-services-title">
        <SectionHead
          title={content.home.servicesIntro.heading}
          description={content.home.servicesIntro.body}
          link={{ href: `${base}/services`, label: landing.servicesLink }}
          titleId="home-services-title"
          layout="center"
        />
        <div className="mt-10 lg:mt-12">
          <ServiceShowcase
            categories={getServiceCategories(content.locale)}
            items={getServiceItems(content.locale)}
            hrefPrefix={`${base}/services#service-`}
            labels={{ discover: content.services.discover, includes: content.services.includes }}
          />
        </div>
      </section>
    ),
    brands: (
      // ───────── Brands: logo marquee (homepage brands, dashboard-ordered) ─────────
      <LogoMarquee
        title={landing.brandsTitle}
        description={landing.brandsIntro}
        items={brands}
        titleId="home-brands-title"
        link={{ href: `${base}/brands`, label: landing.brandsLink }}
        headLayout="center"
      />
    ),
    projects: featured.length > 0 ? (
      // ───────── Homepage projects: split cards ─────────
      <section className="nv-container" aria-labelledby="home-projects-title">
        <SectionHead
          title={landing.projectsTitle}
          description={content.projects.intro}
          link={{ href: `${base}/projects`, label: landing.projectsAllCta }}
          titleId="home-projects-title"
        />
        <ul className="mt-12 flex flex-col gap-5 lg:gap-6" role="list">
          {featured.map((p, i) => (
            <li key={p.id}>
              <ProjectFeature project={p} index={i} labels={content.projects.fieldLabels} />
            </li>
          ))}
        </ul>
      </section>
    ) : null,
    sectors: (
      // ───────── Sectors ─────────
      <section className="nv-container">
        <SectionHead title={landing.sectorsTitle} />
        <ul className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4" role="list">
          {SECTOR_PHOTOS.map((sec, i) => (
            <li key={sec.sector} data-reveal style={{ "--i": i } as React.CSSProperties}>
              <div className="group relative flex aspect-[4/5] items-end overflow-hidden rounded-[var(--radius-lg)] text-white">
                <Image
                  src={sec.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 21vw, 50vw"
                  className={`object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04] ${sec.position ?? ""}`}
                />
                <div className="nv-scrim nv-scrim-soft" aria-hidden />
                <h3 className="relative p-4 font-extrabold md:p-5" style={{ fontSize: "clamp(1.05rem, 0.7rem + 1.5vw, 1.875rem)", lineHeight: 1.2, letterSpacing: content.locale === "ar" ? 0 : "-0.02em" }}>
                  {content.projects.sectorLabels[sec.sector]}
                </h3>
              </div>
            </li>
          ))}
        </ul>
      </section>
    ),
    about: (
      // ───────── Foundation: tabs + layered image ─────────
      <FoundationTabs
        data={content.home.foundation}
        image={FOUNDATION_IMAGE}
        aboutHref={`${base}/about`}
        dir={content.locale === "ar" ? "rtl" : "ltr"}
      />
    ),
    clients: (
      // ───────── Clients: logo marquee (homepage clients, dashboard-ordered) ─────────
      <LogoMarquee title={landing.clientsTitle} description={landing.clientsIntro} items={clients} titleId="home-clients-title" headLayout="center" />
    ),
  };

  return (
    <main>
      {/* ───────── Hero: full-bleed photo, staged headline, scroll parallax ───────── */}
      <section id="hero" className="hero" aria-labelledby="hero-title">
        <HeroMotion />
        <div className="hero-bg">
          <div className="hero-zoom">
            <Image
              src={photo("riyadh-kafd")}
              alt={landing.heroImageAlt}
              fill
              sizes="100vw"
              className="object-cover object-[50%_40%]"
              priority
            />
          </div>
        </div>
        <div className="hero-scrim" aria-hidden />

        <div className="hero-inner">
          <div className="hero-content">
            <p className="nv-label hero-fade" style={{ "--i": 0 } as React.CSSProperties}>
              {landing.eyebrow}
            </p>
            <h1 id="hero-title" className="hero-title">
              <span className="hero-line">
                <span style={{ "--i": 0 } as React.CSSProperties}>{landing.headlineLead}</span>
              </span>
              <span className="hero-line">
                <span className="hero-accent" style={{ "--i": 1 } as React.CSSProperties}>
                  {landing.headlineAccent}
                </span>
              </span>
            </h1>
            <p className="hero-lead hero-fade" style={{ "--i": 2 } as React.CSSProperties}>
              {content.home.heroSub}
            </p>
            <div className="hero-fade flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center" style={{ "--i": 3 } as React.CSSProperties}>
              <NvButton href={`${base}/contact`} variant="accent">
                {content.home.heroCta}
              </NvButton>
              <NvButton href={`${base}/services`} variant="outline-light">
                {landing.secondaryCta}
              </NvButton>
            </div>
          </div>
        </div>
      </section>

      {order.map((key) =>
        blocks[key] ? (
          <div key={key} className="nv-home-block">
            {blocks[key]}
          </div>
        ) : null
      )}
    </main>
  );
}
