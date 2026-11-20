import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing, type Locale, Link } from '@/i18n/routing';
import { AdSlot } from '@/components/ads/AdSlot';
import { StickyAdRails } from '@/components/ads/StickyAdRails';
import { ChevronRight } from 'lucide-react';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isPl = locale === 'pl';

  const title = isPl
    ? 'Metodologia kalkulatora FPS'
    : 'FPS calculator methodology';

  const description = isPl
    ? 'Skąd biorą się szacowane FPS na ifro.pl: mnożniki rozdzielczości, ray tracingu, VRAM i 3D V-Cache. To nie jest pomiar z gry.'
    : 'Where the estimated FPS on ifro.pl comes from: resolution, ray tracing, VRAM and 3D V-Cache multipliers. This is not a measured benchmark.';

  const canonicalPath = locale === 'en' ? '/methodology' : `/${locale}/methodology`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://ifro.pl${canonicalPath}`,
      languages: {
        en: 'https://ifro.pl/methodology',
        pl: 'https://ifro.pl/pl/methodology',
        de: 'https://ifro.pl/de/methodology',
        fr: 'https://ifro.pl/fr/methodology',
        es: 'https://ifro.pl/es/methodology',
        'x-default': 'https://ifro.pl/methodology',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://ifro.pl${canonicalPath}`,
      siteName: 'ifro.pl',
      locale,
      type: 'article',
    },
  };
}

export default async function MethodologyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const isPl = locale === 'pl';

  return (
    <StickyAdRails>
      <article className="py-8 md:py-12 flex flex-col gap-8 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-content-muted">
          <Link href="/" className="hover:text-accent-teal transition-colors">
            {isPl ? 'Strona główna' : 'Home'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-content-secondary">
            {isPl ? 'Metodologia obliczeniowa' : 'Estimation Methodology'}
          </span>
        </nav>

        <header className="space-y-3">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-content-primary sm:text-4xl">
            {isPl ? 'Skąd bierze się liczba FPS' : 'Where the FPS number comes from'}
          </h1>

          <p className="text-base leading-relaxed text-content-secondary">
            {isPl
              ? 'Liczby na tej stronie wychodzą z modelu. To nie jest pomiar z GTA 6 na PC.'
              : 'The numbers on this site come from a model. They are not a measurement of GTA 6 on PC.'}
          </p>
        </header>

        {/* Top Ad Slot */}
        <AdSlot slotId="methodology-top" format="leaderboard" />

        <section className="surface-card space-y-3 border border-border-subtle p-6">
          <h2 className="font-display text-xl font-bold text-content-primary">
            {isPl ? 'Dwie liczby, potem mniejsza' : 'Two numbers, then the smaller one'}
          </h2>
          <p className="text-sm leading-relaxed text-content-secondary">
            {isPl
              ? 'Model liczy osobno wynik karty i wynik procesora. FPS to mniejsza z tych dwóch wartości, pomnożona przez współczynnik RAM i dysku. Ten sam wzór liczy każdy preset, z jedną podłogą 1 FPS, więc Ultra nie wychodzi wyżej niż Wysokie. Preset High ma mnożnik 1,00, Ultra 0,74, średnie 1,18, niskie 1,42. Rozdzielczość 1440p mnoży wynik karty przez 0,69, 4K przez 0,40. To współczynniki modelu, nie przeliczenie pikseli. Upscaler jakościowy mnoży przez 1,32, zbalansowany przez 1,48, wydajność przez 1,68. Ray tracing mnoży wynik karty przez 0,58–0,94, zależnie od wyniku RT. Karta z wynikiem RT równym 0 jest mnożona przez 0,35. Procesor przy ray tracingu jest mnożony przez 0,90. Obciążenie to udział wolniejszego sufitu w szybszym. Procent przy wymianie to drugie przejście tego wzoru.'
              : 'The model scores the GPU and the CPU separately. FPS is the smaller of those two, multiplied by the RAM and storage factors. Every preset uses that formula with the same 1 FPS floor, so Ultra cannot come out above High. High is 1.00, Ultra is 0.74, medium is 1.18, low is 1.42. 1440p multiplies the GPU score by 0.69, and 4K by 0.40. Those are model factors, not a pixel conversion. Quality upscaling multiplies by 1.32, balanced by 1.48, performance by 1.68. Ray tracing multiplies the GPU score by 0.58–0.94, depending on the RT score. A card with an RT score of 0 is multiplied by 0.35. The CPU is multiplied by 0.90 when ray tracing is on. Load is the slower ceiling as a share of the faster one. The upgrade percent is a second pass of the same formula.'}
          </p>
        </section>

        <section className="surface-card space-y-3 border border-border-subtle p-6">
          <h2 className="font-display text-xl font-bold text-content-primary">
            {isPl ? 'Punkt odniesienia' : 'Reference point'}
          </h2>
          <p className="text-sm leading-relaxed text-content-secondary">
            {isPl
              ? 'Skala jest ustawiona tak, że Ryzen 7 3700X i Radeon RX 6700 10 GB siedzą w klasie konsolowej. To wybór skali w tabeli wyników, nie test Rockstar.'
              : 'The scale is set so a Ryzen 7 3700X and a Radeon RX 6700 10 GB sit in the console class. That is a choice in the score table, not a Rockstar test.'}
          </p>
        </section>

        <section className="surface-card space-y-3 border border-border-subtle p-6">
          <h2 className="font-display text-xl font-bold text-content-primary">3D V-Cache</h2>
          <p className="text-sm leading-relaxed text-content-secondary">
            {isPl
              ? 'Wynik procesora w tabeli już zawiera 3D V-Cache i liczbę rdzeni. Model nie mnoży ich drugi raz. Do stosunku 1% low dodaje 0,09, gdy procesor ma 3D V-Cache.'
              : 'The CPU score in the table already includes 3D V-Cache and core count. The model does not multiply those again. It adds 0.09 to the 1% low ratio when the CPU has 3D V-Cache.'}
          </p>
        </section>

        <section className="surface-card space-y-3 border border-border-subtle p-6">
          <h2 className="font-display text-xl font-bold text-content-primary">VRAM</h2>
          <p className="text-sm leading-relaxed text-content-secondary">
            {isPl
              ? 'Przy 4K i karcie do 8 GB wynik karty jest mnożony przez 0,75. Przy 1440p i karcie do 6 GB przez 0,80. Pasek jest czerwony dopiero wtedy. Osobno 1% low spada przy karcie poniżej 12 GB w 4K, do 8 GB w 1440p i do 4 GB w 1080p. Średnie FPS wtedy zostają, a pasek jest żółty.'
              : 'At 4K, a card with 8 GB or less has its GPU score multiplied by 0.75. At 1440p, a card with 6 GB or less is multiplied by 0.80. The meter turns red only then. Separately, 1% lows drop under 12 GB at 4K, at 8 GB or less at 1440p, and at 4 GB or less at 1080p. Average FPS stays the same in that case, and the meter turns yellow.'}
          </p>
        </section>

        {/* Bottom Ad Slot */}
        <AdSlot slotId="methodology-bottom" format="billboard" />
      </article>
    </StickyAdRails>
  );
}
