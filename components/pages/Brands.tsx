import type { CSSProperties } from "react";
import type { SiteContent } from "@/content/types";
import { PageHero } from "@/components/pages/PageHero";
import { BrandTile } from "@/components/ui/BrandTile";
import { getBrands } from "@/lib/site-data";
import { HERO_IMAGE } from "@/lib/photos";

/** Logo directory: logo + name per brand. Same source as the home page brands marquee. */
export async function Brands({ content }: { content: SiteContent }) {
  const b = content.brands;
  const brands = await getBrands(content.locale);

  return (
    <main>
      <PageHero label={content.nav.brands} title={b.headline} lead={b.intro} image={HERO_IMAGE.brands} />

      <section className="nv-container nv-section">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4" role="list">
          {brands.map((brand, i) => (
            <li key={brand.id} data-reveal style={{ "--i": i % 4 } as CSSProperties}>
              <BrandTile item={brand} external={b.opensInNewTab} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
