import Image from "next/image";
import Link from "next/link";
import type { SiteContent } from "@/content/types";
import { homePartners } from "@/content/partners";
import { HeroMotion } from "@/components/pages/HeroMotion";
import { ARROW, CHECK, SERVICE_ICONS } from "@/components/ui/icons";
import { photo, SECTOR_IMAGE, SECTOR_ORDER, SERVICE_PHOTOS } from "@/lib/photos";
import { NvButton } from "@/components/ui/NvButton";

const PROJECT_PHOTOS = [
  { src: photo("data-center-aerial"), position: "object-center" },
  { src: photo("cctv-cameras"), position: "object-center" },
];

const SECTOR_PHOTOS = SECTOR_ORDER.map((sector) => ({ sector, ...SECTOR_IMAGE[sector] }));

function SectionHead({ title, description, link }: { title: string; description?: string; link?: { href: string; label: string } }) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <h2 className="nv-h2">{title}</h2>
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

export function Home({ content }: { content: SiteContent }) {
  const base = content.locale === "ar" ? "" : "/en";
  const { landing } = content.home;
  const brandNames = content.brands.seed.map((b) => b.name);
  const featured = content.projects.list.slice(0, 2);

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

          <div className="hero-foot hero-fade" style={{ "--i": 5 } as React.CSSProperties}>
            <span className="hero-foot-label">{landing.trustedBy}</span>
            <div className="nv-marquee" role="group" aria-label={landing.brandsLabel}>
              <div className="nv-marquee-track">
                {[0, 1].map((n) => (
                  <div className="nv-marquee-group" key={n} aria-hidden={n === 1}>
                    {brandNames.map((name) => (
                      <span key={`${n}-${name}`} className="nv-marquee-item">
                        {name}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Services ───────── */}
      <section className="nv-container nv-section">
        <SectionHead
          title={content.services.headline}
          description={content.services.intro}
          link={{ href: `${base}/services`, label: landing.servicesLink }}
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" role="list">
          {content.services.list.map((s, i) => (
            <li key={s.id} data-reveal style={{ "--i": i } as React.CSSProperties}>
              <Link href={`${base}/services`} className="nv-card group flex h-full flex-col overflow-hidden !p-0 no-underline">
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={SERVICE_PHOTOS[s.id].src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 21vw, (min-width: 640px) 45vw, 100vw"
                    className={`object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105 ${SERVICE_PHOTOS[s.id].position ?? ""}`}
                  />
                  <span className="nv-icon absolute start-4 top-4 bg-[var(--surface-bright)]">{SERVICE_ICONS[s.id]}</span>
                  <span className="nv-num nums absolute end-4 top-4 rounded-full bg-[var(--surface-bright)] px-3 py-1">{String(i + 1).padStart(2, "0")}.</span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <h3 className="font-extrabold" style={{ fontSize: "var(--step-lead)", lineHeight: 1.2, letterSpacing: content.locale === "ar" ? 0 : "-0.02em" }}>
                    {s.name}
                  </h3>
                  <p className="text-[var(--muted)]" style={{ fontSize: "var(--step-small)", lineHeight: 1.65 }}>
                    {s.summary}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ───────── Projects bento: 2 large + 1 wide ───────── */}
      <section className="nv-container pb-[clamp(3.5rem,7vw,6.5rem)]">
        <SectionHead title={landing.projectsTitle} description={content.projects.intro} />
        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          {featured.map((p, i) => (
            <Link
              key={p.name}
              href={`${base}/projects`}
              data-reveal
              className={`nv-card group relative flex min-h-[20rem] flex-col justify-between gap-10 overflow-hidden !border-transparent !text-white no-underline lg:min-h-[26rem] ${
                i === 0 ? "lg:col-span-7" : "lg:col-span-5"
              }`}
            >
              <Image
                src={PROJECT_PHOTOS[i].src}
                alt=""
                fill
                sizes={i === 0 ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 42vw, 100vw"}
                className={`object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04] ${PROJECT_PHOTOS[i].position}`}
              />
              <div className="nv-scrim nv-scrim-strong" aria-hidden />
              <span className="nv-label relative !text-[var(--teal-400)]">{content.projects.sectorLabels[p.sector]}</span>
              <div className="relative flex flex-col gap-4">
                <h3
                  className="font-extrabold max-w-[20ch]"
                  style={{
                    fontSize: "clamp(1.75rem, 1.1rem + 2vw, 2.75rem)",
                    lineHeight: content.locale === "ar" ? 1.3 : 1.05,
                    letterSpacing: content.locale === "ar" ? 0 : "-0.03em",
                  }}
                >
                  {p.name}
                </h3>
                <p className="text-white/80" style={{ fontSize: "var(--step-small)" }}>
                  {p.client} · {p.location}
                </p>
                <span className="inline-flex items-center gap-2 font-semibold text-[var(--teal-400)]">
                  {landing.projectsLink}
                  {ARROW}
                </span>
              </div>
            </Link>
          ))}

          <Link
            href={`${base}/projects`}
            data-reveal
            className="relative flex min-h-[14rem] items-end overflow-hidden rounded-[var(--radius-lg)] no-underline text-white lg:col-span-12 lg:min-h-[18rem]"
          >
            <Image
              src={photo("substation")}
              alt=""
              fill
              sizes="(min-width: 1024px) 84rem, 100vw"
              className="object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.03]"
            />
            <div className="nv-scrim nv-scrim-mid" aria-hidden />
            <div className="relative flex w-full flex-wrap items-end justify-between gap-4 p-6 md:p-10">
              <p className="font-extrabold max-w-[22ch]" style={{ fontSize: "var(--step-lead)", lineHeight: 1.25 }}>
                {content.home.sectionTeasers.projects}
              </p>
              <span className="nv-btn nv-btn-outline-light">
                <span className="nv-btn-text">
                  <span>{landing.projectsAllCta}</span>
                  <span aria-hidden>{landing.projectsAllCta}</span>
                </span>
                {ARROW}
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ───────── Sectors ───────── */}
      <section className="nv-container pb-[clamp(3.5rem,7vw,6.5rem)]">
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

      {/* ───────── Why Leen: image + checklist ───────── */}
      <section className="nv-container">
        <div className="grid items-center gap-10 rounded-[var(--radius-xl)] bg-[var(--surface)] p-4 md:grid-cols-2 md:gap-14 md:p-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] md:aspect-[5/4]" data-reveal>
            <Image
              src={photo("server-rack")}
              alt={landing.whyImageAlt}
              fill
              sizes="(min-width: 768px) 42vw, 100vw"
              className="object-cover object-[50%_30%]"
            />
          </div>
          <div className="flex flex-col gap-6 px-2 pb-4 md:px-0 md:pe-8 md:pb-0">
            <h2 className="nv-h2">{landing.whyTitle}</h2>
            <p className="nv-lead">{landing.whyBody}</p>
            <ul className="flex flex-col gap-3" role="list">
              {landing.whyChecks.map((c) => (
                <li key={c} className="nv-check">
                  {CHECK}
                  {c}
                </li>
              ))}
            </ul>
            <NvButton href={`${base}/about`} className="self-start" icon={ARROW}>
              {landing.whyCta}
            </NvButton>
          </div>
        </div>
      </section>

      {/* ───────── Partners (placeholder data lives in content/partners.ts) ───────── */}
      <section className="nv-container nv-section" aria-labelledby="partners-title">
        <div className="max-w-2xl">
          <h2 id="partners-title" className="nv-h2">
            {landing.partnersTitle}
          </h2>
          <p className="nv-lead mt-4">{landing.partnersIntro}</p>
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6" role="list">
          {homePartners.map((p, i) => {
            const name = p.name[content.locale];
            const body = (
              <>
                <div className="relative grid aspect-[3/2] w-full place-items-center overflow-hidden rounded-[var(--radius)] bg-[var(--surface)]">
                  {p.logo ? (
                    <Image src={p.logo} alt="" fill sizes="(min-width: 1280px) 14vw, (min-width: 768px) 28vw, 44vw" className="object-contain p-6" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-[var(--teal-700)] opacity-55" aria-hidden>
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="5" y="7" width="26" height="22" rx="4" />
                        <circle cx="13" cy="15" r="2.5" />
                        <path d="M5 25l8-7 6 5 5-4 7 6" />
                      </svg>
                      <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>{landing.partnerPlaceholder}</span>
                    </div>
                  )}
                </div>
                <p className="mt-4 text-center font-semibold" style={{ fontSize: "var(--step-small)" }}>
                  {name}
                </p>
              </>
            );
            return (
              <li key={p.id} data-reveal style={{ "--i": i } as React.CSSProperties}>
                {p.url ? (
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="nv-card nv-card-interactive block !p-4 no-underline">
                    {body}
                  </a>
                ) : (
                  <div className="nv-card !p-4">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
