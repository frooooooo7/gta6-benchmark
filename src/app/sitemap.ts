import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getTopHardwarePairs } from '@/data/popularPairs';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ifro.pl';
  const currentDate = new Date();
  const pairs = getTopHardwarePairs();

  // Root homepage entries
  const homeEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          en: `${baseUrl}`,
          pl: `${baseUrl}/pl`,
          de: `${baseUrl}/de`,
          fr: `${baseUrl}/fr`,
          es: `${baseUrl}/es`,
          'x-default': `${baseUrl}`,
        },
      },
    },
    ...routing.locales
      .filter((loc) => loc !== 'en')
      .map((locale) => ({
        url: `${baseUrl}/${locale}`,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: 0.9,
        alternates: {
          languages: {
            en: `${baseUrl}`,
            pl: `${baseUrl}/pl`,
            de: `${baseUrl}/de`,
            fr: `${baseUrl}/fr`,
            es: `${baseUrl}/es`,
            'x-default': `${baseUrl}`,
          },
        },
      })),
  ];

  // Institutional & Legal Pages (Methodology, Privacy Policy, Terms)
  const staticPages = ['methodology', 'privacy-policy', 'terms', 'specs'];
  const institutionalEntries: MetadataRoute.Sitemap = [];

  for (const page of staticPages) {
    for (const locale of routing.locales) {
      const isDefault = locale === 'en';
      const path = isDefault ? `/${page}` : `/${locale}/${page}`;

      institutionalEntries.push({
        url: `${baseUrl}${path}`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: {
            en: `${baseUrl}/${page}`,
            pl: `${baseUrl}/pl/${page}`,
            de: `${baseUrl}/de/${page}`,
            fr: `${baseUrl}/fr/${page}`,
            es: `${baseUrl}/es/${page}`,
            'x-default': `${baseUrl}/${page}`,
          },
        },
      });
    }
  }

  // Specs combination entries (100 pairs x 5 languages with hreflang alternates)
  const specEntries: MetadataRoute.Sitemap = [];

  for (const pair of pairs) {
    for (const locale of routing.locales) {
      const isDefault = locale === 'en';
      const path = isDefault ? `/specs/${pair.slug}` : `/${locale}/specs/${pair.slug}`;

      specEntries.push({
        url: `${baseUrl}${path}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/specs/${pair.slug}`,
            pl: `${baseUrl}/pl/specs/${pair.slug}`,
            de: `${baseUrl}/de/specs/${pair.slug}`,
            fr: `${baseUrl}/fr/specs/${pair.slug}`,
            es: `${baseUrl}/es/specs/${pair.slug}`,
            'x-default': `${baseUrl}/specs/${pair.slug}`,
          },
        },
      });
    }
  }

  return [...homeEntries, ...institutionalEntries, ...specEntries];
}
