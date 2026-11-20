import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing, type Locale, Link } from '@/i18n/routing';
import { AdSlot } from '@/components/ads/AdSlot';
import { StickyAdRails } from '@/components/ads/StickyAdRails';
import { AlertTriangle, ChevronRight, ShieldAlert } from 'lucide-react';

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

  const title = isPl ? 'Regulamin serwisu' : 'Terms of use';

  const description = isPl
    ? 'ifro.pl nie jest związane z Rockstar. Liczby FPS są szacunkiem modelu. Przyciski sklepów otwierają zwykłe wyszukiwanie.'
    : 'ifro.pl is not connected with Rockstar. The FPS figures are a model estimate. Shop buttons open an ordinary search.';

  const canonicalPath = locale === 'en' ? '/terms' : `/${locale}/terms`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://ifro.pl${canonicalPath}`,
      languages: {
        en: 'https://ifro.pl/terms',
        pl: 'https://ifro.pl/pl/terms',
        de: 'https://ifro.pl/de/terms',
        fr: 'https://ifro.pl/fr/terms',
        es: 'https://ifro.pl/es/terms',
        'x-default': 'https://ifro.pl/terms',
      },
    },
  };
}

export default async function TermsPage({
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
            {isPl ? 'Regulamin serwisu' : 'Terms of Service'}
          </span>
        </nav>

        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-border-subtle text-xs font-mono text-content-secondary">
            <ShieldAlert className="w-3.5 h-3.5 text-accent-coral" />
            <span>{isPl ? 'Zasady korzystania' : 'Terms of use'}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-content-primary tracking-tight">
            {isPl ? 'Regulamin i zastrzeżenia prawne' : 'Terms of Service & Legal Disclaimers'}
          </h1>

          <p className="text-xs font-mono text-content-muted">
            {isPl ? 'Ostatnia aktualizacja: 20 listopada 2026 r.' : 'Last Updated: November 20, 2026'}
          </p>
        </header>

        <AdSlot slotId="terms-top" format="leaderboard" />

        <div className="surface-card p-6 border border-border-subtle space-y-6 text-sm text-content-secondary leading-relaxed">
          {/* Section 1: Non-Affiliation Disclaimer (Critical Legal Shield) */}
          <section className="p-4 rounded-lg bg-surface-elevated border border-accent-amber/30 space-y-2">
            <h2 className="font-display font-bold text-base text-accent-amber flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                {isPl ? '1. Znaki towarowe' : '1. Trademarks'}
              </span>
            </h2>
            <p className="text-content-primary text-xs leading-relaxed">
              {isPl
                ? 'Grand Theft Auto, GTA VI, GTA 6, Vice City, Rockstar Games oraz Take-Two Interactive są znakami towarowymi Take-Two Interactive Software, Inc. ifro.pl jest niezależnym serwisem. Nie jest sponsorowany, autoryzowany ani prowadzony przez Rockstar Games ani Take-Two Interactive Software, Inc. To zastrzeżenie nie jest zgodą tych firm na używanie ich znaków.'
                : 'Grand Theft Auto, GTA VI, GTA 6, Vice City, Rockstar Games, and Take-Two Interactive are trademarks of Take-Two Interactive Software, Inc. ifro.pl is an independent site. It is not sponsored, authorized, or run by Rockstar Games or Take-Two Interactive Software, Inc. This notice is not permission from those companies to use their marks.'}
            </p>
            <p className="text-content-muted text-[11px] font-mono">
              All product names, logos, and brands mentioned on this site are property of their respective owners.
            </p>
          </section>

          {/* Section 2: Character of Estimations */}
          <section className="space-y-2">
            <h2 className="font-display font-bold text-base text-content-primary">
              {isPl ? '2. Liczby FPS' : '2. FPS figures'}
            </h2>
            <p>
              {isPl
                ? 'Liczby FPS, obciążenie i pasek VRAM wychodzą z modelu opisanego na stronie metodologii. To nie jest pomiar z GTA 6, test konsoli ani analiza kodu silnika. Wynik nie gwarantuje, ile klatek pokaże gra na danym komputerze.'
                : 'The FPS figures, the load readout, and the VRAM meter come from the model described on the methodology page. They are not a measurement from GTA 6, a console test, or an analysis of engine code. The result does not guarantee the frame rate the game will show on a given PC.'}
            </p>
          </section>

          {/* Section 3: FTC & UOKiK Affiliate Disclosures */}
          <section className="space-y-2">
            <h2 className="font-display font-bold text-base text-content-primary">
              {isPl ? '3. Sklepy' : '3. Shops'}
            </h2>
            <p>
              {isPl
                ? 'Przyciski sklepów otwierają wyszukiwanie nazwy części. ifro.pl nie jest partnerem x-kom, Morele.net, Media Expert ani Amazon i nie dostaje prowizji od tych kliknięć. Cena i dostępność są wyłącznie na stronie sklepu.'
                : 'Shop buttons open a search for the part name. ifro.pl is not a partner of x-kom, Morele.net, Media Expert, or Amazon, and it does not earn a commission on these clicks. Price and availability are only on the shop’s site.'}
            </p>
          </section>

          {/* Section 4: Acceptable Use */}
          <section className="space-y-2">
            <h2 className="font-display font-bold text-base text-content-primary">
              {isPl ? '4. Warunki korzystania z serwisu' : '4. Permitted Use'}
            </h2>
            <p>
              {isPl
                ? 'Z kalkulatora można korzystać osobiście i można wysłać dalej link do wybranego zestawu. Hurtowe pobieranie całej bazy wymaga wcześniejszej zgody. Kontakt: froispro6969@gmail.com.'
                : 'You may use the calculator yourself and you may share a link to a chosen build. Bulk downloading of the whole catalog needs prior consent. Contact: froispro6969@gmail.com.'}
            </p>
          </section>
        </div>

        <AdSlot slotId="terms-bottom" format="billboard" />
      </article>
    </StickyAdRails>
  );
}
