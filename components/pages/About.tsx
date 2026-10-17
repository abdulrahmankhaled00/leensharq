import Image from "@/components/ui/Photo";
import type { CSSProperties } from "react";
import type { SiteContent } from "@/content/types";
import { NvButton } from "@/components/ui/NvButton";
import { PageHero } from "@/components/pages/PageHero";
import { ARROW, ICON } from "@/components/ui/icons";
import { HERO_IMAGE, photo } from "@/lib/photos";

export function About({ content }: { content: SiteContent }) {
  const a = content.about;
  const base = content.locale === "ar" ? "" : "/en";
  const track = content.locale === "ar" ? 0 : "-0.02em";

  return (
    <main>
      <PageHero label={content.nav.about} title={a.headline} lead={content.meta.tagline} image={HERO_IMAGE.about} />

      {/* Intro: photo + who we are */}
      <section className="nv-container nv-section">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-xl)] lg:col-span-5 lg:aspect-auto lg:min-h-[24rem]" data-reveal>
            <Image
              src={photo("data-center-aerial")}
              alt=""
              fill
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-7 lg:col-span-7" data-reveal style={{ "--i": 1 } as CSSProperties}>
            <p className="nv-lead !max-w-none" style={{ color: "var(--ink)" }}>
              {a.intro}
            </p>
            <ul className="flex flex-wrap gap-2" role="list">
              {content.services.list.map((s) => (
                <li key={s.id} className="rounded-full border border-[var(--line)] bg-[var(--surface-bright)] px-4 py-2 font-semibold" style={{ fontSize: "var(--step-small)" }}>
                  {s.name}
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 sm:flex-row">
              <NvButton href={`${base}/services`} icon={ARROW}>
                {content.nav.services}
              </NvButton>
              <NvButton href={`${base}/contact`} variant="outline">
                {content.nav.contact}
              </NvButton>
            </div>
          </div>
        </div>
      </section>

      {/* Vision + Mission */}
      <section className="nv-container pb-[clamp(3.5rem,7vw,6.5rem)]">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { block: a.vision, icon: ICON.eye, dark: true },
            { block: a.mission, icon: ICON.target, dark: false },
          ].map(({ block, icon, dark }, i) => (
            <article
              key={block.title}
              data-reveal
              style={{ "--i": i } as CSSProperties}
              className={`flex min-h-[22rem] flex-col gap-10 rounded-[var(--radius-xl)] p-8 md:p-12 ${
                dark ? "bg-[var(--teal-900)] text-white" : "border border-[var(--line)] bg-[var(--teal-100)] text-[var(--ink)]"
              }`}
            >
              <span className={`nv-icon ${dark ? "!bg-white/10 !text-[var(--teal-400)]" : "!bg-[var(--surface-bright)]"}`}>{icon}</span>
              <div className="flex flex-col gap-4">
                <h2 className="font-extrabold" style={{ fontSize: "clamp(1.75rem, 1.1rem + 2vw, 2.75rem)", lineHeight: 1.1, letterSpacing: track }}>
                  {block.title}
                </h2>
                <p className={dark ? "text-white/80" : "text-[var(--muted)]"} style={{ fontSize: "var(--step-body)", lineHeight: 1.65 }}>
                  {block.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Why us — photo band */}
      <section className="nv-container">
        <div className="relative isolate overflow-hidden rounded-[var(--radius-xl)] text-white" data-reveal>
          <Image src={photo("substation")} alt="" fill sizes="100vw" className="-z-20 object-cover" />
          <div className="nv-scrim nv-scrim-strong -z-10" aria-hidden />
          <div className="flex min-h-[26rem] flex-col justify-end gap-6 p-8 md:p-14">
            <span className="nv-icon !bg-white/10 !text-[var(--teal-400)]">{ICON.shield}</span>
            <h2 className="nv-h2 max-w-[18ch]">{a.whyUs.title}</h2>
            <p className="max-w-3xl text-white/85" style={{ fontSize: "var(--step-body)", lineHeight: 1.65 }}>
              {a.whyUs.body}
            </p>
            <div>
              <NvButton href={`${base}/contact`} variant="accent">
                {content.home.heroCta}
              </NvButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
