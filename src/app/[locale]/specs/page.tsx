import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { StickyAdRails } from '@/components/ads/StickyAdRails';
import { SpecsBrowser } from '@/components/SpecsBrowser';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'specs' });
  const canonicalPath = locale === 'en' ? '/specs' : `/${locale}/specs`;

  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: `https://ifro.pl${canonicalPath}`,
      languages: {
        en: 'https://ifro.pl/specs',
        pl: 'https://ifro.pl/pl/specs',
        de: 'https://ifro.pl/de/specs',
        fr: 'https://ifro.pl/fr/specs',
        es: 'https://ifro.pl/es/specs',
        'x-default': 'https://ifro.pl/specs',
      },
    },
  };
}

export default async function SpecsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <StickyAdRails>
      <main className="pb-24 lg:pb-4">
        <SpecsBrowser />
      </main>
    </StickyAdRails>
  );
}
