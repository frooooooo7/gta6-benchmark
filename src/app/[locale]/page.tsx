import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { HardwareCalculator } from '@/components/HardwareCalculator';
import { StickyAdRails } from '@/components/ads/StickyAdRails';
import { Link } from '@/i18n/routing';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations();

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col">
      <StickyAdRails>
        <main className="flex flex-col gap-4 pb-24 lg:pb-4">
          <HardwareCalculator />
        </main>
      </StickyAdRails>

      <footer className="mt-auto border-t border-white/10 bg-black/75 px-4 py-6 text-xs text-white/75">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-display text-sm font-bold text-white">
              ifro.pl
              <span className="mx-2 font-sans font-normal text-white/50">—</span>
              <span className="font-sans text-xs font-normal text-white/75">{t('footer.tagline')}</span>
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/privacy-policy" className="hover:text-white">
                {t('footer.privacy')}
              </Link>
              <Link href="/terms" className="hover:text-white">
                {t('footer.terms')}
              </Link>
              <Link href="/methodology" className="hover:text-white">
                {t('nav.methodology')}
              </Link>
            </div>
          </div>
          <p>{t('footer.disclaimerLegal')}</p>
          <p>{t('footer.disclaimerAffiliate')}</p>
          <p>© 2026 ifro.pl. {t('footer.rights')}</p>
        </div>
      </footer>
    </div>
  );
}
