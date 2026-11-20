import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { plusJakartaSans, inter, jetbrainsMono } from '@/app/fonts';
import { SiteHeader } from '@/components/SiteHeader';
import '@/app/globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: 'meta' });

  const isDefault = locale === routing.defaultLocale;
  const canonicalUrl = isDefault ? 'https://ifro.pl' : `https://ifro.pl/${locale}`;

  return {
    metadataBase: new URL('https://ifro.pl'),
    title: {
      default: t('title'),
      template: '%s | ifro.pl',
    },
    description: t('description'),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: 'https://ifro.pl',
        pl: 'https://ifro.pl/pl',
        de: 'https://ifro.pl/de',
        fr: 'https://ifro.pl/fr',
        es: 'https://ifro.pl/es',
        'x-default': 'https://ifro.pl',
      },
    },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: canonicalUrl,
      siteName: 'ifro.pl',
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('ogTitle'),
      description: t('ogDescription'),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${plusJakartaSans.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      data-type="software"
      data-site-kind="gaming"
    >
      <head>
        {/* Google Consent Mode v2 (Strict Default Denied) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied',
                'ads_data_redaction': true,
                'url_passthrough': true
              });
            `,
          }}
        />
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8402255762825056"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-vice text-content-primary antialiased font-sans selection:bg-accent-teal/20 selection:text-white">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SiteHeader />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}