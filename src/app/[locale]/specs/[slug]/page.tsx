import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing, type Locale, Link } from '@/i18n/routing';
import { GPUS_MAP } from '@/data/gpus';
import { CPUS_MAP } from '@/data/cpus';
import { getTopHardwarePairs, parsePairSlug } from '@/data/popularPairs';
import { estimatePerformance } from '@/lib/estimator';
import { UpgradeAffiliateBox } from '@/components/UpgradeAffiliateBox';
import { AdSlot } from '@/components/ads/AdSlot';
import { StickyAdRails } from '@/components/ads/StickyAdRails';
import { Cpu, HardDrive, Activity, ArrowRight, SlidersHorizontal, ChevronRight } from 'lucide-react';

export function generateStaticParams() {
  const pairs = getTopHardwarePairs();
  return routing.locales.flatMap((locale) =>
    pairs.map((pair) => ({
      locale,
      slug: pair.slug,
    }))
  );
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const pair = parsePairSlug(slug);

  if (!pair) return {};

  const gpu = GPUS_MAP[pair.gpuId];
  const cpu = CPUS_MAP[pair.cpuId];

  const isPl = locale === 'pl';
  const title = isPl
    ? `${gpu.name} + ${cpu.name} | Szacowane FPS w GTA 6`
    : `${gpu.name} + ${cpu.name} | Estimated GTA 6 FPS`;

  const description = isPl
    ? `Szacowane FPS dla ${gpu.name} i ${cpu.name} w 1080p, 1440p i 4K. Wynik modelu, nie pomiar z gry.`
    : `Estimated FPS for ${gpu.name} and ${cpu.name} at 1080p, 1440p and 4K. A model result, not a measurement from the game.`;

  const canonicalPath = locale === 'en' ? `/specs/${slug}` : `/${locale}/specs/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://ifro.pl${canonicalPath}`,
      languages: {
        en: `https://ifro.pl/specs/${slug}`,
        pl: `https://ifro.pl/pl/specs/${slug}`,
        de: `https://ifro.pl/de/specs/${slug}`,
        fr: `https://ifro.pl/fr/specs/${slug}`,
        es: `https://ifro.pl/es/specs/${slug}`,
        'x-default': `https://ifro.pl/specs/${slug}`,
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
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function SpecPairPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const pair = parsePairSlug(slug);
  if (!pair) {
    notFound();
  }

  const gpu = GPUS_MAP[pair.gpuId];
  const cpu = CPUS_MAP[pair.cpuId];

  // Calculate baseline metrics at 1080p, 1440p, and 4K (High Preset, RTGI enabled, Quality upscaling)
  const perf1080p = estimatePerformance({
    gpuId: gpu.id,
    cpuId: cpu.id,
    ramGB: 32,
    storageType: 'nvme_gen4',
    resolution: '1080p',
    rayTracing: true,
    upscaler: 'quality',
  });

  const perf1440p = estimatePerformance({
    gpuId: gpu.id,
    cpuId: cpu.id,
    ramGB: 32,
    storageType: 'nvme_gen4',
    resolution: '1440p',
    rayTracing: true,
    upscaler: 'quality',
  });

  const perf4k = estimatePerformance({
    gpuId: gpu.id,
    cpuId: cpu.id,
    ramGB: 32,
    storageType: 'nvme_gen4',
    resolution: '4k',
    rayTracing: true,
    upscaler: 'quality',
  });

  const isPl = locale === 'pl';

  // Structured Data (JSON-LD): WebApplication + FAQPage
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: `GTA 6 PC Estimator: ${gpu.name} & ${cpu.name}`,
        url: `https://ifro.pl${locale === 'en' ? '' : `/${locale}`}/specs/${slug}`,
        applicationCategory: 'GameApplication',
        operatingSystem: 'Windows 10, Windows 11',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: isPl
              ? `Czy ${gpu.name} oraz ${cpu.name} poradzą sobie z GTA 6?`
              : `Can ${gpu.name} and ${cpu.name} run GTA 6?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: isPl
                ? `Model daje około ${perf1440p.fps} FPS na wysokich w 1440p z ray tracingiem i upscalerem Jakość (1% low: ${perf1440p.low1Percent}). ${gpu.name} ma ${gpu.vramGB} GB VRAM. To nie jest pomiar z gry.`
                : `The model gives about ${perf1440p.fps} FPS at 1440p high with ray tracing and Quality upscaling (1% low: ${perf1440p.low1Percent}). The ${gpu.name} has ${gpu.vramGB} GB of VRAM. This is not a measurement from the game.`,
            },
          },
          {
            '@type': 'Question',
            name: isPl
              ? `Czy występuje wąskie gardło (bottleneck) między ${gpu.name} a ${cpu.name}?`
              : `Is there a bottleneck between ${gpu.name} and ${cpu.name} in GTA 6?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: isPl
                ? `W 1440p High z ray tracingiem i upscalerem Jakość model daje ${perf1440p.bottleneck.type === 'balanced' ? 'zbliżone obciążenie CPU i GPU' : perf1440p.bottleneck.type === 'gpu_bound' ? `ograniczenie po stronie karty (${perf1440p.bottleneck.percentage}% wolnego sufitu procesora)` : `ograniczenie po stronie procesora (${perf1440p.bottleneck.percentage}% wolnego sufitu karty)`}.`
                : `At 1440p High with ray tracing and Quality upscaling the model shows ${perf1440p.bottleneck.type === 'balanced' ? 'CPU and GPU load close together' : perf1440p.bottleneck.type === 'gpu_bound' ? `a GPU limit (${perf1440p.bottleneck.percentage}% of the CPU ceiling is unused)` : `a CPU limit (${perf1440p.bottleneck.percentage}% of the GPU ceiling is unused)`}.`,
            },
          },
          {
            '@type': 'Question',
            name: isPl
              ? `Jaki dysk i pamięć RAM są zalecane dla tego zestawu pod GTA 6?`
              : `What RAM and storage are recommended for this build in GTA 6?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: isPl
                ? 'Przy 8 GB RAM model mnoży FPS przez 0,78 i pokazuje ostrzeżenie. Od 32 GB mnożnik to 1,02. HDD mnoży przez 0,85, NVMe 4.0 przez 1,03.'
                : 'At 8 GB of RAM the model multiplies FPS by 0.78 and shows a warning. From 32 GB the multiplier is 1.02. An HDD multiplies by 0.85, NVMe 4.0 by 1.03.',
            },
          },
        ],
      },
    ],
  };

  return (
    <StickyAdRails>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="py-8 md:py-12 flex flex-col gap-8 max-w-5xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/75">
          <Link href="/" className="whitespace-nowrap hover:text-white">
            {isPl ? 'Strona główna' : 'Home'}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <Link href="/specs" className="whitespace-nowrap hover:text-white">
            {isPl ? 'Baza sprzętu' : 'Specs Database'}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="min-w-0 truncate text-white/90">
            {gpu.name} + {cpu.name}
          </span>
        </nav>

        {/* Article Header & Main Title */}
        <header className="space-y-3">
          <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            {gpu.name}{' '}
            <span className="font-normal text-white/50">&amp;</span>{' '}
            {cpu.name}
          </h1>

          <p className="max-w-3xl text-base leading-relaxed text-white/75">
            {isPl
              ? 'Szacowane FPS na wysokich ustawieniach z ray tracingiem. To wynik modelu, nie pomiar z gry.'
              : 'Estimated FPS at high settings with ray tracing. This is a model result, not a measurement from the game.'}
          </p>
        </header>

        {/* Top Ad Slot with 24px Safety Buffer */}
        <AdSlot slotId={`specs-top-${slug}`} format="leaderboard" />

        {/* Primary Resolution Performance Cards */}
        <section aria-label="Resolution Benchmarks" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { res: '1080p', data: perf1080p },
            { res: '1440p', data: perf1440p },
            { res: '4K', data: perf4k },
          ].map((item) => (
            <div
              key={item.res}
              className="surface-card flex flex-col justify-between gap-4 border border-border-subtle p-5"
            >
              <div>
                <p className="mb-1 text-xs text-white/60">{item.res}</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl font-extrabold tabular-nums text-white">
                    {item.data.fps}
                  </span>
                  <span className="text-sm font-bold text-white/70">FPS</span>
                </div>
                <span className="mt-1 block text-[11px] tabular-nums text-white/60">
                  1% low: <strong className="font-semibold text-white/80">{item.data.low1Percent} FPS</strong>
                </span>
              </div>

              <p className="border-t border-white/10 pt-3 text-[11px] text-white/60">
                {isPl ? 'Wysokie, ray tracing, upscaler Jakość' : 'High, ray tracing, Quality upscaler'}
              </p>
            </div>
          ))}
        </section>

        {/* In-depth Hardware Analysis */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* GPU Specs Box */}
          <div className="surface-card p-6 border border-border-subtle flex flex-col gap-3">
            <div className="flex items-center gap-2.5 border-b border-border-subtle pb-3">
              <HardDrive className="w-5 h-5 text-accent-teal" />
              <h2 className="font-display font-bold text-base text-content-primary">
                {gpu.name}
              </h2>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-border-subtle/40">
                <span className="text-content-muted">VRAM</span>
                <span className="text-content-primary font-bold tabular-nums">{gpu.vramGB} GB GDDR</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-subtle/40">
                <span className="text-content-muted">{isPl ? 'Wynik rasteryzacji' : 'Raster score'}</span>
                <span className="text-accent-teal font-bold tabular-nums">{gpu.rasterScore}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-subtle/40">
                <span className="text-content-muted">{isPl ? 'Wynik ray tracingu' : 'Ray tracing score'}</span>
                <span className="text-accent-cyan font-bold tabular-nums">{gpu.rtScore}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-content-muted">Upscaler</span>
                <span className="text-content-primary font-bold">{gpu.upscaler}</span>
              </div>
            </div>
          </div>

          {/* CPU Specs Box */}
          <div className="surface-card p-6 border border-border-subtle flex flex-col gap-3">
            <div className="flex items-center gap-2.5 border-b border-border-subtle pb-3">
              <Cpu className="w-5 h-5 text-accent-cyan" />
              <h2 className="font-display font-bold text-base text-content-primary">
                {cpu.name}
              </h2>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-border-subtle/40">
                <span className="text-content-muted">{isPl ? 'Rdzenie / wątki' : 'Cores / threads'}</span>
                <span className="text-content-primary font-bold tabular-nums">
                  {cpu.cores}C / {cpu.threads}T
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-subtle/40">
                <span className="text-content-muted">{isPl ? 'Architektura' : 'Architecture'}</span>
                <span className="text-content-primary font-bold">{cpu.architecture} ({cpu.socket})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-subtle/40">
                <span className="text-content-muted">3D V-Cache</span>
                <span className={`font-bold ${cpu.has3DVcache ? 'text-accent-teal' : 'text-content-muted'}`}>
                  {cpu.has3DVcache ? (isPl ? 'tak, +0,09 do 1% low' : 'yes, +0.09 on 1% lows') : (isPl ? 'nie' : 'no')}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-content-muted">{isPl ? 'Wynik w modelu' : 'Model score'}</span>
                <span className="text-accent-cyan font-bold tabular-nums">{cpu.gamingScore} / 100</span>
              </div>
            </div>
          </div>
        </section>

        {/* Bottleneck Diagnostic Card */}
        <section className="surface-card p-6 border border-border-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent-teal" />
              <h2 className="font-display text-lg font-bold text-content-primary">
                {isPl ? 'Obciążenie w 1440p' : 'Load at 1440p'}
              </h2>
            </div>
            <span className="text-xs font-bold tabular-nums text-white/80">
              CPU {perf1440p.bottleneck.cpuLoadPercent}% · GPU {perf1440p.bottleneck.gpuLoadPercent}%
            </span>
          </div>

          <p className="text-sm leading-relaxed text-content-secondary">
            {isPl
              ? perf1440p.bottleneck.type === 'balanced'
                ? 'Obciążenie procesora i karty jest zbliżone.'
                : perf1440p.bottleneck.type === 'gpu_bound'
                  ? `Kartę ogranicza liczba pikseli. Wolne zostaje ${perf1440p.bottleneck.percentage}% sufitu procesora.`
                  : `Procesor ogranicza klatki. Wolne zostaje ${perf1440p.bottleneck.percentage}% sufitu karty.`
              : perf1440p.bottleneck.type === 'balanced'
                ? 'CPU load and GPU load are close.'
                : perf1440p.bottleneck.type === 'gpu_bound'
                  ? `The graphics card limits the frame rate. ${perf1440p.bottleneck.percentage}% of the CPU ceiling is unused.`
                  : `The processor limits the frame rate. ${perf1440p.bottleneck.percentage}% of the GPU ceiling is unused.`}
          </p>
        </section>

        {/* Upgrade Recommendation */}
        <UpgradeAffiliateBox recommendation={perf1440p.recommendation} />

        {/* Interactive CTA to full calculator */}
        <section className="surface-card p-6 border-2 border-accent-teal/40 bg-accent-teal/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-display text-base font-bold text-content-primary">
              {isPl ? 'Otwórz ten zestaw w kalkulatorze' : 'Open this pair in the calculator'}
            </h3>
            <p className="text-xs text-content-secondary">
              {isPl
                ? 'RAM, dysk i upscaler zmienisz tam.'
                : 'Change RAM, storage and the upscaler there.'}
            </p>
          </div>

          <Link
            href={`/?gpu=${gpu.id}&cpu=${cpu.id}&res=1440p&rt=1`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-teal text-content-inverted font-bold text-xs btn-interactive shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{isPl ? 'Otwórz kalkulator' : 'Open in Calculator'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>

        {/* Bottom Ad Slot with 24px Safety Buffer */}
        <AdSlot slotId={`specs-bottom-${slug}`} format="billboard" />
      </article>
    </StickyAdRails>
  );
}
