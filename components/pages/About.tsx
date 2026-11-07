import Image from "@/components/ui/Photo";
import type { SiteContent } from "@/content/types";
import { NvButton } from "@/components/ui/NvButton";
import { PageHero } from "@/components/pages/PageHero";
import { AboutCards } from "@/components/sections/AboutCards";
import { ICON } from "@/components/ui/icons";
import { HERO_IMAGE, photo } from "@/lib/photos";

export function About({ content }: { content: SiteContent }) {
  const a = content.about;
  const base = content.locale === "ar" ? "" : "/en";

  return (
    <main>
      <PageHero label={content.nav.about} title={a.headline} lead={content.meta.tagline} image={HERO_IMAGE.about} />

      {/* Who we are + Vision + Mission, directly under the hero */}
      <section className="nv-container nv-section">
        <AboutCards cards={a.overview} />
      </section>

      {/* Why us: photo band */}
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
